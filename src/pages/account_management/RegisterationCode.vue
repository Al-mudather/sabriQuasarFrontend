<template>
  <div class="auth-card">
    <header class="auth-card__head">
      <h1 class="auth-card__title">{{ $t('كود التسجيل') }}</h1>
      <p class="auth-card__subtitle">
        {{ $t('أدخل الكود المكوّن من 6 خانات المرسل إليك.') }}
      </p>
    </header>

    <div v-if="apiError" class="auth-card__banner" role="alert">{{ apiError }}</div>

    <form @submit.prevent="REGISTER_THE_USER_WITH_REGISTERATION_CODE" class="auth-card__form" novalidate>
      <div class="otp" dir="ltr" @paste="onPaste">
        <input
          v-for="(d, i) in digits"
          :key="i"
          :ref="(el) => { if (el) otpRefs[i] = el as HTMLInputElement }"
          class="otp__box"
          inputmode="numeric"
          pattern="[0-9]*"
          maxlength="1"
          autocomplete="one-time-code"
          :value="digits[i]"
          @input="onInput($event, i)"
          @keydown="onKeydown($event, i)"
          @focus="($event.target as HTMLInputElement).select()"
        />
      </div>

      <ds-button
        type="submit"
        native-type="submit"
        variant="accent"
        size="lg"
        full-width
        :loading="visible"
        :disabled="!isComplete"
      >
        {{ $t('تأكيد') }}
      </ds-button>

      <div class="auth-card__resend">
        <span v-if="cooldown > 0" class="auth-card__resend-lock">
          {{ $t('يمكنك الإرسال مجدداً خلال') }} {{ cooldown }} {{ $t('ثانية') }}
        </span>
        <a v-else class="auth-card__resend-link" @click="resend">
          {{ $t('إعادة الإرسال') }}
        </a>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
/**
 * This page lives under account_management but its sole mutation
 * (`JoinPlatform`) belongs to the pyramid feature, not auth.
 */
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useQuasar } from 'quasar'
import { useMutation } from '@vue/apollo-composable'
import { storeToRefs } from 'pinia'
import { usePyramidStore } from 'src/stores/pyramid'
import { JoinPlatform } from 'src/graphql/pyramid_marketing_management/mutation/JoinPlatform'
import type { JoinPlatformResult, JoinPlatformVars } from 'src/types/pyramid/types'

const { t } = useI18n()
const $q = useQuasar()
const router = useRouter()
const pyramid = usePyramidStore()
const { registerationCode } = storeToRefs(pyramid)

const { mutate: joinPlatformMutate } = useMutation<JoinPlatformResult, JoinPlatformVars>(JoinPlatform)

// ---------------------------------------------------------------------------
// Local state
// ---------------------------------------------------------------------------
const digits = ref<string[]>(['', '', '', '', '', ''])
const visible = ref(false)
const cooldown = ref(60)
const timer = ref<ReturnType<typeof setInterval> | null>(null)
const apiError = ref('')
const otpRefs = ref<HTMLInputElement[]>([])

// ---------------------------------------------------------------------------
// Computed
// ---------------------------------------------------------------------------
const r_code = computed(() => digits.value.join(''))
const isComplete = computed(() => digits.value.every(d => d !== ''))

// ---------------------------------------------------------------------------
// Methods
// ---------------------------------------------------------------------------
function focusBox (i: number): void {
  otpRefs.value[i]?.focus()
}

function onInput (e: Event, i: number): void {
  const input = e.target as HTMLInputElement
  const v = input.value.replace(/\D/g, '')
  const char = v.slice(-1) || ''
  digits.value[i] = char
  if (char && i < 5) focusBox(i + 1)
}

function onKeydown (e: KeyboardEvent, i: number): void {
  if (e.key === 'Backspace' && !digits.value[i] && i > 0) {
    focusBox(i - 1)
  } else if (e.key === 'ArrowLeft' && i < 5) {
    focusBox(i + 1)
  } else if (e.key === 'ArrowRight' && i > 0) {
    focusBox(i - 1)
  } else if (e.key === 'Enter' && isComplete.value) {
    void REGISTER_THE_USER_WITH_REGISTERATION_CODE()
  }
}

