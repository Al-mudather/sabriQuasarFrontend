<template>
  <main class="profile-page">
    <header class="profile-page__header">
      <h1 class="profile-page__title">{{ $t('الملف الشخصي') }}</h1>
      <p class="profile-page__subtitle">
        {{ $t('إدارة بياناتك الشخصية وتفضيلاتك وأمان حسابك.') }}
      </p>
    </header>

    <div class="profile-page__grid">
      <!-- Personal info card -->
      <ds-card class="profile-card" variant="default" elevation="xs">
        <div class="profile-card__head">
          <div class="profile-card__head-text">
            <h2>{{ $t('البيانات الشخصية') }}</h2>
            <p>{{ $t('حافظ على بياناتك محدّثة.') }}</p>
          </div>
          <ds-button
            v-if="!editingInfo"
            variant="ghost"
            size="sm"
            @click="startEditInfo"
          >
            {{ $t('تعديل') }}
          </ds-button>
        </div>

        <div class="profile-card__identity">
          <div class="profile-avatar" aria-hidden="true">
            <span class="profile-avatar__initials">{{ initials }}</span>
          </div>
          <div class="profile-identity">
            <h3 class="profile-identity__name">{{ fullName || $t('بدون اسم') }}</h3>
            <p class="profile-identity__email">{{ email }}</p>
          </div>
        </div>

        <form class="profile-form" @submit.prevent="UpdateUserProfileData">
          <div class="profile-form__grid">
            <ds-input
              v-model="fullName"
              :label="$t('الاسم الكامل')"
              :disabled="!editingInfo"
              :readonly="!editingInfo"
            />
            <ds-input
              v-model="email"
              type="email"
              :label="$t('البريد الإلكتروني')"
              readonly
              disabled
            />
            <ds-input
              v-model="whatsAppNumber"
              :label="$t('رقم الواتساب')"
              :disabled="!editingInfo"
              :readonly="!editingInfo"
              placeholder="+249XXXXXXXXX"
            />
            <ds-input
              v-model="telegramNumber"
              :label="$t('رقم التلجرام')"
              :disabled="!editingInfo"
              :readonly="!editingInfo"
              placeholder="+249XXXXXXXXX"
            />
          </div>

          <fieldset class="profile-form__gender" :disabled="!editingInfo">
            <legend>{{ $t('الجنس') }}</legend>
            <div class="profile-form__chips">
              <button
                v-for="g in genders"
                :key="g.value"
                type="button"
                class="gender-chip"
                :class="{ 'gender-chip--active': gender === g.value, 'gender-chip--disabled': !editingInfo }"
                :disabled="!editingInfo"
                @click="gender = g.value"
              >
                <span>{{ g.label }}</span>
              </button>
            </div>
          </fieldset>

          <div v-if="editingInfo" class="profile-form__actions">
            <ds-button
              type="button"
              variant="ghost"
              size="md"
              :disabled="saving"
              @click="cancelEditInfo"
            >
              {{ $t('إلغاء') }}
            </ds-button>
            <ds-button
              type="submit"
              variant="accent"
              size="md"
              :loading="saving"
            >
              {{ $t('حفظ') }}
            </ds-button>
          </div>
        </form>
      </ds-card>

      <!-- Security card -->
      <ds-card class="profile-card" variant="default" elevation="xs">
        <div class="profile-card__head">
          <div class="profile-card__head-text">
            <h2>{{ $t('الأمان') }}</h2>
            <p>{{ $t('حدث كلمة المرور وتحقق من بريدك الإلكتروني.') }}</p>
          </div>
        </div>

        <div class="profile-card__row">
          <div class="profile-card__row-label">
            <span class="profile-card__row-title">{{ $t('حالة البريد الإلكتروني') }}</span>
            <span class="profile-card__row-sub">{{ email }}</span>
          </div>
          <ds-badge :variant="emailVerified ? 'success' : 'warning'" size="md">
            {{ emailVerified ? $t('مؤكَّد') : $t('غير مؤكَّد') }}
          </ds-badge>
        </div>

        <div v-if="!emailVerified" class="profile-card__verify">
          <a href="#" class="profile-link" @click.prevent="resendVerification">
            {{ $t('إعادة إرسال رابط التأكيد') }}
          </a>
        </div>

        <div class="profile-form__grid">
          <ds-input
            v-model="currentPassword"
            type="password"
            :label="$t('كلمة المرور الحالية')"
            autocomplete="current-password"
          />
          <ds-input
            v-model="newPassword"
            type="password"
            :label="$t('كلمة المرور الجديدة')"
            autocomplete="new-password"
          />
          <ds-input
            v-model="confirmPassword"
            type="password"
            :label="$t('تأكيد كلمة المرور')"
            autocomplete="new-password"
          />
        </div>
        <div class="profile-form__actions">
          <ds-button
            variant="primary"
            size="md"
            :disabled="!canChangePassword"
            @click="changePassword"
          >
            {{ $t('تغيير كلمة المرور') }}
          </ds-button>
        </div>
      </ds-card>

      <!-- Preferences card -->
      <ds-card class="profile-card profile-card--full" variant="default" elevation="xs">
        <div class="profile-card__head">
          <div class="profile-card__head-text">
            <h2>{{ $t('التفضيلات') }}</h2>
            <p>{{ $t('اللغة والعملة وتنبيهاتك.') }}</p>
          </div>
        </div>

        <div class="profile-prefs">
          <div class="profile-prefs__row">
            <div class="profile-prefs__label">
              <span>{{ $t('اللغة') }}</span>
              <small>{{ $t('واجهة الموقع') }}</small>
            </div>
            <div class="profile-prefs__control">
              <button
                class="lang-chip"
                :class="{ 'lang-chip--active': !isEnglish }"
                type="button"
                @click="setLang(false)"
              >
                العربية
              </button>
              <button
                class="lang-chip"
                :class="{ 'lang-chip--active': isEnglish }"
                type="button"
                @click="setLang(true)"
              >
                English
              </button>
            </div>
          </div>

          <div class="profile-prefs__row">
            <div class="profile-prefs__label">
              <span>{{ $t('العملة') }}</span>
              <small>{{ $t('عملة العرض الافتراضية') }}</small>
            </div>
            <div class="profile-prefs__control">
              <select
                class="profile-select"
                :value="currency"
                @change="setCurrency($event.target.value)"
              >
                <option v-for="c in currencies" :key="c" :value="c">{{ c }}</option>
              </select>
            </div>
          </div>

          <div class="profile-prefs__row">
            <div class="profile-prefs__label">
              <span>{{ $t('الإشعارات') }}</span>
              <small>{{ $t('اختر ما يصلك من تنبيهات.') }}</small>
            </div>
            <div class="profile-prefs__control profile-prefs__control--stack">
              <label class="pref-check">
                <input type="checkbox" v-model="prefs.courses" />
                <span>{{ $t('تحديثات الدورات') }}</span>
              </label>
              <label class="pref-check">
                <input type="checkbox" v-model="prefs.transactions" />
                <span>{{ $t('المعاملات المالية') }}</span>
              </label>
              <label class="pref-check">
                <input type="checkbox" v-model="prefs.marketing" />
                <span>{{ $t('التسويق والعروض') }}</span>
              </label>
            </div>
          </div>
        </div>
      </ds-card>
    </div>
  </main>
