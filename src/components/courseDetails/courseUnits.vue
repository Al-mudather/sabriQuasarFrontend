<template>
  <section class="cd-content">
    <header class="cd-content__head">
      <h2>{{ $t('محتوى الدورة') }}</h2>
      <p v-if="!loading" class="cd-content__summary">
        <span>{{ totalUnits }} {{ $t('وحدات') }}</span>
        <span class="cd-content__dot" aria-hidden="true">·</span>
        <span>{{ totalLessons }} {{ $t('درس') }}</span>
      </p>
    </header>

    <div v-if="units.length === 0 && !loading" class="cd-content__empty">
      <ds-empty-state
        :title="$t('لا توجد محتويات حتى الآن')"
        size="sm"
      />
    </div>

    <div v-else-if="loading && units.length === 0" class="cd-content__skeleton">
      <ds-skeleton v-for="n in 3" :key="'u-' + n" shape="rect" height="3.5rem" />
    </div>

    <template v-else>
      <div class="cd-content__toolbar">
        <button
          type="button"
          class="cd-content__expand-all"
          @click="toggleExpandAll"
        >
          {{ allOpen ? $t('طي الكل') : $t('توسيع الكل') }}
        </button>
      </div>

      <ds-accordion
        v-model="openedUnits"
        :multi="true"
      >
        <ds-accordion-item
          v-for="(edge, idx) in units"
          :key="edge.node?.pk ?? idx"
          :name="String(edge.node?.pk ?? idx)"
        >
          <template #title>
            <span class="cd-content__unit-index">{{ idx + 1 }}</span>
            <span class="cd-content__unit-title">{{ edge.node?.title ?? '' }}</span>
          </template>
          <template #subtitle>
            <span class="cd-content__unit-meta">
              {{ lectureCountFor(edge) }} {{ $t('درس') }}
            </span>
          </template>

          <div class="cd-content__unit-body">
            <template v-if="edge.node?.isExternal">
              <div
                v-for="content in (edge.node.external?.courseunitcontentSet?.edges ?? [])"
                :key="content?.node?.pk ?? ''"
              >
                <content-item
                  v-if="isRenderableContent(content?.node?.modelName)"
                  :content="content!.node!"
                  @preview-content="(p) => emit('preview-content', { ...p, unitTitle: edge.node?.title ?? '' })"
                />
              </div>
            </template>
            <template v-else>
              <div
                v-for="content in (edge.node?.courseunitcontentSet?.edges ?? [])"
                :key="content?.node?.pk ?? ''"
              >
                <content-item
                  v-if="isRenderableContent(content?.node?.modelName)"
                  :content="content!.node!"
                  @preview-content="(p) => emit('preview-content', { ...p, unitTitle: edge.node?.title ?? '' })"
                />
              </div>
            </template>
          </div>
        </ds-accordion-item>
      </ds-accordion>
    </template>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import contentItem from 'components/courseDetails/contentItem.vue'
import DsAccordion from 'src/design-system/components/DsAccordion.vue'
import DsAccordionItem from 'src/design-system/components/DsAccordionItem.vue'
import DsSkeleton from 'src/design-system/components/DsSkeleton.vue'
import DsEmptyState from 'src/design-system/components/DsEmptyState.vue'
import { GetAllCourseUnitsByCourseID } from 'src/graphql/course_management/query/GetAllCourseUnitsByCourseID'
import type {
  GetAllCourseUnitsByCourseIdResult,
  GetAllCourseUnitsByCourseIdVars,
} from 'src/types/courses/types'

type UnitEdge = NonNullable<
  NonNullable<GetAllCourseUnitsByCourseIdResult['allCourseUnits']>['edges'][number]
>

const RENDERABLE = ['ContentVideo', 'ContentFile', 'ContentQuiz']

const props = defineProps<{
  course_id: string
  courseCover?: string | null
}>()

interface PreviewPayload {
  id: string
  pk: number | null
  title: string
  modelName: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any
  unitTitle?: string
}

interface FreeSample {
  id: string
  pk: number | null
  title: string
  modelName: string
  duration?: string
  thumbnail?: string
  unitTitle?: string
  modelValue: Record<string, unknown> | null
}

const emit = defineEmits<{
  (e: 'preview-content', payload: PreviewPayload): void
  (e: 'samples-changed', list: FreeSample[]): void
}>()

const { result, loading: qLoading } = useQuery<GetAllCourseUnitsByCourseIdResult, GetAllCourseUnitsByCourseIdVars>(
  GetAllCourseUnitsByCourseID,
  () => ({ courseID: props.course_id, limit: 50 }),
  { errorPolicy: 'all' },
)

const units = computed<UnitEdge[]>(
  () => (result.value?.allCourseUnits?.edges ?? [])
    .filter((e): e is UnitEdge => !!e && !!e.node),
)

const totalUnits = computed(
  () => result.value?.allCourseUnits?.totalCount ?? units.value.length,
)

const totalLessons = computed(() =>
  units.value.reduce((sum, edge) => sum + lectureCountFor(edge), 0),
)

const loading = computed(() => qLoading.value && units.value.length === 0)

function lectureCountFor (edge: UnitEdge): number {
  if (edge.node?.isExternal) {
    return edge.node?.external?.courseunitcontentSet?.totalCount ?? 0
  }
  return edge.node?.courseunitcontentSet?.edges?.length ?? 0
}

