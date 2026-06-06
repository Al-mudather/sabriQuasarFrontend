<template>
  <section v-if="hasPeople" class="instructor-marquee" :aria-label="$t('طاقم التدريب')">
    <div class="instructor-marquee__container">
      <span class="instructor-marquee__kicker">{{ $t('طاقم التدريب') }}</span>
    </div>

    <div class="instructor-marquee__viewport">
      <div class="instructor-marquee__fade instructor-marquee__fade--start" aria-hidden="true"></div>
      <div class="instructor-marquee__fade instructor-marquee__fade--end" aria-hidden="true"></div>

      <div class="instructor-marquee__track">
        <div
          v-for="(p, i) in doubled"
          :key="`chip-${i}`"
          class="instructor-marquee__chip"
        >
          <span class="instructor-marquee__avatar" aria-hidden="true">
            <img
              :src="p.image || stcLogo"
              :alt="p.name"
              :class="{ 'instructor-marquee__logo-img': !p.image }"
              @error="onImageError"
            />
          </span>
          <span class="instructor-marquee__meta">
            <span class="instructor-marquee__name">{{ p.name }}</span>
            <span class="instructor-marquee__role">{{ p.role }}</span>
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import { GetAllCourseInstructors } from 'src/graphql/course_management/query/GetAllCourseInstructors'
import { LOGO } from 'src/design-system/brand'
import type {
  GetAllCourseInstructorsResult,
  GetAllCourseInstructorsVars,
} from 'src/types/courses/types'

// Fallback avatar when an instructor has no image, a stock-photo placeholder,
// or a URL that fails to load — show the STC logo instead.
const stcLogo = LOGO.mark

function onImageError (e: Event): void {
  const el = e.target as HTMLImageElement
  if (el.dataset.fallback === 'true') return
  el.dataset.fallback = 'true'
  el.src = stcLogo
  el.classList.add('instructor-marquee__logo-img')
}

// ---------------------------------------------------------------------------
// Query
// ---------------------------------------------------------------------------
const { result } = useQuery<GetAllCourseInstructorsResult, GetAllCourseInstructorsVars>(
  GetAllCourseInstructors,
  {},
  { errorPolicy: 'all' },
)

const allCourseInstructors = computed(
  () => result.value?.allCourseInstructors ?? null,
)

// ---------------------------------------------------------------------------
// people: typed chip list, free of undefined
// ---------------------------------------------------------------------------
interface InstructorChip {
  image: string | null
  name: string
  role: string
}

const arabicOnly = /^[؀-ۿ0-9\s\-،؛.]+$/

const people = computed<InstructorChip[]>(() => {
  const edges = allCourseInstructors.value?.edges ?? []

  const mapped: InstructorChip[] = []
  for (const edge of edges) {
    const inst = edge?.node?.instructor
    if (!inst) continue

    // Resolve display name
    const name =
      inst.user?.fullName ||
      [inst.user?.firstName, inst.user?.lastName].filter(Boolean).join(' ') ||
      ''
    if (!name) continue

    // Qualification: keep only short Arabic-only strings
    const qual = (inst.qualification ?? '').trim()
    const role =
      qual && qual.length <= 40 && arabicOnly.test(qual)
        ? qual
        : 'مدرب معتمد'

    // Only use real image paths — reject stock-photo placeholders. When there
    // is no usable image we keep the instructor and fall back to the STC logo
    // (rendered in the template), rather than dropping them.
    const img = inst.image &&
      typeof inst.image === 'string' &&
      !/unsplash|picsum|placeholder|pexels|lorem/i.test(inst.image)
      ? inst.image
      : null

    mapped.push({ name, role, image: img })
  }

  // Deduplicate by name (same instructor may appear per-course)
  const seen = new Set<string>()
  return mapped.filter(p => {
    if (seen.has(p.name)) return false
    seen.add(p.name)
    return true
  })
})

const hasPeople = computed<boolean>(() => people.value.length > 0)

const doubled = computed<InstructorChip[]>(() => [
  ...people.value,
  ...people.value,
])
</script>

<style lang="scss" scoped>
@import 'src/design-system/tokens.scss';

.instructor-marquee {
  background: var(--ds-cream);
  padding-block: var(--ds-section-y-tight);
  border-block-start: 1px solid var(--ds-border);
  border-block-end: 1px solid var(--ds-border);
  position: relative;
  overflow: hidden;
}

.instructor-marquee__container {
  max-inline-size: 1200px;
  margin-inline: auto;
  padding-inline: clamp(1rem, 4vw, 2.5rem);
  text-align: center;
  margin-block-end: var(--ds-space-8);
}

.instructor-marquee__kicker {
  font-family: var(--ds-font-body);
  font-weight: 500;
  font-size: var(--ds-text-sm);
  color: var(--ds-taupe);
  letter-spacing: 0.04em;
}

.instructor-marquee__viewport {
  position: relative;
  overflow: hidden;
}

.instructor-marquee__fade {
  position: absolute;
  inset-block: 0;
  inline-size: 80px;
  z-index: 2;
  pointer-events: none;
}

.instructor-marquee__fade--start {
  inset-inline-start: 0;
  background: linear-gradient(to right, var(--ds-cream), rgba(246, 241, 234, 0));
}

.instructor-marquee__fade--end {
  inset-inline-end: 0;
  background: linear-gradient(to left, var(--ds-cream), rgba(246, 241, 234, 0));
}

.instructor-marquee__track {
  display: inline-flex;
  gap: 48px;
  align-items: center;
  padding-inline: 24px;
  animation: instructor-scroll 30s linear infinite;
  will-change: transform;

  &:hover { animation-play-state: paused; }
}

.instructor-marquee__chip {
  display: inline-flex;
  align-items: center;
  gap: var(--ds-space-3);
  flex: 0 0 auto;
}

.instructor-marquee__avatar {
  inline-size: 56px;
  block-size: 56px;
  border-radius: 50%;
  overflow: hidden;
  background: var(--ds-surface-sunken);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 56px;
  border: 1px solid var(--ds-border);

  img {
    inline-size: 100%;
    block-size: 100%;
    object-fit: cover;
  }

  /* STC logo fallback — contain (not crop) on a light field so the lockup
     reads clearly inside the circular avatar. */
  img.instructor-marquee__logo-img {
    object-fit: contain;
    padding: 8px;
    background: var(--ds-ivory);
  }
}

.instructor-marquee__avatar-fallback {
  font-family: var(--ds-font-heading);
  font-weight: 600;
  color: var(--ds-brand-600);
  font-size: 20px;
}

.instructor-marquee__meta {
  display: flex;
  flex-direction: column;
  line-height: 1.4;
}

.instructor-marquee__name {
  font-family: var(--ds-font-body);
  font-weight: 500;
  font-size: 14px;
  color: var(--ds-ink);
}

.instructor-marquee__role {
  font-family: var(--ds-font-body);
  font-weight: 400;
  font-size: 12px;
  color: var(--ds-taupe);
}

@keyframes instructor-scroll {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}

@media (prefers-reduced-motion: reduce) {
  .instructor-marquee__track { animation: none; }
}
</style>
