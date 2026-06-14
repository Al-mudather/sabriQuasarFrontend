<template>
  <section ref="root" class="hero-indigo" aria-label="STC hero">
    <!-- Topographic contour overlay -->
    <svg class="hero-indigo__contour" viewBox="0 0 1600 800" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0,180 C400,120 800,260 1600,160" />
      <path d="M0,380 C500,320 1000,460 1600,360" />
      <path d="M0,580 C400,520 900,660 1600,560" />
      <path d="M0,720 C500,680 1100,760 1600,700" />
    </svg>

    <!-- Logo watermark silhouette (cream-transparent gradient stand-in) -->
    <div class="hero-indigo__watermark" aria-hidden="true"></div>

    <div class="hero-indigo__container">
      <div class="hero-indigo__grid">
        <!-- RIGHT (logical-start, 55%) -->
        <div class="hero-indigo__copy">
          <span class="hero-indigo__kicker">
            <span class="hero-indigo__kicker-dash" aria-hidden="true">—</span>
            {{ $t('مركز د. صبري للتدريب الطبي والتأهيل المهني') }}
          </span>

          <h1 class="hero-indigo__headline">
            <span ref="line1" class="hero-indigo__line">{{ $t('بوابتك إلى') }}</span>
            <span ref="line2" class="hero-indigo__line hero-indigo__line--inline">
              <span class="hero-indigo__word hero-indigo__word--underline">
                {{ $t('التميّز') }}
                <svg class="hero-indigo__brush" viewBox="0 0 120 18" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M2,11 C22,4 48,16 78,8 C98,3 112,10 118,6" />
                </svg>
              </span>
              <span class="hero-indigo__inline-photo" aria-hidden="true">
                <span class="hero-indigo__inline-photo-inner"></span>
              </span>
              <span class="hero-indigo__word">{{ $t('الطبي') }}</span>
            </span>
            <span ref="line3" class="hero-indigo__line">{{ $t('العالمي') }}</span>
          </h1>

          <p class="hero-indigo__deck">
            {{ $t('منصة عالمية رائدة في التدريب الطبي والتأهيل المهني، تجمع برامج التطوير الطبي المستمر، والمعادلات والبوردات الدولية، والبرامج الأكاديمية المعتمدة، لتأهيل الكفاءات الصحية وفق أعلى المعايير العالمية.') }}
          </p>

          <div class="hero-indigo__actions">
            <ds-button variant="accent" size="lg" pill to="/account/signUp">
              {{ $t('ابدأ الآن') }}
            </ds-button>
          </div>

          <ul ref="trust" class="hero-indigo__trust">
            <li v-if="coursesLabel"><bdi>{{ coursesLabel }}</bdi> {{ $t('دورة معتمدة') }}</li>
            <li v-if="coursesLabel" aria-hidden="true" class="hero-indigo__trust-dot">·</li>
            <li>{{ $t('15+ سنة خبرة') }}</li>
          </ul>
        </div>

        <!-- LEFT (logical-end, 45%) — offset portrait -->
        <div class="hero-indigo__portrait-wrap">
          <div ref="portrait" class="hero-indigo__portrait">
            <img :src="portraitSrc" alt="" />
            <div class="hero-indigo__portrait-overlay" aria-hidden="true"></div>
            <div class="hero-indigo__badge">
              <span class="hero-indigo__badge-num">15+</span>
              <span class="hero-indigo__badge-label">{{ $t('سنة خبرة') }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import DsButton from 'src/design-system/components/DsButton.vue'
import { LOGO } from 'src/design-system/brand'
import { slowBreath, cascade, contourDrift } from 'src/design-system/motion'
import { useIntl } from 'src/composables/useIntl'

interface Props {
  coursesCount?: number | null
}

const props = withDefaults(defineProps<Props>(), {
  coursesCount: null,
})

// Template refs
const root = ref<HTMLElement | null>(null)
const portrait = ref<HTMLElement | null>(null)
const line1 = ref<HTMLElement | null>(null)
const line2 = ref<HTMLElement | null>(null)
const line3 = ref<HTMLElement | null>(null)
const trust = ref<HTMLElement | null>(null)

type Motion = { kill?: () => void } | null

let breath: Motion = null
let drift: Motion = null
let cascade_: Motion = null
let trustCascade: Motion = null
let trustTimer: ReturnType<typeof setTimeout> | null = null

const portraitSrc = computed(() => LOGO.full)

const { formatNumber } = useIntl()

// Real number when available, else empty string so the trust line is hidden
// (no "[metric]" placeholder ever shown).
const coursesLabel = computed(() =>
  Number.isFinite(props.coursesCount) && (props.coursesCount ?? 0) > 0
    ? formatNumber(props.coursesCount as number)
    : ''
)

onMounted(() => {
  if (portrait.value) breath = slowBreath(portrait.value) as Motion
  const contour = root.value?.querySelector('.hero-indigo__contour')
  if (contour) drift = contourDrift(contour) as Motion
  const lines = [line1.value, line2.value, line3.value].filter((el): el is HTMLElement => !!el)
  cascade_ = cascade(lines, { stagger: 0.08, y: 18, duration: 0.7 }) as Motion
  trustTimer = setTimeout(() => {
    if (trust.value) {
      const items = trust.value.querySelectorAll('li')
      trustCascade = cascade(items, { stagger: 0.06, y: 10, duration: 0.5 }) as Motion
    }
  }, 200)
})

onBeforeUnmount(() => {
  breath?.kill?.()
  drift?.kill?.()
  cascade_?.kill?.()
  trustCascade?.kill?.()
  if (trustTimer !== null) clearTimeout(trustTimer)
})
</script>

<style lang="scss" scoped>
@import 'src/design-system/tokens.scss';

.hero-indigo {
  position: relative;
  isolation: isolate;
  background: var(--ds-brand-600);
  color: var(--ds-ivory);
  overflow: hidden;
  padding-block: clamp(4rem, 10vw, 7.5rem);
}

.hero-indigo__contour {
  position: absolute;
  inset: 0;
  inline-size: 110%;
  block-size: 100%;
  fill: none;
  stroke: var(--ds-cream);
  stroke-width: 1.2;
  opacity: 0.10;
  pointer-events: none;
  z-index: 0;
}

.hero-indigo__watermark {
  position: absolute;
  inset-block: 0;
  inset-inline-end: -120px;
  inline-size: 500px;
  background:
    radial-gradient(
      circle at 30% 50%,
      rgba(251, 247, 240, 0.12) 0%,
      rgba(251, 247, 240, 0.04) 40%,
      transparent 70%
    );
  pointer-events: none;
  z-index: 0;
}

.hero-indigo__container {
  position: relative;
  z-index: 1;
  max-inline-size: 1200px;
  margin-inline: auto;
  padding-inline: clamp(1rem, 4vw, 2.5rem);
}

.hero-indigo__grid {
  display: grid;
  grid-template-columns: 55fr 45fr;
  gap: clamp(2rem, 5vw, 4rem);
  align-items: center;

  @media (max-width: $ds-bp-md) {
    grid-template-columns: 1fr;
  }
}

/* ---------- Copy column ---------- */

.hero-indigo__kicker {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--ds-font-body);
  font-weight: 500;
  font-size: 14px;
  color: var(--ds-accent-300);
  line-height: 1.6;
  margin-block-end: var(--ds-space-6);
}

