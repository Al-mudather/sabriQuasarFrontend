<template>
  <main class="error-page">
    <ds-empty-state
      title="404"
      size="lg"
    >
      <template #illustration>
        <img src="~assets/img/404.png" alt="" />
      </template>
      <template #description>
        <span class="error-page__sub">{{ $t('الصفحة غير موجودة') }}</span>
        <p class="error-page__hint">
          {{ $t('يبدو أن الصفحة التي تبحث عنها لم تعد متاحة. تأكد من الرابط أو عد إلى الواجهة الرئيسية.') }}
        </p>
      </template>
      <template #actions>
        <ds-button variant="primary" size="lg" @click="goToHomePage">
          {{ $t('إنتقال الي الواجهة الرئيسية') }}
        </ds-button>
      </template>
    </ds-empty-state>
  </main>
</template>

<script>
export default {
  name: 'Error404',
  methods: {
    goToHomePage () { this.$router.push({ name: 'Home' }) }
  }
}
</script>

<style lang="scss" scoped>
.error-page {
  min-block-size: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--ds-space-8) var(--ds-space-4);

  &__sub {
    display: block;
    font-family: var(--ds-font-heading);
    font-size: var(--ds-text-xl);
    color: var(--ds-brand-700);
    font-weight: var(--ds-weight-bold);
    margin-block-end: var(--ds-space-2);
  }

  &__hint {
    color: var(--ds-text-muted);
    font-size: var(--ds-text-md);
    line-height: var(--ds-leading-arabic);
    margin: 0;
  }
}
</style>
