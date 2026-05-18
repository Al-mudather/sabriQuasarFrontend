// Phase 2C backfill: append Arabic-keyed entries produced by the slice
// agents (sliced sweep of bare Arabic in vue templates) into both
// locale files. Idempotent — skips keys already present.

import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const manifest = JSON.parse(readFileSync(resolve(__dirname, 'i18n-phase2c-merged.json'), 'utf8'))
const entries = Object.entries(manifest)

function jsEscape (s) {
  return s.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r')
}

function needsLeadingComma (src, insertAt) {
  let i = insertAt - 1
  while (i >= 0 && /\s/.test(src[i])) i -= 1
  if (i < 0) return false
  return src[i] !== ','
}

function buildSnippet (entries, valueFor, needsLead) {
  const lead = needsLead ? ',\n' : ''
  const header = lead + '\n  // ---------------------------------------------------------------------\n  // Phase 2C residual sweep (2026-05-19) — bare Arabic literals previously\n  // unwrapped in vue templates (aria-label / placeholder / heading text)\n  // were swept into $t() calls by the parallel slice agents. These entries\n  // populate the English values so the switcher actually translates them.\n  // ---------------------------------------------------------------------\n'
  const lines = entries.map(([k, v]) => `  "${jsEscape(k)}": "${jsEscape(valueFor(k, v))}",`)
  return header + lines.join('\n') + '\n'
}

function patchFile (path, valueFor) {
  let src = readFileSync(path, 'utf8')
  const remaining = entries.filter(([k]) => !src.includes(`"${jsEscape(k)}"`))
  const present = entries.length - remaining.length
  console.log(`${path.split('/').slice(-3).join('/')}: ${present} already present, ${remaining.length} to add`)
  if (remaining.length === 0) return
  const matches = [...src.matchAll(/\}\s*;?\s*$/g)]
  if (matches.length === 0) throw new Error(`${path}: no closing brace`)
  const insertAt = matches[matches.length - 1].index
  const snippet = buildSnippet(remaining, valueFor, needsLeadingComma(src, insertAt))
  writeFileSync(path, src.slice(0, insertAt) + snippet + src.slice(insertAt), 'utf8')
  console.log(`${path.split('/').slice(-3).join('/')}: wrote ${remaining.length} entries`)
}

patchFile(resolve(root, 'src/i18n/en/index.js'), (_k, v) => v)
patchFile(resolve(root, 'src/i18n/ar/index.js'), (k) => k)
console.log('done.')
