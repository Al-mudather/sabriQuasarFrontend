<template>
  <div class="password">
    <div class="titel">
      <img src="~assets/img/tit.png" alt="" />
      <h3>{{$t('تعيين اسم إستخراج شهادة التدريب')}}</h3>
    </div>
    <form>
      <div class="row">
        <!-- Mohammed almudather Yahya Mohammed Ahmead -->
        <div class="col-lg-12 col-xs-12 q-mt-sm q-mb-sm">
          <q-banner inline-actions class="text-white bg-red">
            تذكر اسمك الرباعي باللغه الإنجليزيه سوف يكتب في الشهاده و لايمكن تغييره مره اخرى... الأفضل كتابة اسمك من جواز السفر .
          </q-banner>
        </div>
        <div class="col-lg-12 col-xs-12">
          <div class="inp">
            <q-input
                rounded
                outlined
                v-model="certificateName"
                hint="The certificat Name"
                :label="$t('الإسم رباعيا باللغه الإنجليزيه للإستخراج الشهاده')"
            />
          </div>
        </div>
        <div  class="col-lg-12 col-xs-12">
          <div class="inp">
            <q-input
                rounded
                outlined
                v-model="certificateNameConfirm"
                hint="The certificat Name Confirm"
                :label="$t('تأكيد الإسم باللغه الإنجليزيه')"
            />
          </div>
        </div>
        <div disable="1" class="but" @click="UPDATA_THE_USER_CERTIFICATE_NAME">
          <h3>تعيين</h3>
          <img src="~assets/img/Group 734.png" alt="" />
        </div>
      </div>
    </form>
    <q-inner-loading :showing="visible">
        <q-spinner-hourglass color="primary" size="70px" />
    </q-inner-loading>
  </div>
</template>

<script>
import { UpdateCertificateNameQuery } from "src/queries/account_management/mutation/UpdateCertificateName";
import { GetMyProfileData } from "src/queries/account_management/query/GetMyProfileData";

export default {
  name: "UpdataCertificateName",
  data() {
    return {
      visible: false,
      certificateName: null,
      certificateNameConfirm: null,
    };
  },
  methods: {

    errorHandler(errorsObj) {
      for (const key in errorsObj) {
        for (const val of errorsObj[key]) {
          this.errorMessages.push(val.message);
        }
      }
    },

    MAKE_SURE_THE_CERTIFCATE_NAME_AND_THE_CERTIFCATE_NAME_CONFIRM_ARE_MATCHED () {
      if (this.certificateName == this.certificateNameConfirm) {
        return true
      }
      this.$q.notify({
        type: "negative",
        multiLine: true,
        progress: true,
        message: this.$t('اسمك الرباعي غير متطابق')
      })
      return false
    },

    resetTheField () {
      this.certificateName = null
      this.certificateNameConfirm = null
    },

    UPDATA_THE_USER_CERTIFICATE_NAME(e) {
      e.preventDefault();
      ///////////////////////////////////////////
      // TODO: IF the password need to be changed
      ///////////////////////////////////////////
      const res = this.MAKE_SURE_THE_CERTIFCATE_NAME_AND_THE_CERTIFCATE_NAME_CONFIRM_ARE_MATCHED()
      if (res) {
        this.visible = true
        try {
          this.$apollo
            .mutate({
              mutation: UpdateCertificateNameQuery,
              variables: {
                input: {
                  certificateName: this.certificateName.toUpperCase() , //TODO: Change the name to the upperCase
                  certificateNameConfirm: this.certificateNameConfirm.toUpperCase() //TODO: Change the confirm name to the upperCase
                }
              },
              refetchQueries: [{
                query: GetMyProfileData,
              }]
            })
            .then(result => {
              this.visible = false
              const success = this.$_.get(result, '[data][updateCertificateName][success]')
              const errors = this.$_.get(result, '[data][updateCertificateName][errors]')
              if (success) {
                this.resetTheField()
                // TODO: Notifiy the user by the changes
                this.$q.notify({
                  type: "positive",
                  multiLine: true,
                  progress: true,
                  message: "Certificate Name was set successfully"
                })
              } else if (errors) {
                
                this.errorHandler(errors);
              }
            }).catch(e=> {
              this.visible = false
            });

        } catch {
          this.visible = false
        }
      }
    }
  }
};
</script>

<style lang="scss">
</style>