function isRenderableContent (modelName: string | null | undefined): boolean {
  return RENDERABLE.includes(modelName ?? '')
}

// Opened-unit state: open the first unit by default; reset on course change.
const openedUnits = ref<(string | number)[]>([])
const allOpen = computed(
  () => units.value.length > 0 && openedUnits.value.length === units.value.length,
)

watch(
  units,
  (next, prev) => {
    // Seed first-open only once after the first populate, or whenever the
    // course_id changes (which re-fires the query and resets `prev` to []).
    if (!next.length) { openedUnits.value = []; return }
    const firstName = String(next[0]?.node?.pk ?? 0)
    if (!prev || !prev.length) {
      openedUnits.value = [firstName]
    }
  },
  { immediate: true },
)

watch(() => props.course_id, () => { openedUnits.value = [] })

function toggleExpandAll (): void {
  if (allOpen.value) {
    openedUnits.value = []
  } else {
    openedUnits.value = units.value.map((e, i) => String(e.node?.pk ?? i))
  }
}

// Free samples — derived from the full units tree and emitted upward so the
// parent CourseDetails page can feed the shared CoursePreviewDialog.
const PLAYABLE_MODELS = new Set(['ContentVideo', 'ContentFile', 'ContentQuiz'])

function parseMv (raw: unknown): Record<string, unknown> | null {
  if (!raw) return null
  if (typeof raw === 'string') {
    try { return JSON.parse(raw) as Record<string, unknown> } catch { return null }
  }
  if (typeof raw === 'object') return raw as Record<string, unknown>
  return null
}

function titleFor (modelName: string, mv: Record<string, unknown> | null): string {
  if (!mv) return ''
  if (modelName === 'ContentFile') {
    return String((mv.attachment as string | undefined)?.split('/attachment/')[1] ?? '')
  }
  if (modelName === 'ContentQuiz') return String(mv.quiz_title ?? '')
  return String(mv.title ?? '')
}

function durationFor (mv: Record<string, unknown> | null): string | undefined {
  if (!mv) return undefined
  const d = mv.duration ?? mv.video_duration ?? mv.minutes
  return d ? String(d) : undefined
}

const freeSamples = computed<FreeSample[]>(() => {
  const out: FreeSample[] = []
  for (const u of units.value) {
    const unitTitle = u.node?.title ?? ''
    const items = u.node?.isExternal
      ? (u.node.external?.courseunitcontentSet?.edges ?? [])
      : (u.node?.courseunitcontentSet?.edges ?? [])
    for (const c of items) {
      const node = c?.node
      if (!node) continue
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (!(node as any).isFree) continue
      const modelName = String(node.modelName ?? '')
      if (!PLAYABLE_MODELS.has(modelName)) continue
      const mv = parseMv(node.modelValue as unknown)
      out.push({
        id: String((node as unknown as { id?: string }).id ?? node.pk ?? ''),
        pk: node.pk ?? null,
        title: titleFor(modelName, mv),
        modelName,
        duration: durationFor(mv),
        thumbnail: props.courseCover ?? undefined,
        unitTitle,
        modelValue: mv,
      })
    }
  }
  return out
})

watch(freeSamples, (list) => emit('samples-changed', list), { immediate: true })
</script>

<style lang="scss" scoped>
.cd-content {
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-4);

  &__head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: var(--ds-space-2);

    h2 {
      font-family: var(--ds-font-heading);
      font-size: var(--ds-text-xl);
      font-weight: 700;
      color: var(--ds-text);
      margin: 0;
      letter-spacing: -0.01em;
    }
  }

  &__summary {
    margin: 0;
    display: inline-flex;
    gap: var(--ds-space-2);
    align-items: center;
    font-family: var(--ds-font-body);
    font-size: var(--ds-text-sm);
    color: var(--ds-text-muted);
  }

  &__dot { color: var(--ds-text-muted); }

  &__toolbar {
    display: flex;
    justify-content: flex-end;
  }

  &__expand-all {
    appearance: none;
    background: transparent;
    border: 0;
    cursor: pointer;
    font-family: var(--ds-font-heading);
    font-weight: 600;
    font-size: var(--ds-text-sm);
    color: var(--ds-brand-600);
    padding: var(--ds-space-1) var(--ds-space-2);
    border-radius: var(--ds-radius-sm);

    &:hover { color: var(--ds-brand-700); text-decoration: underline; }
    &:focus-visible { outline: 2px solid var(--ds-brand-600); outline-offset: 2px; }
  }

  &__skeleton {
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-2);
  }

  &__unit-index {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    inline-size: 1.75rem;
    block-size: 1.75rem;
    border-radius: 50%;
    background: var(--ds-brand-600);
    color: var(--ds-text-onBrand, #fff);
    font-family: var(--ds-font-heading);
    font-size: var(--ds-text-sm);
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    margin-inline-end: var(--ds-space-2);
  }

  &__unit-title {
    font-family: var(--ds-font-heading);
    font-weight: 600;
    color: var(--ds-text);
  }

  &__unit-meta {
    font-family: var(--ds-font-body);
    font-size: var(--ds-text-xs);
    color: var(--ds-text-muted);
  }

  &__unit-body {
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-1);
    padding-block: var(--ds-space-2);
  }
}
</style>
