<template>
  <section class="value-props">
    <div class="value-props__container">
      <div class="value-props__intro">
        <span class="value-props__kicker">لماذا STC؟</span>
        <h2 class="value-props__heading">
          تدريب يُحدث <span class="value-props__heading-accent">فرقاً حقيقياً</span>
        </h2>
      </div>

      <div class="value-props__grid">
        <ds-card
          v-for="(v, i) in values"
          :key="v.title"
          :interactive="false"
          elevation="sm"
          class="value-props__card"
          :class="{
            'value-props__card--lead': i === 1,
            'value-props__card--low':  i === 0,
            'value-props__card--high': i === 2
          }"
        >
          <span class="value-props__icon" aria-hidden="true" v-html="v.icon"></span>
          <h3 class="value-props__title">{{ v.title }}</h3>
          <p class="value-props__body">{{ v.body }}</p>
        </ds-card>
      </div>
    </div>
  </section>
</template>

<script>
import DsCard from 'src/design-system/components/DsCard.vue'

const ICONS = {
  medical: `
    <svg viewBox="0 0 48 48" width="48" height="48" fill="none" stroke="currentColor"
         stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M10 14 Q10 8 18 8 Q24 8 24 16 Q24 8 30 8 Q38 8 38 14 Q38 22 24 36 Q10 22 10 14 Z" />
      <path d="M21 20 L24 20 L24 17 L27 17 L27 20 L30 20 L30 23 L27 23 L27 26 L24 26 L24 23 L21 23 Z" />
    </svg>`,
  growth: `
    <svg viewBox="0 0 48 48" width="48" height="48" fill="none" stroke="currentColor"
         stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="24" cy="24" r="16" />
      <path d="M24 13 C17 20 17 28 24 35 C31 28 31 20 24 13 Z" />
      <path d="M8 24 L40 24" />
    </svg>`,
  community: `
    <svg viewBox="0 0 48 48" width="48" height="48" fill="none" stroke="currentColor"
         stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="17" cy="19" r="5" />
      <circle cx="31" cy="19" r="5" />
      <path d="M8 36 Q8 28 17 28 Q21 28 24 31 Q27 28 31 28 Q40 28 40 36" />
    </svg>`
}

export default {
  name: 'ValueProps',
  components: { DsCard },
  data () {
    return {
      values: [
        {
          icon: ICONS.medical,
          title: 'تدريب طبي معتمد',
          body: 'مناهج متخصصة في علوم الدم، التخطيط الكهربائي، وعلم الأمراض — مبنية على أحدث المراجع الإكلينيكية.'
        },
        {
          icon: ICONS.growth,
          title: 'تطوير ذاتي عميق',
          body: 'رحلات تحوّلية تُعيد تشكيل علاقتك بالعمل والحياة، بإشراف مدرب معتمد بخبرة تتجاوز العقدين.'
        },
        {
          icon: ICONS.community,
          title: 'مجتمع من المتعلمين',
          body: 'تنضم لشبكة من الأطباء والمهنيين الذين يشاركونك الرحلة، ويدعمون نموك بعد انتهاء كل دورة.'
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'src/design-system/tokens.scss';

.value-props {
  background: var(--ds-cream);
  padding-block: var(--ds-section-y);
}

.value-props__container {
  max-inline-size: 1200px;
  margin-inline: auto;
  padding-inline: clamp(1rem, 4vw, 2.5rem);
}

.value-props__intro {
  text-align: center;
  margin-block-end: clamp(2rem, 4vw, 3.5rem);
}

.value-props__kicker {
  display: block;
  font-family: var(--ds-font-body);
  font-weight: 500;
  font-size: var(--ds-text-xs);
  color: var(--ds-taupe);
  letter-spacing: 0.04em;
  margin-block-end: var(--ds-space-2);
}

.value-props__heading {
  font-family: var(--ds-font-heading);
  font-weight: 600;
  font-size: clamp(1.75rem, 1.4rem + 1.2vw, 2.25rem);
  color: var(--ds-ink);
  line-height: 1.25;
  margin: 0;
}

.value-props__heading-accent {
  color: var(--ds-accent-300);
}

.value-props__grid {
  display: grid;
  grid-template-columns: 1fr 1.15fr 1fr;
  gap: clamp(1.25rem, 2vw, 2rem);
  align-items: stretch;

  @media (max-width: $ds-bp-md) {
    grid-template-columns: 1fr;
  }
}

.value-props__card {
  padding: clamp(1.5rem, 2.5vw, 2rem);
  background: var(--ds-ivory);
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-4);
}

/* Zigzag vertical offset — lead card drops, side cards lift */
.value-props__card--low  { transform: translateY(24px); }
.value-props__card--high { transform: translateY(-24px); }
.value-props__card--lead {
  background: var(--ds-ivory);
  box-shadow: 0 4px 12px rgba(27, 20, 16, 0.06), 0 16px 40px rgba(27, 20, 16, 0.06);
}

@media (max-width: $ds-bp-md) {
  .value-props__card--low,
  .value-props__card--high { transform: none; }
}

.value-props__icon {
  display: inline-flex;
  color: var(--ds-brand-600);
}

.value-props__title {
  font-family: var(--ds-font-heading);
  font-weight: 600;
  font-size: 20px;
  color: var(--ds-ink);
  line-height: 1.3;
  margin: 0;
}

.value-props__body {
  font-family: var(--ds-font-body);
  font-weight: 400;
  font-size: var(--ds-text-md);
  color: var(--ds-taupe);
  line-height: 1.85;
  margin: 0;
  max-inline-size: 34ch;
}
</style>
