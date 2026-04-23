<template>
  <section class="course-units">
    <header class="course-units__head">
      <h2>{{ $t('المحتويـات') }}</h2>
      <ds-badge v-if="totalUnits > 0" variant="brand">
        {{ totalUnits }} {{ $t('وحدات') }}
      </ds-badge>
    </header>

    <div v-if="units.length === 0 && !loading" class="course-units__empty">
      <ds-empty-state
        :title="$t('لا توجد محتويات حتى الآن')"
        size="sm"
      />
    </div>

    <div v-else-if="loading" class="course-units__skeleton">
      <ds-skeleton v-for="n in 3" :key="'u-' + n" shape="rect" height="3.5rem" />
    </div>

    <ul v-else class="course-units__list">
      <li v-for="(unit, idx) in units" :key="$_.get(unit, '[node][pk]')" class="unit">
        <details :open="idx === 0">
          <summary class="unit__head">
            <span class="unit__index">{{ idx + 1 }}</span>
            <span class="unit__title">{{ $_.get(unit, '[node][title]') }}</span>
            <svg
              class="unit__chevron"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </summary>

          <div class="unit__body">
            <template v-if="$_.get(unit, '[node][isExternal]')">
              <div
                v-for="content in $_.get(unit, '[node][external][courseunitcontentSet][edges]')"
                :key="$_.get(content, '[node][pk]')"
              >
                <content-item
                  v-if="isRenderableContent(content)"
                  :content="content.node"
                />
              </div>
            </template>
            <template v-else>
              <div
                v-for="content in $_.get(unit, '[node][courseunitcontentSet][edges]')"
                :key="$_.get(content, '[node][pk]')"
              >
                <content-item
                  v-if="isRenderableContent(content)"
                  :content="content.node"
                />
              </div>
            </template>
          </div>
        </details>
      </li>
    </ul>
  </section>
</template>

<script>
import contentItem from 'components/courseDetails/contentItem.vue'
import { GetAllCourseUnitsByCourseID } from 'src/queries/course_management/query/GetAllCourseUnitsByCourseID'

const RENDERABLE = ['ContentVideo', 'ContentFile', 'ContentQuiz']

export default {
  name: 'courseUnits',
  components: { contentItem },
  props: ['course_id'],

  data () {
    return {
      allCourseUnits: { pageInfo: { hasNextPage: '' } },
      allUnitsData: []
    }
  },

  computed: {
    units () { return this.$_.get(this.allUnitsData, 'edges', []) || [] },
    totalUnits () { return this.$_.get(this.allUnitsData, 'totalCount', this.units.length) },
    loading () { return this.$apollo.queries.allCourseUnits.loading && this.units.length === 0 }
  },

  apollo: {
    allCourseUnits: {
      query () { return GetAllCourseUnitsByCourseID },
      variables () { return { courseID: this.course_id, limit: 5 } },
      update (data) { this.allUnitsData = this.$_.get(data, '[allCourseUnits]') }
    }
  },

  methods: {
    isRenderableContent (content) {
      return RENDERABLE.includes(this.$_.get(content, '[node][modelName]'))
    }
  }
}
</script>

<style lang="scss" scoped>
.course-units {
  background: var(--ds-surface);
  border: 1px solid var(--ds-border);
  border-radius: var(--ds-radius-lg);
  padding: var(--ds-space-5);
  box-shadow: var(--ds-shadow-xs);

  &__head {
    display: flex;
    align-items: center;
    gap: var(--ds-space-3);
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

  &__list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-2);
  }
}

.unit {
  details {
    background: var(--ds-surface-muted);
    border: 1px solid var(--ds-border);
    border-radius: var(--ds-radius-md);
    overflow: hidden;
    transition: background-color var(--ds-duration-fast) var(--ds-ease-out);

    &[open] { background: var(--ds-surface); }
    &[open] .unit__chevron { transform: rotate(180deg); }
  }

  summary {
    list-style: none;
    cursor: pointer;
    padding: var(--ds-space-3) var(--ds-space-4);
    display: flex;
    align-items: center;
    gap: var(--ds-space-3);
    user-select: none;

    &::-webkit-details-marker { display: none; }

    &:hover { background: var(--ds-surface-muted); }
    &:focus-visible {
      outline: 2px solid transparent;
      box-shadow: var(--ds-shadow-focus);
    }
  }

  &__index {
    flex-shrink: 0;
    inline-size: 1.75rem;
    block-size: 1.75rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: var(--ds-brand-600);
    color: var(--ds-text-onBrand);
    border-radius: 50%;
    font-family: var(--ds-font-heading);
    font-size: var(--ds-text-sm);
    font-weight: var(--ds-weight-bold);
    font-variant-numeric: tabular-nums;
  }

  &__title {
    flex: 1;
    font-family: var(--ds-font-heading);
    font-size: var(--ds-text-md);
    font-weight: var(--ds-weight-medium);
    color: var(--ds-text);
    min-inline-size: 0;
  }

  &__chevron {
    inline-size: 1rem;
    block-size: 1rem;
    color: var(--ds-text-muted);
    flex-shrink: 0;
    transition: transform var(--ds-duration-fast) var(--ds-ease-out);
  }

  &__body {
    padding: 0 var(--ds-space-4) var(--ds-space-3);
    border-block-start: 1px solid var(--ds-border);
  }
}
</style>