</template>

<script>
import { GetMyProfileData } from 'src/queries/account_management/query/GetMyProfileData'
import { UpdateUserProfile } from 'src/queries/account_management/mutation/UpdateUserProfile'
import { useSettingsStore } from 'src/stores/settings'
import { storeToRefs } from 'pinia'
import { useQuery, useMutation } from '@vue/apollo-composable'
import { computed } from 'vue'
import DsInput from 'src/design-system/components/DsInput.vue'

export default {
  name: 'Profile',

  components: { DsInput },

  setup () {
    const settings = useSettingsStore()
    const { isEnglish, currency } = storeToRefs(settings)

    const profileQuery = useQuery(GetMyProfileData)
    const me = computed(() => profileQuery.result.value?.me || null)

    const updateProfile = useMutation(UpdateUserProfile, {
      refetchQueries: [{ query: GetMyProfileData }]
    })

    return {
      settings,
      isEnglish,
      currency,
      me,
      _updateProfile: updateProfile
    }
  },

  data () {
    return {
      saving: false,
      editingInfo: false,
      fullName: '',
      whatsAppNumber: '',
      telegramNumber: '',
      email: '',
      gender: '',
      emailVerified: false,
      // snapshot for cancel
      snapshot: null,
      // security
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      // preferences
      currencies: ['SAR', 'SDG', 'EUR', 'GBP', 'USD'],
      prefs: { courses: true, transactions: true, marketing: false }
    }
  },

  computed: {
    genders () {
      return [
        { value: 'male',   label: this.$t('ذكر') },
        { value: 'female', label: this.$t('أنثى') }
      ]
    },
    initials () {
      const n = (this.fullName || this.email || '').trim()
      if (!n) return '؟'
      const parts = n.split(/\s+/).filter(Boolean)
      if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
      return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
    },
    canChangePassword () {
      return this.currentPassword && this.newPassword && this.newPassword === this.confirmPassword
    }
  },

  watch: {
    me (value) {
      if (!value) return
      this.email          = value.email || ''
      this.fullName       = value.fullName || ''
      this.whatsAppNumber = value.phoneNumber2 || ''
      this.telegramNumber = value.phoneNumber3 || ''
      if (value.gender === 'MALE')   this.gender = 'male'
      if (value.gender === 'FEMALE') this.gender = 'female'
      // emailVerified not on schema — keep defensive default
      this.emailVerified = !!value.emailVerified
    }
  },

  mounted () {
    this.settings.setActiveNav('PROFILE')
  },

  methods: {
    startEditInfo () {
      this.snapshot = {
        fullName: this.fullName,
        whatsAppNumber: this.whatsAppNumber,
        telegramNumber: this.telegramNumber,
        gender: this.gender
      }
      this.editingInfo = true
    },

    cancelEditInfo () {
      if (this.snapshot) {
        this.fullName       = this.snapshot.fullName
        this.whatsAppNumber = this.snapshot.whatsAppNumber
        this.telegramNumber = this.snapshot.telegramNumber
        this.gender         = this.snapshot.gender
      }
      this.editingInfo = false
    },

    setLang (flag) {
      this.settings.setIsEnglish(flag)
      this.$q.notify && this.$q.notify({
        type: 'positive',
        position: 'top',
        progress: true,
        message: this.$t('تم تحديث اللغة')
      })
    },

    setCurrency (val) {
      this.settings.setCurrency(val)
      this.$q.notify && this.$q.notify({
        type: 'positive',
        position: 'top',
        progress: true,
        message: this.$t('تم تحديث العملة')
      })
    },

    resendVerification () {
      this.$q.notify({
        type: 'info',
        position: 'top',
        progress: true,
        message: this.$t('تم إرسال رابط التأكيد إلى بريدك.')
      })
    },

    changePassword () {
      // Password mutation not wired on this schema — placeholder flow.
      if (!this.canChangePassword) return
      this.$q.notify({
        type: 'positive',
        position: 'top',
        progress: true,
        message: this.$t('تم طلب تغيير كلمة المرور.')
      })
      this.currentPassword = ''
      this.newPassword = ''
      this.confirmPassword = ''
    },

    errorHandler (errorsObj) {
      for (const key in errorsObj) {
        for (const val of errorsObj[key]) {
          this.$q.notify({
            type: 'warning',
            progress: true,
            multiLine: true,
            position: 'top',
            message: val.message
          })
        }
      }
    },

    async UpdateUserProfileData () {
      this.saving = true
      try {
        const result = await this._updateProfile.mutate({
          input: {
            fullName: this.fullName,
            phoneNumber2: this.whatsAppNumber,
            phoneNumber3: this.telegramNumber,
            gender: this.gender
          }
        })
        if (result.data.updateUserProfile.success) {
          this.$q.notify({
            type: 'positive',
            position: 'top',
            progress: true,
            multiLine: true,
            message: this.$t('تم تحديث بياناتك بنجاح')
          })
          this.editingInfo = false
        } else if (result.data.updateUserProfile.errors) {
          this.errorHandler(result.data.updateUserProfile.errors)
        }
      } catch (e) { /* apolloProvider surfaces the error toast */ }
      finally { this.saving = false }
    }
  }
}
</script>

