// Phase 4 fixup backfill: adds missing nav/role/aria translations
// surfaced by bilingual smoke testing. Mirror keys into ar/index.js
// (Arabic = key). Idempotent on re-run.

import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const a = JSON.parse(readFileSync(resolve(__dirname, 'i18n-phase4-fixups.json'), 'utf8'))
const b = JSON.parse(readFileSync(resolve(__dirname, 'i18n-phase4-final.json'), 'utf8'))
const manifest = { ...a, ...b }
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
  const header = lead + '\n  // Phase 4 fixups (2026-05-19): missing nav/role/aria translations.\n'
  const lines = entries.map(([k, v]) => `  "${jsEscape(k)}": "${jsEscape(valueFor(k, v))}",`)
  return header + lines.join('\n') + '\n'
}
function patchFile (path, valueFor) {
  let src = readFileSync(path, 'utf8')
  const remaining = entries.filter(([k]) => !src.includes(`"${jsEscape(k)}"`))
  console.log(`${path.split('/').slice(-3).join('/')}: ${entries.length - remaining.length} present, ${remaining.length} to add`)
  if (remaining.length === 0) return
  const matches = [...src.matchAll(/\}\s*;?\s*$/g)]
  const insertAt = matches[matches.length - 1].index
  const snippet = buildSnippet(remaining, valueFor, needsLeadingComma(src, insertAt))
  writeFileSync(path, src.slice(0, insertAt) + snippet + src.slice(insertAt))
  console.log(`${path.split('/').slice(-3).join('/')}: wrote ${remaining.length} entries`)
}
patchFile(resolve(root, 'src/i18n/en/index.js'), (_k, v) => v)
patchFile(resolve(root, 'src/i18n/ar/index.js'), (k) => k)
console.log('done.')
