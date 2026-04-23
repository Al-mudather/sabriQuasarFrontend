<template>
  <main class="profile-page">
    <header class="profile-page__hero">
      <div class="profile-page__hero-inner">
        <img src="~assets/img/big_man.png" alt="" class="profile-page__avatar" />
        <div class="profile-page__hero-text">
          <h1>{{ $t('الملف الشخصي') }}</h1>
          <p v-if="fullName">{{ fullName }}</p>
        </div>
      </div>
    </header>

    <div class="profile-page__layout">
      <AfilliateBord class="profile-page__affiliate" />

      <section class="profile-page__section">
        <header class="profile-page__section-head">
          <h2>{{ $t('بياناتــي') }}</h2>
          <p>{{ $t('حافظ على بياناتك محدّثة للوصول إلى جميع خدمات المنصة.') }}</p>
        </header>

        <form @submit.prevent="UpdateUserProfileData" class="profile-form">
          <div class="profile-form__grid">
            <q-input
              rounded outlined
              v-model="fullName"
              :label="$t('الاسم الحقيقي')"
              hint="Enter your Name in english"
            />
            <q-input
              rounded outlined readonly
              v-model="email"
              type="email"
              :label="$t('البريد الالكتروني')"
            />
            <q-input
              rounded outlined
              v-model="whatsAppNumber"
              :label="whatsAppLabel"
              :hint="$t('ادخل ارقام فقط')"
              mask="################"
            />
            <q-input
              rounded outlined
              v-model="telegramNumber"
              :label="telegramLabel"
              :hint="$t('ادخل ارقام فقط')"
              mask="################"
            />
          </div>

          <fieldset class="profile-form__gender">
            <legend>{{ $t('الجنس') }}</legend>
            <button
              v-for="g in genders"
              :key="g.value"
              type="button"
              class="gender-chip"
              :class="{ 'gender-chip--active': gender === g.value }"
              @click="gender = g.value"
            >
              <img :src="g.icon" alt="" />
              <span>{{ g.label }}</span>
            </button>
          </fieldset>

          <div class="profile-form__actions">
            <ds-button
              type="submit"
              variant="primary"
              size="lg"
              :loading="visible"
            >
              {{ $t('تحديث') }}
            </ds-button>
          </div>
        </form>

        <UpdataCertificateName :certificateNameData="certificateName" class="profile-page__certificate" />
      </section>
    </div>
  </main>
</template>

<script>
import UpdataCertificateName from 'src/components/Profile_managements/UpdataCertificateName.vue'
import AfilliateBord from 'src/components/MyCourses/afilliateBord.vue'
import { GetMyProfileData } from 'src/queries/account_management/query/GetMyProfileData'
import { UpdateUserProfile } from 'src/queries/account_management/mutation/UpdateUserProfile'
import { mapActions } from 'vuex'

export default {
  name: 'Profile',

  components: { UpdataCertificateName, AfilliateBord },

  data () {
    return {
      visible: false,
      certificateName: '',
      fullName: '',
      whatsAppNumber: null,
      telegramNumber: null,
      whatsAppLabel: this.$t('رقم الواتساب اذا وجد'),
      telegramLabel: this.$t('رقم التلجرام اذا وجد'),
      email: '',
      gender: ''
    }
  },

  computed: {
    genders () {
      return [
        { value: 'male',   label: this.$t('ذكــر'),  icon: require('assets/img/male.png') },
        { value: 'female', label: this.$t('أنثـــي'), icon: require('assets/img/female.png') }
      ]
    }
  },

  apollo: {
    me: { query () { return GetMyProfileData } }
  },

  watch: {
    me (value) {
      this.email          = value.email
      this.fullName       = value.fullName
      this.whatsAppNumber = value.phoneNumber2
      this.telegramNumber = value.phoneNumber3
      if (value.certificateName && value.certificateNameConfirm) {
        this.certificateName = value.certificateName
      }
      if (value.gender === 'MALE')   this.gender = 'male'
      if (value.gender === 'FEMALE') this.gender = 'female'
    }
  },

  mounted () { this.setActiveNavAction('PROFILE') },

  methods: {
    ...mapActions('settings', ['setActiveNavAction']),

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
      this.visible = true
      try {
        const result = await this.$apollo.mutate({
          mutation: UpdateUserProfile,
          variables: {
            input: {
              fullName: this.fullName,
              phoneNumber2: this.whatsAppNumber,
              phoneNumber3: this.telegramNumber,
              gender: this.gender
            }
          },
          refetchQueries: [{ query: GetMyProfileData }]
        })
        if (result.data.updateUserProfile.success) {
          this.$q.notify({
            type: 'positive',
            multiLine: true,
            progress: true,
            message: this.$t('تم تحديث بياناتك بنجاح')
          })
          this.$router.push({ name: 'Home' })
        } else if (result.data.updateUserProfile.errors) {
          this.errorHandler(result.data.updateUserProfile.errors)
        }
      } catch (e) { /* apolloProvider surfaces the error toast */ }
      finally { this.visible = false }
    }
  }
}
</script>

