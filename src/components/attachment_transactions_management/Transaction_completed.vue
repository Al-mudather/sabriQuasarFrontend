<template>
  <article class="tx-card tx-card--completed">
    <header class="tx-card__head">
      <span class="tx-card__invoice">
        <img src="~assets/img/hash.png" alt="" aria-hidden="true" />
        <span>{{ customerTrans.order.invoiceNumber }}</span>
      </span>
      <button type="button" class="tx-card__details" @click="detail = true">
        {{ $t('التفاصيل') }}
      </button>
    </header>

    <div class="tx-card__body">
      <img src="~assets/img/done.png" alt="" aria-hidden="true" />
      <ds-badge variant="success">{{ $t('مكتملة') }}</ds-badge>
    </div>

    <TransactionDetails v-if="detail" :customerTrans="customerTrans" v-on:close="detail = false" />
  </article>
</template>

<script>
import TransactionDetails from 'src/components/attachment_transactions_management/Transaction_details.vue'

export default {
  name: 'TransactionCompleted',
  components: { TransactionDetails },
  props: ['customerTrans'],
  data () { return { detail: false } }
}
</script>

<style lang="scss" scoped>
@import './tx-card.scss';
</style>
