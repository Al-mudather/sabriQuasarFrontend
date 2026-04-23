<template>
  <div class="who-joined-me">
    <div class="who-joined-me__value">{{ count }}</div>
    <p class="who-joined-me__label">{{ $t('شخص إنضم من خلالي') }}</p>
  </div>
</template>

<script>
import { MyPyramidAffiliates } from 'src/queries/pyramid_marketing_management/query/WhoJoindThePlatformThrowMe.js'

export default {
  name: 'WhoJoindThePlatformThrowMe',
  data () { return { count: 0 } },
  apollo: {
    myPyramidAffiliates: {
      query: MyPyramidAffiliates,
      result (res) { if (!res.loading) this.count = res.data.myPyramidAffiliates }
    }
  }
}
</script>

<style lang="scss" scoped>
.who-joined-me {
  background: linear-gradient(135deg, var(--ds-brand-600), var(--ds-brand-700));
  color: var(--ds-text-onBrand);
  border-radius: var(--ds-radius-lg);
  padding: var(--ds-space-5);
  display: flex;
  align-items: center;
  gap: var(--ds-space-4);
  box-shadow: var(--ds-shadow-md);

  &__value {
    font-family: var(--ds-font-heading);
    font-size: var(--ds-text-4xl);
    font-weight: var(--ds-weight-bold);
    color: var(--ds-accent-300);
    line-height: 1;
    font-variant-numeric: tabular-nums;
    min-inline-size: 3ch;
    text-align: center;
  }

  &__label {
    margin: 0;
    font-family: var(--ds-font-heading);
    font-size: var(--ds-text-md);
    font-weight: var(--ds-weight-medium);
  }
}
</style>
