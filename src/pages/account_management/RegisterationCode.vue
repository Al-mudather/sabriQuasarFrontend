<template>
  <div class="auth-card">
    <header class="auth-card__head">
      <h1 class="auth-card__title">{{ $t('كود التسجيل') }}</h1>
      <p class="auth-card__subtitle">
        {{ $t('أدخل كود التسجيل المرسل إليك.') }}
      </p>
    </header>

    <div v-if="apiError" class="auth-card__banner" role="alert">{{ apiError }}</div>

    <form @submit.prevent="REGISTER_THE_USER_WITH_REGISTERATION_CODE" class="auth-card__form" novalidate>
      <input
        ref="codeInput"
        v-model="code"
        class="code-field"
        type="text"
        dir="ltr"
        autocomplete="one-time-code"
        autocapitalize="characters"
        autocorrect="off"
        spellcheck="false"
        :placeholder="$t('مثال: P068252021')"
        @keydown.enter.prevent="REGISTER_THE_USER_WITH_REGISTERATION_CODE"
      />

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
// The registration code is an alphanumeric affiliate/marketing code (e.g.
// "P068252021"), NOT a fixed-length numeric OTP. It must be submitted EXACTLY
// as the user enters it — no digit-stripping, no length cap. We only trim
// surrounding whitespace (stray spaces from copy/paste) on submit.
const code = ref('')
const visible = ref(false)
const apiError = ref('')
const codeInput = ref<HTMLInputElement | null>(null)

// ---------------------------------------------------------------------------
// Computed
// ---------------------------------------------------------------------------
const isComplete = computed(() => code.value.trim().length > 0)

// ---------------------------------------------------------------------------
// Methods
// ---------------------------------------------------------------------------
async function REGISTER_THE_USER_WITH_REGISTERATION_CODE (): Promise<void> {
  const value = code.value.trim()
  if (!value) {
    apiError.value = t('يرجى إدخال الكود')
    return
  }
  apiError.value = ''
  visible.value = true
  try {
    const res = await joinPlatformMutate({ marketingCode: value, input: {} })
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
  // Prefill from a code carried in via the affiliate share link (loadCourse →
  // setRegisterationCode). Use it verbatim — it's an alphanumeric code — and
  // auto-submit so a referred user sails straight through.
  if (registerationCode.value && registerationCode.value.trim().length > 4) {
    code.value = String(registerationCode.value).trim()
    void REGISTER_THE_USER_WITH_REGISTERATION_CODE()
  } else {
    void nextTick(() => { codeInput.value?.focus() })
  }
})

onBeforeUnmount(() => {
  pyramid.setRegisterationCode('')
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
}

.code-field {
  inline-size: 100%;
  block-size: 56px;
  padding-inline: var(--ds-space-4);
  text-align: center;
  letter-spacing: 0.18em;
  font-family: var(--ds-font-heading);
  font-size: var(--ds-text-xl);
  font-weight: var(--ds-weight-bold);
  color: var(--ds-text);
  background: var(--ds-surface-ivory);
  border: 1px solid var(--ds-taupe);
  border-radius: var(--ds-radius-sm);
  outline: none;
  transition: border-color 150ms ease, box-shadow 150ms ease;

  &::placeholder {
    font-weight: var(--ds-weight-regular);
    letter-spacing: normal;
    color: var(--ds-text-muted);
    opacity: 0.7;
  }

  &:focus {
    border-color: var(--ds-brand-600);
    box-shadow: 0 0 0 3px rgba(50, 40, 115, 0.22);
  }
}
</style>
