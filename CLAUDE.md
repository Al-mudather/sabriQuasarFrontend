# CLAUDE.md — Dr. Sabri STC frontend

Project-specific working rules. These override general defaults when they conflict.

## Type-safety is not optional

This codebase has a generated GraphQL type layer at `src/graphql/generated.ts` and a feature-scoped type-safety layer at `src/types/<feature>/types.ts` that re-exports narrowed domain types (e.g. `Course`, `Speciality`, `GetAllCoursesResult`, `CoursePricing`). Any new component, page, store, or composable you write or refactor **must**:

1. Import the types it needs from `src/types/<feature>/types` — never from `src/graphql/generated` directly, never redeclare a shape that already lives in a feature types module.
2. Call `useQuery<ResultType, VarsType>(DOC, ...)` / `useMutation<ResultType, VarsType>(DOC, ...)` with explicit generics. Untyped `useQuery(DOC, ...)` is a regression.
3. Use typed optional chaining (`x?.a?.b ?? fallback`) to read Apollo results. Do **not** use `lodash.get('a.b.c', fallback)` — it silently swallows the exact kind of missing-field bug that types are meant to catch. (The `/courses` page stuck-on-skeletons incident was caused by exactly this: `_.get(..., 'allCourses.pageInfo.hasNextPage', false)` returned `false` for a field the query never selected; the typed version surfaced the real problem — `pageInfo` wasn't in the query at all.)
4. Never `JSON.parse(node.currency)` or parse any other `JSONString` scalar in component code. The Apollo `typePolicy` in `src/apollo/client.js` parses `JSONString` fields at cache-read time; consumers receive a plain object typed as `Record<string, number>` (narrowed to `CoursePricing` in the courses feature). Parsing twice throws.

## If a query is missing a field the UI reads, fix the query — don't paper over it

When the UI reads a field that isn't in the GraphQL selection set (e.g. `allCourses.pageInfo.hasNextPage`, a node's nested child, a mutation's return payload), the correct fix is:

1. Edit the `.js` file under `src/graphql/<domain>/{query,mutation}/...` to add the missing selection (and any required variable like `$after: String`).
2. Run `npm run codegen` to refresh `src/graphql/generated.ts`.
3. If the feature module in `src/types/<feature>/types.ts` needs a new narrowed alias, add one there.
4. Only then consume it in the component.

Do **not** cast with `as any`, do **not** use `// @ts-expect-error`, do **not** reach into `src/graphql/generated` directly to import a raw type when a feature alias would have fit.

## Vite build passing is NOT proof of type-safety

`esbuild` (what Vite uses) strips TypeScript without typechecking. A green `npm run build` only proves the code parses and bundles. Before claiming a typed conversion is done, run:

```
npx tsc --noEmit -p tsconfig.json
```

This is the real gate. `tsconfig.json` currently covers `src/graphql/**/*.ts` and `src/types/**/*.ts`. If you convert a `.vue` page to `<script setup lang="ts">` and want it typechecked, add `vue-tsc` (discuss first — it's a devDep bump).

## Dev server

Always start the dev server in the background — `npx quasar dev -m spa -p 9000 > /tmp/qc.log 2>&1 &`. Headless Chrome at `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome --headless --disable-gpu --enable-logging=stderr --v=0 --virtual-time-budget=<ms> --dump-dom <url>` is the fastest way to confirm a page mounts and reads render output / console errors without puppeteer.

## RTL is default

`quasar.config.js` sets `lang: 'ar'`; `src/boot/main.js` sets `document.documentElement.dir = 'rtl'`. Never use `:global(html[dir='rtl']) ...` inside a Vue 3 scoped `<style>` block — the parser drops the inner selector and `transform: scaleX(-1)` flips the whole page. Use plain ancestor-attribute selectors like `[dir='rtl'] .my-thing { ... }` outside the scoped rules block.

## Folder map (authoritative)

- `src/graphql/` — codegen output (`generated.ts`, `index.ts`) + domain query/mutation `.js` files. Codegen input glob is `src/graphql/**/*.js`.
- `src/types/<feature>/types.ts` — feature-scoped narrowed types. Source of truth for everything UI. 12 features today: auth, courses, cart, attachments, certificates, enrollments, marketing-content, notifications, orders, pyramid, qa, settings.
- `src/stores/` — Pinia stores (auth, cart, settings, pyramid). JSDoc `@typedef` references into `src/types/...` are the current typing pattern for the `.js` stores; when converting a store to `.ts`, use direct imports.
- `src/design-system/` — DS primitives (17 `Ds*` components). Public prop / slot / event contracts are load-bearing — ~100 call sites each. Do not rename or remove them.
- `src/queries/` does **not** exist — it was moved into `src/graphql/<domain>/{query,mutation}/` in the folder-rename PR. Old imports would be `src/queries/...` — if you see one, it's rot, update it.
- `src/features/` does **not** exist — it was renamed to `src/types/`. Same rule.

## When converting a page to typed

This is the canonical path after 2026-04-24. Follow it exactly.

1. Read `src/pages/course_management/Courses.vue` — it's the reference implementation of the pattern.
2. Identify every `useQuery` / `useMutation` and look up its feature module's `Result` / `Vars` aliases.
3. Cross-check template reads vs query selection sets. Fix any gap by editing the `.js` query file, not the consumer.
4. Convert the `<script>` block to `<script setup lang="ts">`. Drop the `export default { components: { ... } }` — imports auto-register in `<script setup>`. Drop Options-API `data/computed/methods/mounted/unmounted/watch` in favor of the composition API primitives.
5. Run `npx tsc --noEmit`, `npm run codegen:check`, `npm run build` — all three. Then headless-smoke the route.
6. Commit a single logical change per page using haiku model.
