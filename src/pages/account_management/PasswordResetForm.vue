<template>
  <section class="password">
      <div class="container">
          <div class="row">
              <div class="col-lg-12">
                  <div class="enter">
                      <svg xmlns="http://www.w3.org/2000/svg" width="324.044" height="73.252" viewBox="0 0 324.044 73.252">
                          <g id="Group_415" data-name="Group 415" transform="translate(-522.567 -249.054)">
                            <path id="Path_553" data-name="Path 553" d="M672.194-19.356h-1.928a5.634,5.634,0,0,1-1.656,4,5.635,5.635,0,0,1-4,1.657,5.639,5.639,0,0,1-4-1.657,5.639,5.639,0,0,1-1.657-4,5.641,5.641,0,0,1,1.657-4,5.639,5.639,0,0,1,4-1.657,5.635,5.635,0,0,1,4,1.657,5.634,5.634,0,0,1,1.656,4h1.928a7.585,7.585,0,0,0-7.585-7.586,7.587,7.587,0,0,0-7.587,7.586,7.587,7.587,0,0,0,7.587,7.586A7.585,7.585,0,0,0,672.194-19.356Z" transform="translate(181.626 205.6) rotate(11)" fill="#fbc74b" opacity="0.19"/>
                            <path id="Path_555" data-name="Path 555" d="M623.578-336.84a5.619,5.619,0,0,1-5.619,5.618,5.618,5.618,0,0,1-5.618-5.618,5.619,5.619,0,0,1,5.618-5.619A5.619,5.619,0,0,1,623.578-336.84Z" transform="translate(149.627 515.028) rotate(11)" fill="#fbc74b" opacity="0.19"/>
                            <g id="Group_377" data-name="Group 377" transform="translate(750.866 -256.506) rotate(99)" opacity="0.28">
                              <path id="Path_552" data-name="Path 552" d="M355.693-370.651H354.68a2.957,2.957,0,0,1-.87,2.1,2.959,2.959,0,0,1-2.1.871,2.96,2.96,0,0,1-2.1-.871,2.959,2.959,0,0,1-.871-2.1,2.961,2.961,0,0,1,.871-2.1,2.96,2.96,0,0,1,2.1-.87,2.961,2.961,0,0,1,2.1.87,2.958,2.958,0,0,1,.87,2.1h1.012a3.984,3.984,0,0,0-3.984-3.984,3.985,3.985,0,0,0-3.984,3.984,3.985,3.985,0,0,0,3.984,3.984A3.984,3.984,0,0,0,355.693-370.651Z" transform="translate(194.807 510.621)" fill="#fbc74b"/>
                              <path id="Path_556" data-name="Path 556" d="M79.956-349.4a2.951,2.951,0,0,1-2.951,2.95,2.95,2.95,0,0,1-2.95-2.95,2.95,2.95,0,0,1,2.95-2.95A2.95,2.95,0,0,1,79.956-349.4Z" transform="translate(458.751 478.681)" fill="#fbc74b"/>
                            </g>
                          </g>
                      </svg>
                      <h3>{{$t('تعيين كلمــة مـرور')}}</h3>
                      <form>
                          <div class="row">
                              <div class="col-lg-12 col-xs-12">
                                  <div class="" style="text-align:left" v-if="errorMessages.length > 0">
                                    Please fix these <strong>error first</strong>
                                    <ul>
                                      <li v-for="(message, index) in errorMessages" :key="index">{{message}}<br /></li>
                                    </ul>
                                  </div>
                                  <div class="inp">
                                      <img src="~assets/img/password.png" alt="">
                                    <input v-model="newPassword1" type="password" :placeholder="$t('كلمة المرور')">
                                      <img class="closee" src="~assets/img/eye.png" alt="">
                                  </div>
                                  <div class="inp">
                                      <img src="~assets/img/password.png" alt="">
                                      <input v-model="newPassword2" type="password" :placeholder="$t('إعادة كلمة المرور')">
                                  </div>
                              </div>
                          </div>
                          <div class="next" style="cursor: pointer">
                              <a @click="ResetTheUserPassword">
                                  <svg class="nexx" xmlns="http://www.w3.org/2000/svg" width="61.667" height="54" viewBox="0 0 61.667 54">
                                      <g id="Group_363" data-name="Group 363" transform="translate(0 54)">
                                          <path id="Path_55" data-name="Path 595" d="M61.667-27A23.678,23.678,0,0,0,38-50.667H28.333A23.678,23.678,0,0,0,4.667-27,23.678,23.678,0,0,0,28.333-3.333H38A23.678,23.678,0,0,0,61.667-27Z" fill="#fbc74b" fill-rule="evenodd"/>
                                          <path id="Path_56" data-name="Path 596" d="M28.333-1.333,27,0A27.013,27.013,0,0,1,0-27,27.013,27.013,0,0,1,27-54l1.333,1.333A25.679,25.679,0,0,0,2.667-27,25.679,25.679,0,0,0,28.333-1.333Z" fill="#fbc74b" fill-rule="evenodd"/>
                                      </g>
                                  </svg>
                                  <img src="~assets/img/back.png" alt="">
                              </a>
                          </div>
                      </form>
                  </div>
              </div>
          </div>
      </div>
  </section>
