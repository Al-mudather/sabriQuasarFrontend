<template>
  <div class="pyramid-card">
    <img src="~assets/img/harm.png" alt="" aria-hidden="true" class="pyramid-card__art" />
    <h3 class="pyramid-card__title">{{ $t('عدد المسوقين في شبكتي التسويقيه') }}</h3>
    <div class="pyramid-card__value">{{ myPyramidMarketersCount }}</div>

    <form class="pyramid-card__share" @submit.prevent="CopyTheLinkHandler">
      <input id="shar-link" type="text" :value="myMarketingCode" readonly />
      <button
        type="submit"
        class="pyramid-card__copy"
        :aria-label="$t('انسخ الرابط')"
      >
        <q-tooltip>{{ message }}</q-tooltip>
        <img src="~assets/img/copyed.png" alt="" />
      </button>
    </form>
  </div>
</template>

<script>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useQuery } from '@vue/apollo-composable'
import { MyPyramidMarketers } from 'src/graphql/pyramid_marketing_management/query/MyPyramidMarketers'
import { copyToClipboard } from 'quasar'
import { usePyramidStore } from 'src/stores/pyramid'

export default {
  name: 'MyPyramidParticipants',

  setup () {
    const pyramid = usePyramidStore()
    const { myMarketingCode } = storeToRefs(pyramid)
    const { result } = useQuery(MyPyramidMarketers, null, { errorPolicy: 'all' })
    const myPyramidMarketersCount = computed(() => result.value?.myPyramidMarketers || 0)
    return { pyramid, myMarketingCode, myPyramidMarketersCount }
  },

  data () {
    return {
      message: this.$t('انسخ الرابط')
    }
  },

  mounted () { this.pyramid.fetchMyMarketingCode() },

  methods: {
    async CopyTheLinkHandler () {
      const copyText = document.getElementById('shar-link')
      copyText.focus()
      copyText.select()
      try {
        await copyToClipboard(copyText.value)
        this.message = this.$t('تم النسخ')
        this.$q.notify({
          type: 'positive',
          progress: true,
          multiLine: true,
          position: 'top',
          message: this.$t('تم النسخ')
        })
      } catch (e) { /* no-op */ }
    }
  }
}
</script>

<style lang="scss" scoped>
.pyramid-card {
  background: var(--ds-surface);
  border: 1px solid var(--ds-border);
  border-radius: var(--ds-radius-lg);
  padding: var(--ds-space-5);
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-3);
  align-items: center;
  text-align: center;
  box-shadow: var(--ds-shadow-xs);

  &__art {
    block-size: 4rem;
    inline-size: auto;
  }

  &__title {
    font-family: var(--ds-font-heading);
    font-size: var(--ds-text-sm);
    font-weight: var(--ds-weight-medium);
    color: var(--ds-text-muted);
    margin: 0;
  }

  &__value {
    font-family: var(--ds-font-heading);
    font-size: var(--ds-text-4xl);
    font-weight: var(--ds-weight-bold);
    color: var(--ds-brand-700);
    font-variant-numeric: tabular-nums;
    line-height: 1;
  }

  &__share {
    margin-block-start: var(--ds-space-2);
    display: flex;
    gap: var(--ds-space-2);
    inline-size: 100%;
    background: var(--ds-surface-muted);
    border-radius: var(--ds-radius-md);
    padding: var(--ds-space-1);

    input {
      flex: 1;
      min-inline-size: 0;
      background: transparent;
      border: 0;
      outline: 0;
      padding: var(--ds-space-2);
      font-size: var(--ds-text-xs);
      color: var(--ds-text-muted);
      font-family: monospace;
    }
  }

  &__copy {
    background: var(--ds-brand-600);
    border: 0;
    border-radius: var(--ds-radius-md);
    padding: var(--ds-space-2);
    cursor: pointer;
    transition: background-color var(--ds-duration-fast) var(--ds-ease-out);

    &:hover { background: var(--ds-brand-700); }
    img { block-size: 1rem; inline-size: auto; filter: brightness(0) invert(1); }
  }
}
</style>
