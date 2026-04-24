<template>
  <section class="user-info" aria-label="معلومات الفوترة">
    <header class="user-info__header">
      <h2 class="user-info__title">{{ $t('معلوماتك الشخصية') }}</h2>
      <p class="user-info__subtitle">
        {{ $t('نستخدم هذه المعلومات للتواصل معك بشأن طلبك وتفعيل الدورات.') }}
      </p>
    </header>

    <DsCard padding="lg" class="user-info__card">
      <form
        class="user-info__form"
        novalidate
        @submit.prevent="UPDATE_THE_USER_PROFILE"
      >
        <DsInput
          v-model="fullName"
          :label="$t('الاسم الكامل')"
          :placeholder="$t('مثال: أحمد محمد')"
          :error="errors.fullName"
          :hint="$t('باللغة العربية أو الإنجليزية')"
          required
        />

        <div class="user-info__row user-info__row--phone">
          <div class="user-info__country">
            <label class="user-info__country-label" for="country-code">
              {{ $t('الرمز') }}
            </label>
            <select
              id="country-code"
              v-model="countryCode"
              class="user-info__country-select"
              :aria-label="$t('رمز الدولة')"
            >
              <option
                v-for="c in countryCodes"
                :key="c.code"
                :value="c.code"
              >
                {{ c.flag }} {{ c.code }}
              </option>
            </select>
          </div>

          <div class="user-info__phone">
            <DsInput
              v-model="whatsAppNumber"
              type="tel"
              :label="$t('رقم واتساب')"
              :placeholder="$t('رقم الهاتف')"
              :error="errors.phone"
              :hint="$t('يفضل رقم متصل بواتساب')"
              required
            />
          </div>
        </div>

        <DsInput
          v-model="telegramNumber"
          type="tel"
          :label="$t('رقم تلجرام (اختياري)')"
          :placeholder="$t('إن وجد')"
        />

        <DsInput
          v-model="email"
          type="email"
          :label="$t('البريد الإلكتروني')"
          :placeholder="$t('example@mail.com')"
          :error="errors.email"
        />

        <div class="user-info__row user-info__row--two">
          <DsInput
            v-model="country"
            :label="$t('الدولة')"
            :placeholder="$t('السعودية')"
          />
          <DsInput
            v-model="city"
            :label="$t('المدينة')"
            :placeholder="$t('الرياض')"
          />
        </div>

        <DsTextarea
          v-model="notes"
          :label="$t('ملاحظات (اختياري)')"
          :placeholder="$t('أي معلومات إضافية تودّ إخبارنا بها')"
          :rows="3"
        />

        <div class="user-info__actions">
          <DsButton
            variant="ghost"
            size="md"
            @click="$router.push({ name: 'cart' })"
          >
            ← {{ $t('عودة إلى السلة') }}
          </DsButton>

          <DsButton
            type="submit"
            variant="accent"
            size="lg"
            :loading="submitting"
            :disabled="submitting"
            @click="UPDATE_THE_USER_PROFILE"
          >
            {{ $t('التالي — الدفع') }}
          </DsButton>
        </div>
      </form>
    </DsCard>
  </section>
</template>

<script>
/**
 * Cart-checkout billing-info step. This component gates progression to
 * the payment step and does not itself invoke any per-provider checkout
 * mutation — only account_management.UpdateUserProfile + GetMyProfileData.
 * The cart feature aliases are referenced for consistency with siblings.
 *
 * @typedef {import('src/types/cart/types').CartEntry} CartEntry
 * @typedef {import('src/types/cart/types').PaymentProvider} PaymentProvider
 */
import { UpdateUserProfile } from 'src/graphql/account_management/mutation/UpdateUserProfile'
import { GetMyProfileData } from 'src/graphql/account_management/query/GetMyProfileData'
import { apolloClient } from 'src/apollo/client'

import DsInput from 'src/design-system/components/DsInput.vue'
import DsTextarea from 'src/design-system/components/DsTextarea.vue'