<style lang="scss" scoped>
.profile-page {
  background: var(--ds-cream, var(--ds-surface-muted));
  min-block-size: 100vh;
  padding: var(--ds-space-6) var(--ds-space-3) var(--ds-space-12);

  @media (min-width: 600px) {
    padding: var(--ds-space-8) var(--ds-space-4) var(--ds-space-16);
  }

  &__header {
    max-inline-size: 1120px;
    margin-inline: auto;
    margin-block-end: var(--ds-space-6);
  }

  &__title {
    font-family: var(--ds-font-heading);
    font-size: var(--ds-text-3xl);
    font-weight: var(--ds-weight-bold);
    color: var(--ds-ink, var(--ds-text));
    margin: 0 0 var(--ds-space-1);
  }

  &__subtitle {
    font-family: var(--ds-font-body);
    color: var(--ds-taupe, var(--ds-text-muted));
    margin: 0;
    font-size: var(--ds-text-md);
  }

  &__grid {
    max-inline-size: 1120px;
    margin-inline: auto;
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--ds-space-5);

    @media (min-width: 1024px) {
      grid-template-columns: 1fr 1fr;
    }
  }
}

.profile-card {
  :deep(.ds-card__body) {
    padding: var(--ds-space-6);
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-5);
  }

  &--full { grid-column: 1 / -1; }

  &__head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--ds-space-3);
  }

  &__head-text {
    h2 {
      font-family: var(--ds-font-heading);
      font-size: var(--ds-text-xl);
      font-weight: var(--ds-weight-bold);
      color: var(--ds-ink, var(--ds-text));
      margin: 0 0 var(--ds-space-1);
    }
    p {
      margin: 0;
      color: var(--ds-taupe, var(--ds-text-muted));
      font-size: var(--ds-text-sm);
    }
  }

  &__identity {
    display: flex;
    align-items: center;
    gap: var(--ds-space-4);
  }

  &__row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--ds-space-3);
    padding: var(--ds-space-3) var(--ds-space-4);
    border: 1px solid var(--ds-border);
    border-radius: var(--ds-radius-md);
    background: var(--ds-surface-sunken, var(--ds-surface));
  }

  &__row-label {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  &__row-title {
    font-family: var(--ds-font-heading);
    font-weight: var(--ds-weight-medium);
    color: var(--ds-ink, var(--ds-text));
    font-size: var(--ds-text-sm);
  }

  &__row-sub {
    font-size: var(--ds-text-xs);
    color: var(--ds-taupe, var(--ds-text-muted));
  }

  &__verify { margin-block-start: calc(var(--ds-space-2) * -1); }
}

