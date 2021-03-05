<template>
  <div class="password">
    <div class="titel">
      <img src="~assets/img/tit.png" alt="" />
      <h3>{{$t('تعيين كلمة مرور جديدة')}}</h3>
    </div>
    <form>
      <div
        class=""
        style="text-align:left"
        v-if="errorMessages.length > 0"
      >
        Please fix these <strong>error first</strong>
        <ul>
          <li
            v-for="(message, index) in errorMessages"
            :key="index"
          >
            {{ message }}<br />
          </li>
        </ul>
      </div>
      <div class="row">
        <div class="col-lg-6 col-sm-6 col-xs-12">
          <div class="inp">
            <img src="~assets/img/password.png" alt="" />
            <input
              v-model="oldPassword"
              type="password"
              :placeholder="$t('كلمة المرور القديمة')"
            />
          </div>
        </div>
        <div class="col-lg-6 col-sm-6 col-xs-12">
          <div class="inp">
            <img src="~assets/img/password.png" alt="" />
            <input
              v-model="newPassword1"
              type="password"
              :placeholder="$t('كلمة المرور الجديدة')"
            />
          </div>
        </div>
        <div class="col-lg-12 col-xs-12">
          <div class="inp">
            <img src="~assets/img/password.png" alt="" />
            <input
              v-model="newPassword2"
              type="password"
              :placeholder="$t('تأكيد كلمة المرور الجديدة')"
            />
          </div>
        </div>
        <div disable="1" class="but" @click="UpdateUserPassowrd">
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
import { ChangeUserPassword } from "src/queries/account_management/mutation/ChangeUserPassword";
import { tokenStorage } from "src/localStorageService";

export default {
  name: "PasswordResetProfile",
  data() {
    return {
      lodash: this.$_,
      visible: false,
      oldPassword: "",
      newPassword1: "",
      newPassword2: "",
      errorMessages: []
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

    resetTheField () {
      this.oldPassword = ''
      this.newPassword1 = ''
      this.newPassword2 = ''
    },

    UpdateUserPassowrd(e) {
      e.preventDefault();
      ///////////////////////////////////////////
      // TODO: IF the password need to be changed
      ///////////////////////////////////////////
      if (this.oldPassword) {
        if (this.newPassword1 === this.newPassword2) {
          this.errorMessages = [];
          this.visible = true
          try {
            this.$apollo
              .mutate({
                mutation: ChangeUserPassword,
                variables: {
                  oldPassword: this.oldPassword,
                  newPassword1: this.newPassword1,
                  newPassword2: this.newPassword2
                }
              })
              .then(result => {
                this.visible = false
                if (result.data.passwordChange.success) {
                  // TODO: Stop the loder
                  
                  // TODO: empty all the fileds
                  this.resetTheField()
                  
                  // TODO: Set the new token
                  tokenStorage.setToken({
                    token: result.data.passwordChange.token,
                    refresh: result.data.passwordChange.refreshToken
                  })

                  // TODO: Notifiy the user by the changes
                  this.$q.notify({
                    type: "positive",
                    multiLine: true,
                    progress: true,
                    message: "Password wase changed successfully"
                  })
                } else if (result.data.passwordChange.errors) {
                  
                  console.log(result.data.passwordChange);

                  this.errorHandler(result.data.passwordChange.errors);
                }
              }).catch(e=> {
                this.visible = false
              });

          } catch {
            this.visible = false
          }
        } else {
          this.errorMessages.push("passwords are not the same");
        }
      }
    }
  }
};
</script>

<style lang="scss">
</style>
