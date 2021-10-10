<template>
<div class="marketing">
      <img src="~assets/img/OBJECTS.png" alt="">
      <h3>كود الدخول (الإحالة)</h3>
      <div class="inp">
           <q-input
              class="r_code-input registerationInputCode"
              rounded
              outlined
              v-model="r_code"
              hint="registeration code: P01xxxxxx"
              label="كود الإحالة"
          />
      </div> 
      <div class="next">
          <button id="registerationCodeAction" @click="REGISTER_THE_USER_WITH_REGISTERATION_CODE($event)" style="outline: none; border: none; background: transparent; box-shadow: none;">
              <svg class="nexx" xmlns="http://www.w3.org/2000/svg" width="61.667" height="54" viewBox="0 0 61.667 54">
                  <g id="Group_363" data-name="Group 363" transform="translate(0 54)">
                      <path id="Path_55" data-name="Path 595" d="M61.667-27A23.678,23.678,0,0,0,38-50.667H28.333A23.678,23.678,0,0,0,4.667-27,23.678,23.678,0,0,0,28.333-3.333H38A23.678,23.678,0,0,0,61.667-27Z" fill="#fbc74b" fill-rule="evenodd"/>
                      <path id="Path_56" data-name="Path 596" d="M28.333-1.333,27,0A27.013,27.013,0,0,1,0-27,27.013,27.013,0,0,1,27-54l1.333,1.333A25.679,25.679,0,0,0,2.667-27,25.679,25.679,0,0,0,28.333-1.333Z" fill="#fbc74b" fill-rule="evenodd"/>
                  </g>
              </svg>
              <img src="~assets/img/back.png" alt="">
          </button>
      </div>
      <q-inner-loading :showing="visible">
        <q-spinner-hourglass color="primary" size="70px" />
      </q-inner-loading>
  </div>
</template>

<script>
import { JoinPlatform } from 'src/queries/pyramid_marketing_management/mutation/JoinPlatform'
import { mapState, mapActions } from 'vuex'

export default {
  data () {
    return {
      r_code: null,
      visible: false
    }
  },

  computed: {
    ...mapState('pyramidManagement',['registerationCode']),
  },

  mounted() {
    this.$q.notify({
      type: 'warning',
      progress: true,
      multiLine: true,
      position: 'top',
      message: this.$t('قم بإدخال كود التسجيل')
    })
    
    if (this.registerationCode) {
      this.r_code = this.registerationCode
      //TODO: Register the student under the marketer
      // this.REGISTER_THE_USER_WITH_REGISTERATION_CODE()
    }
  },
  methods: {
    async REGISTER_THE_USER_WITH_REGISTERATION_CODE (event) {
      event.preventDefault();
      if (this.r_code) {
        //TODO: show the lodder
        try {
          this.visible = true
          const join_res = await this.$apollo.mutate({
              mutation: JoinPlatform,
              variables: {
                marketingCode: this.r_code,
                input: {}
              }
            })
          //TODO: close the loader
          this.visible = false
          if (join_res.data.joinPlatform.success) {
            this.$q.notify({
                type: 'positive',
                progress: true,
                multiLine: true,
                position: 'top',
                message: this.$t('مرحبا بك')
            })
            this.GO_TO_HOME_PAGE()
          }
        } catch (e) {
          if ( e.message == 'GraphQL error: Pyramid matching query does not exist.') {
            this.$q.notify({
                type: 'negative',
                progress: true,
                multiLine: true,
                position: 'top',
                message: this.$t('هذا الكود خاطئ ادخل الكود الصحيح')
            })
            // TODO: Go to code registeration page
            this.$router.push({ name: 'registeration-code' })
          }
          //TODO: close the loader
          this.visible = false
          
        }
      } else {
        this.$q.notify({
          type: 'negative',
          position: 'top',
          progress: true,
          multiLine: true,
          message: 'You must enter the registeration code'
        })
      }
    },

    GO_TO_HOME_PAGE () {
      this.$router.push({ name: 'Home' })
    },

    errorHandler(errorsObj) {
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

  }  
}
</script>

<style lang="scss">
@import 'src/assets/css/sass/helpers/_variabels.scss';
@import 'src/assets/css/sass/helpers/_mixins.scss';
@import 'src/assets/css/account.scss';

/*-- Marketing --*/
.marketing {
  display: block;
  text-align: center;
  max-width: 580px;
  margin: 107px auto 0 auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 31px;
  -webkit-box-shadow: 2px 3px 20px #2323231a;
          box-shadow: 2px 3px 20px #2323231a;
}


.r_code-input {
  @media screen and (max-width: 450px) {
    width: 75% !important;
  }
}

.q-field__messages {
  margin-right: -2rem !important;
}

.marketing img {
  width: 250px;
}

.marketing h3 {
  font-size: 18px;
  font-family: 'airR';
  color: #0C72CB;
  margin: 20px 0 19px 0;
}

.marketing .inp {
  width: 400px;
  margin: 0 auto;
}

.marketing .inp input {
  width: 100%;
  height: 54px;
  // border-radius: 100px;
  // border: 1px solid #E1E1E1;
  padding: 0 12px 0 12px;
  margin: 10px 0 10px 0;
  outline: 0;
}

.marketing .inp input ::-webkit-input-placeholder {
  font-size: 14px;
  font-family: 'cairoR';
  color: #E1E1E1;
}

.marketing .inp input :-ms-input-placeholder {
  font-size: 14px;
  font-family: 'cairoR';
  color: #E1E1E1;
}

.marketing .inp input ::-ms-input-placeholder {
  font-size: 14px;
  font-family: 'cairoR';
  color: #E1E1E1;
}

.marketing .inp input ::placeholder {
  font-size: 14px;
  font-family: 'cairoR';
  color: #E1E1E1;
}

.marketing .next {
  position: relative;
  top: -2rem;
}

.marketing .next .nexx {
  position: absolute;
  top: -50px;
  left: 0;
  width: auto;
}

.marketing .next img {
  position: absolute;
  width: auto;
  left: 18px;
  top: -35px;
}
</style>
