# vue-tsc Baseline — 208 errors to address incrementally

Run `npm run typecheck:vue` to reproduce. Main (non-Vue) `tsc` via
`npm run typecheck` is green and is the hard CI gate. This document
tracks the work needed to get `typecheck:vue` to zero.

## Baseline snapshot

- First baseline: **249 errors** (immediately after vue-tsc wiring).
- After converting Pinia stores to TS: **208 errors** (−41).

## Error-code distribution

| TS code | Count | Category |
|---|---|---|
| TS2322 | 48 | Type not assignable (often `null → T`) |
| TS18047 | 47 | `foo is possibly 'null'` |
| TS2345 | 38 | Argument not assignable |
| TS2339 | 22 | Property does not exist |
| TS2352 | 15 | Type conversion (invalid cast) |
| TS2307 | 9  | Cannot find module |
| TS18048 | 9  | `foo is possibly 'undefined'` |
| TS2722 | 5  | Cannot invoke possibly undefined |
| TS2741 | 3  | Property missing in type |
| TS7016 | 2  | No declaration file |

**68% of errors** (TS18047 + TS18048 + TS2322 + TS2345) are nullability
issues — GraphQL optional fields (`T | null`) read without `?.` or `??`.
These are the bugs type-safety is meant to surface.

## Top offenders (by file)

- `src/App.vue` — ~12 errors: `window.OneSignal` calls without `?.` guards,
  plus a `setExternalUserId` arity mismatch against the narrow ambient shim
  in `src/types/globals.d.ts`.
- `src/components/Home/Training.vue` — ~9 errors: `courses.edgeCount` /
  `courses.edges` accesses where `courses` is `AllCoursesInSpecialityResult |
  null` without a null-guard.
- `src/pages/Home.vue` — ~4 errors: `allCoursesCount` / `allCourseSpecialities`
  reads without `?.`.
- `src/pages/pyramid_marketing_management/MyMarketingPage.vue` — ~4 errors:
  similar pattern.
- Numerous per-file singles — one to three nullability accesses each.

## Fix patterns

Per category, the recipe is mechanical:

**TS18047 (`foo is possibly 'null'`):**
```ts
// before
const edges = myQuery.result.value.allX.edges
// after
const edges = myQuery.result.value?.allX?.edges ?? []
```

**TS2345 / TS2322 (`null` not assignable to `string`):**
```ts
// before
fn(props.course.title)    // title: string | null
// after
fn(props.course.title ?? '')
```

**TS18048 (`foo is possibly 'undefined'`):**
Add a `if (!foo) return` early-return, or `foo?.` before the call.

**TS2339 on window globals (`window.OneSignal.xxx`):**
The ambient shim in `src/types/globals.d.ts` declares `OneSignal?: {...}`
(optional). Guard every call:
```ts
// before
window.OneSignal.push(...)
// after
if (window.OneSignal) window.OneSignal.push(...)
```

**TS2307 (cannot find module):**
Usually a missing `.js` file or a path that the Vite resolver tolerates but
TS doesn't. Add `allowJs: true` is already set in `tsconfig.vue.json`; if
errors persist, the import specifier is likely misspelled.

## Suggested fix order

1. **App.vue** — single file, ~12 errors, all OneSignal null-guards. Easy win.
2. **Training.vue** — consolidate `courses` null handling via an `edges`
   computed that defaults to `[]`. Eliminates 9+ errors.
3. **Home.vue** — 4 nullability adds.
4. **MyMarketingPage.vue** + **MyCustomersPaymentPage.vue** — a pass over all
   pyramid components for `?.` on optional fields.
5. **Widespread sweep** — the remaining ~100 errors are singletons across
   many files. An agent with a scope-contract listing the exact file/line
   and the fix pattern can sweep these in one pass.

## What NOT to do

- Do **not** widen `src/types/globals.d.ts` shims to remove `?` on window
  globals. The shim is narrow on purpose — the errors are telling you the
  runtime call path is unsafe; fix the call site, not the shim.
- Do **not** add `as any` or `@ts-expect-error`. The stated project policy
  in `CLAUDE.md` is to either fix the query (if a field is missing from the
  selection) or fix the consumer (if the field is legitimately nullable).
- Do **not** turn off `strict` in the vue tsconfig — it's what surfaces the
  nullability bugs in the first place.

## Not counted in the 208

- Schema-drift queries excluded in `codegen.yml` (CreatePaypalCheckout,
  CreateSyberpayCheckout, SetUserPassword, etc.) — need backend coordination
  before their operation types can be generated and consumed.
- `src/components/courseDetails/contentItem.vue` — the `modelValue` JSONString
  scalar is not covered by the Apollo `typePolicy`. Adding a field policy in
  `src/apollo/client.js` would let consumers read it as a typed object and
  drop the local `RawContent` shim.
