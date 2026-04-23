<template>
  <section class="cert-name">
    <header class="cert-name__head">
      <h2 v-if="certificateNameData">{{ $t('اسم إستخراج شهادة التدريب') }}</h2>
      <h2 v-else>{{ $t('تعيين اسم إستخراج شهادة التدريب') }}</h2>
    </header>

    <q-banner
      v-if="!certificateNameData"
      class="cert-name__banner"
      inline-actions
    >
      {{ $t('تذكر اسمك الرباعي باللغه الإنجليزيه سوف يكتب في الشهاده و لايمكن تغييره مره اخرى... الأفضل كتابة اسمك من جواز السفر.') }}
    </q-banner>

    <form @submit.prevent="UPDATA_THE_USER_CERTIFICATE_NAME" class="cert-name__form">
      <q-input
        rounded outlined
        :readonly="!!certificateNameData"
        v-model="certificateName"
        :label="$t('الإسم رباعيا باللغه الإنجليزيه للإستخراج الشهاده')"
        hint="The certificate Name"
      />
      <q-input
        v-if="!certificateNameData"
        rounded outlined
        v-model="certificateNameConfirm"
        :label="$t('تأكيد الإسم باللغه الإنجليزيه')"
        hint="The certificate Name Confirm"
      />
      <div v-if="!certificateNameData" class="cert-name__actions">
        <ds-button type="submit" variant="primary" :loading="visible">
          {{ $t('تعيين') }}
        </ds-button>
      </div>
    </form>
  </section>
</template>

<script>
import { UpdateCertificateNameQuery } from 'src/queries/account_management/mutation/UpdateCertificateName'
import { GetMyProfileData } from 'src/queries/account_management/query/GetMyProfileData'
import { mapActions } from 'vuex'

export default {
  name: 'UpdataCertificateName',
  props: ['certificateNameData'],

  data () {
    return {
      visible: false,
      certificateName: null,
      certificateNameConfirm: null,
      errorMessages: []
    }
  },

  watch: {
    certificateNameData (data) {
      if (data) this.certificateName = data
    }
  },

  mounted () {
    if (this.certificateNameData) this.certificateName = this.certificateNameData
  },

  methods: {
    ...mapActions('authentication', ['GET_MY_PROFILE_DATA_ACTION']),

    errorHandler (errorsObj) {
      for (const key in errorsObj) {
        for (const val of errorsObj[key]) this.errorMessages.push(val.message)
      }
    },

    resetFields () {
      this.certificateName = null
      this.certificateNameConfirm = null
    },

    async UPDATA_THE_USER_CERTIFICATE_NAME () {
      if (this.certificateName !== this.certificateNameConfirm) {
        this.$q.notify({
          type: 'negative',
          multiLine: true,
          progress: true,
          message: this.$t('اسمك الرباعي غير متطابق')
        })
        return
      }
      this.visible = true
      try {
        const result = await this.$apollo.mutate({
          mutation: UpdateCertificateNameQuery,
          variables: {
            input: {
              certificateName: this.certificateName.toUpperCase(),
              certificateNameConfirm: this.certificateNameConfirm.toUpperCase()
            }
          },
          refetchQueries: [{ query: GetMyProfileData }]
        })
        const success = this.$_.get(result, '[data][updateCertificateName][success]')
        const errors = this.$_.get(result, '[data][updateCertificateName][errors]')
        if (success) {
          this.resetFields()
          this.$q.notify({
            type: 'positive',
            multiLine: true,
            progress: true,
            message: 'Certificate Name was set successfully'
          })
          this.GET_MY_PROFILE_DATA_ACTION()
          this.$q.notify({
            type: 'warning',
            multiLine: true,
            progress: true,
            message: 'يمكنك الذهاب إلى صفحة شهاداتي لتحميل شهادتك'
          })
        } else if (errors) {
          this.errorHandler(errors)
        }
      } catch (e) { /* apolloProvider surfaces error */ }
      finally { this.visible = false }
    }
  }
}
</script>

<style lang="scss" scoped>
.cert-name {
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-4);

  &__head h2 {
    font-family: var(--ds-font-heading);
    font-size: var(--ds-text-lg);
    font-weight: var(--ds-weight-bold);
    color: var(--ds-text);
    margin: 0;
  }

  &__banner {
    background: var(--ds-warning-bg);
    color: var(--ds-warning);
    border-radius: var(--ds-radius-md);
    font-size: var(--ds-text-sm);
    line-height: var(--ds-leading-arabic);
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-3);
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
