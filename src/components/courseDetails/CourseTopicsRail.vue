<template>
  <section v-if="chips.length" class="topics">
    <h2 class="topics__title">{{ $t('مواضيع ذات صلة') }}</h2>
    <div class="topics__rail">
      <router-link
        v-for="c in chips"
        :key="c.key"
        :to="c.to"
        class="topics__chip"
      >
        {{ c.label }}
      </router-link>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CourseDetail } from 'src/types/courses/types'
import type { RouteLocationRaw } from 'vue-router'

interface Props {
  courseData: CourseDetail | null
}

const props = defineProps<Props>()

interface Chip {
  key: string
  label: string
  to: RouteLocationRaw
}

const chips = computed<Chip[]>(() => {
  const out: Chip[] = []
  const spec = props.courseData?.courseSpeciality
  if (spec?.speciality) {
    out.push({
      key: `spec-${spec.pk ?? spec.id}`,
      label: spec.speciality,
      to: { name: 'courses', query: { speciality: String(spec.pk ?? '') } },
    })
  }
  const lang = props.courseData?.courseLanguage
  if (lang?.languageName) {
    out.push({
      key: `lang-${lang.pk ?? lang.id}`,
      label: lang.languageName,
      to: { name: 'courses' },
    })
  }
  return out
})
</script>

<style lang="scss" scoped>
.topics {
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-3);

  &__title {
    font-family: var(--ds-font-heading);
    font-size: var(--ds-text-xl);
    font-weight: 700;
    color: var(--ds-text);
    margin: 0;
    letter-spacing: -0.01em;
  }

  &__rail {
    display: flex;
    flex-wrap: wrap;
    gap: var(--ds-space-2);
  }

  &__chip {
    display: inline-flex;
    align-items: center;
    padding: var(--ds-space-2) var(--ds-space-4);
    border: 1px solid var(--ds-border);
    border-radius: var(--ds-radius-pill);
    background: var(--ds-surface-elevated);
    color: var(--ds-text);
    font-family: var(--ds-font-body);
    font-size: var(--ds-text-sm);
    text-decoration: none;
    transition:
      background-color var(--ds-duration-fast) var(--ds-ease-out),
      border-color var(--ds-duration-fast) var(--ds-ease-out),
      color var(--ds-duration-fast) var(--ds-ease-out);

    &:hover {
      background: var(--ds-brand-50, rgba(50, 40, 115, 0.06));
      border-color: var(--ds-brand-600);
      color: var(--ds-brand-700);
    }

    &:focus-visible {
      outline: 2px solid var(--ds-brand-600);
      outline-offset: 2px;
    }
  }
}
</style>
