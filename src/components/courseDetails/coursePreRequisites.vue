<template>
  <section v-if="hasContent || loading" class="cd-section">
    <header class="cd-section__head">
      <h2>{{ $t('ماهي متطلبات الدوره ؟') }}</h2>
    </header>

    <ReadMore v-if="prerequisites.length" :max-height="260">
      <ul class="cd-prereq-list">
        <li v-for="preReq in prerequisites" :key="preReq.node?.id ?? ''">
          <svg class="cd-prereq-list__dot" viewBox="0 0 16 16" aria-hidden="true">
            <circle cx="8" cy="8" r="3" fill="currentColor" />
          </svg>
          <!-- Authored as markdown — render formatting instead of raw text. -->
          <div class="cd-md" v-html="renderMarkdown(preReq.node?.prerequisite)" />
        </li>
      </ul>
    </ReadMore>

    <div v-else-if="loading" class="cd-section__skeleton">
      <ds-skeleton shape="line" width="75%" />
      <ds-skeleton shape="line" width="60%" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import { GetAllPreRequisitesByCourse } from 'src/graphql/course_management/query/GetAllPreRequisitesByCourse'
import { renderMarkdown } from 'src/utils/renderQaContent'
import ReadMore from 'src/components/courseDetails/ReadMore.vue'
import type {
  GetAllPreRequisitesByCourseResult,
  GetAllPreRequisitesByCourseVars,
} from 'src/types/courses/types'

const props = defineProps<{
  course_id: string
}>()

const { result, loading } = useQuery<GetAllPreRequisitesByCourseResult, GetAllPreRequisitesByCourseVars>(
  GetAllPreRequisitesByCourse,
  () => ({ courseID: parseInt(props.course_id, 10) }),
  { errorPolicy: 'all' },
)

const prerequisites = computed(
  () => (result.value?.allPrerequisiteByCourse?.edges ?? [])
    .filter((e): e is NonNullable<typeof e> => !!e && !!e.node),
)

const hasContent = computed(() => prerequisites.value.length > 0)
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

.cd-prereq-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-3);

  li {
    display: flex;
    align-items: flex-start;
    gap: var(--ds-space-2);
    font-size: var(--ds-text-md);
    line-height: var(--ds-leading-arabic);
    color: var(--ds-text);
  }

  &__dot {
    inline-size: 1rem;
    block-size: 1rem;
    color: var(--ds-accent-500);
    flex-shrink: 0;
    margin-block-start: 0.4em;
  }
}

// Markdown prose rendered inside a prerequisite item.
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
}
</style>