function onPaste (e: ClipboardEvent): void {
  const text = (e.clipboardData ?? (window as Window & { clipboardData?: DataTransfer }).clipboardData)
    ?.getData('text')
    .replace(/\D/g, '')
    .slice(0, 6) ?? ''
  if (!text) return
  e.preventDefault()
  for (let i = 0; i < 6; i++) digits.value[i] = text[i] ?? ''
  focusBox(Math.min(text.length, 5))
}

function startCooldown (): void {
  cooldown.value = 60
  if (timer.value) clearInterval(timer.value)
  timer.value = setInterval(() => {
    cooldown.value = Math.max(0, cooldown.value - 1)
    if (cooldown.value === 0 && timer.value) clearInterval(timer.value)
  }, 1000)
}

function resend (): void {
  $q.notify({ type: 'info', progress: true, multiLine: true, position: 'top', message: t('تم إعادة إرسال الكود') })
  startCooldown()
}

async function REGISTER_THE_USER_WITH_REGISTERATION_CODE (): Promise<void> {
  if (!isComplete.value) {
    apiError.value = t('يرجى إدخال الكود كاملاً')
    return
  }
  apiError.value = ''
  visible.value = true
  try {
    const res = await joinPlatformMutate({ marketingCode: r_code.value, input: {} })
    if (res?.data?.joinPlatform?.success) {
      $q.notify({ type: 'positive', progress: true, multiLine: true, position: 'top', message: t('مرحباً بك') })
      pyramid.setRegisterationCode('')
      void router.push({ name: 'Home' })
    }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : ''
    if (msg === 'GraphQL error: Pyramid matching query does not exist.') {
      apiError.value = t('هذا الكود غير صحيح — يرجى التحقق والمحاولة مجدداً.')
    } else {
      apiError.value = t('تعذّر التحقق من الكود.')
    }
  } finally {
    visible.value = false
  }
}

// ---------------------------------------------------------------------------
// Lifecycle
// ---------------------------------------------------------------------------
onMounted(() => {
  if (registerationCode.value && registerationCode.value.length > 4) {
    const clean = String(registerationCode.value).replace(/\D/g, '').slice(0, 6).padEnd(6, '')
    digits.value = clean.split('').map(c => c.trim())
    if (isComplete.value) void REGISTER_THE_USER_WITH_REGISTERATION_CODE()
  } else {
    void nextTick(() => { focusBox(0) })
  }
  startCooldown()
})

onBeforeUnmount(() => {
  pyramid.setRegisterationCode('')
  if (timer.value) clearInterval(timer.value)
})
</script>

<style lang="scss" scoped>
.auth-card {
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-5);

  &__head { text-align: start; }

  &__title {
    font-family: var(--ds-font-heading);
    font-weight: var(--ds-weight-bold);
    font-size: var(--ds-text-2xl);
    color: var(--ds-text);
    margin: 0 0 var(--ds-space-2);
  }

  &__subtitle {
    font-size: var(--ds-text-md);
    color: var(--ds-text-muted);
    margin: 0;
    line-height: var(--ds-leading-arabic);
  }

  &__banner {
    padding: var(--ds-space-3) var(--ds-space-4);
    background: var(--ds-accent-50);
    color: var(--ds-accent-500);
    border-inline-start: 3px solid var(--ds-accent-300);
    border-radius: var(--ds-radius-sm);
    font-size: var(--ds-text-sm);
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-4);
  }

  &__resend {
    text-align: center;
    font-size: var(--ds-text-sm);
    color: var(--ds-text-muted);
  }

  &__resend-link {
    color: var(--ds-brand-600);
    font-weight: var(--ds-weight-medium);
    cursor: pointer;
    &:hover { text-decoration: underline; }
  }
}

.otp {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: var(--ds-space-2);

  &__box {
    inline-size: 100%;
    aspect-ratio: 1 / 1;
    text-align: center;
    font-family: var(--ds-font-heading);
    font-size: var(--ds-text-xl);
    font-weight: var(--ds-weight-bold);
    color: var(--ds-text);
    background: var(--ds-surface-ivory);
    border: 1px solid var(--ds-taupe);
    border-radius: var(--ds-radius-sm);
    outline: none;
    transition: border-color 150ms ease, box-shadow 150ms ease;

    &:focus {
      border-color: var(--ds-brand-600);
      box-shadow: 0 0 0 3px rgba(50, 40, 115, 0.22);
    }
  }
}
</style>