.hero-indigo__kicker-dash {
  color: var(--ds-accent-300);
  font-weight: 600;
}

.hero-indigo__headline {
  font-family: var(--ds-font-display);
  font-weight: 700;
  font-size: clamp(2.5rem, 4vw + 1rem, 4.5rem);
  line-height: 1.15;
  letter-spacing: -0.01em;
  color: var(--ds-ivory);
  margin: 0 0 var(--ds-space-6);
}

.hero-indigo__line {
  display: block;
  opacity: 1;
}

.hero-indigo__line--inline {
  display: flex;
  align-items: center;
  gap: 0.45em;
  flex-wrap: wrap;
}

.hero-indigo__word {
  position: relative;
  display: inline-block;
}

.hero-indigo__word--underline {
  /* brush stroke sits under the text */
}

.hero-indigo__brush {
  position: absolute;
  inset-inline-start: -8%;
  inset-block-end: -0.18em;
  inline-size: 140%;
  block-size: 0.32em;
  fill: none;
  stroke: var(--ds-accent-300);
  stroke-width: 3;
  stroke-linecap: round;
  opacity: 0.95;
  pointer-events: none;
}

.hero-indigo__inline-photo {
  display: inline-flex;
  inline-size: 48px;
  block-size: 48px;
  border-radius: 50%;
  overflow: hidden;
  align-self: center;
  box-shadow: 0 0 0 2px var(--ds-ivory), 0 2px 8px rgba(0, 0, 0, 0.25);
  background: var(--ds-brand-500);
}

