<template>
  <div class="currency-picker">
    <button
      type="button"
      class="currency-picker__trigger"
      :aria-expanded="showCurrency"
      @click="showCurrency = !showCurrency"
    >
      <img src="~assets/img/exchange.png" alt="" aria-hidden="true" />
      <span>{{ $t('حدد عملة الشراء') }}</span>
    </button>

    <ul v-if="showCurrency" class="currency-picker__list">
      <li>
        <button type="button" @click="currencySelectionHandler('SDG')">
          <img src="~assets/img/sudan.png" alt="" />
          <span>{{ $t('الجنيه السوداني') }}</span>
        </button>
      </li>
      <li>
        <button type="button" @click="currencySelectionHandler('USD')">
          <img src="~assets/img/united-states .png" alt="" />
          <span>{{ $t('الدولار الامريكي') }}</span>
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { useSettingsStore } from 'src/stores/settings'
import type { CurrencyCode } from 'src/types/settings/types'

const $q = useQuasar()
const { t } = useI18n()
const settings = useSettingsStore()

const showCurrency = ref(false)

function currencySelectionHandler (currency: CurrencyCode): void {
  settings.setCurrency(currency)
  showCurrency.value = false
  $q.notify({
    type: 'positive',
    progress: true,
    multiLine: true,
    position: 'bottom',
    message: t('تم تغيير العمله الى:') + currency
  })
}
</script>

<style lang="scss" scoped>
.currency-picker {
  position: relative;
  display: inline-block;

  &__trigger {
    display: inline-flex;
    align-items: center;
    gap: var(--ds-space-2);
    background: var(--ds-surface);
    border: 1px solid var(--ds-border);
    border-radius: var(--ds-radius-pill);
    padding: var(--ds-space-2) var(--ds-space-3);
    cursor: pointer;
    font-family: var(--ds-font-heading);
    font-size: var(--ds-text-sm);
    color: var(--ds-text);
    transition: background-color var(--ds-duration-fast) var(--ds-ease-out);

    img { block-size: 1.1rem; inline-size: auto; }
    &:hover { background: var(--ds-surface-muted); }
    &:focus-visible { outline: 2px solid transparent; box-shadow: var(--ds-shadow-focus); }
  }

  &__list {
    position: absolute;
    inset-inline-start: 0;
    inset-block-start: calc(100% + var(--ds-space-1));
    list-style: none;
    margin: 0;
    padding: var(--ds-space-1);
    background: var(--ds-surface);
    border: 1px solid var(--ds-border);
    border-radius: var(--ds-radius-md);
    box-shadow: var(--ds-shadow-md);
    min-inline-size: 200px;
    z-index: var(--ds-z-raised);

    li { margin: 0; }
    button {
      inline-size: 100%;
      display: flex;
      align-items: center;
      gap: var(--ds-space-2);
      padding: var(--ds-space-2) var(--ds-space-3);
      background: transparent;
      border: 0;
      border-radius: var(--ds-radius-sm);
      color: var(--ds-text);
      font-family: var(--ds-font-body);
      font-size: var(--ds-text-sm);
      cursor: pointer;
      text-align: start;
      transition: background-color var(--ds-duration-fast) var(--ds-ease-out);

      img { block-size: 1rem; inline-size: auto; }
      &:hover { background: var(--ds-surface-muted); }
    }
  }
}
</style>
