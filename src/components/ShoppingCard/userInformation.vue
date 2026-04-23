<template>
  <section class="user-info">
    <header class="user-info__header">
      <h2 class="user-info__title">{{ $t('ادخل معلوماتك الشخصيه') }}</h2>
      <p class="user-info__subtitle">
        {{ $t('نحتاج هذه المعلومات للتواصل معك حول طلبك') }}
      </p>
    </header>

    <form class="user-info__form" @submit.prevent="UPDATE_THE_USER_PROFILE">
      <q-input
        rounded
        outlined
        v-model="fullName"
        :label="$t('Full Name')"
        :hint="$t('Enter your Name in english')"
      />

      <q-input
        rounded
        outlined
        v-model="whatsAppNumber"
        :label="whatsAppLabel"
        mask="################"
      />

      <q-input
        rounded
        outlined
        v-model="telegramNumber"
        :label="telegramLabel"
        mask="################"
      />

      <DsButton
        variant="primary"
        size="lg"
        full-width
        :loading="visible"
        :disabled="visible"
        @click.native="UPDATE_THE_USER_PROFILE"
      >
        {{ $t('حفظ و الدهاب الى صفحة البيع') }}
      </DsButton>
    </form>

    <q-inner-loading :showing="visible">
      <q-spinner-hourglass size="70px" />
    </q-inner-loading>
  </section>
</template>

<script>
import { UpdateUserProfile } from 'src/queries/account_management/mutation/UpdateUserProfile'
import { GetMyProfileData } from 'src/queries/account_management/query/GetMyProfileData'

export default {
  name: 'userInformation',

  data () {
    return {
      fullName: null,
      whatsAppNumber: null,
      whatsAppLabel: this.$t('رقم الواتساب اذا وجد'),
      telegramLabel: this.$t('رقم التلجرام اذا وجد'),
      telegramNumber: null,
      visible: false
    }
  },

  async created () {
    const res = await this.$apollo.query({
      query: GetMyProfileData
    })

    if (res.data.me.pk) {
      if (res.data.me.fullName && (res.data.me.phoneNumber2 || res.data.me.phoneNumber3)) {
        this.$q.notify({
          type: 'positive',
          progress: true,
          multiLine: true,
          position: 'top',
          message: 'بياناتك الشخصيه مكتمله'
        })
        this.$router.push({ name: 'payment' })
      } else {
        this.$q.notify({
          type: 'warning',
          progress: true,
          multiLine: true,
          position: 'top',
          message: 'الرجاء اكمال بياناتك الشخصيه'
        })
        this.fullName = res.data.me.fullName
        this.whatsAppNumber = res.data.me.phoneNumber2
        this.telegramNumber = res.data.me.phoneNumber3
      }
    }
  },

  methods: {
    errorHandler (errorsObj) {
      if (typeof errorsObj == 'object') {
        for (const key of Object.keys(errorsObj)) {
          for (const val of errorsObj[key]) {
            if (typeof val.message == 'object') {
              this.$q.notify({
                type: 'warning',
                progress: true,
                multiLine: true,
                position: 'top',
                message: val.message.msg
              })
            } else {
              this.$q.notify({
                type: 'warning',
                progress: true,
                multiLine: true,
                position: 'top',
                message: ` ${val.message} : ${key}`
              })
            }
          }
        }
      } else {
        for (const val in errorsObj) {
          if (typeof val.message == 'object') {
            this.$q.notify({
              type: 'warning',
              progress: true,
              multiLine: true,
              position: 'top',
              message: val.message.msg
            })
          } else {
            this.$q.notify({
              type: 'warning',
              progress: true,
              multiLine: true,
              position: 'top',
              message: val.message
            })
          }
        }
      }
    },

    async UPDATE_THE_USER_PROFILE (e) {
      if (e && e.preventDefault) e.preventDefault()
      this.visible = true
      try {
        if (this.fullName && (this.whatsAppNumber || this.telegramNumber)) {
          const res = await this.$apollo.mutate({
            mutation: UpdateUserProfile,
            variables: {
              input: {
                fullName: this.fullName,
                phoneNumber2: this.whatsAppNumber,
                phoneNumber3: this.telegramNumber
              }
            }
          })
          const success = res.data.updateUserProfile.success
          const errors = res.data.updateUserProfile.errors

          this.$q.notify({
            type: 'positive',
            multiLine: true,
            progress: true,
            message: 'Great the data wase updated'
          })
          this.$router.push({ name: 'payment' })
        } else {
          this.visible = false
          this.$q.notify({
            type: 'negative',
            multiLine: true,
            progress: true,
            message: 'يجب ان تكمل بياناتك لكي نستطيع التواصل معك'
          })
        }
      } catch {
        this.visible = false
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
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-2);
    text-align: center;
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
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-4);
  }
}

::v-deep .q-field__label {
  margin-inline-start: var(--ds-space-2);
}
</style>
