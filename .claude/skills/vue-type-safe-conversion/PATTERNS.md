# Pattern Library — Vue Type-Safe Conversion

Load this file on demand when you need a specific pattern. Examples and copy-paste templates below.

---

## 1. Typed `useQuery` — basic form

```ts
import { useQuery } from '@vue/apollo-composable'
import { GetAllCourses } from 'src/graphql/course_management/query/GetAllCourses.js'
import type { GetAllCoursesResult, GetAllCoursesVars } from 'src/types/courses/types'

const { result, loading, error } = useQuery<GetAllCoursesResult, GetAllCoursesVars>(
  GetAllCourses,
  { first: 12, orderBy: ['-created'], isDraft: false },
)
```

## 2. Typed `useQuery` with reactive variables

When variables come from filter state:

```ts
const queryVars = reactive<GetAllCoursesVars>({
  first: 12,
  orderBy: ['-created'],
  isDraft: false,
})

const coursesQuery = useQuery<GetAllCoursesResult, GetAllCoursesVars>(
  GetAllCourses,
  () => queryVars,                              // factory, re-runs on change
  { fetchPolicy: 'cache-and-network' },
)
```

Sync a derived computed into `queryVars` via a deep watch with `immediate: true`:

```ts
const queryVariables = computed<GetAllCoursesVars>(() => {
  const v: GetAllCoursesVars = { first: 12, orderBy: orderBy.value, isDraft: false }
  if (search.value.trim()) v.title_Icontains = search.value.trim()
  if (activeSpecialityID.value) v.courseSpeciality = activeSpecialityID.value
  return v
})

watch(
  queryVariables,
  (vars) => {
    for (const k of Object.keys(queryVars) as Array<keyof GetAllCoursesVars>) {
      if (!(k in vars)) delete (queryVars as Record<string, unknown>)[k]
    }
    Object.assign(queryVars, vars)
  },
  { deep: true, immediate: true },
)
```

## 3. Typed `useMutation`

```ts
import { useMutation } from '@vue/apollo-composable'
import { LoginUserWithEmail } from 'src/graphql/account_management/mutation/LoginUserWithEmail.js'
import type { LoginResult, LoginVars } from 'src/types/auth/types'

const { mutate: login, loading } = useMutation<LoginResult, LoginVars>(LoginUserWithEmail)

async function handleSubmit (): Promise<void> {
  const res = await login({ username: email.value, password: password.value })
  // res?.data is typed as LoginResult | undefined
}
```

## 4. Typed `apolloClient.query` (imperative)

```ts
import { apolloClient } from 'src/apollo/client'

const { data } = await apolloClient.query<GetAllSpecialitiesResult, GetAllSpecialitiesVars>({
  query: GetSpecialities,
  variables: { courseNumber: 50 },
})
const edges = data?.allCourseSpecialities?.edges ?? []
```

## 5. Edge-node extraction

Connection types emit `edges: Array<Edge | null>` where each `Edge` has `node: Node | null`. Extract the non-null node shape:

```ts
export type Course = NonNullable<
  NonNullable<
    NonNullable<GetAllCoursesQuery['allCourses']>['edges'][number]
  >['node']
>
```

At the call site, when iterating edges, narrow each one:

```ts
const coursesEdges = computed(
  () => (coursesData.value?.allCourses?.edges ?? [])
    .filter((e): e is NonNullable<typeof e> => !!e && !!e.node),
)
```

## 6. JSONString scalar consumption (e.g. `CourseNode.currency`)

**Do NOT `JSON.parse` this.** The Apollo `typePolicy` in `src/apollo/client.js` parses `JSONString` fields at cache-read time. Consumers receive a plain object, which codegen emits as `Record<string, number>`. Narrow it to a domain type:

```ts
import type { CoursePricing, CurrencyCode } from 'src/types/courses/types'

const pricing = computed<CoursePricing | null>(() => {
  const raw = props.course.currency
  if (!raw || typeof raw !== 'object') return null
  return raw as CoursePricing
})

const displayAmount = computed<number | null>(() => {
  const priced = pricing.value?.[selectedCurrency.value as CurrencyCode]
  return typeof priced === 'number' && Number.isFinite(priced) ? priced : null
})
```

## 7. `defineProps<Props>()` — typed component inputs

```ts
interface Props {
  course: Course | CourseInSpeciality   // accept both rich and light shapes
  name?: string
  instructor?: string
  unit?: string
  price?: number | string | null
}
const props = defineProps<Props>()
```

For default values, use `withDefaults`:

```ts
const props = withDefaults(defineProps<Props>(), {
  unit: 'SDG',
  price: null,
})
```

## 8. `defineEmits<>()` — typed events

```ts
const emit = defineEmits<{
  (e: 'select', pk: number): void
  (e: 'close'): void
}>()
```

## 9. Pinia store refs + actions

