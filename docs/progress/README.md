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
| 1.1.8 | [Course: post-login redirect + clean `+`-slug URLs](1.1.8-course-redirect-and-clean-urls.md) | 🟡 | `ee21b42` |
| 1.1.9 | [Course: collapsible instructor bios](1.1.9-instructor-bio-show-more.md) | ✅ | `93b6241` |
| 1.1.10 | [Auth: fix laggy/silent Google sign-in](1.1.10-google-signin-lag-fix.md) | 🟡 | `e5ccaca` |
| 1.1.11 | [Version 2.2.0 + footer-sync clarification](1.1.11-version-2.2.0-footer-sync.md) | ✅ | `ec0fa43` |
| 1.1.12 | [Auth: registration-code gate (global guard + null-detection fix)](1.1.12-registration-code-gate.md) | ✅ | `bc3725e`…`9fa4bc2` |
| 1.1.13 | [Forms: RTL/LTR direction + password eye](1.1.13-forms-direction-password-eye.md) | ✅ | `9093fe7`,`4c8691e` |
| 1.1.14 | [Auth: server-side session logout (`logoutUser`)](1.1.14-server-side-logout.md) | 🟡 | `28d9151` |
| 1.1.15 | [Fix: my-courses post-login 404 (name vs path)](1.1.15-mycourses-redirect-404.md) | ✅ | `db860bb` |
| 1.1.16 | [Auth: simplify + harden post-login navigation (stuck-login fix)](1.1.16-login-navigation-stuck-fix.md) | ✅ | `3b0bd79` |

Tags: each commit also carries a descriptive git tag — e.g. `registration-code-gate`,
`payment-code-gate`, `regcode-null-fix`, `userinfo-bidi-direction`,
`login-form-direction-eye` (see standing conventions).

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
- 🔭 **Live-verify remaining auth flow** — [1.1.10](1.1.10-google-signin-lag-fix.md)
  full Google success → redirect still wants a real login (OAuth can't run headless).
  The [1.1.12](1.1.12-registration-code-gate.md) gate is now **verified live**: a
  real no-code account is redirected to `registeration-code` (`access false`);
  guests/no-token confirmed unrestricted. NOTE: production must be **deployed** for
  any of this to take effect there — local testing hits the prod backend with new code.
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
- **`.vue` changes need a headless mount smoke test** — green `tsc`/`build` does
  NOT check template bindings. A dropped template method passes both and only
  crashes at runtime (caught this way in [1.1.9](1.1.9-instructor-bio-show-more.md)).
  Headless check: `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome
  --headless --disable-gpu --enable-logging=stderr --virtual-time-budget=9000
  --dump-dom <url> 2>err.log` then grep the log for `is not a function` / `Vue warn`.
- **Tag every commit** with a short descriptive kebab-case git tag and push it
  (`git tag <slug> && git push origin <slug>`) — e.g. `google-signin-fix`,
  `registration-code-gate`. Matches the repo's existing tags; makes history
  skimmable and any commit a one-command rollback (`git reset --hard <slug>`).
  Use a `pre-<thing>` tag to mark a baseline before a risky change.
