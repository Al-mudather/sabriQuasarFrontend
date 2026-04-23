<template>
  <main class="account-shell" dir="rtl">
    <section class="account-shell__form-side">
      <header class="account-shell__brand">
        <router-link :to="{ name: 'Home' }" class="account-shell__brand-link" aria-label="الصفحة الرئيسية">
          <img :src="logo" alt="" class="account-shell__brand-logo" />
          <span class="account-shell__brand-name">{{ brandName }}</span>
        </router-link>
      </header>

      <div class="account-shell__form-wrap">
        <router-view />
      </div>
    </section>

    <aside class="account-shell__panel" aria-hidden="true">
      <svg
        class="account-shell__topo"
        viewBox="0 0 600 900"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round">
          <path d="M-40,120 C120,60 280,180 460,110 C560,72 640,140 700,100" opacity="0.20" />
          <path d="M-40,220 C140,160 280,290 480,210 C580,170 660,240 720,200" opacity="0.18" />
          <path d="M-40,330 C120,260 300,400 480,320 C580,280 680,360 740,320" opacity="0.16" />
          <path d="M-40,450 C160,380 320,520 500,440 C600,400 680,470 740,430" opacity="0.14" />
          <path d="M-40,570 C140,500 300,630 500,560 C600,520 680,590 740,550" opacity="0.12" />
          <path d="M-40,690 C160,620 320,760 520,680 C620,640 700,710 740,670" opacity="0.11" />
          <path d="M-40,810 C140,740 300,870 500,800 C600,760 680,830 740,790" opacity="0.09" />
        </g>
      </svg>

      <div class="account-shell__panel-inner">
        <span class="account-shell__eyebrow">{{ acronym }}</span>
        <h2 class="account-shell__headline">{{ headline }}</h2>
        <p class="account-shell__tagline">{{ tagline }}</p>
      </div>
    </aside>
  </main>
</template>

<script>
import { LOGO, BRAND } from 'src/design-system/brand'

export default {
  name: 'Account',
  data () {
    return {
      logo: LOGO.full,
      brandName: BRAND.nameAr,
      acronym: BRAND.acronym,
      headline: 'مرحباً بك في رحلتك الطبية',
      tagline: 'تعلّم بثقة. تمرّن بإتقان. تقدّم بخطى واثقة.'
    }
  }
}
</script>

<style lang="scss" scoped>
.account-shell {
  min-block-size: 100vh;
  display: grid;
  grid-template-columns: 1fr;
  background: var(--ds-neutral-50);

  @media (min-width: 960px) {
    grid-template-columns: 1fr 1fr;
  }

  &__form-side {
    position: relative;
    display: flex;
    flex-direction: column;
    padding: var(--ds-space-5) var(--ds-space-4) var(--ds-space-8);
    background: var(--ds-neutral-50);
    order: 2;

    @media (min-width: 960px) {
      order: 1;
      padding: var(--ds-space-6) var(--ds-space-8);
      min-block-size: 100vh;
    }
  }

  &__brand {
    display: flex;
    justify-content: flex-start;
    margin-block-end: var(--ds-space-6);
  }

  &__brand-link {
    display: inline-flex;
    align-items: center;
    gap: var(--ds-space-3);
    text-decoration: none;
    color: var(--ds-text);
  }

  &__brand-logo {
    block-size: 40px;
    inline-size: auto;
    object-fit: contain;
    border-radius: var(--ds-radius-sm);
  }

  &__brand-name {
    font-family: var(--ds-font-heading);
    font-size: var(--ds-text-sm);
    font-weight: var(--ds-weight-medium);
    color: var(--ds-text);
    display: none;

    @media (min-width: 640px) {
      display: inline;
    }
  }

  &__form-wrap {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;

    & > * {
      inline-size: 100%;
      max-inline-size: 420px;
    }
  }

  &__panel {
    position: relative;
    overflow: hidden;
    background: var(--ds-brand-600);
    color: var(--ds-neutral-0);
    order: 1;
    min-block-size: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--ds-space-5) var(--ds-space-4);

    @media (min-width: 960px) {
      order: 2;
      min-block-size: 100vh;
      padding: var(--ds-space-10) var(--ds-space-8);
      align-items: center;
      justify-content: flex-start;
    }
  }

  &__topo {
    position: absolute;
    inset: 0;
    inline-size: 100%;
    block-size: 100%;
    color: var(--ds-neutral-0);
    pointer-events: none;
  }

  &__panel-inner {
    position: relative;
    z-index: 1;
    max-inline-size: 440px;
    text-align: center;

    @media (min-width: 960px) {
      text-align: start;
    }
  }

  &__eyebrow {
    display: none;
    font-family: var(--ds-font-heading);
    font-size: var(--ds-text-xs);
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--ds-accent-200);
    margin-block-end: var(--ds-space-3);

    @media (min-width: 960px) {
      display: inline-block;
    }
  }

  &__headline {
    font-family: var(--ds-font-heading);
    font-weight: var(--ds-weight-bold);
    font-size: clamp(1.25rem, 2.5vw, 2.25rem);
    line-height: var(--ds-leading-tight);
    color: var(--ds-neutral-0);
    margin: 0 0 var(--ds-space-3);

    @media (max-width: 959px) {
      font-size: var(--ds-text-md);
      margin: 0;
    }
  }

  &__tagline {
    display: none;
    font-family: var(--ds-font-body);
    font-size: var(--ds-text-md);
    line-height: var(--ds-leading-arabic);
    color: rgba(251, 247, 240, 0.82);
    margin: 0;

    @media (min-width: 960px) {
      display: block;
    }
  }
}
</style>