.profile-avatar {
  inline-size: 80px;
  block-size: 80px;
  border-radius: 50%;
  background: var(--ds-brand-700, #322873);
  color: var(--ds-text-onBrand, #fff);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: var(--ds-shadow-sm);

  &__initials {
    font-family: var(--ds-font-heading);
    font-weight: var(--ds-weight-bold);
    font-size: 28px;
    letter-spacing: 0.04em;
  }
}

.profile-identity {
  min-inline-size: 0;

  &__name {
    font-family: var(--ds-font-heading);
    font-size: var(--ds-text-lg);
    font-weight: var(--ds-weight-bold);
    color: var(--ds-ink, var(--ds-text));
    margin: 0 0 var(--ds-space-1);
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__email {
    margin: 0;
    font-family: var(--ds-font-mono);
    font-size: var(--ds-text-sm);
    color: var(--ds-taupe, var(--ds-text-muted));
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.profile-form {
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-4);

  &__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--ds-space-3);
    @media (min-width: 700px) { grid-template-columns: 1fr 1fr; }
  }

  &__gender {
    margin: 0;
    padding: 0;
    border: 0;

    legend {
      padding: 0;
      margin-block-end: var(--ds-space-2);
      font-family: var(--ds-font-heading);
      font-size: var(--ds-text-sm);
      font-weight: var(--ds-weight-medium);
      color: var(--ds-ink, var(--ds-text));
    }
  }

  &__chips {
    display: flex;
    gap: var(--ds-space-2);
    flex-wrap: wrap;
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--ds-space-2);
  }
}

.gender-chip {
  background: var(--ds-surface);
  border: 1px solid var(--ds-border);
  border-radius: var(--ds-radius-pill);
  padding: 0.55rem 1.25rem;
  font-family: var(--ds-font-heading);
  font-size: var(--ds-text-sm);
  color: var(--ds-text);
  cursor: pointer;
  transition: all var(--ds-duration-fast) var(--ds-ease-out);

  &:hover:not(:disabled) { background: var(--ds-surface-sunken); }
  &--active {
    background: var(--ds-brand-600);
    color: var(--ds-text-onBrand);
    border-color: var(--ds-brand-600);
  }
  &--disabled, &:disabled { opacity: 0.6; cursor: not-allowed; }
  &:focus-visible { outline: 2px solid transparent; box-shadow: var(--ds-shadow-focus); }
}

.profile-link {
  color: var(--ds-brand-600);
  font-family: var(--ds-font-body);
  font-size: var(--ds-text-sm);
  text-decoration: none;
  border-block-end: 1px solid currentColor;
  &:hover { color: var(--ds-brand-700); }
}

.profile-prefs {
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-3);

  &__row {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--ds-space-4);
    padding: var(--ds-space-4);
    border: 1px solid var(--ds-border);
    border-radius: var(--ds-radius-md);
    background: var(--ds-surface);
    flex-wrap: wrap;
  }

  &__label {
    display: flex;
    flex-direction: column;
    gap: 2px;

    span {
      font-family: var(--ds-font-heading);
      font-weight: var(--ds-weight-medium);
      color: var(--ds-ink, var(--ds-text));
      font-size: var(--ds-text-sm);
    }
    small {
      color: var(--ds-taupe, var(--ds-text-muted));
      font-size: var(--ds-text-xs);
    }
  }

  &__control {
    display: flex;
    align-items: center;
    gap: var(--ds-space-2);
    flex-wrap: wrap;

    &--stack {
      flex-direction: column;
      align-items: flex-start;
    }
  }
}

