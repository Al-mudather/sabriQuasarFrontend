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
          :ref="el => { if (el) otpRefs[i] = el }"
          class="otp__box"
          inputmode="numeric"
          pattern="[0-9]*"
          maxlength="1"
          autocomplete="one-time-code"
          :value="digits[i]"
          @input="onInput($event, i)"
          @keydown="onKeydown($event, i)"
          @focus="$event.target.select()"
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

<script>
import { JoinPlatform } from 'src/queries/pyramid_marketing_management/mutation/JoinPlatform'
import { usePyramidStore } from 'src/stores/pyramid'
import { storeToRefs } from 'pinia'
import { useMutation } from '@vue/apollo-composable'

export default {
  name: 'RegisterationCode',

  setup () {
    const pyramid = usePyramidStore()
    const { registerationCode } = storeToRefs(pyramid)
    const joinPlatform = useMutation(JoinPlatform)
    return { pyramid, registerationCode, _joinPlatform: joinPlatform }
  },

  data () {
    return {
      digits: ['', '', '', '', '', ''],
      visible: false,
      cooldown: 60,
      timer: null,
      apiError: '',
      otpRefs: []
    }
  },

  computed: {
    r_code () { return this.digits.join('') },
    isComplete () { return this.digits.every(d => d !== '') }
  },

  beforeUnmount () {
    this.pyramid.setRegisterationCode('')
    if (this.timer) clearInterval(this.timer)
  },

  mounted () {
    if (this.registerationCode && this.registerationCode.length > 4) {
      const clean = String(this.registerationCode).replace(/\D/g, '').slice(0, 6).padEnd(6, '')
      this.digits = clean.split('').map(c => c.trim())
      if (this.isComplete) this.REGISTER_THE_USER_WITH_REGISTERATION_CODE()
    } else {
      this.$nextTick(() => { this.focusBox(0) })
    }
    this.startCooldown()
  },

  methods: {
    focusBox (i) {
      const el = this.otpRefs[i]
      if (el) el.focus()
    },

    onInput (e, i) {
      const v = e.target.value.replace(/\D/g, '')
      const char = v.slice(-1) || ''
      this.digits[i] = char
      if (char && i < 5) this.focusBox(i + 1)
    },

    onKeydown (e, i) {
      if (e.key === 'Backspace' && !this.digits[i] && i > 0) {
        this.focusBox(i - 1)
      } else if (e.key === 'ArrowLeft' && i < 5) {
        this.focusBox(i + 1)
      } else if (e.key === 'ArrowRight' && i > 0) {
        this.focusBox(i - 1)
      } else if (e.key === 'Enter' && this.isComplete) {
        this.REGISTER_THE_USER_WITH_REGISTERATION_CODE()
      }
    },

    onPaste (e) {
      const text = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '').slice(0, 6)
      if (!text) return
      e.preventDefault()
      for (let i = 0; i < 6; i++) this.digits[i] = text[i] || ''
      this.focusBox(Math.min(text.length, 5))
    },

    startCooldown () {
      this.cooldown = 60
      if (this.timer) clearInterval(this.timer)
      this.timer = setInterval(() => {
        this.cooldown = Math.max(0, this.cooldown - 1)
        if (this.cooldown === 0) clearInterval(this.timer)
      }, 1000)
    },

    resend () {
      this.$q.notify({
        type: 'info',
        progress: true,
        multiLine: true,
        position: 'top',
        message: this.$t('تم إعادة إرسال الكود')
      })
      this.startCooldown()
    },

    async REGISTER_THE_USER_WITH_REGISTERATION_CODE () {
      if (!this.isComplete) {
        this.apiError = this.$t('يرجى إدخال الكود كاملاً')
        return
      }
      this.apiError = ''
      this.visible = true
      try {
        const res = await this._joinPlatform.mutate({ marketingCode: this.r_code, input: {} })
        if (res.data.joinPlatform.success) {
          this.$q.notify({
            type: 'positive',
            progress: true,
            multiLine: true,
            position: 'top',
            message: this.$t('مرحباً بك')
          })
          this.pyramid.setRegisterationCode('')
          this.$router.push({ name: 'Home' })
        }
      } catch (e) {
        if (e.message === 'GraphQL error: Pyramid matching query does not exist.') {
          this.apiError = this.$t('هذا الكود غير صحيح — يرجى التحقق والمحاولة مجدداً.')
        } else {
          this.apiError = this.$t('تعذّر التحقق من الكود.')
        }
      } finally {
        this.visible = false
      }
    }
  }
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
