<template>
  <main class="password-reset" dir="rtl">
    <div class="password-reset__card">
      <header class="password-reset__head">
        <h1 class="password-reset__title">{{ $t('تعيين كلمة مرور جديدة') }}</h1>
        <p class="password-reset__subtitle">
          {{ $t('اختر كلمة مرور قوية — ستحميك في كل مرة تسجّل فيها الدخول.') }}
        </p>
      </header>

      <div v-if="apiError" class="password-reset__banner" role="alert">{{ apiError }}</div>

      <form @submit.prevent="ResetTheUserPassword" class="password-reset__form" novalidate>
        <ds-input
          v-model="newPassword1"
          type="password"
          :label="$t('كلمة المرور الجديدة')"
          :error="fieldErrors.newPassword1"
          autocomplete="new-password"
          required
        />

        <div class="password-reset__strength" v-if="newPassword1">
          <ds-progress-bar :value="strengthValue" size="sm" variant="brand" />
          <span class="password-reset__strength-label" :class="`is-${strengthTier}`">
            {{ strengthLabel }}
          </span>
        </div>

        <ds-input
          v-model="newPassword2"
          type="password"
          :label="$t('تأكيد كلمة المرور')"
          :error="fieldErrors.newPassword2"
          autocomplete="new-password"
          required
        />

        <ds-button
          type="submit"
          native-type="submit"
          variant="accent"
          size="lg"
          full-width
          :loading="visible"
        >
          {{ $t('تعيين كلمة المرور') }}
        </ds-button>
      </form>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useQuasar } from 'quasar'
import { useMutation } from '@vue/apollo-composable'
import { ResetUserPassword } from 'src/graphql/account_management/mutation/ResetUserPassword'
import DsInput from 'src/design-system/components/DsInput.vue'
import type { PasswordResetResult, PasswordResetVariables } from 'src/types/auth/types'

const { t } = useI18n()
const $q = useQuasar()
const route = useRoute()
const router = useRouter()

const { mutate: resetPassword } = useMutation<PasswordResetResult, PasswordResetVariables>(ResetUserPassword)

// ---------------------------------------------------------------------------
// Local state
// ---------------------------------------------------------------------------
const newPassword1 = ref('')
const newPassword2 = ref('')
const token = ref('')
const visible = ref(false)
const apiError = ref('')
const fieldErrors = ref({ newPassword1: '', newPassword2: '' })

// ---------------------------------------------------------------------------
// Route param → token
// ---------------------------------------------------------------------------
watch(
  () => route.params,
  (params) => { token.value = String(params.token ?? '') },
  { immediate: true, deep: true },
)

// ---------------------------------------------------------------------------
// Computed — password strength
// ---------------------------------------------------------------------------
const strengthValue = computed(() => {
  const p = newPassword1.value
  let score = 0
  if (p.length >= 6)  score += 25
  if (p.length >= 10) score += 20
  if (/[A-Z]/.test(p) && /[a-z]/.test(p)) score += 20
  if (/\d/.test(p))   score += 15
  if (/[^A-Za-z0-9]/.test(p)) score += 20
  return Math.min(100, score)
})

type StrengthTier = 'weak' | 'medium' | 'strong'

const strengthTier = computed<StrengthTier>(() => {
  const v = strengthValue.value
  if (v < 40) return 'weak'
  if (v < 70) return 'medium'
  return 'strong'
})

const strengthLabel = computed(() => {
  const map: Record<StrengthTier, string> = {
    weak: t('ضعيفة'),
    medium: t('متوسطة'),
    strong: t('قوية'),
  }
  return map[strengthTier.value]
})

// ---------------------------------------------------------------------------
// Methods
// ---------------------------------------------------------------------------
function errorHandler (errorsObj: Record<string, Array<{ message: string }>>): void {
  const generic: string[] = []
  const map: Record<string, keyof typeof fieldErrors.value> = {
    newPassword1: 'newPassword1',
    newPassword2: 'newPassword2',
  }
  for (const key in errorsObj) {
    for (const val of errorsObj[key]) {
      const field = map[key]
      if (field) fieldErrors.value[field] = val.message
      else generic.push(val.message)
    }
  }
  if (generic.length) apiError.value = generic.join(' — ')
}

async function ResetTheUserPassword (): Promise<void> {
  apiError.value = ''
  fieldErrors.value = { newPassword1: '', newPassword2: '' }
  if (newPassword1.value !== newPassword2.value) {
    fieldErrors.value.newPassword2 = t('كلمتا المرور غير متطابقتين')
    return
  }
  visible.value = true
  try {
    const res = await resetPassword({
      token: token.value,
      newPassword1: newPassword1.value,
      newPassword2: newPassword2.value,
    })
    const payload = res?.data?.passwordReset
    if (payload?.success) {
      $q.notify({ type: 'positive', progress: true, multiLine: true, position: 'bottom', message: t('تم تعيين كلمة المرور بنجاح') })
      void router.push({ name: 'login' })
    } else if (payload?.errors) {
      errorHandler(payload.errors as Record<string, Array<{ message: string }>>)
    }
  } catch {
    apiError.value = t('تعذر تعيين كلمة المرور. قد يكون الرابط منتهياً.')
  } finally {
    visible.value = false
  }
}
</script>

<style lang="scss" scoped>
.password-reset {
  min-block-size: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--ds-space-6) var(--ds-space-4);
  background: var(--ds-neutral-50);

  &__card {
    inline-size: 100%;
    max-inline-size: 460px;
    background: var(--ds-surface-ivory);
    border: 1px solid var(--ds-border);
    border-radius: var(--ds-radius-lg);
    padding: var(--ds-space-7) var(--ds-space-6);
    box-shadow: var(--ds-shadow-md);
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-5);
  }

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

  &__strength {
    display: flex;
    align-items: center;
    gap: var(--ds-space-3);
    margin-block-start: calc(-1 * var(--ds-space-2));
  }

  &__strength-label {
    font-size: var(--ds-text-xs);
    font-weight: var(--ds-weight-medium);
    font-family: var(--ds-font-heading);

    &.is-weak   { color: var(--ds-danger); }
    &.is-medium { color: var(--ds-warning); }
    &.is-strong { color: var(--ds-brand-600); }
  }
}
</style>
