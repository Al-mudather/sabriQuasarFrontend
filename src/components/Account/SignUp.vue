<template>
  <div class="auth-card">
    <header class="auth-card__head">
      <h1 class="auth-card__title">{{ t('إنشاء حساب جديد') }}</h1>
      <p class="auth-card__subtitle">
        {{ t('ابدأ رحلتك العلمية في دقيقة واحدة.') }}
      </p>
    </header>

    <div class="auth-card__social">
      <GoogleAuthentication :label="googleLabel" :prevRoute="prevRoute" />
    </div>

    <p class="auth-card__switch">
      <span>{{ t('لديك حساب بالفعل؟') }}</span>
      <a @click="goLogin">{{ t('تسجيل الدخول') }}</a>
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useSettingsStore } from 'src/stores/settings'
import GoogleAuthentication from 'src/components/Account/GoogleAuthentication.vue'

const { t } = useI18n()
const router = useRouter()
const settings = useSettingsStore()
const { isEnglish } = storeToRefs(settings)

const googleLabel = ref('إنشاء حساب جديد بإستخدام Google')
const prevRoute = ref<string | null>(null)

onMounted(() => {
  if (isEnglish.value) googleLabel.value = 'Sign up using Google'
})

function goLogin (): void {
  void router.push({ name: 'login' })
}
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

  &__social {
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-2);
  }

  &__switch {
    text-align: center;
    font-size: var(--ds-text-sm);
    color: var(--ds-text-muted);
    margin: 0;

    a {
      color: var(--ds-brand-600);
      font-weight: var(--ds-weight-medium);
      margin-inline-start: var(--ds-space-1);
      cursor: pointer;
      &:hover { text-decoration: underline; }
    }
  }
}
</style>
