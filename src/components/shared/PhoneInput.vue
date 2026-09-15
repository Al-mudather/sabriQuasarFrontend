<template>
  <!-- Phone numbers are inherently LTR: the dial code sits on the left and the
       digits read left-to-right even on the RTL page (same convention as the
       old checkout phone row — see docs/progress/1.1.13). -->
  <div ref="rootEl" class="phone-input" dir="ltr">
    <DsInput
      ref="inputEl"
      v-model="national"
      type="tel"
      inputmode="tel"
      autocomplete="tel-national"
      :label="label"
      :placeholder="placeholder"
      :error="error"
      :required="required"
      :disabled="disabled"
    >
      <template #prefix>
        <button
          type="button"
          class="phone-input__country-btn"
          :disabled="disabled"
          :aria-label="$t('رمز الدولة')"
          :aria-expanded="open"
          aria-haspopup="listbox"
          @click="toggleOpen"
        >
          <span class="phone-input__flag" aria-hidden="true">{{ selected.flag }}</span>
          <span class="phone-input__dial">{{ selected.dialCode }}</span>
          <svg
            class="phone-input__caret"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
      </template>
      <template v-if="helper" #helper>{{ helper }}</template>
    </DsInput>

    <div v-if="open" class="phone-input__dropdown" :dir="isRtl ? 'rtl' : 'ltr'">
      <input
        ref="searchEl"
        v-model="search"
        class="phone-input__search"
        type="search"
        :placeholder="$t('ابحث عن الدولة')"
        :aria-label="$t('ابحث عن الدولة')"
        @keydown.esc.prevent="closeDropdown"
      />
      <ul class="phone-input__list" role="listbox" :aria-label="$t('اختر الدولة')">
        <li v-for="c in filtered" :key="c.iso">
          <button
            type="button"
            class="phone-input__option"
            :class="{ 'phone-input__option--active': c.iso === country }"
            role="option"
            :aria-selected="c.iso === country"
            @click="selectCountry(c.iso)"
          >
            <span class="phone-input__option-flag" aria-hidden="true">{{ c.flag }}</span>
            <span class="phone-input__option-name">{{ c.name }}</span>
            <span class="phone-input__option-dial" dir="ltr">{{ c.dialCode }}</span>
          </button>
        </li>
        <li v-if="!filtered.length" class="phone-input__no-results">
          {{ $t('لا توجد نتائج') }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import DsInput from 'src/design-system/components/DsInput.vue'
import {
  getCountryOptions,
  splitE164,
  toE164,
  type CountryCode,
  type CountryOption,
} from 'src/utils/phone'

defineOptions({ name: 'PhoneInput' })

interface Props {
  /** Canonical stored value — E.164 (`+249912345678`) or null when unset. */
  modelValue?: string | null
  label?: string
  placeholder?: string
  helper?: string
  error?: string
  required?: boolean
  disabled?: boolean
  defaultCountry?: CountryCode
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  label: '',
  placeholder: '',
  helper: '',
  error: '',
  required: false,
  disabled: false,
  defaultCountry: 'SD',
})

const emit = defineEmits<{
  (e: 'update:modelValue', val: string | null): void
}>()

const { locale } = useI18n()

const rootEl = ref<HTMLElement | null>(null)
const inputEl = ref<InstanceType<typeof DsInput> | null>(null)
const searchEl = ref<HTMLInputElement | null>(null)

const country = ref<CountryCode>(props.defaultCountry)
const national = ref('')
const open = ref(false)
const search = ref('')

const isRtl = computed(() => String(locale.value).startsWith('ar'))
const countries = computed<CountryOption[]>(() => getCountryOptions(String(locale.value)))

const selected = computed<CountryOption>(() =>
  countries.value.find((c) => c.iso === country.value) ??
  { iso: country.value, name: country.value, dialCode: '', flag: '' })

const filtered = computed<CountryOption[]>(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return countries.value
  const qDigits = q.replace(/^\+/, '')
  return countries.value.filter((c) =>
    c.name.toLowerCase().includes(q) ||
    c.iso.toLowerCase() === q ||
    (qDigits && c.dialCode.slice(1).startsWith(qDigits)))
})

// E.164 for the current (country, national) pair — null while empty/invalid.
const e164 = computed<string | null>(() =>
  national.value.trim() ? toE164(country.value, national.value) : null)

/** 'empty' | 'invalid' | 'valid' — parents gate submit on this. */
const status = computed<'empty' | 'invalid' | 'valid'>(() => {
  if (!national.value.trim()) return 'empty'
  return e164.value ? 'valid' : 'invalid'
})

