<template>
  <div class="stat-tile">
    <div class="stat-tile__value">
      <span v-if="query && totalCount !== ''" class="stat-tile__number">
        {{ formatted }}<slot />
      </span>
      <ds-skeleton v-else shape="line" width="3ch" style="height: 0.8em" />
    </div>
    <p class="stat-tile__label">{{ name }}</p>
  </div>
</template>

<script>
export default {
  name: 'StatistcsData',
  props: ['name', 'query'],
  data () { return { totalCount: '' } },
  computed: {
    formatted () {
      const n = Number(this.totalCount)
      if (!Number.isFinite(n)) return this.totalCount
      return n.toLocaleString('ar-EG')
    }
  },
  mounted () {
    if (this.query) {
      this.$apollo.query({ query: this.query }).then(res => {
        const key = Object.keys(res.data)[0]
        this.totalCount = res.data[key]
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.stat-tile {
  background: var(--ds-surface);
  border: 1px solid var(--ds-border);
  border-radius: var(--ds-radius-lg);
  padding: var(--ds-space-5) var(--ds-space-4);
  text-align: center;
  box-shadow: var(--ds-shadow-xs);
  transition:
    transform var(--ds-duration-base) var(--ds-ease-out),
    box-shadow var(--ds-duration-base) var(--ds-ease-out);

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--ds-shadow-md);
  }

  &__value {
    font-family: var(--ds-font-heading);
    font-size: var(--ds-text-3xl);
    font-weight: var(--ds-weight-bold);
    color: var(--ds-brand-700);
    line-height: 1.1;
    margin-block-end: var(--ds-space-2);
    min-block-size: calc(var(--ds-text-3xl) * 1.1);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.1em;
  }

  &__number {
    font-variant-numeric: tabular-nums;
    ::v-deep span {
      font-size: 0.7em;
      color: var(--ds-accent-500);
      margin-inline-start: 0.1em;
    }
  }

  &__label {
    font-family: var(--ds-font-body);
    font-size: var(--ds-text-sm);
    color: var(--ds-text-muted);
    margin: 0;
  }
}
</style>
