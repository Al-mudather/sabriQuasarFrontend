// Render Q&A user-generated content as safe HTML.
//
// Legacy data is full of stray HTML markup (e.g. `<font style="…">…</font>`)
// from a long-deceased rich-text editor. Newer entries are plain text or
// markdown. We:
//
//   1. Strip the legacy `<font>` / inline-style noise so it doesn't render as
//      visible literal text under v-text.
//   2. Run the result through `marked` so genuine markdown (lists, links,
//      code, emphasis, blockquotes) renders properly.
//   3. Sanitize the final HTML with DOMPurify before returning, so v-html is
//      safe against script/style injection from anything we missed.
//
// Output is meant to be consumed via v-html in `.qa-prose` containers — see
// QuestionItem.vue / QuestionReplyItem.vue for the typography styles.

import { marked } from 'marked'
import DOMPurify from 'dompurify'

// One-time configuration: GFM (tables, strikethrough), line breaks → <br>,
// no async parsing, no header IDs (we don't need anchors here).
marked.setOptions({
  gfm: true,
  breaks: true,
})

/** Strip legacy HTML chrome that shouldn't render as text. */
function stripLegacyHtml(input: string): string {
  return (
    input
      // Drop `<font ...>` and `</font>` wrappers entirely — keep inner text.
      .replace(/<\/?font[^>]*>/gi, '')
      // Drop `&nbsp;` literal that shows up inside the legacy blobs.
      .replace(/&nbsp;/gi, ' ')
      // Drop empty `style="…"` attribute residue if any survives.
      .replace(/\s+style="[^"]*"/gi, '')
  )
}

const ALLOWED_TAGS = [
  'p', 'br', 'strong', 'em', 'b', 'i', 'u', 's', 'del',
  'ul', 'ol', 'li',
  'blockquote', 'code', 'pre',
  'a', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'hr', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
]

const ALLOWED_ATTR = ['href', 'title', 'target', 'rel', 'lang', 'dir']

/**
 * Render markdown → sanitized HTML safe for v-html. Empty string for blank
 * input. Generic (no legacy-HTML stripping) — used for course content
 * (what-you-will-learn / prerequisites) which is authored markdown.
 */
export function renderMarkdown(raw: string | null | undefined): string {
  if (!raw) return ''
  const html = marked.parse(raw, { async: false }) as string
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    // External links open safely (rel added below).
    ADD_ATTR: ['target', 'rel'],
  })
}

/** Returns sanitized HTML safe for v-html. Empty string for blank input. */
export function renderQaContent(raw: string | null | undefined): string {
  if (!raw) return ''
  // Strip the legacy rich-text editor's <font>/style noise first, then render
  // the result as markdown.
  return renderMarkdown(stripLegacyHtml(raw))
}
