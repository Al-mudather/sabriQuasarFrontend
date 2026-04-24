<template>
  <q-dialog :value="true" persistent @input="CLOSE_THE_ATTACHEMENTS_DETAILS">
    <q-card class="tx-details">
      <header class="tx-details__head">
        <h3>{{ $t('تفاصيل العملية') }}</h3>
        <button
          type="button"
          class="tx-details__close"
          :aria-label="$t('إغلاق')"
          @click="CLOSE_THE_ATTACHEMENTS_DETAILS"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </header>

      <div class="tx-details__table-wrap">
        <table class="tx-details__table">
          <thead>
            <tr>
              <th>{{ $t('إسم الكورس') }}</th>
              <th>{{ $t('مقدم الطلب') }}</th>
              <th>{{ $t('رقم الواتساب') }}</th>
              <th>{{ $t('رقم التلجرام') }}</th>
            </tr>
          </thead>
          <tbody v-if="customerTrans.order.user">
            <tr v-for="detail in customerTrans.order.orderdetailsSet?.edges" :key="detail?.node?.pk">
              <td>{{ detail?.node?.course?.title }}</td>
              <td>{{ customerTrans.order.user.fullName }}</td>
              <td>{{ customerTrans.order.user.phoneNumber2 }}</td>
              <td>{{ customerTrans.order.user.phoneNumber3 }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import type { AttachmentTransaction } from 'src/types/attachments/types'

interface Props {
  customerTrans: AttachmentTransaction
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

function CLOSE_THE_ATTACHEMENTS_DETAILS (): void {
  emit('close')
}
</script>

<style lang="scss" scoped>
.tx-details {
  inline-size: 100%;
  max-inline-size: 720px;
  padding: var(--ds-space-5);
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-4);

  &__head {
    display: flex;
    align-items: center;
    justify-content: space-between;

    h3 {
      font-family: var(--ds-font-heading);
      font-size: var(--ds-text-lg);
      font-weight: var(--ds-weight-bold);
      color: var(--ds-text);
      margin: 0;
    }
  }

  &__close {
    inline-size: 2rem;
    block-size: 2rem;
    border-radius: 50%;
    border: 1px solid var(--ds-border);
    background: var(--ds-surface);
    color: var(--ds-text);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    svg { inline-size: 1rem; block-size: 1rem; }
    &:hover { background: var(--ds-surface-muted); }
  }

  &__table-wrap {
    overflow-x: auto;
  }

  &__table {
    inline-size: 100%;
    border-collapse: collapse;
    font-size: var(--ds-text-sm);

    th, td {
      padding: var(--ds-space-2) var(--ds-space-3);
      text-align: start;
      border-block-end: 1px solid var(--ds-border);
    }

    th {
      font-family: var(--ds-font-heading);
      font-weight: var(--ds-weight-bold);
      color: var(--ds-text);
      background: var(--ds-surface-muted);
    }

    tbody tr:hover { background: var(--ds-surface-muted); }
  }
}
</style>
