# Classroom Content View — Responsive Video-Stage Redesign

Plan + scope contract for the mobile/tablet-first redesign of
`/classroom/:coursePk/content/:contentPk`.

## Goal (confirmed with user)

Turn the squeezed-desktop mobile layout into a focused YouTube/Udemy-grade
viewing experience:

1. **Center the side-panel tabs** (they currently splay edge-to-edge).
2. **Video = a clearly-defined stage** that fits the video's true shape (no
   black letterbox bands) and **sticks** to the top while content scrolls.
3. **Lesson title becomes a header *above* the video** (currently below).
4. **Remove** Prev/Next buttons entirely.
5. **Remove** the `CONTENTVIDEO` kind badge.

Scope: **mobile/tablet first (≤1023px)** + **light desktop polish** (title moves
above player, badge removed, tabs centered). Frontend only.

## Letterbox diagnosis

Both `TypeHasifHlsPlayer.vue` and `VdoCipherPlayer.vue` already wrap the player in
a correct `aspect-ratio: 16/9` box with a `#000` background. The bands in the
screenshot are the **source video being `contain`-fit inside a 16:9 box** (the
lecture's real aspect ≠ 16:9). Fix = make the player box fit the video's true
aspect for native `<video>` (video.js / TypeHasif), keep 16:9 for cross-origin
iframe providers.

---

## Master Scope Contract

### Will modify (disjoint per agent)
- **Agent A** — `src/pages/classroom/ClassroomContentView.vue`
- **Agent B** — `src/components/classroom/player/VideoPlayer.vue`,
  `src/components/classroom/player/TypeHasifHlsPlayer.vue`,
  `src/components/classroom/player/VdoCipherPlayer.vue`,
  `src/components/classroom/player/VimeoPlayer.vue`
- **Agent C** — `src/components/classroom/ClassroomSidePanel.vue`

### Read only (all agents may read, none edit)
- `src/design-system/classroom/tokens.scss` (token names)
- `src/composables/classroom/*` (understand context/navigation, don't edit)
- `src/types/classroom/types.ts`

### Must preserve
- All Apollo queries, progress start/end timers, `onSelect` navigation +
  `scrollIntoView`, quiz/file/placeholder rendering, loading + empty states.
- All player init (video.js, EME/ClearKey, quality selector), VdoCipher v-html,
  provider resolution, and every `begin/progress/complete/error` emit contract.
- Tab a11y: `role=tablist/tab`, `aria-selected`, roving `tabindex`, arrow-key
  nav, focus management, the curriculum→overview fallback watch.

### Forbidden paths (every agent)
- Any backend, stores, GraphQL `.js`/`generated.ts`, `src/types/**`,
  `quasar.config.js`, lockfiles.
- No agent edits a file outside its own "Will modify" list.
- No functional/logic changes — layout, markup, and SCSS only.

### Verification (orchestrator runs once after merge)
- `npx tsc --noEmit -p tsconfig.json`
- `npm run build`
- Headless Chrome mobile-viewport smoke of a content route.

### Cross-agent contract
- Agent A's `.cls-cockpit__media` stays a plain full-width wrapper with **no
  fixed `aspect-ratio` / height** — the player (Agent B) owns its own aspect.
- Agents do **not** run the dev server or `npm run build` (orchestrator owns the
  single consolidated verification + commit).

---

## Per-agent design spec

### Agent A — Stage & layout (`ClassroomContentView.vue`)
- Reorder template: lesson **title header → video**. Wrap title + media in a
  `__top` cluster.
- On mobile (≤1023px) make `__top` `position: sticky; inset-block-start: 0`
  (move the sticky off `__media`). Title clamps to 2 lines.
- Remove the `__kind-badge` element and the entire `__nav` block.
- Remove now-dead script: `useCurriculumNavigation` import, `nextContent`,
  `prevContent`, `goToNext`, `goToPrev`, `goToNextAndEnd`, `goToPrevAndEnd`
  (keep `useLearningProgress` / `end()` — still used by `onSelect`/`onComplete`).
- Drop `@media` rules referencing `__nav` / `__kind-badge`.

### Agent B — Player fill (`VideoPlayer.vue` + providers)
- Native `<video>` (TypeHasif): on `loadedmetadata`, set the player root
  `aspect-ratio` from `videoWidth/videoHeight` (clamp ~[0.5,3], fallback 16/9
  until loaded). Video element fills 100% with `object-fit: contain` — never
  `cover` (would crop lecture content). Result: no bars.
- Iframe providers (VdoCipher v-html, YouTube, Vimeo): keep 16:9 (cross-origin,
  can't measure). Ensure iframe fills its box.
- Keep `#000` bg + rounded definition (square corners acceptable on mobile
  edge-to-edge).

### Agent C — Centered tabs (`ClassroomSidePanel.vue`)
- `.cls-panel__tabs`: `justify-content: center`. `.cls-panel__tab`: drop
  `flex: 1`, become content-sized (`flex: 0 0 auto`) with comfortable padding,
  centered label. Keep active `::after` underline + all a11y.
- Narrow-screen safety: if the 3 Arabic labels don't fit centered, the strip
  scrolls horizontally (`overflow-x: auto`) rather than clipping.

## Dispatch order
All three files are disjoint → **A, B, C run in parallel**. Orchestrator merges,
runs `tsc` + `build` + headless smoke, then commits.
