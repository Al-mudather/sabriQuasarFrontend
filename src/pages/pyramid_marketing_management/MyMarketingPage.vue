<template>
  <main class="marketing-page">
    <header class="marketing-page__head">
      <h1>
        <img src="~assets/img/tit.png" alt="" aria-hidden="true" />
        <span>{{ $t('حسابي التسويقي') }}</span>
      </h1>
    </header>

    <section class="marketing-page__top">
      <who-joind-the-platform-throw-me />
    </section>

    <section class="marketing-page__grid">
      <my-balance class="marketing-page__balance" />
      <div class="marketing-page__pyramid">
        <my-pyramid />
      </div>
    </section>

    <header class="marketing-page__head marketing-page__head--second">
      <h2>{{ $t('سجل السحب') }}</h2>
    </header>

    <section class="marketing-page__withdraws">
      <my-withdraws-list />
    </section>
  </main>
</template>

<script>
import WhoJoindThePlatformThrowMe from 'src/components/pyramid_marketing_management/WhoJoindThePlatformThrowMe.vue'
import MyBalance from 'src/components/pyramid_marketing_management/MyBalance.vue'
import MyPyramid from 'src/components/pyramid_marketing_management/MyPyramid.vue'
import MyWithdrawsList from 'src/components/pyramid_marketing_management/MyWithdrawsList.vue'

export default {
  name: 'MyMarketingPage',
  components: {
    'who-joind-the-platform-throw-me': WhoJoindThePlatformThrowMe,
    'my-balance': MyBalance,
    'my-pyramid': MyPyramid,
    'my-withdraws-list': MyWithdrawsList
  }
}
</script>

<style lang="scss" scoped>
.marketing-page {
  max-inline-size: 1200px;
  margin-inline: auto;
  padding: var(--ds-space-6) var(--ds-space-3) var(--ds-space-12);

  @media (min-width: 600px) {
    padding: var(--ds-space-8) var(--ds-space-4) var(--ds-space-16);
  }

  &__head {
    margin-block-end: var(--ds-space-5);
    h1, h2 {
      display: inline-flex;
      align-items: center;
      gap: var(--ds-space-2);
      font-family: var(--ds-font-heading);
      font-weight: var(--ds-weight-bold);
      color: var(--ds-text);
      margin: 0;
      img { block-size: 1.5rem; inline-size: auto; }
    }
    h1 { font-size: var(--ds-text-3xl); }
    h2 { font-size: var(--ds-text-2xl); }

    &--second { margin-block-start: var(--ds-space-10); }
  }

  &__top { margin-block-end: var(--ds-space-6); }

  &__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--ds-space-5);
    margin-block-end: var(--ds-space-6);

    @media (min-width: 900px) {
      grid-template-columns: 340px 1fr;
      align-items: start;
    }
  }

  &__pyramid {
    background: var(--ds-surface);
    border: 1px solid var(--ds-border);
    border-radius: var(--ds-radius-lg);
    padding: var(--ds-space-4);
    box-shadow: var(--ds-shadow-xs);
  }
}
</style>
