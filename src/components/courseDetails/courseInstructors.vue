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

      <article v-for="instructor in instructors" :key="instructor.node.id" class="cd-instructor">
        <img
          v-if="$_.get(instructor, '[node][instructor][image]')"
          :src="GET_IMAGE_URL($_.get(instructor, '[node][instructor][image]'))"
          :alt="displayName(instructor)"
          class="cd-instructor__avatar"
        />
        <img v-else src="~assets/img/user-13.jpg" :alt="displayName(instructor)" class="cd-instructor__avatar" />
        <div class="cd-instructor__text">
          <h3 class="cd-instructor__name">{{ displayName(instructor) }}</h3>
          <p class="cd-instructor__qualification">
            {{ $_.get(instructor, '[node][instructor][qualification]') }}
          </p>
        </div>
      </article>
    </div>
  </section>
</template>

<script>
import { GetAllCourseInstructors } from 'src/queries/course_management/query/GetAllCourseInstructors'

export default {
  name: 'CourseInstructors',
  props: ['course_id'],

  data () {
    return { allCourseInstructors: { edges: [] } }
  },

  computed: {
    instructors () { return this.$_.get(this.allCourseInstructors, 'edges', []) },
    loading () { return this.$apollo.queries.allCourseInstructors.loading }
  },

  apollo: {
    allCourseInstructors: {
      query () { return GetAllCourseInstructors },
      variables () { return { courseID: this.course_id } }
    }
  },

  methods: {
    displayName (instructor) {
      const full = this.$_.get(instructor, '[node][instructor][user][fullName]')
      if (full) return full
      const username = this.$_.get(instructor, '[node][instructor][user][username]', '')
      return username.split('@')[0]
    },

    GET_IMAGE_URL (img) {
      if (process.env.NODE_ENV === 'development') return 'http://localhost:8000/media/' + img
      return location.origin + '/media/' + img
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
}

.cd-instructors {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--ds-space-4);

  @media (min-width: 700px) {
    grid-template-columns: 1fr 1fr;
  }
}

.cd-instructor {
  display: flex;
  gap: var(--ds-space-3);
  align-items: center;
  background: var(--ds-surface-muted);
  border-radius: var(--ds-radius-md);
  padding: var(--ds-space-3);

  &--loading { background: transparent; }

  &__avatar {
    inline-size: 4rem;
    block-size: 4rem;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
    border: 2px solid var(--ds-surface);
    box-shadow: var(--ds-shadow-xs);
  }

  &__text {
    flex: 1;
    min-inline-size: 0;
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-1);
  }

  &__name {
    font-family: var(--ds-font-heading);
    font-size: var(--ds-text-md);
    font-weight: var(--ds-weight-bold);
    color: var(--ds-text);
    margin: 0;
  }

  &__qualification {
    font-size: var(--ds-text-sm);
    color: var(--ds-text-muted);
    margin: 0;
    line-height: var(--ds-leading-normal);
  }
}
</style>
