<template>
  <section class="category-section" :aria-label="speciality.speciality">
    <div class="category-section__container">
      <header class="category-section__header">
        <div class="category-section__title-block">
          <span class="category-section__icon" aria-hidden="true" v-html="iconSvg"></span>
          <h2 class="category-section__title">{{ speciality.speciality }}</h2>
          <span class="category-section__count">{{ countLabel }}</span>
        </div>
        <router-link
          class="category-section__all"
          :to="`/courses?speciality=${speciality.pk}`"
        >
          {{ $t('عرض كل دورات {speciality}', { speciality: speciality.speciality }) }}
          <span aria-hidden="true" class="category-section__arrow">←</span>
        </router-link>
      </header>

      <!-- Topographic seam -->
      <svg
        class="category-section__seam"
        viewBox="0 0 1200 60"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d="M0,20 C300,10 600,34 1200,16" />
        <path d="M0,36 C400,28 900,48 1200,32" />
        <path d="M0,52 C350,44 800,58 1200,46" />
      </svg>

      <!-- Loading -->
      <div v-if="isLoading" class="category-section__rail">
        <div v-for="n in 3" :key="`sk-${n}`" class="category-section__slot">
          <ds-skeleton type="card" />
        </div>
      </div>

      <!-- Empty -->
      <ds-empty-state
        v-else-if="!courses.length"
        variant="search"
        size="sm"
        :title="$t('لا توجد دورات حالياً')"
        :body="$t('سنضيف دورات جديدة في هذا التخصص قريباً')"
      />

      <!-- Rail -->
      <div v-else ref="rail" class="category-section__rail">
        <div
          v-for="(c, i) in courses"
          :key="c.id"
          class="category-section__slot"
          :data-idx="i"
        >
          <course-card :course="normalize(c)" variant="public" />
        </div>

        <!-- See-all tile -->
        <router-link
          class="category-section__see-all"
          :to="`/courses?speciality=${speciality.pk}`"
          :aria-label="`عرض كل دورات ${speciality.speciality}`"
        >
          <span class="category-section__see-all-arrow" aria-hidden="true">
            <svg viewBox="0 0 48 48" width="40" height="40" fill="none"
                 stroke="currentColor" stroke-width="1.8" stroke-linecap="round"
                 stroke-linejoin="round">
              <circle cx="24" cy="24" r="20" />
              <path d="M28 16 L20 24 L28 32" />
            </svg>
          </span>
          <span class="category-section__see-all-label">{{ $t('عرض الكل') }}</span>
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, watch, onMounted, onBeforeUnmount, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useQuery } from '@vue/apollo-composable'
import { GetAllCoursesInSpeciality } from 'src/graphql/course_management/query/GetAllCoursesInSpeciality'
import CourseCard from 'src/components/shared/CourseCard.vue'
import DsSkeleton from 'src/design-system/components/DsSkeleton.vue'
import DsEmptyState from 'src/design-system/components/DsEmptyState.vue'
import { useSettingsStore } from 'src/stores/settings'
import { useIntl } from 'src/composables/useIntl'
import { useI18n } from 'vue-i18n'
import { FORMAT_THE_IAMGE_URL } from 'src/utils/functions.js'
import { cascade } from 'src/design-system/motion.js'
import type {
  AllCoursesInSpecialityResult,
  AllCoursesInSpecialityVars,
  CourseInSpeciality,
  CoursePricing,
  CurrencyCode,
} from 'src/types/courses/types'
import type { Speciality } from 'src/types/courses/types'

// ---------------------------------------------------------------------------
// Arabic keyword -> simple stroke icon
// ---------------------------------------------------------------------------
const ICON_MAP: Record<string, string> = {
  heart: `<svg viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M16 27 C8 21 4 16 4 11 Q4 6 9 6 Q13 6 16 10 Q19 6 23 6 Q28 6 28 11 C28 16 24 21 16 27 Z"/></svg>`,
  pulse: `<svg viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 16 H9 L12 9 L17 23 L20 16 H29"/></svg>`,
  brain: `<svg viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M16 6 Q10 6 10 12 Q6 13 6 17 Q6 22 11 23 Q12 27 16 27 M16 6 Q22 6 22 12 Q26 13 26 17 Q26 22 21 23 Q20 27 16 27 M16 6 V27"/></svg>`,
  book:  `<svg viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 7 Q16 5 26 7 V25 Q16 23 6 25 Z"/><path d="M16 6 V24"/></svg>`,
  atom:  `<svg viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="16" cy="16" r="3"/><ellipse cx="16" cy="16" rx="12" ry="5"/><ellipse cx="16" cy="16" rx="12" ry="5" transform="rotate(60 16 16)"/><ellipse cx="16" cy="16" rx="12" ry="5" transform="rotate(120 16 16)"/></svg>`,
  microscope: `<svg viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5 L18 9 L14 15 L8 11 Z"/><path d="M13 14 L11 17 Q9 20 12 22 L14 20"/><path d="M7 26 H21"/><path d="M11 26 Q11 22 16 22 Q21 22 21 26"/></svg>`,
}

