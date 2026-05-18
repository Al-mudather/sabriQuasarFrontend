<template>
  <section ref="root" class="final-cta" :aria-label="$t('ابدأ رحلتك')">
    <svg
      class="final-cta__contour"
      viewBox="0 0 1600 600"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path d="M0,140 C400,90 900,200 1600,130" />
      <path d="M0,300 C500,250 1100,360 1600,290" />
      <path d="M0,460 C400,410 900,520 1600,450" />
    </svg>

    <div class="final-cta__container">
      <h2 class="final-cta__heading">{{ $t('جاهز لتبدأ؟') }}</h2>
      <p class="final-cta__deck">
        {{ $t('انضمّ إلى آلاف المتعلمين الذين اختاروا الاستثمار في أنفسهم. رحلتك نحو نسخة أقوى تبدأ بخطوة واحدة.') }}
      </p>
      <div class="final-cta__actions">
        <ds-button variant="accent" size="lg" pill to="/courses">
          {{ $t('ابدأ الدورة المجانية') }}
        </ds-button>
      </div>
      <p class="final-cta__fineprint">
        {{ $t('لا تحتاج بطاقة ائتمان · إلغاء في أي وقت') }}
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import DsButton from 'src/design-system/components/DsButton.vue'
import { contourDrift } from 'src/design-system/motion'

const root = ref<HTMLElement | null>(null)
let drift: { kill?: () => void } | null = null

onMounted(() => {
  const contour = root.value?.querySelector('.final-cta__contour')
  if (contour) drift = contourDrift(contour) as { kill?: () => void } | null
})

onBeforeUnmount(() => {
  drift?.kill?.()
})
</script>

<style lang="scss" scoped>
@import 'src/design-system/tokens.scss';

.final-cta {
  position: relative;
  isolation: isolate;
  background: var(--ds-brand-600);
  color: var(--ds-ivory);
  padding-block: clamp(4rem, 8vw, 6rem);
  overflow: hidden;
  text-align: center;
}

.final-cta__contour {
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

.final-cta__container {
  position: relative;
  z-index: 1;
  max-inline-size: 720px;
  margin-inline: auto;
  padding-inline: clamp(1rem, 4vw, 2.5rem);
}

.final-cta__heading {
  font-family: var(--ds-font-display);
  font-weight: 700;
  font-size: clamp(2rem, 2vw + 1.5rem, 3rem);
  line-height: 1.2;
  color: var(--ds-ivory);
  margin: 0 0 var(--ds-space-5);
}

.final-cta__deck {
  font-family: var(--ds-font-body);
  font-weight: 400;
  font-size: clamp(1rem, 0.9rem + 0.3vw, 1.125rem);
  line-height: 1.85;
  color: rgba(251, 247, 240, 0.82);
  margin: 0 auto var(--ds-space-8);
  max-inline-size: 52ch;
}

.final-cta__actions {
  display: flex;
  justify-content: center;
  margin-block-end: var(--ds-space-4);
}

.final-cta__fineprint {
  font-family: var(--ds-font-body);
  font-weight: 400;
  font-size: var(--ds-text-xs);
  color: rgba(251, 247, 240, 0.6);
  margin: 0;
}
</style>