export default {
  name: 'userInformation',

  components: { DsInput, DsTextarea },

  data () {
    return {
      fullName: '',
      email: '',
      countryCode: '+966',
      whatsAppNumber: '',
      telegramNumber: '',
      country: '',
      city: '',
      notes: '',
      submitting: false,
      errors: {
        fullName: '',
        phone: '',
        email: ''
      },
      countryCodes: [
        { code: '+966', flag: '🇸🇦' },
        { code: '+971', flag: '🇦🇪' },
        { code: '+20',  flag: '🇪🇬' },
        { code: '+249', flag: '🇸🇩' },
        { code: '+962', flag: '🇯🇴' },
        { code: '+965', flag: '🇰🇼' },
        { code: '+974', flag: '🇶🇦' },
        { code: '+973', flag: '🇧🇭' },
        { code: '+968', flag: '🇴🇲' },
        { code: '+212', flag: '🇲🇦' },
        { code: '+216', flag: '🇹🇳' },
        { code: '+213', flag: '🇩🇿' },
        { code: '+964', flag: '🇮🇶' },
        { code: '+961', flag: '🇱🇧' },
        { code: '+967', flag: '🇾🇪' }
      ]
    }
  },

  async created () {
    try {
      const res = await apolloClient.query({ query: GetMyProfileData })
      if (res.data.me && res.data.me.pk) {
        const me = res.data.me
        if (me.fullName && (me.phoneNumber2 || me.phoneNumber3)) {
          // Profile already complete — move on without spamming a toast.
          this.$router.push({ name: 'payment' })
          return
        }
        this.fullName = me.fullName || ''
        this.whatsAppNumber = me.phoneNumber2 || ''
        this.telegramNumber = me.phoneNumber3 || ''
        this.email = me.email || ''
      }
    } catch (_) {
      // silent — form will render empty
    }
  },

  methods: {
    validate () {
      this.errors = { fullName: '', phone: '', email: '' }
      let ok = true

      if (!this.fullName || this.fullName.trim().length < 2) {
        this.errors.fullName = this.$t('يرجى إدخال اسمك الكامل')
        ok = false
      }
      if (!this.whatsAppNumber || this.whatsAppNumber.replace(/\D/g, '').length < 6) {
        this.errors.phone = this.$t('يرجى إدخال رقم هاتف صحيح')
        ok = false
      }
      if (this.email && !/^\S+@\S+\.\S+$/.test(this.email)) {
        this.errors.email = this.$t('صيغة البريد الإلكتروني غير صحيحة')
        ok = false
      }
      return ok
    },

    async UPDATE_THE_USER_PROFILE (e) {
      if (e && e.preventDefault) e.preventDefault()
      if (!this.validate()) return

      this.submitting = true
      try {
        const fullPhone = this.whatsAppNumber
          ? `${this.countryCode}${this.whatsAppNumber.replace(/\D/g, '')}`
          : null

        const res = await apolloClient.mutate({
          mutation: UpdateUserProfile,
          variables: {
            input: {
              fullName: this.fullName,
              phoneNumber2: fullPhone,
              phoneNumber3: this.telegramNumber || null
            }
          }
        })

        const payload = res.data.updateUserProfile
        if (payload && payload.errors && Object.keys(payload.errors).length) {
          this.errorHandler(payload.errors)
          this.submitting = false
          return
        }

        this.$q.notify({
          type: 'positive',
          multiLine: true,
          progress: true,
          position: 'top',
          message: 'تم حفظ بياناتك'
        })
        this.$router.push({ name: 'payment' })
      } catch (_) {
        this.submitting = false
      }
    },

    errorHandler (errorsObj) {
      if (typeof errorsObj !== 'object' || errorsObj == null) return
      for (const key of Object.keys(errorsObj)) {
        const entries = errorsObj[key]
        if (!Array.isArray(entries)) continue
        for (const val of entries) {
          const msg = typeof val.message === 'object'
            ? (val.message.msg || JSON.stringify(val.message))
            : `${val.message} : ${key}`
          this.$q.notify({
            type: 'warning',
            progress: true,
            multiLine: true,
            position: 'top',
            message: msg
          })
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.user-info {
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-6);
  color: var(--ds-text);

  &__header {
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-2);
  }

  &__title {
    margin: 0;
    font-family: var(--ds-font-heading);
    font-size: var(--ds-text-xl);
    color: var(--ds-text);
  }

  &__subtitle {
    margin: 0;
    font-size: var(--ds-text-sm);
    color: var(--ds-text-muted);
    line-height: 1.6;
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-4);
  }

  &__row {
    display: grid;
    gap: var(--ds-space-3);

    &--phone {
      grid-template-columns: 7rem 1fr;
      align-items: end;
    }

    &--two {
      grid-template-columns: 1fr 1fr;
      @media (max-width: 600px) { grid-template-columns: 1fr; }
    }
  }

  &__country-label {
    display: block;
    font-size: var(--ds-text-sm);
    font-weight: var(--ds-weight-medium);
    color: var(--ds-text);
    margin-block-end: var(--ds-space-2);
  }

  &__country-select {
    width: 100%;
    height: 2.75rem;
    border: 1px solid var(--ds-border);
    border-radius: var(--ds-radius-md);
    background: var(--ds-surface);
    color: var(--ds-text);
    padding-inline: var(--ds-space-3);
    font-family: var(--ds-font-body);
    font-size: var(--ds-text-sm);
    appearance: none;
    cursor: pointer;

    &:focus {
      outline: none;
      border-color: var(--ds-indigo, #322873);
      box-shadow: 0 0 0 3px rgba(50, 40, 115, 0.12);
    }
  }

  &__actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--ds-space-3);
    margin-block-start: var(--ds-space-2);
    flex-wrap: wrap;
  }
}
</style>