```ts
import { storeToRefs } from 'pinia'
import { useAuthStore } from 'src/stores/auth'
import { useSettingsStore } from 'src/stores/settings'

const auth = useAuthStore()
const settings = useSettingsStore()
const { user, isAuthenticated } = storeToRefs(auth)   // refs to state/getters
const { currency, isEnglish } = storeToRefs(settings)

// Actions are called directly on the store instance, NOT via storeToRefs:
auth.setNavbarSearch(false)
settings.setActiveNav('COURSES')
```

## 10. Auth-guarded navigation

Uses the `isAuthenticated` getter from `src/stores/auth.js`:

```ts
function redirectToLogin (): void {
  $q.notify({
    type: 'info', position: 'top',
    message: 'سجل دخول أولاً للمتابعة',
    progress: true, timeout: 2000,
  })
  void router.push({
    name: 'login',
    query: { redirect: route.fullPath },
  })
}

function addToCart (): void {
  if (!courseData.value) return
  if (!auth.isAuthenticated) { redirectToLogin(); return }
  cart.addCourseToCart({ user: user.value, course: courseData.value })
  $q.notify({ type: 'positive', position: 'top', message: 'تمت الإضافة إلى السلة' })
}
```

## 11. Route handling — `useRoute` / `useRouter`

```ts
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// Watch for param changes
watch(
  () => route.params,
  (params) => { void loadResource(params) },
  { immediate: true, deep: true },
)

// Always use named routes for pushes
router.push({ name: 'course-details', params: { pk: '42', name: 'MRCS', id: 'X' } })
```

**Named routes, not paths.** `router.push({ name: 'Home' })` survives path refactors and catches typos at commit time. Path-based `router.push('/')` doesn't.

## 12. `<script setup lang="ts">` conversion recipe

Starting from an Options-API block like:

```vue
<script>
export default {
  name: 'MyPage',
  components: { ChildA, ChildB },
  setup () { /* refs */ return { /* exposed */ } },
  data () { return { foo: '' } },
  computed: { bar () { return this.foo.length } },
  methods: { onClick () { this.foo = 'x' } },
  mounted () { /* ... */ },
}
</script>
```

Convert to:

```vue
<script setup lang="ts">
import ChildA from '...'
import ChildB from '...'       // auto-registered, no components: {}

const foo = ref('')
const bar = computed(() => foo.value.length)

function onClick (): void { foo.value = 'x' }

onMounted(() => { /* ... */ })
</script>
```

Key substitutions:
- `this.$route` → `const route = useRoute()` → `route.*`
- `this.$router` → `const router = useRouter()` → `router.*`
- `this.$q` → `const $q = useQuasar()` → `$q.*`
- `this.$t` → `const { t } = useI18n()` → `t('key')`
- `mounted` → `onMounted`
- `unmounted` → `onUnmounted`
- `beforeDestroy` → `onBeforeUnmount`
- `destroyed` → `onUnmounted`
- `this.$refs.x` → `const x = ref<HTMLElement | null>(null)` + `ref="x"` in template

## 13. RTL-safe scoped styles

Never use `:global(html[dir='rtl']) .foo { ... }` inside a Vue 3 scoped `<style>` block — the parser drops the inner selector and `transform: scaleX(-1)` flips the whole `<html>` (the `/courses` page bug we hit). Use plain ancestor-attribute selectors:

```scss
<style scoped>
[dir='rtl'] .my-icon {
  transform: scaleX(-1);
}
</style>
```

Or, better, use logical properties and avoid the override entirely:

```scss
.filter-trigger {
  inset-inline-start: var(--ds-space-3);   /* right in RTL, left in LTR */
  padding-inline-start: 2.5rem;
}
```

## 14. Vue Router best practices (for this project)

- **Named routes** everywhere. `name: 'course-details'`, `name: 'Home'` (case-sensitive). Greppable, typo-proof, survives path changes.
- **Lazy chunks** for page-level routes: `component: () => import('src/pages/Home.vue')`. Keeps the initial bundle small.
- **Route meta for auth**: `meta: { requiresAuth: true }` on protected routes, a single `router.beforeEach` guard in `src/router/index.js` that checks `useAuthStore().isAuthenticated` and redirects to login with `query: { redirect: to.fullPath }`. Do NOT re-implement the auth check in every page — use the guard.
- **Typed route params** (optional follow-up): augment `vue-router`'s `RouteMeta` and typed routes via TypeScript module augmentation. Not yet done here; a follow-up if typed `route.params` becomes important.

## 15. Intl formatting (Arabic-digit display)

```ts
new Intl.NumberFormat('ar-EG', { maximumFractionDigits: 2 }).format(12345.67)
// → "١٢٬٣٤٥٫٦٧"
```

Use this instead of hand-rolled string splits. Project default locale is Arabic (`quasar.config.js` sets `lang: 'ar'`).
