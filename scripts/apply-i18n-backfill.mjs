// Backfill 291 missing English translations into src/i18n/en/index.js
// and mirror keys in src/i18n/ar/index.js. Idempotent: skips keys that
// already exist in the target file.
//
// Run from project root:  node scripts/apply-i18n-backfill.mjs

import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

const manifest = JSON.parse(readFileSync(resolve(__dirname, 'i18n-missing-translations.json'), 'utf8'))
const entries = Object.entries(manifest)

console.log(`manifest has ${entries.length} entries`)

function jsEscape (s) {
  return s
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
}

function buildSnippet (entries, valueFor, needsLeadingComma) {
  // Older auto-generated files are inconsistent about trailing commas
  // on the final entry. Caller tells us whether one is needed.
  const lead = needsLeadingComma ? ',\n' : ''
  const header = lead + '\n  // ---------------------------------------------------------------------\n  // Phase 2B backfill (2026-05-18) — Arabic-string-as-key entries added so\n  // the existing ~291 t() call sites that referenced literal Arabic strings\n  // actually resolve to a value when locale === "en". The legacy\n  // "Arabic": "Arabic" pattern is preserved for backwards compatibility;\n  // a future PR can migrate to proper namespaced keys.\n  // ---------------------------------------------------------------------\n'
  const lines = entries.map(([k, v]) => `  "${jsEscape(k)}": "${jsEscape(valueFor(k, v))}",`)
  return header + lines.join('\n') + '\n'
}

// Look backwards from insertion point past whitespace/blank lines to find
// the last significant character. Comments (//... or /* ... */) count as
// already-terminated entries, so check for `,` immediately after the last
// closing `"`/`}`/`]` instead.
function needsLeadingComma (src, insertAt) {
  let i = insertAt - 1
  while (i >= 0 && /\s/.test(src[i])) i -= 1
  if (i < 0) return false
  const ch = src[i]
  // A trailing comma means we don't need to add one.
  if (ch === ',') return false
  // If the previous significant char closes a value (`"`, `'`, `}`, `]`,
  // a digit, or a word boundary like `e` in `true`), we need a comma.
  return true
}

function patchFile (path, valueFor) {
  let src = readFileSync(path, 'utf8')
  // Determine which manifest keys aren't already present in this file as
  // a JS string literal. Treat any `"<key>"` appearing as a property name
  // as "present" — guards against duplicates after re-runs.
  const remaining = entries.filter(([k]) => {
    const needle = `"${jsEscape(k)}"`
    return !src.includes(needle)
  })
  console.log(`${path.split('/').slice(-3).join('/')}: ${entries.length - remaining.length} already present, ${remaining.length} to add`)
  if (remaining.length === 0) return

  // Insert before the LAST closing brace of the default export.
  // Both files end with `}` or `};` followed by trailing whitespace.
  const matches = [...src.matchAll(/\}\s*;?\s*$/g)]
  if (matches.length === 0) {
    throw new Error(`${path}: could not find closing brace`)
  }
  const last = matches[matches.length - 1]
  const insertAt = last.index
  const needsComma = needsLeadingComma(src, insertAt)
  const snippet = buildSnippet(remaining, valueFor, needsComma)
  const next = src.slice(0, insertAt) + snippet + src.slice(insertAt)
  writeFileSync(path, next, 'utf8')
  console.log(`${path.split('/').slice(-3).join('/')}: wrote ${remaining.length} entries`)
}

patchFile(resolve(root, 'src/i18n/en/index.js'), (_k, v) => v)
patchFile(resolve(root, 'src/i18n/ar/index.js'), (k) => k)

console.log('done.')
