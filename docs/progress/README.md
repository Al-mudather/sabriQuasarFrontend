# Progress log

A running, time-ordered record of what we've built on the Dr. Sabri STC
frontend — so any new session (human or AI) can read this folder and know
exactly where things stand, what was decided and why, and what's next.

## Numbering convention

Entries are numbered `PHASE.BLOCK.TASK` (e.g. `1.1.3`):

- **PHASE** (`1`, `2`, …) — a large theme of work (e.g. "Frontend redesign & modernization").
- **BLOCK** (`1.1`, `1.2`, …) — a working block, usually one session or a tight cluster of days.
- **TASK** (`1.1.1`, `1.1.2`, …) — one shippable deliverable, one commit.

Each task has its own file: `1.1.3-short-slug.md`. Numbers only ever go up —
a later block is `1.2`, a new phase is `2`. Never renumber old entries.

## Status legend

- ✅ **done** — shipped and on `master`.
- 🟡 **partial** — shipped but with a known follow-up or unverified path.
- ⛔ **parked** — intentionally deferred (usually blocked on something external).
- 🔭 **planned** — not started.

---

## Phase 1 — Frontend redesign & modernization

### Block 1.1 — 2026-06-15 → 2026-06-16

| #     | Title                                             | Status | Commit    |
|-------|---------------------------------------------------|--------|-----------|
| 1.1.1 | [Marketing: redeem-earnings button](1.1.1-marketing-redeem-earnings-button.md) | ✅ | `d10e95a` |
| 1.1.2 | [Courses: short share links](1.1.2-courses-short-share-links.md) | ✅ | `11c1ccc` |
| 1.1.3 | [Classroom: HLS player control bar](1.1.3-classroom-hls-player-controls.md) | ✅ | `d9abcf3` |
| 1.1.4 | [Classroom: Vimeo player control bar](1.1.4-classroom-vimeo-player-controls.md) | ✅ | `fa49062` |
| 1.1.5 | [Cart: RTL/i18n + receipt error handling](1.1.5-cart-rtl-i18n-error-handling.md) | 🟡 | `1c5ea4c` |
| 1.1.6 | [Notifications: bottom toast redesign](1.1.6-notifications-bottom-toast-redesign.md) | ✅ | `16a5323` |
| 1.1.7 | [Login: toast feedback](1.1.7-login-toast-feedback.md) | ✅ | `bca0932` |

---

## What we're trying to achieve next (roadmap)

- 🔭 **Classroom: VdoCipher player control bar** — the third video provider. Parked
  (see [1.1.4](1.1.4-classroom-vimeo-player-controls.md)): the integration injects a
  pre-signed, cross-origin iframe blob, so its native controls can't be hidden and its
  playback can't be driven from the frontend without **backend changes** (disable the
  embed's controls / switch to OTP + playbackInfo init). Needs a backend hand-off spec.
- 🔭 **Remove dead pyramid code** — `src/components/pyramid_marketing_management/MyPyramid.vue`
  and `MyPyramidRewards.vue` are unrouted/unimported dead code (found during 1.1.1).
- 🔭 **Live-verify cart error toasts** — the receipt-upload failure paths (1.1.5) are
  build/logic-verified but only fire on a real backend rejection; confirm in-app.
- 🔭 **Dependabot** — the repo reports 28 dependency vulnerabilities (1 critical, 5 high)
  on every push. Triage the critical/high ones.

## Standing conventions (don't relearn these each session)

- Read the root `CLAUDE.md` first — it has the hard rules (typed GraphQL layer,
  `tsc --noEmit` is the real gate not `build`, RTL-default, folder map).
- RTL is the default; English flips `document.documentElement.dir` to `ltr`
  via `useAppLocale → syncDom()`.
- i18n keys ARE the Arabic string: add to BOTH `src/i18n/ar/index.js` (identity)
  and `src/i18n/en/index.js` (English).
- Notifications: one system, bottom-positioned — see [1.1.6](1.1.6-notifications-bottom-toast-redesign.md).
- Classroom video players follow a shared pattern: a `useXPlayer` reactive
  composable + the shared `ClassroomVideoControls.vue` bar — see [1.1.3](1.1.3-classroom-hls-player-controls.md).
