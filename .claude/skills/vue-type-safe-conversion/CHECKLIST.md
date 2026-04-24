# Per-Page Conversion Checklist

Run this every time you convert a `.vue` page or component. No shortcuts.

## Before touching any code

- [ ] Read `SKILL.md` and `REFERENCE.md`. Load `PATTERNS.md` if you need a specific template.
- [ ] Read the target `.vue` file top to bottom. Note every Apollo op, every template binding, every `_.get`, every `JSON.parse`, every `$_.` lodash call, every `$route` / `$router` / `$q` / `$t`, every `this.$refs.*`.
- [ ] Read the feature types module (`src/types/<domain>/types.ts`) that owns this component's queries. Note the `Result` / `Vars` / `Entity` aliases you'll import.
- [ ] For each Apollo op, open the `.js` file under `src/graphql/<domain>/{query,mutation}/` and cross-check **every template read** against the selection set.

## Fix the query first, if it's wrong

If the UI reads a field the query doesn't select:

- [ ] Edit the `.js` query file to add the selection (and any required new variable like `$after: String`).
- [ ] Run `npm run codegen` to refresh `src/graphql/generated.ts`.
- [ ] If a new feature-type alias is needed, add it to `src/types/<domain>/types.ts`.

Never: `as any`, `@ts-expect-error`, lodash `_.get` to paper over, or optional-chain to swallow the failure.

## Script block conversion

- [ ] Replace `<script>` with `<script setup lang="ts">`.
- [ ] Drop the `export default { name, components, setup, data, computed, methods, watch, mounted, unmounted, beforeDestroy }` wrapper.
- [ ] Imports of child components auto-register — drop the `components: { ... }` block.
- [ ] Replace `data()` entries with `ref<T>()` / `reactive<T>()`.
- [ ] Replace `computed: { x() { return this.y } }` with `const x = computed(() => y.value)`.
- [ ] Replace `methods: { foo() { ... } }` with `function foo(): void { ... }`.
- [ ] Replace `watch: { foo(v) { ... } }` with `watch(foo, (v) => { ... })`.
- [ ] Replace `mounted`, `unmounted`, `beforeDestroy`, `destroyed` with `onMounted`, `onUnmounted`, `onBeforeUnmount`, `onUnmounted`.
- [ ] Replace `this.$route` → `const route = useRoute()`, `this.$router` → `const router = useRouter()`, `this.$q` → `const $q = useQuasar()`, `this.$t(k)` → `const { t } = useI18n(); t(k)`.
- [ ] Replace `this.$refs.foo` with `const foo = ref<HTMLElement | null>(null)` + `ref="foo"` in template.
- [ ] Every `useQuery` / `useMutation` / `apolloClient.query` / `apolloClient.mutate` call has `<Result, Vars>` generics from the feature types module.
- [ ] Every Apollo result read uses typed `?.` optional chaining. Zero `lodash.get` paths on Apollo results.
- [ ] Props typed via `defineProps<Props>()` (with `withDefaults` if defaults are needed).
- [ ] Emits typed via `defineEmits<{ (e: 'evt', v: T): void }>()` if any.
- [ ] Pinia stores: `storeToRefs(store)` for state/getters, direct method calls for actions.
- [ ] For auth-gated actions, check `auth.isAuthenticated` (the getter added in Wave A) — not `token && user`. On fail, `router.push({ name: 'login', query: { redirect: route.fullPath } })` + `$q.notify`.

## Clean up lodash and manual parsing

- [ ] No `_.get(x, 'a.b.c', fb)` — replace with `x?.a?.b?.c ?? fb`.
- [ ] No `$_.isEmpty(arr)` in templates — use a `computed isEmpty = computed(() => !arr.value?.length)`.
- [ ] No `$_.get(user, '[fullName]')` — it's non-standard bracket syntax that silently returns `undefined`. Use `user?.fullName`.
- [ ] No `JSON.parse(node.currency)` or any `JSONString` scalar parsing — Apollo's typePolicy already parsed it.
- [ ] Guard any remaining `JSON.parse(LocalStorage.getItem(...))` against `null`: `const raw = LocalStorage.getItem('x'); if (raw != null) { JSON.parse(raw) }`.

## Style block

- [ ] No `:global(html[dir='rtl']) .foo { ... }` inside scoped styles — Vue 3's scoped-style parser drops the inner selector and flips the whole `<html>`. Use `[dir='rtl'] .foo { ... }` outside scoped rules, or prefer logical properties (`inset-inline-start`, `padding-inline-start`) so RTL works without overrides.

## Gates (all three must pass)

```bash
npx tsc --noEmit -p tsconfig.json
npm run codegen:check
npm run build
```

Vite's esbuild does not typecheck — `npm run build` passing without `tsc --noEmit` means nothing.

## Smoke test

- [ ] Start dev in the background: `npx quasar dev -m spa -p 9000 > /tmp/qc.log 2>&1 &`
- [ ] Wait for `App URL` in the log.
- [ ] Headless-Chrome the affected route:
  ```bash
  /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
    --headless --disable-gpu --virtual-time-budget=15000 --dump-dom \
    'http://localhost:9000/#/your-route' > /tmp/dom.html 2>/tmp/err.log
  ```
- [ ] Confirm DOM markers for the content you expect (card classes, section headings, etc.).
- [ ] `grep -iE "CONSOLE.*(error|warn)|Uncaught" /tmp/err.log` — filter out `OneSignal`, `LogRocket`, `allowComposition`, Apollo devtools deprecation. Residual count should be **0**.

## Commit

- [ ] One commit per logical conversion (a page + its tight-coupled leaf components, or one parallel agent's scope).
- [ ] Commit message names the files converted, the query selections added (if any), and the gate results.
- [ ] No emojis unless the user asked.

## Stop if

- The typed conversion would require touching files outside the owned scope (stop and report; don't silently widen).
- A `.js` query file you'd have to edit for a field addition is owned by another feature that isn't part of this task — ask the user.
- A required type is missing from `src/types/<feature>/types.ts` — add it to the types module, don't pull raw types from `src/graphql/generated`.