// Incoming model -> split into country + national digits. Ignore echoes of
// our own emit, and never clear text the user is mid-way through fixing
// (parent holds null while our status is 'invalid').
watch(() => props.modelValue, (val) => {
  const incoming = (val ?? '').trim()
  if (incoming) {
    if (incoming === e164.value) return
    const s = splitE164(incoming, props.defaultCountry)
    country.value = s.iso
    national.value = s.national
  } else if (status.value === 'valid') {
    national.value = ''
  }
}, { immediate: true })

watch(e164, (val) => {
  if (val !== (props.modelValue ?? null)) emit('update:modelValue', val)
})

// A parent may steer the default (e.g. Telegram follows the WhatsApp
// country); only adopt it while the field is still empty so a number the
// user already typed never silently changes country.
watch(() => props.defaultCountry, (iso) => {
  if (status.value === 'empty') country.value = iso
})

function toggleOpen (): void {
  if (props.disabled) return
  open.value = !open.value
  if (open.value) {
    search.value = ''
    void nextTick(() => searchEl.value?.focus())
  }
}

function closeDropdown (): void {
  open.value = false
}

function selectCountry (iso: CountryCode): void {
  country.value = iso
  open.value = false
  inputEl.value?.focus()
}

function onDocumentClick (ev: MouseEvent): void {
  if (!open.value) return
  if (rootEl.value && !rootEl.value.contains(ev.target as Node)) open.value = false
}

onMounted(() => document.addEventListener('click', onDocumentClick, true))
onBeforeUnmount(() => document.removeEventListener('click', onDocumentClick, true))

defineExpose({
  status,
  country,
  focus: (): void => inputEl.value?.focus(),
})
</script>

<style lang="scss" scoped>
.phone-input {
  position: relative;
  width: 100%;

  &__country-btn {
    display: inline-flex;
    align-items: center;
    gap: var(--ds-space-1);
    border: 0;
    background: none;
    padding: 0;
    padding-inline-end: var(--ds-space-2);
    margin-inline-end: var(--ds-space-1);
    border-inline-end: 1px solid var(--ds-border, var(--ds-taupe));
    font-family: var(--ds-font-body);
    font-size: var(--ds-text-sm);
    color: var(--ds-text);
    cursor: pointer;
    white-space: nowrap;

    &:disabled {
      cursor: not-allowed;
      color: var(--ds-text-muted);
    }

    &:focus-visible {
      outline: 2px solid var(--ds-brand-600);
      outline-offset: 2px;
      border-radius: var(--ds-radius-sm);
    }
  }

  &__flag {
    font-size: var(--ds-text-md);
    line-height: 1;
  }

  &__caret {
    color: var(--ds-taupe);
    flex: 0 0 auto;
  }

  &__dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 50;
    width: 100%;
    min-width: 16rem;
    margin-block-start: var(--ds-space-1);
    background: var(--ds-surface, #fff);
    border: 1px solid var(--ds-border, var(--ds-taupe));
    border-radius: var(--ds-radius-md);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    overflow: hidden;
  }

  &__search {
    width: 100%;
    border: 0;
    border-bottom: 1px solid var(--ds-border, var(--ds-taupe));
    padding: var(--ds-space-2) var(--ds-space-3);
    font-family: var(--ds-font-body);
    font-size: var(--ds-text-sm);
    color: var(--ds-text);
    background: transparent;

    &:focus {
      outline: none;
      background: var(--ds-surface-muted, rgba(0, 0, 0, 0.03));
    }
  }

  &__list {
    list-style: none;
    margin: 0;
    padding: var(--ds-space-1) 0;
    max-height: 16rem;
    overflow-y: auto;
  }

  &__option {
    display: flex;
    align-items: center;
    gap: var(--ds-space-2);
    width: 100%;
    border: 0;
    background: none;
    padding: var(--ds-space-2) var(--ds-space-3);
    font-family: var(--ds-font-body);
    font-size: var(--ds-text-sm);
    color: var(--ds-text);
    cursor: pointer;
    text-align: start;

    &:hover,
    &:focus-visible {
      background: var(--ds-surface-muted, rgba(0, 0, 0, 0.05));
      outline: none;
    }

    &--active {
      background: var(--ds-surface-muted, rgba(0, 0, 0, 0.05));
      font-weight: var(--ds-weight-medium);
    }
  }

  &__option-flag {
    flex: 0 0 auto;
  }

  &__option-name {
    flex: 1 1 auto;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__option-dial {
    flex: 0 0 auto;
    color: var(--ds-text-muted);
  }

  &__no-results {
    padding: var(--ds-space-3);
    font-size: var(--ds-text-sm);
    color: var(--ds-text-muted);
    text-align: center;
  }
}
</style>