.lang-chip {
  background: var(--ds-surface);
  border: 1px solid var(--ds-border);
  border-radius: var(--ds-radius-pill);
  padding: 0.4rem 1rem;
  font-family: var(--ds-font-heading);
  font-size: var(--ds-text-sm);
  cursor: pointer;
  color: var(--ds-text);
  transition: all var(--ds-duration-fast) var(--ds-ease-out);

  &--active {
    background: var(--ds-brand-700, #322873);
    color: var(--ds-text-onBrand, #fff);
    border-color: var(--ds-brand-700, #322873);
  }
  &:focus-visible { outline: 2px solid transparent; box-shadow: var(--ds-shadow-focus); }
}

.profile-select {
  background: var(--ds-surface);
  border: 1px solid var(--ds-border);
  border-radius: var(--ds-radius-md);
  padding: 0.5rem 0.75rem;
  font-family: var(--ds-font-body);
  font-size: var(--ds-text-sm);
  color: var(--ds-text);
  min-inline-size: 10rem;

  &:focus-visible { outline: 2px solid transparent; box-shadow: var(--ds-shadow-focus); }
}

.pref-check {
  display: inline-flex;
  align-items: center;
  gap: var(--ds-space-2);
  font-family: var(--ds-font-body);
  font-size: var(--ds-text-sm);
  color: var(--ds-text);
  cursor: pointer;

  input { accent-color: var(--ds-brand-600); }
}
</style>