</template>

<script>
import { ResetUserPassword } from 'src/queries/account_management/mutation/ResetUserPassword'
export default {
  name: 'PasswordResetForm',
  data () {
    return {
      newPassword1: '',
      newPassword2: '',
      token: '',
      errorMessages: []
    }
  },
  components: {
  },
  methods: {
    GotToLoginPage () {
      this.$router.push({ name: 'login' })
    },
    errorHandler (errorsObj) {
      console.log(errorsObj)
      for (const key in errorsObj) {
        for (const val of errorsObj[key]) {
          this.errorMessages.push(val.message)
        }
      }
    },
    ResetTheUserPassword () {
      if (this.newPassword1 === this.newPassword2) {
        this.errorMessages = []
        this.$apollo.mutate({
          mutation: ResetUserPassword,
          variables: {
            token: this.token,
            newPassword1: this.newPassword1,
            newPassword2: this.newPassword2
          }
        }).then((res) => {

          if (res.data.passwordReset.success) {
            this.$router.push({ name: 'login' })
            console.log(res.data.passwordReset.success)
          } else if (res.data.passwordReset.errors) this.errorHandler(res.data.passwordReset.errors)
        })
      } else {
        // TODO: empty the errorMessage
        this.errorMessages = []
        this.errorMessages.push('password are not match')
      }
    }
  },
  watch: {
    '$route.params': {
      handler: function (params) {

        this.token = params.token
      },
      deep: true,
      immediate: true
    }
  }
}
</script>
<style lang="scss">
@import "src/css/helpers/_functions.scss";
@import "src/css/helpers/_mixins.scss";
@import "src/css/helpers/_variabels.scss";

.password{
    padding: 50px 0;
    margin: 80px 0 50px 0;
    text-align: center;
    .enter{
        margin: 42px auto;
        max-width: 372px;
        height: auto;
        padding: 20px;
        position: relative;
        svg{
            position: absolute;
            top: 0;
            left: 52px;
            width: auto;
        }
        h3{
            color: $textColor;
            font-size: 18px;
            font-family: 'cairoR';
            margin: 0 0 40px 0;
        }
        form{
            .inp{
                position: relative;
                margin-bottom: 15px;
                img{
                    position: absolute;
                    top: 22px;
                    right: 12px;
                }
                .closee{
                    left: 12px;
                }
            }
            .next{
                position: relative;
                height: 66px;
                margin: 20px 0 -3px 0;
                .nexx{
                    position: absolute;
                    top: 6px;
                    left: 0;
                    width: auto;
                }
                img{
                    position: absolute;
                    width: auto;
                    left: 18px;
                    top: 20px;
                }
            }
        }
    }
}
</style>
