# Typecheck Gates — Current State

As of commit `cc4e4ea`, **all typecheck gates are green**:

| Gate | Command | Status |
|---|---|---|
| Hard TS compile | `npm run typecheck` (tsc on `src/graphql/**` + `src/types/**`) | ✅ 0 errors |
| Vue SFC typecheck | `npm run typecheck:vue` (vue-tsc on all `.vue`) | ✅ 0 errors |
| Codegen drift | `npm run codegen:check` | ✅ green |
| Quasar/Vite build | `npm run build` | ✅ green |

## History

- **249 errors** — immediately after vue-tsc was wired up.
- **208 errors** — after converting Pinia stores (`auth`, `cart`, `settings`, `pyramid`) from `.js` to `.ts`.
- **11 errors** — after a mechanical nullability sweep across ~45 `.vue` files (commit `cc4e4ea`).
- **0 errors** — after `tsconfig.vue.json` path aliases + `videojs-hls-quality-selector.d.ts` shim.

## How to keep it at zero

Run `npm run typecheck:vue` before committing any `.vue` edit. Every PR should
keep this at 0. If you introduce a new Apollo op, a new leaf component, or a
new prop shape, the rules in `.claude/skills/vue-type-safe-conversion/SKILL.md`
still apply:

1. Types come from `src/types/<feature>/types.ts` — never import from
   `src/graphql/generated` directly.
2. `useQuery` / `useMutation` / `apolloClient.query` / `apolloClient.mutate`
   always take `<Result, Vars>` generics.
3. Read Apollo results with typed optional chaining (`?.` + `??`) — no
   `lodash.get` paths, no `as any`, no `@ts-expect-error`.
4. If a GraphQL selection is missing a field the UI reads, edit the `.js`
   file under `src/graphql/<domain>/{query,mutation}/` and re-run
   `npm run codegen`. Don't paper over the consumer.

## Edge cases worth remembering

- **`CourseNode.currency`** is parsed at cache-read time by the Apollo
  `typePolicy` in `src/apollo/client.js` — consume as `CoursePricing` directly,
  never `JSON.parse(node.currency)`.
- **`CourseUnitContentNode.modelValue`** is a `JSONString` scalar NOT covered
  by a typePolicy — `contentItem.vue` accepts both the parsed-object shape and
  the runtime JSON-string, via a `readModelValue()` helper. If a typePolicy is
  ever added for this field, drop the helper and consume the object directly.
- **Cart item shape** is narrower than the GraphQL Course node — cart call
  sites build an explicit `{ id, pk, name, currency }` mapping rather than
  passing the raw Course.
- **Third-party window globals** (OneSignal, FB, google, Stripe, paypal,
  videojs) are narrowly typed as optional in `src/types/globals.d.ts`. Every
  call must guard with `if (!window.X) return` or `?.`. Do NOT widen the
  shims to drop the optional.
- **`CurrencyCode`** lives in `src/types/settings/types.ts` (the settings
  feature owns the currency selection UI). `src/types/courses/types.ts`
  re-exports it for course-shaped consumers.

## Not covered by vue-tsc

- Schema-drift ops excluded from codegen (`CreatePaypalCheckout`,
  `CreateSyberpayCheckout`, `SetUserPassword`, etc.) — these still use inline
  types in their consuming components. Follow-up: coordinate with backend to
  get the ops back into the schema so codegen picks them up, then drop the
  inline declarations.
- Runtime behavior of template bindings that vue-tsc can check structurally
  but not semantically — e.g. whether a `v-model` binding target exists on
  the parent. vue-tsc does check `defineProps`/`defineEmits` contracts, but
  template-to-script data-flow validation is limited.
