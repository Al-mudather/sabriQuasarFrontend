---
name: vue-type-safe-conversion
description: Use when converting a Vue SFC to `<script setup lang="ts">` with typed Apollo queries and feature-scoped types, OR when about to edit a `.vue` page/component in this repo that still uses Options API. Enforces the pattern that prevents silent "stuck on skeletons" and "silent undefined" bugs caused by untyped `useQuery` + `_.get` reads against GraphQL responses.
---

# Vue Type-Safe Conversion

This project has a feature-scoped type layer at `src/types/<feature>/types.ts` that narrows the codegen output in `src/graphql/generated.ts`. The goal of this skill is: every page, component, and composable consumes those feature types — not untyped Apollo results, not `_.get(...)` paths, not `JSON.parse(node.xxx)`.

## When to invoke

Invoke this skill when any of these are true:

- User asks: "convert X to TypeScript", "make X type-safe", "type the X page"
- You are about to edit a `.vue` file in `src/pages/**` or `src/components/**` that still uses `export default { ... }` (Options API without `<script setup lang="ts">`)
- You see `useQuery(DOC, ...)` without generic type parameters
- You see `_.get(result, 'a.b.c', fallback)` reading a GraphQL result
- You see `JSON.parse(node.<field>)` where `<field>` is a GraphQL `JSONString` scalar

## The core rules

1. **Feature types are the source of truth.** Every `.vue`, `.ts`, or `.js` file (outside `src/types/**` itself) imports types from `src/types/<feature>/types.ts`, never from `src/graphql/generated`.
2. **`useQuery<Result, Vars>(DOC, ...)` with generics — always.** Untyped `useQuery(DOC, ...)` is a regression. Same for `useMutation<R, V>` and `apolloClient.query<R, V>`.
3. **Typed optional chaining, not lodash.** Replace every `_.get(x, 'a.b.c', fallback)` with `x?.a?.b?.c ?? fallback`. The `_.get` path silently swallows the exact "field not in query selection" bug that types catch.
4. **Don't re-parse `JSONString` scalars.** `src/apollo/client.js` has a `typePolicy` that parses `JSONString` fields (like `CourseNode.currency`) at cache-read time. Consumers receive a plain object. `JSON.parse(courseObject)` throws.
5. **If a query is missing a field the UI reads, fix the query — don't paper over it.** Edit the `.js` file under `src/graphql/<domain>/{query,mutation}/`, re-run `npm run codegen`, then consume. Never `as any` or `// @ts-expect-error`.
6. **Vite build passing is NOT proof of type-safety.** Vite's esbuild strips TS without checking. Run `npx tsc --noEmit -p tsconfig.json` as the real gate.

## Quick checklist (load CHECKLIST.md for the full version)

Before saying "done":

- [ ] `<script setup lang="ts">` header
- [ ] Every `useQuery` / `useMutation` / `apolloClient.query` has `<Result, Vars>` generics from a feature types module
- [ ] No `lodash.get` / `_.get` on Apollo results
- [ ] No `JSON.parse(...)` on a `JSONString` scalar
- [ ] No `as any`, no `@ts-expect-error`
- [ ] `npx tsc --noEmit -p tsconfig.json` — green
- [ ] `npm run codegen:check` — green
- [ ] `npm run build` — green
- [ ] Headless-Chrome smoke of the affected route — zero unexpected console errors

## Reference implementation

Read `REFERENCE.md` for the canonical example (`src/pages/course_management/Courses.vue` and `src/components/utils/courseCard.vue`). Those two files are the exact pattern every other conversion should mirror.

## Patterns library

Load `PATTERNS.md` on demand when you need a specific pattern. Covers:
- `useQuery<R, V>` — basic and reactive-variables form
- Edge-node extraction with `NonNullable<NonNullable<...>['edges'][number]>['node']`
- JSONString scalar consumption (`CoursePricing` narrowing)
- `defineProps<Props>()` for typed component inputs
- Auth-guarded navigation (`auth.isAuthenticated` → `router.push({ name: 'login', query: { redirect } })`)
- Route-param typing via `useRoute()` in composition API
- Named-route convention (always `{ name: 'X' }`, never paths)
- RTL-safe scoped styles (no `:global(html[dir='rtl']) ...` — it flips the whole page)

## Execution recipe

1. **Read** `REFERENCE.md` (always) and `CHECKLIST.md` (always). Load `PATTERNS.md` only when a specific pattern is needed.
2. **Read** the target `.vue` file and note: which queries/mutations it uses, every template-binding path, every `_.get` / `JSON.parse` / `as any` smell.
3. **Read** the corresponding feature types module in `src/types/<feature>/types.ts` to find the `Result`/`Vars`/`Entity` aliases you need.
4. **For each query the component uses**, open the `.js` file under `src/graphql/<domain>/` and cross-check: is every field the template reads in the selection set? If not, add it, run `npm run codegen`.
5. **Convert `<script>` to `<script setup lang="ts">`.** Drop `export default { components, setup, data, computed, methods, watch, mounted, unmounted }`. Replace with `import`, `defineProps<Props>()`, `ref`/`reactive`/`computed`, `onMounted`/`onUnmounted`, `useRoute`/`useRouter`/`useQuasar`.
6. **Run the gates.** `tsc --noEmit`, `codegen:check`, `build`. Then `quasar dev -m spa -p 9000 &` and headless-chrome the affected route.
7. **Commit per logical change.** One page or one tight component group per commit.
