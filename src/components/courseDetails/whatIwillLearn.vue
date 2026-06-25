<template>
  <section v-if="points.length || loading" class="cd-section">
    <header class="cd-section__head">
      <h2>{{ $t('ما الذي سأتعلمه ؟') }}</h2>
    </header>

    <ReadMore v-if="points.length" :max-height="300">
      <ul class="cd-learn-list">
        <li v-for="edge in points" :key="edge.node?.id ?? ''">
          <svg class="cd-learn-list__check" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 12.5l4.2 4.2L19 7" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <!-- Authored as markdown — render it so lists/bold/emoji read nicely
               instead of a wall of raw text. -->
          <div class="cd-md" v-html="renderMarkdown(edge.node?.points)" />
        </li>
      </ul>
    </ReadMore>

    <div v-else-if="loading" class="cd-section__skeleton">
      <ds-skeleton shape="line" width="80%" />
      <ds-skeleton shape="line" width="65%" />
      <ds-skeleton shape="line" width="74%" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import { GetAllWhatYouWillLearnByCourseID } from 'src/graphql/course_management/query/GetAllWhatYouWillLearnByCourseID'
import { renderMarkdown } from 'src/utils/renderQaContent'
import ReadMore from 'src/components/courseDetails/ReadMore.vue'
import type {
  GetAllWhatYouWillLearnByCourseIdResult,
  GetAllWhatYouWillLearnByCourseIdVars,
} from 'src/types/courses/types'

type OutcomeEdge = NonNullable<
  NonNullable<GetAllWhatYouWillLearnByCourseIdResult['allWhatYouWillLearn']>['edges'][number]
>

const props = defineProps<{
  course_id: string
}>()

// Load the full set in one page; the ReadMore clamp (not a paginate button)
// handles a long list, so there's a single "عرض المزيد" affordance.
const { result, loading } = useQuery<
  GetAllWhatYouWillLearnByCourseIdResult,
  GetAllWhatYouWillLearnByCourseIdVars
>(
  GetAllWhatYouWillLearnByCourseID,
  () => ({ courseID: props.course_id, limit: 50 }),
  { errorPolicy: 'all' },
)

const allWhatYouWillLearn = computed(
  () => result.value?.allWhatYouWillLearn ?? null,
)

const points = computed(
  () => (allWhatYouWillLearn.value?.edges ?? [])
    .filter((e): e is OutcomeEdge => !!e && !!e.node),
)
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

  &__skeleton {
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-2);
  }
}

.cd-learn-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--ds-space-3);

  @media (min-width: 700px) {
    grid-template-columns: 1fr 1fr;
    gap: var(--ds-space-3) var(--ds-space-5);
  }

  li {
    display: flex;
    align-items: flex-start;
    gap: var(--ds-space-2);
    font-size: var(--ds-text-md);
    line-height: var(--ds-leading-arabic);
    color: var(--ds-text);
  }

  &__check {
    inline-size: 1.15rem;
    block-size: 1.15rem;
    color: var(--ds-success);
    flex-shrink: 0;
    margin-block-start: 0.35em;
  }
}

// Markdown prose rendered inside a learn-list item.
.cd-md {
  min-width: 0;
  flex: 1;

  :deep(p) { margin: 0 0 var(--ds-space-2); }
  :deep(p:last-child) { margin-block-end: 0; }
  :deep(ul), :deep(ol) {
    padding-inline-start: var(--ds-space-5);
    margin: var(--ds-space-1) 0 var(--ds-space-2);
  }
  :deep(li) { margin-block-end: var(--ds-space-1); display: list-item; }
  :deep(strong), :deep(b) { color: var(--ds-text); font-weight: var(--ds-weight-bold); }
  :deep(em), :deep(i) { font-style: italic; }
  :deep(a) { color: var(--ds-brand-600); text-decoration: underline; }
  :deep(h1), :deep(h2), :deep(h3), :deep(h4) {
    font-family: var(--ds-font-heading);
    font-size: var(--ds-text-md);
    font-weight: var(--ds-weight-bold);
    margin: var(--ds-space-2) 0 var(--ds-space-1);
    color: var(--ds-text);
  }
  :deep(code) {
    font-family: var(--ds-font-mono);
    font-size: 0.9em;
    background: var(--ds-surface-2, rgba(0, 0, 0, 0.05));
    padding: 0.1em 0.35em;
    border-radius: 4px;
  }
}
</style>