function pickIcon (name = ''): string {
  const s = String(name).toLowerCase()
  if (/hema|blood|دم/.test(s)) return ICON_MAP.heart
  if (/ecg|cardio|قلب|كهرب/.test(s)) return ICON_MAP.pulse
  if (/physio|فسيولوج|فسلج|neuro|عصب/.test(s)) return ICON_MAP.brain
  if (/terminolog|مصطلح|lang|لغة/.test(s)) return ICON_MAP.book
  if (/chem|كيم|atom|ذرة/.test(s)) return ICON_MAP.atom
  if (/micro|path|id |infectious|معد|علم الأ/.test(s)) return ICON_MAP.microscope
  return ICON_MAP.book
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
interface Props {
  speciality: Speciality
}
const props = defineProps<Props>()

// ---------------------------------------------------------------------------
// Stores
// ---------------------------------------------------------------------------
const settings = useSettingsStore()
const { currency, isEnglish } = storeToRefs(settings)

// ---------------------------------------------------------------------------
// Query
// ---------------------------------------------------------------------------
const { result, loading } = useQuery<AllCoursesInSpecialityResult, AllCoursesInSpecialityVars>(
  GetAllCoursesInSpeciality,
  () => ({ specialityId: props.speciality.pk as number, first: 8, isDraft: false }),
  { fetchPolicy: 'cache-and-network', errorPolicy: 'all' },
)

const coursesInSpeciality = computed(
  () => result.value?.allCoursesInSpeciality ?? null,
)

const isLoading = computed(() => loading.value && !coursesInSpeciality.value)

// ---------------------------------------------------------------------------
// Derived course list
// ---------------------------------------------------------------------------
const courses = computed<CourseInSpeciality[]>(() => {
  const edges = coursesInSpeciality.value?.edges ?? []
  return edges.map(e => e?.node).filter((n): n is CourseInSpeciality => !!n)
})

const { formatNumber } = useIntl()
const { t } = useI18n()

const countLabel = computed<string>(() => {
  const total = coursesInSpeciality.value?.totalCount ?? courses.value.length
  return `${formatNumber(total)} ${t('دورة')}`
})

const iconSvg = computed<string>(() => pickIcon(props.speciality.speciality))

// ---------------------------------------------------------------------------
// normalize: CourseInSpeciality -> shape expected by CourseCard
// currency is already parsed into a CoursePricing object by Apollo typePolicy
// ---------------------------------------------------------------------------
interface NormalizedCourse {
  id: string
  pk: number | null
  slug: number | null
  name: string
  coverImage?: string
  price: { current: number; currency: string; original?: number }
  category: string
  studentCount: number
}

function normalize (node: CourseInSpeciality): NormalizedCourse {
  const selectedCur: CurrencyCode = (currency.value as CurrencyCode) || 'SAR'
  // currency is already parsed by the Apollo typePolicy — treat directly as CoursePricing
  const prices = (node.currency ?? {}) as CoursePricing
  const current = node.isPaid === false ? 0 : (Number(prices[selectedCur]) || 0)
  return {
    id: node.id,
    pk: node.pk,
    slug: node.pk,
    name: node.title,
    coverImage: resolveImage(node) ?? undefined,
    price: {
      current,
      currency: selectedCur,
    },
    category: props.speciality.speciality,
    studentCount: node.enrolled ? 1 : 0,
  }
}

function resolveImage (node: CourseInSpeciality): string | null {
  const raw = node.cover ?? node.profile
  if (!raw) return null
  if (/^https?:\/\//.test(raw)) return raw
  try {
    return FORMAT_THE_IAMGE_URL(String(raw).replace(/^\/+/, '')) as string
  } catch {
    return null
  }
}

// ---------------------------------------------------------------------------
// Cascade animation
// ---------------------------------------------------------------------------
const rail = ref<HTMLElement | null>(null)
let _io: IntersectionObserver | null = null
let _isVisible = false
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _cascade: any = null

function scheduleCascade (): void {
  if (!_isVisible || _cascade) return
  void Promise.resolve().then(() => {
    const el = rail.value
    if (!el) return
    const slots = el.querySelectorAll('.category-section__slot')
    if (slots.length) {
      _cascade = cascade(slots, { stagger: 0.08, y: 18, duration: 0.6 })
    }
  })
}

watch(courses, (next) => {
  if (next && next.length) scheduleCascade()
})

onMounted(() => {
  // Avoid accessing $el directly in script setup — observe the section via a
  // template ref on the root element instead. We use the injected component
  // root, available as the first child of the document when mounted.
  // Since we can't use $el in script setup without a ref, we rely on the
  // IntersectionObserver on `rail`. Instead observe the parent section.
  // Use a small workaround: observe `rail`'s closest ancestor after mount.
  _io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        _isVisible = true
        scheduleCascade()
        if (_io) { _io.disconnect(); _io = null }
      }
    })
  }, { threshold: 0.2 })
  // rail may not be rendered yet (isLoading=true), so observe the section root
  // via the host element. We get it from the template's outermost element via
  // a second ref, but since we only have `rail`, fall back to observing document.body
  // and rely on the watcher to trigger cascade when courses arrive.
  _isVisible = false
  // Once courses load the watcher fires scheduleCascade; if already visible by
  // then the animation plays. Also set up IO on the rail when it becomes available.
  const checkRail = (): void => {
    if (rail.value) {
      _io?.observe(rail.value)
    } else {
      // courses not loaded yet — IO will be set up after watcher fires
      // Just mark visible after a tick so cascade runs on data arrival
      _isVisible = true
    }
  }
  void Promise.resolve().then(checkRail)
})

