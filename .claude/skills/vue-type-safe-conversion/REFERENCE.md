# Canonical Reference — Type-Safe Vue SFC Conversion

The reference implementation lives in two files. When in doubt, do what these files do.

## Primary: `src/pages/course_management/Courses.vue` (commit 81efe8f)

A list page with two queries (catalog + specialities filter), a filter sidebar, a mobile bottom-sheet, and pagination via `fetchMore`. Demonstrates every pattern in one place.

Key features to study:

- **Typed `useQuery` with reactive variables:**
  ```ts
  const queryVars = reactive<GetAllCoursesVars>({
    first: 12,
    orderBy: ['-created'],
    isDraft: false,
  })
  const coursesQuery = useQuery<GetAllCoursesResult, GetAllCoursesVars>(
    GetAllCourses,
    () => queryVars,
    { fetchPolicy: 'cache-and-network' },
  )
  ```

- **Edge extraction with filter-narrowed null stripping:**
  ```ts
  const coursesEdges = computed(
    () => (coursesData.value?.allCourses?.edges ?? [])
      .filter((e): e is NonNullable<typeof e> => !!e && !!e.node),
  )
  ```

- **Computed state with union-literal types:**
  ```ts
  type SortValue = 'newest' | 'popular' | 'price_asc' | 'price_desc'
  const sortValue = ref<SortValue>('newest')
  ```

- **Typed `fetchMore.updateQuery`:**
  ```ts
  updateQuery: (prev: GetAllCoursesResult, { fetchMoreResult }): GetAllCoursesResult => {
    if (!fetchMoreResult?.allCourses || !prev.allCourses) return prev
    // ...
  }
  ```

- **Derived-state sync into reactive query vars via `watch(..., { deep: true, immediate: true })`** — this replaces the Options-API "computed-with-side-effects" anti-pattern.

- **Composition-API lifecycle:**
  ```ts
  onMounted(() => {
    settings.setActiveNav('COURSES')
    auth.setNavbarSearch(false)
    hydrateFromRoute()
  })
  onUnmounted(() => {
    auth.setNavbarSearch(true)
    if (searchTimer.value) clearTimeout(searchTimer.value)
  })
  ```

- **`useRoute` / `useRouter` instead of `this.$route` / `this.$router`.**

## Secondary: `src/components/utils/courseCard.vue` (commit ae3a779)

A leaf card component. Demonstrates:

- **`defineProps<Props>()` with a union type** that accepts both rich and light course shapes:
  ```ts
  interface Props {
    course: Course | CourseInSpeciality
    name?: string
    instructor?: string
    unit?: string
    price?: number | string | null
  }
  const props = defineProps<Props>()
  ```

- **`storeToRefs` for Pinia state, direct method calls for actions:**
  ```ts
  const auth = useAuthStore()
  const settings = useSettingsStore()
  const cart = useCartStore()
  const { user } = storeToRefs(auth)
  const { currency } = storeToRefs(settings)
  ```

- **Typed JSONString scalar consumption** — `CourseNode.currency` is already parsed by the Apollo `typePolicy` in `src/apollo/client.js`; consumers read it as an object:
  ```ts
  const pricing = computed<CoursePricing | null>(() => {
    const raw = props.course.currency
    if (!raw || typeof raw !== 'object') return null
    return raw as CoursePricing
  })
  ```

- **Auth-guarded navigation:**
  ```ts
  function addToCart (): void {
    if (!auth.isAuthenticated) {
      router.push({ name: 'login', query: { redirect: '/courses' } })
      return
    }
    cart.addCourseToCart({ user: user.value, course: props.course })
    router.push({ name: 'cart' })
  }
  ```

- **Intl.NumberFormat for locale-aware formatting** (Arabic digits on this project):
  ```ts
  new Intl.NumberFormat('ar-EG', { maximumFractionDigits: 2 }).format(n)
  ```

## The bug story (commit 62e76b7) — why this matters

The `/courses` page was stuck on skeletons forever. The old Options-API code did:

```js
// untyped, using lodash.get
coursesHasNext: _.get(data, 'allCourses.pageInfo.hasNextPage', false)
```

`pageInfo` was never selected in the `GetAllCourses` query. `_.get` silently returned `false`. The "load more" button never appeared, but the page still ran.

Then the typed rewrite made it:

```ts
coursesHasNext: data?.allCourses?.pageInfo.hasNextPage ?? false
```

Missing the trailing `?.` after `pageInfo`. Since `pageInfo` wasn't in the type either (because it wasn't in the query), `undefined.hasNextPage` threw at runtime and the page froze in skeleton state.

**The fix was not to paper over with another `?.`.** It was to realize the page wanted pagination all along and fix the actual problem: add `pageInfo { hasNextPage endCursor }` + `$after: String` to the GraphQL query, re-run `npm run codegen`, then consume it cleanly. Same story for `enrolled` on the listing page and `courseSpeciality.speciality` on details.

**Lesson:** when the type says the field isn't there, that's the schema of truth telling you the query is wrong. Fix the query.
