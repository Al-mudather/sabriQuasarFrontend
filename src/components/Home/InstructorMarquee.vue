<template>
  <section v-if="hasPeople" class="instructor-marquee" aria-label="طاقم التدريب">
    <div class="instructor-marquee__container">
      <span class="instructor-marquee__kicker">طاقم التدريب</span>
    </div>

    <div class="instructor-marquee__viewport">
      <div class="instructor-marquee__fade instructor-marquee__fade--start" aria-hidden="true" />
      <div class="instructor-marquee__fade instructor-marquee__fade--end" aria-hidden="true" />

      <div class="instructor-marquee__track">
        <div
          v-for="(p, i) in doubled"
          :key="`chip-${i}`"
          class="instructor-marquee__chip"
        >
          <span class="instructor-marquee__avatar" aria-hidden="true">
            <img :src="p.image" :alt="p.name" />
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

<script>
import { GetAllCourseInstructors } from 'src/queries/course_management/query/GetAllCourseInstructors'

export default {
  name: 'InstructorMarquee',
  data () {
    return { allCourseInstructors: null }
  },
  apollo: {
    allCourseInstructors: {
      query: GetAllCourseInstructors,
      update: data => data.allCourseInstructors,
      error (err) {
        // eslint-disable-next-line no-console
        console.warn('[InstructorMarquee] query failed', err)
      }
    }
  },
  computed: {
    people () {
      const edges = (this.allCourseInstructors && this.allCourseInstructors.edges) || []
      const mapped = edges
        .map((e) => {
          const inst = e && e.node && e.node.instructor
          if (!inst) return null
          const name = (inst.user && inst.user.fullName) ||
            [inst.user && inst.user.firstName, inst.user && inst.user.lastName].filter(Boolean).join(' ') ||
            ''
          if (!name) return null
          const qual = (inst.qualification || '').trim()
          // Reject English/latin-heavy bios (they bleed unfiltered backend copy
          // into the RTL marquee). Keep only short Arabic roles.
          const arabicOnly = /^[\u0600-\u06FF0-9\s\-\u060C\u061B.]+$/
          const role = qual && qual.length <= 40 && arabicOnly.test(qual)
            ? qual
            : 'مدرب معتمد'
          // Only use instructor image if it's a real absolute/relative path.
          const img = inst.image && typeof inst.image === 'string' &&
            !/unsplash|picsum|placeholder|pexels|lorem/i.test(inst.image)
            ? inst.image
            : null
          // Drop entries without a real image — avoids the ugly initial-avatar fallback.
          if (!img) return null
          return { name, role, image: img }
        })
        .filter(Boolean)
      // Deduplicate by name so the API returning the same instructor per course
      // doesn't spam the marquee.
      const seen = new Set()
      return mapped.filter(p => {
        if (seen.has(p.name)) return false
        seen.add(p.name)
        return true
      })
    },
    hasPeople () {
      return this.people.length > 0
    },
    doubled () {
      return [...this.people, ...this.people]
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'src/design-system/tokens.scss';

.instructor-marquee {
  background: var(--ds-cream);
  padding-block: 6rem;
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