onBeforeUnmount(() => {
  if (_io) { _io.disconnect(); _io = null }
  if (_cascade && typeof _cascade.kill === 'function') _cascade.kill()
})

// expose isEnglish so template can access if needed (currently unused in template
// but kept for parity with the original)
void isEnglish
</script>

<style lang="scss" scoped>
@import 'src/design-system/tokens.scss';

.category-section {
  background: var(--ds-cream);
  padding-block: var(--ds-section-y-tight);
}

.category-section__container {
  max-inline-size: 1200px;
  margin-inline: auto;
  padding-inline: clamp(1rem, 4vw, 2.5rem);
}

.category-section__header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--ds-space-4);
  flex-wrap: wrap;
  margin-block-end: var(--ds-space-4);
}

.category-section__title-block {
  display: inline-flex;
  align-items: center;
  gap: var(--ds-space-3);
  flex-wrap: wrap;
}

.category-section__icon {
  color: var(--ds-brand-600);
  display: inline-flex;
}

.category-section__title {
  font-family: var(--ds-font-display);
  font-weight: 700;
  font-size: clamp(1.5rem, 1.2rem + 1vw, 2rem);
  color: var(--ds-ink);
  margin: 0;
  line-height: 1.2;
}

.category-section__count {
  font-family: var(--ds-font-body);
  font-weight: 400;
  font-size: var(--ds-text-sm);
  color: var(--ds-taupe);
}

.category-section__all {
  font-family: var(--ds-font-body);
  font-weight: 500;
  font-size: var(--ds-text-sm);
  color: var(--ds-brand-600);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  transition: color var(--ds-duration-fast) var(--ds-ease-out);

  &:hover { color: var(--ds-brand-700); }
}

.category-section__arrow { display: inline-block; }

.category-section__seam {
  display: block;
  inline-size: 100%;
  block-size: 40px;
  fill: none;
  stroke: var(--ds-brand-600);
  stroke-width: 1;
  opacity: 0.08;
  margin-block-end: var(--ds-space-6);
}

/* Full-bleed swipeable rail — escapes the 1200px container so cards
   can be swiped edge-to-edge with peek on both sides. */
.category-section__rail {
  display: flex;
  gap: 1.25rem;
  overflow-x: auto;
  overflow-y: hidden;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior-inline: contain;
  padding-block: var(--ds-space-2) var(--ds-space-4);
  margin-block-start: var(--ds-space-2);

  &::-webkit-scrollbar { block-size: 6px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb {
    background: var(--ds-neutral-200);
    border-radius: 4px;
  }
}

/* Leading + trailing spacers align first/last card with the 1200px gutter */
.category-section__rail-pad {
  flex: 0 0 max(1rem, calc((100vw - 1200px) / 2 + 1rem));
}

.category-section__slot {
  flex: 0 0 280px;
  inline-size: 280px;
  scroll-snap-align: start;
  display: flex;
}

@media (min-width: 768px) {
  .category-section__slot {
    flex: 0 0 300px;
    inline-size: 300px;
  }
}

.category-section__see-all {
  flex: 0 0 180px;
  inline-size: 180px;
  scroll-snap-align: start;
  background: var(--ds-ivory);
  border-radius: 14px;
  border: 1px dashed var(--ds-neutral-300);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--ds-space-3);
  color: var(--ds-brand-600);
  text-decoration: none;
  padding: var(--ds-space-6);
  transition:
    background-color var(--ds-duration-base) var(--ds-ease-out),
    transform var(--ds-duration-base) var(--ds-ease-out);

  &:hover {
    background: var(--ds-surface-sunken);
    transform: translateY(-2px);
  }
}

.category-section__see-all-arrow { color: var(--ds-brand-600); }

.category-section__see-all-label {
  font-family: var(--ds-font-body);
  font-weight: 500;
  font-size: var(--ds-text-md);
  color: var(--ds-brand-600);
}

// Arrow direction: RTL already flips visually, keep glyph as-is.
</style>
