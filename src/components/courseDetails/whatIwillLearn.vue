<template>
  <section class="cd-section">
    <header class="cd-section__head">
      <h2>{{ $t('ما الذي سأتعلمه ؟') }}</h2>
    </header>

    <ul v-if="points.length" class="cd-learn-list">
      <li v-for="point in points" :key="point.node.id">
        <svg class="cd-learn-list__check" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 12.5l4.2 4.2L19 7" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <span>{{ point.node.points }}</span>
      </li>
    </ul>

    <div v-else-if="loading" class="cd-section__skeleton">
      <ds-skeleton shape="line" width="80%" />
      <ds-skeleton shape="line" width="65%" />
      <ds-skeleton shape="line" width="74%" />
    </div>

    <ds-empty-state
      v-else
      :title="$t('لا توجد أهداف تعلم محددة')"
      size="sm"
    />

    <div v-if="hasNextPage" class="cd-section__more">
      <ds-button variant="secondary" @click="loadMoreData">
        {{ $t('عرض المزيد') }}
      </ds-button>
    </div>
  </section>
</template>

<script>
import { computed } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import { GetAllWhatYouWillLearnByCourseID } from 'src/queries/course_management/query/GetAllWhatYouWillLearnByCourseID'

export default {
  name: 'WhatIwillLearn',
  props: ['course_id'],

  setup (props) {
    const { result, loading, fetchMore } = useQuery(
      GetAllWhatYouWillLearnByCourseID,
      () => ({ courseID: props.course_id, limit: 5 }),
      { errorPolicy: 'all' }
    )
    const allWhatYouWillLearn = computed(() => result.value?.allWhatYouWillLearn || { pageInfo: { hasNextPage: '' } })
    return { allWhatYouWillLearn, loading, fetchMore }
  },

  computed: {
    points () { return this.$_.get(this.allWhatYouWillLearn, 'edges', []) || [] },
    hasNextPage () { return this.$_.get(this.allWhatYouWillLearn, '[pageInfo][hasNextPage]', false) }
  },

  methods: {
    async loadMoreData () {
      await this.fetchMore({
        variables: {
          courseID: this.course_id,
          cursor: this.allWhatYouWillLearn.pageInfo.endCursor
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          const newEdges = fetchMoreResult.allWhatYouWillLearn.edges
          const pageInfo = fetchMoreResult.allWhatYouWillLearn.pageInfo
          if (newEdges.length) {
            return {
              allWhatYouWillLearn: {
                __typename: previousResult.allWhatYouWillLearn.__typename,
                edges: [...previousResult.allWhatYouWillLearn.edges, ...newEdges],
                pageInfo
              }
            }
          }
          return previousResult
        }
      })
    }
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

  &__more {
    margin-block-start: var(--ds-space-4);
    display: flex;
    justify-content: center;
  }
}

.cd-learn-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--ds-space-2);

  @media (min-width: 700px) {
    grid-template-columns: 1fr 1fr;
    gap: var(--ds-space-2) var(--ds-space-5);
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
</style>
