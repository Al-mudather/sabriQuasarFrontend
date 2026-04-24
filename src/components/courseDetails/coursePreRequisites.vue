<template>
  <section v-if="hasContent || loading" class="cd-section">
    <header class="cd-section__head">
      <h2>{{ $t('ماهي متطلبات الدوره ؟') }}</h2>
    </header>

    <ul v-if="prerequisites.length" class="cd-prereq-list">
      <li v-for="preReq in prerequisites" :key="preReq.node.id">
        <svg class="cd-prereq-list__dot" viewBox="0 0 16 16" aria-hidden="true">
          <circle cx="8" cy="8" r="3" fill="currentColor" />
        </svg>
        <span>{{ preReq.node.prerequisite }}</span>
      </li>
    </ul>

    <div v-else-if="loading" class="cd-section__skeleton">
      <ds-skeleton shape="line" width="75%" />
      <ds-skeleton shape="line" width="60%" />
    </div>
  </section>
</template>

<script>
import { computed } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import { GetAllPreRequisitesByCourse } from 'src/graphql/course_management/query/GetAllPreRequisitesByCourse'

export default {
  name: 'CoursePreRequisites',
  props: ['course_id'],

  setup (props) {
    const { result, loading } = useQuery(
      GetAllPreRequisitesByCourse,
      () => ({ courseID: props.course_id }),
      { errorPolicy: 'all' }
    )
    const data = computed(() => result.value || '')
    return { data, loading }
  },

  computed: {
    prerequisites () {
      return this.$_.get(this.data, '[allPrerequisiteByCourse][edges]', []) || []
    },
    hasContent () { return this.prerequisites.length > 0 }
  }
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
  gap: var(--ds-space-2);

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
</style>
