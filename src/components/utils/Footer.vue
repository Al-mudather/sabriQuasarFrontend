<template>
  <footer class="site-footer">
    <div class="site-footer__inner">
      <nav class="site-footer__links">
        <a class="site-footer__link" @click="$router.push({ name: 'terms-and-conditions' })">
          {{ isEnglish ? 'Terms and Conditions' : 'الأحكام والشروط' }}
        </a>
        <a class="site-footer__link" @click="$router.push({ name: 'privacy-policy' })">
          {{ isEnglish ? 'Privacy Policy' : 'سياسة الخصوصيه' }}
        </a>
      </nav>

      <div class="site-footer__brand">
        <img src="~assets/img/suppo.png" alt="" />
        <p>{{ isEnglish ? 'All rights reserved 2024–2021' : 'جميع الحقوق محفوظة 2024-2021' }}</p>
      </div>
    </div>
  </footer>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Footer',
  computed: { ...mapState('settings', ['isEnglish']) }
}
</script>

<style lang="scss" scoped>
.site-footer {
  background: var(--ds-brand-800);
  color: rgba(255, 255, 255, 0.85);
  padding: var(--ds-space-8) var(--ds-space-4);
  margin-block-start: var(--ds-space-16);

  &__inner {
    max-inline-size: 1200px;
    margin-inline: auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--ds-space-6);
    flex-wrap: wrap;
  }

  &__links {
    display: flex;
    gap: var(--ds-space-5);
    flex-wrap: wrap;
  }

  &__link {
    color: rgba(255, 255, 255, 0.8);
    font-family: var(--ds-font-heading);
    font-size: var(--ds-text-sm);
    cursor: pointer;
    text-decoration: none;
    transition: color var(--ds-duration-fast) var(--ds-ease-out);
    &:hover { color: var(--ds-accent-300); }
  }

  &__brand {
    display: flex;
    align-items: center;
    gap: var(--ds-space-3);

    img {
      block-size: 2rem;
      inline-size: auto;
    }
    p {
      margin: 0;
      font-size: var(--ds-text-sm);
      color: rgba(255, 255, 255, 0.7);
      font-variant-numeric: tabular-nums;
    }
  }
}
</style>
