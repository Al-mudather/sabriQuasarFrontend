<template>
  <section v-if="instructors.length || loading" class="cd-section">
    <header class="cd-section__head">
      <h2>{{ $t('المحاضرون') }}</h2>
    </header>

    <div class="cd-instructors">
      <template v-if="loading && instructors.length === 0">
        <div class="cd-instructor cd-instructor--loading" v-for="n in 2" :key="'in-' + n">
          <ds-skeleton shape="circle" width="4rem" />
          <div class="cd-instructor__text">
            <ds-skeleton shape="line" width="70%" />
            <ds-skeleton shape="line" width="50%" />
          </div>
        </div>
      </template>

      <article v-for="edge in instructors" :key="edge.node?.id ?? ''" class="cd-instructor">
        <img
          v-if="edge.node?.instructor?.image"
          :src="getImageUrl(edge.node.instructor.image)"
          :alt="displayName(edge)"
          class="cd-instructor__avatar"
        />
        <img v-else src="~assets/img/user-13.jpg" :alt="displayName(edge)" class="cd-instructor__avatar" />
        <div class="cd-instructor__text">
          <h3 class="cd-instructor__name">{{ displayName(edge) }}</h3>
          <p
            :ref="(el) => setBioRef(el, edge.node?.id ?? '')"
            class="cd-instructor__qualification"
            :class="{ 'cd-instructor__qualification--clamped': !expandedIds.has(edge.node?.id ?? '') }"
          >
            {{ edge.node?.instructor?.qualification ?? '' }}
          </p>
          <button
            v-if="overflowingIds.has(edge.node?.id ?? '')"
            class="cd-instructor__toggle"
            :aria-expanded="expandedIds.has(edge.node?.id ?? '')"
            @click="toggleExpanded(edge.node?.id ?? '')"
          >
            {{ expandedIds.has(edge.node?.id ?? '') ? $t('عرض أقل') : $t('عرض المزيد') }}
          </button>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import { GetAllCourseInstructors } from 'src/graphql/course_management/query/GetAllCourseInstructors'
import type {
  GetAllCourseInstructorsResult,
  GetAllCourseInstructorsVars,
} from 'src/types/courses/types'

type InstructorEdge = NonNullable<
  NonNullable<GetAllCourseInstructorsResult['allCourseInstructors']>['edges'][number]
>

const props = defineProps<{
  course_id: string
}>()

const { result, loading } = useQuery<GetAllCourseInstructorsResult, GetAllCourseInstructorsVars>(
  GetAllCourseInstructors,
  () => ({ courseID: props.course_id }),
  { errorPolicy: 'all' },
)

const instructors = computed(
  () => (result.value?.allCourseInstructors?.edges ?? [])
    .filter((e): e is InstructorEdge => !!e && !!e.node),
)

/** Per-instructor expanded state — keyed by node id */
const expandedIds = ref<Set<string>>(new Set())

/** Ids whose bio text actually overflows the 5-line clamp */
const overflowingIds = ref<Set<string>>(new Set())

/** Map of node id → paragraph DOM element, populated by the template ref callback */
const bioEls = ref<Map<string, Element>>(new Map())

function setBioRef (el: unknown, id: string): void {
  if (el instanceof Element) {
    bioEls.value.set(id, el)
  } else {
    bioEls.value.delete(id)
  }
}

function toggleExpanded (id: string): void {
  const next = new Set(expandedIds.value)
  if (next.has(id)) {
    next.delete(id)
  } else {
    next.add(id)
  }
  expandedIds.value = next
}

/** Measure each paragraph's overflow after the DOM has settled */
async function measureOverflow (): Promise<void> {
  await nextTick()
  const next = new Set<string>()
  for (const [id, el] of bioEls.value.entries()) {
    if (el.scrollHeight > el.clientHeight + 2) {
      next.add(id)
    }
  }
  overflowingIds.value = next
}

// Re-measure whenever instructors load or change
watch(instructors, () => { void measureOverflow() }, { immediate: true })

function displayName (edge: InstructorEdge): string {
  const user = edge.node?.instructor?.user
  if (!user) return ''
  if (user.fullName) return user.fullName
  return user.username.split('@')[0]
}

function getImageUrl (img: string): string {
  if (process.env.NODE_ENV === 'development') return 'http://localhost:8000/media/' + img
  return location.origin + '/media/' + img
}
</script>

<style lang="scss" scoped>
.cd-section {
  background: var(--ds-surface);
  border: 1px solid var(--ds-border);
  border-radius: var(--ds-radius-lg);
  padding: var(--ds-space-5);
  box-shadow: var(--ds-shadow-xs);

  &__head {
    margin-block-end: var(--ds-space-4);
    h2 {
      font-family: var(--ds-font-heading);
      font-size: var(--ds-text-xl);
      font-weight: var(--ds-weight-bold);
      color: var(--ds-text);
      margin: 0;
    }
  }
}

.cd-instructors {
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-6);
}

.cd-instructor {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: var(--ds-space-4) var(--ds-space-5);
  align-items: start;

  &--loading { background: transparent; }

  &__avatar {
    inline-size: 5.5rem;
    block-size: 5.5rem;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
    border: 3px solid var(--ds-surface-elevated);
    box-shadow: var(--ds-shadow-sm);
    grid-row: 1 / span 2;

    @media (min-width: 700px) {
      inline-size: 7rem;
      block-size: 7rem;
    }
  }

  &__text {
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-1);
    min-inline-size: 0;
  }

  &__name {
    font-family: var(--ds-font-heading);
    font-size: var(--ds-text-lg);
    font-weight: var(--ds-weight-bold);
    color: var(--ds-text);
    margin: 0;
    line-height: 1.25;
  }

  &__qualification {
    font-size: var(--ds-text-sm);
    color: var(--ds-text-muted);
    margin: 0;
    line-height: var(--ds-leading-arabic);
    max-inline-size: 65ch;

    &--clamped {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 5;
      overflow: hidden;
    }
  }

  &__toggle {
    align-self: flex-start;
    background: none;
    border: none;
    padding: 0;
    margin-block-start: var(--ds-space-1);
    font-size: var(--ds-text-sm);
    font-family: var(--ds-font-body);
    font-weight: var(--ds-weight-medium);
    color: var(--ds-indigo, var(--ds-primary));
    cursor: pointer;
    text-decoration: underline;
    text-underline-offset: 2px;

    &:hover {
      opacity: 0.8;
    }

    &:focus-visible {
      outline: 2px solid var(--ds-indigo, var(--ds-primary));
      outline-offset: 2px;
      border-radius: 2px;
    }
  }
}
</style>
