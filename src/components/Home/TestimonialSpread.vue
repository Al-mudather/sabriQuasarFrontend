<template>
  <section class="testimonial-spread" aria-label="قصص المتعلمين">
    <div class="testimonial-spread__container">
      <span class="testimonial-spread__glyph" aria-hidden="true">”</span>

      <div class="testimonial-spread__body">
        <p class="testimonial-spread__quote">
          <span class="testimonial-spread__drop">ك</span><!--
       -->ان التدريب في مركز د. صبري نقطة تحوّل حقيقية في مسيرتي المهنية. المنهج عميق،
          والمدرب حاضر بكل كفاءته وإنسانيته، وأخرجت من الدورة بمهارات سريرية صلبة
          وإحساس جديد بقدراتي على تقديم رعاية أفضل لمرضاي.
        </p>

        <div class="testimonial-spread__attribution">
          <span class="testimonial-spread__avatar" aria-hidden="true">
            <span class="testimonial-spread__avatar-inner"></span>
          </span>
          <span class="testimonial-spread__meta">
            <span class="testimonial-spread__name">د. هدى الفهد</span>
            <span class="testimonial-spread__role">أكملت دورة علوم الدم · 2026</span>
          </span>
        </div>

        <router-link class="testimonial-spread__more" to="/stories">
          اقرأ المزيد من القصص
          <span aria-hidden="true">←</span>
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// No props, no store access — pure presentational.
</script>

<style lang="scss" scoped>
@import 'src/design-system/tokens.scss';

.testimonial-spread {
  background: var(--ds-cream);
  padding-block: var(--ds-section-y);
  position: relative;
  overflow: hidden;
}

.testimonial-spread__container {
  position: relative;
  max-inline-size: 1200px;
  margin-inline: auto;
  padding-inline: clamp(1rem, 4vw, 2.5rem);
}

.testimonial-spread__glyph {
  position: absolute;
  inset-block-start: -40px;
  inset-inline-start: clamp(1rem, 6vw, 5rem);
  font-family: var(--ds-font-display);
  font-weight: 700;
  font-size: 280px;
  line-height: 1;
  color: var(--ds-accent-300);
  opacity: 0.14;
  transform: rotate(-8deg);
  pointer-events: none;
  z-index: 0;
  user-select: none;
}

.testimonial-spread__body {
  position: relative;
  z-index: 1;
  max-inline-size: 50ch;
  margin-inline: auto;
}

.testimonial-spread__quote {
  font-family: var(--ds-font-body);
  font-weight: 400;
  font-size: 22px;
  line-height: 1.85;
  color: var(--ds-ink);
  margin: 0 0 var(--ds-space-8);
}

.testimonial-spread__drop {
  float: inline-start;
  font-family: var(--ds-font-display);
  font-weight: 700;
  color: var(--ds-accent-300);
  font-size: 110px;
  line-height: 0.9;
  margin-inline-end: 0.4rem;
  margin-block-start: 0.15em;
  margin-block-end: -0.1em;
}

.testimonial-spread__attribution {
  display: inline-flex;
  align-items: center;
  gap: var(--ds-space-4);
  margin-block-end: var(--ds-space-6);
}

.testimonial-spread__avatar {
  inline-size: 64px;
  block-size: 64px;
  border-radius: 50%;
  overflow: hidden;
  background: var(--ds-surface-sunken);
  border: 2px solid var(--ds-ivory);
  box-shadow: var(--ds-shadow-sm);
  display: inline-flex;
  flex: 0 0 64px;
}

.testimonial-spread__avatar-inner {
  inline-size: 100%;
  block-size: 100%;
  background:
    radial-gradient(circle at 35% 35%,
      var(--ds-accent-200) 0%,
      var(--ds-accent-400) 55%,
      var(--ds-brand-700) 100%);
}

.testimonial-spread__meta {
  display: flex;
  flex-direction: column;
  line-height: 1.5;
}

.testimonial-spread__name {
  font-family: var(--ds-font-body);
  font-weight: 500;
  font-size: var(--ds-text-md);
  color: var(--ds-ink);
}

.testimonial-spread__role {
  font-family: var(--ds-font-mono);
  font-weight: 400;
  font-size: var(--ds-text-xs);
  color: var(--ds-taupe);
}

.testimonial-spread__more {
  font-family: var(--ds-font-body);
  font-weight: 500;
  font-size: var(--ds-text-sm);
  color: var(--ds-accent-300);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  transition: color var(--ds-duration-fast) var(--ds-ease-out);

  &:hover { color: var(--ds-accent-400); }
}
</style>
