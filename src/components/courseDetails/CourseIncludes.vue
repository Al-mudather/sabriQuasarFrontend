<template>
  <section class="includes">
    <h2 class="includes__title">{{ $t('تتضمن هذه الدورة') }}</h2>
    <ul class="includes__grid">
      <li v-for="f in features" :key="f.key" class="includes__item">
        <span class="includes__icon" aria-hidden="true" v-html="f.icon"></span>
        <span class="includes__label">{{ f.label }}</span>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CourseDetail } from 'src/types/courses/types'

interface Props {
  courseData: CourseDetail | null
  lessonTotal: number
  unitTotal: number
}

const props = defineProps<Props>()

interface Feature {
  key: string
  label: string
  icon: string
}

const ICON = {
  clock: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></svg>`,
  list: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h16M4 12h16M4 18h10"/></svg>`,
  stack: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="6" rx="1.5"/><rect x="4" y="13" width="16" height="6" rx="1.5"/></svg>`,
  globe: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.7 4 6.3 4 9s-1.5 6.3-4 9M12 3c-2.5 2.7-4 6.3-4 9s1.5 6.3 4 9"/></svg>`,
  device: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="14" height="10" rx="1.5"/><rect x="15" y="9" width="6" height="10" rx="1"/><path d="M7 19h6"/></svg>`,
  certificate: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="12" rx="1.5"/><circle cx="12" cy="10" r="2.5"/><path d="M9 20l3-2 3 2"/></svg>`,
  infinity: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7 12c0-2.2 1.8-4 4-4s3 1 4.5 2.5S17.8 13 19 13s2.5-1.3 2.5-3-1.3-3-3-3-2.5.8-4 2.5S11.2 12 9.5 12 7 13.8 7 16s1.3 3 3 3 2.5-.8 4-2.5"/></svg>`,
}

const features = computed<Feature[]>(() => {
  const out: Feature[] = []
  const c = props.courseData
  if (c?.courseHours) {
    const hrs = Number(c.courseHours)
    out.push({
      key: 'hours',
      label: `${c.courseHours} ${hoursLabel(hrs)}`,
      icon: ICON.clock,
    })
  }
  if (props.lessonTotal > 0) {
    out.push({ key: 'lessons', label: `${props.lessonTotal} درس تعليمي`, icon: ICON.list })
  }
  if (props.unitTotal > 0) {
    out.push({ key: 'units', label: `${props.unitTotal} وحدات تدريبية`, icon: ICON.stack })
  }
  if (c?.courseLanguage?.languageName) {
    out.push({ key: 'lang', label: `اللغة: ${c.courseLanguage.languageName}`, icon: ICON.globe })
  }
  out.push({ key: 'device', label: 'وصول من الجوال والحاسوب', icon: ICON.device })
  out.push({ key: 'certificate', label: 'شهادة إتمام معتمدة', icon: ICON.certificate })
  out.push({ key: 'lifetime', label: 'وصول مدى الحياة', icon: ICON.infinity })
  return out
})

function hoursLabel(n: number): string {
  // "ساعة" for 1–10, "ساعة" for 11+ — Arabic plural rules; keep simple for now.
  return n === 1 ? 'ساعة' : 'ساعة'
}
</script>

<style lang="scss" scoped>
.includes {
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-4);

  &__title {
    font-family: var(--ds-font-heading);
    font-size: var(--ds-text-xl);
    font-weight: 700;
    color: var(--ds-text);
    margin: 0;
    letter-spacing: -0.01em;
  }

  &__grid {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--ds-space-3) var(--ds-space-5);

    @media (min-width: 640px) {
      grid-template-columns: 1fr 1fr;
    }
  }

  &__item {
    display: flex;
    align-items: center;
    gap: var(--ds-space-3);
    font-family: var(--ds-font-body);
    font-size: var(--ds-text-sm);
    color: var(--ds-text);
  }

  &__icon {
    flex-shrink: 0;
    inline-size: 2.25rem;
    block-size: 2.25rem;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: var(--ds-brand-50, rgba(50, 40, 115, 0.08));
    color: var(--ds-brand-600);
  }

  &__label { flex: 1; min-inline-size: 0; }
}
</style>