<style lang="scss" scoped>
.profile-page {
  background: var(--ds-surface-muted);
  min-block-size: 100vh;
  padding-block-end: var(--ds-space-16);

  &__hero {
    background: linear-gradient(135deg, var(--ds-brand-700), var(--ds-brand-600));
    color: var(--ds-text-onBrand);
    padding: var(--ds-space-10) var(--ds-space-4);
    margin-block-end: var(--ds-space-8);
  }

  &__hero-inner {
    max-inline-size: 1100px;
    margin-inline: auto;
    display: flex;
    align-items: center;
    gap: var(--ds-space-5);
    flex-wrap: wrap;
  }

  &__avatar {
    inline-size: 6rem;
    block-size: 6rem;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.12);
    padding: var(--ds-space-2);
  }

  &__hero-text {
    h1 {
      font-family: var(--ds-font-heading);
      font-size: var(--ds-text-3xl);
      font-weight: var(--ds-weight-bold);
      margin: 0;
    }
    p {
      margin: var(--ds-space-1) 0 0;
      color: rgba(255, 255, 255, 0.85);
      font-size: var(--ds-text-md);
    }
  }

  &__layout {
    max-inline-size: 1100px;
    margin-inline: auto;
    padding-inline: var(--ds-space-3);
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-5);

    @media (min-width: 600px) { padding-inline: var(--ds-space-4); }
  }

  &__section {
    background: var(--ds-surface);
    border: 1px solid var(--ds-border);
    border-radius: var(--ds-radius-lg);
    padding: var(--ds-space-6);
    box-shadow: var(--ds-shadow-xs);
  }

  &__section-head {
    margin-block-end: var(--ds-space-5);
    h2 {
      font-family: var(--ds-font-heading);
      font-size: var(--ds-text-xl);
      font-weight: var(--ds-weight-bold);
      color: var(--ds-text);
      margin: 0 0 var(--ds-space-1);
    }
    p {
      color: var(--ds-text-muted);
      margin: 0;
      font-size: var(--ds-text-sm);
    }
  }

  &__certificate {
    margin-block-start: var(--ds-space-6);
    padding-block-start: var(--ds-space-5);
    border-block-start: 1px solid var(--ds-border);
  }
}

.profile-form {
  &__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--ds-space-4);
    @media (min-width: 700px) {
      grid-template-columns: 1fr 1fr;
    }
  }

  &__gender {
    margin: var(--ds-space-5) 0;
    padding: 0;
    border: 0;

    legend {
      padding: 0;
      margin-block-end: var(--ds-space-2);
      font-family: var(--ds-font-heading);
      font-size: var(--ds-text-sm);
      font-weight: var(--ds-weight-medium);
      color: var(--ds-text);
    }
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--ds-space-3);
  }
}

.gender-chip {
  display: inline-flex;
  align-items: center;
  gap: var(--ds-space-2);
  background: var(--ds-surface);
  border: 1px solid var(--ds-border);
  border-radius: var(--ds-radius-pill);
  padding: 0.55rem 1.15rem;
  font-family: var(--ds-font-heading);
  font-size: var(--ds-text-sm);
  color: var(--ds-text);
  cursor: pointer;
  margin-inline-end: var(--ds-space-2);
  transition: all var(--ds-duration-fast) var(--ds-ease-out);

  img { block-size: 1.1rem; inline-size: auto; }

  &:hover { background: var(--ds-surface-muted); }
  &:focus-visible { outline: 2px solid transparent; box-shadow: var(--ds-shadow-focus); }

  &--active {
    background: var(--ds-brand-600);
    color: var(--ds-text-onBrand);
    border-color: var(--ds-brand-600);
    img { filter: brightness(0) invert(1); }
  }
}
</style>
