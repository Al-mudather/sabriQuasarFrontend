<template>
  <article class="tx-card tx-card--rejected">
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
      <img src="~assets/img/cansl.png" alt="" aria-hidden="true" />
      <ds-badge variant="danger">{{ label }}</ds-badge>
    </div>

    <TransactionDetails v-if="detail" :customerTrans="customerTrans" @close="detail = false" />
  </article>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TransactionDetails from 'src/components/attachment_transactions_management/Transaction_details.vue'
import type { AttachmentTransaction } from 'src/types/attachments/types'

interface Props {
  customerTrans: AttachmentTransaction
  label: string
}

defineProps<Props>()

const detail = ref(false)
</script>

<style lang="scss" scoped>
@import './tx-card.scss';
</style>