.hero-indigo__inline-photo-inner {
  inline-size: 100%;
  block-size: 100%;
  background:
    radial-gradient(circle at 35% 35%, var(--ds-accent-200) 0%, var(--ds-accent-400) 60%, var(--ds-brand-700) 100%);
  display: block;
}

.hero-indigo__deck {
  font-family: var(--ds-font-body);
  font-weight: 400;
  font-size: clamp(1rem, 0.9rem + 0.3vw, 1.15rem);
  line-height: 1.85;
  color: rgba(251, 247, 240, 0.82);
  max-inline-size: 48ch;
  margin: 0 0 var(--ds-space-8);
}

.hero-indigo__actions {
  display: flex;
  align-items: center;
  gap: var(--ds-space-6);
  flex-wrap: wrap;
  margin-block-end: var(--ds-space-8);
}

.hero-indigo__trust {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
  font-family: var(--ds-font-body);
  font-size: var(--ds-text-xs);
  font-weight: 500;
  color: rgba(251, 247, 240, 0.7);

  li {
    display: inline-flex;
    align-items: center;
  }
}

.hero-indigo__trust-dot {
  color: rgba(251, 247, 240, 0.45);
  padding-inline: 0.1rem;
}

/* ---------- Portrait column ---------- */

.hero-indigo__portrait-wrap {
  position: relative;
  min-block-size: 100%;

  /* Hide the hero portrait on small screens — the "15+ years" stat still
     shows in the trust line, so no information is lost. */
  @media (max-width: $ds-bp-md) {
    display: none;
  }
}

.hero-indigo__portrait {
  position: relative;
  aspect-ratio: 4 / 5;
  inline-size: 100%;
  border-radius: 14px;
  overflow: hidden;
  background: var(--ds-brand-700);
  box-shadow: 0 18px 48px rgba(13, 10, 39, 0.35);
  transform-origin: center;
  /* Offset bottom — portrait extends 60px past the section's edge */
  margin-block-end: -60px;

  @media (max-width: $ds-bp-md) {
    margin-block-end: 0;
    max-inline-size: 420px;
    margin-inline: auto;
  }

  img {
    inline-size: 100%;
    block-size: 100%;
    object-fit: cover;
    display: block;
    filter: saturate(0.92) contrast(1.05);
  }
}

.hero-indigo__portrait-overlay {
  position: absolute;
  inset-inline: 0;
  inset-block-end: 0;
  block-size: 45%;
  background: linear-gradient(
    to top,
    rgba(27, 20, 16, 0.45) 0%,
    rgba(27, 20, 16, 0.15) 50%,
    transparent 100%
  );
  pointer-events: none;
}

.hero-indigo__badge {
  position: absolute;
  inset-block-start: 16px;
  inset-inline-start: 16px;
  inline-size: 64px;
  block-size: 64px;
  border-radius: 50%;
  background: var(--ds-accent-300);
  color: var(--ds-ivory);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  box-shadow: 0 6px 18px rgba(110, 52, 30, 0.35);
  font-family: var(--ds-font-body);
  font-weight: 500;
  line-height: 1.05;
}

.hero-indigo__badge-num {
  font-family: var(--ds-font-mono);
  font-weight: 600;
  font-size: 16px;
}

.hero-indigo__badge-label {
  font-size: 9px;
  margin-block-start: 2px;
  opacity: 0.95;
}
</style>
