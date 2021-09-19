<template>
  <div>
    <!--=============== START profile ===============-->
    <section class="profile">
      <div class="container-fluid">
        <div class="row">
          <div class="col-lg-12">
            <div class="titel">
              <img src="~assets/img/tit.png" alt="" />
              <h3>{{$t('الملف الشخصي')}}</h3>
            </div>
          </div>
        </div>
      </div>
      <div class="container">
        <div class="details">
          <div class="row">
            <AfilliateBord />
            <div class="col-lg-3">
              <div class="user">
                <img src="~assets/img/big_man.png" alt="" />
              </div>
            </div>
            <div class="col-lg-7">
              <div class="all">
                <div class="titel">
                  <img src="~assets/img/tit.png" alt="" />
                  <h3>{{$t('بياناتــي')}}</h3>
                </div> 
                <form>
                  <div class="row">
                    <div class="col-lg-6 col-xs-12">
                      <div class="inp">
                        <img src="~assets/img/usser.png" alt="" />
                        <q-input
                            rounded
                            outlined
                            v-model="fullName"
                            hint="Enter your Name in english"
                            :label="$t('الاسم الحقيقي')"
                            :rules="[
                                val => !!val || '* Required',
                            ]"
                        />
                      </div>
                    </div>
                    <div class="col-lg-6 col-xs-12">
                      <div class="inp">
                        <!-- <img src="~assets/img/gmail.png" alt="" /> -->
                        <input
                          v-model="email"
                          type="email"
                          :placeholder="$t('البريد الالكتروني')"
                          disabled
                        />
                      </div>
                    </div>
                    <div class="col-lg-12 col-xs-12">
                      <div class="inp">
                        <!-- <img src="~assets/img/phone-call.png" alt="" /> -->
                        <q-input
                            rounded
                            outlined
                            :label="whatsAppLabel"
                            :hint="$t('ادخل ارقام فقط')"
                            mask="################"
                            v-model="whatsAppNumber"
                        />
                      </div>
                      <div class="inp">
                        <!-- <img src="~assets/img/phone-call.png" alt="" /> -->
                         <q-input
                            rounded 
                            outlined 
                            v-model="telegramNumber" 
                            :hint="$t('ادخل ارقام فقط')"
                            :label="telegramLabel"
                            mask="################"
                        />
                      </div>
                    </div>
                    <div class="type">
                      <div class="male" data-gender="male" @click="setTheGenderToMale">
                        <img src="~assets/img/male.png" alt="" />
                        <h3>{{$t('ذكــر')}}</h3>
                      </div>
                      <div class="male" data-gender="female" @click="setTheGenderToFemale">
                        <img src="~assets/img/female.png" alt="" />
                        <h3>{{$t('أنثـــي')}}</h3>
                      </div>
                    </div>
                  </div>
                  <div
                    disable="1"
                    class="but"
                    @click="UpdateUserProfileData"
                  >
                    <h3>{{$t('تحديث')}}</h3>
                    <img src="~assets/img/Group 734.png" alt="" />
                  </div>
                  <q-inner-loading :showing="visible">
                      <q-spinner-hourglass color="primary" size="70px" />
                  </q-inner-loading>
                </form>
                <!-- 
                  Start of Passowrd Rest
                -->
                <!-- <Password-Reset-Profile /> -->
                <!-- 
                  End of Passowrd Rest
                -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!--=============== End profile ===============-->
  </div>
</template>

<script>
// import PasswordResetProfile from 'src/components/Profile_managements/PasswordResetProfile.vue'
import AfilliateBord from 'src/components/MyCourses/afilliateBord.vue'
import { GetMyProfileData } from "src/queries/account_management/query/GetMyProfileData";
import { UpdateUserProfile } from "src/queries/account_management/mutation/UpdateUserProfile";
import { mapActions } from 'vuex'

export default {
  name: "Home",
  data() {
    return {
      lodash: this.$_,
      visible: false,
      fullName: "",
      phoneNumber: "",
      whatsAppNumber: null,
      whatsAppLabel: this.$t('رقم الواتساب اذا وجد'),
      telegramLabel: this.$t('رقم التلجرام اذا وجد'),
      telegramNumber: null,
      email: "",
      gender: '',
      myAffiliateLink: "",
      errorMessages: [],
      genderOptions: ['male', 'female', 'not_set']
    }
  },
  components: {
    // 'Password-Reset-Profile': PasswordResetProfile
    AfilliateBord
  },

  apollo: {
    me: {
      query() {
        return GetMyProfileData;
      }
    }
  },
 
  watch: {
    me(value) {
      this.email = value.email;
      this.fullName = value.fullName;
      this.gender = value.gender;
      this.whatsAppNumber = value.phoneNumber2;
      this.telegramNumber = value.phoneNumber3;
      
      if (value.gender === "MALE") {
        document.querySelector('[data-gender="female"]').classList.remove("active");
        document.querySelector('[data-gender="male"]').classList.add("active");
        this.gender = 'male'
      } else if (value.gender === "FEMALE") {
        document.querySelector('[data-gender="male"]').classList.remove("active");
        document.querySelector('[data-gender="female"]').classList.add("active");
        this.gender = 'female'
      } else {

      }
    }
  },

  methods: {
    ...mapActions('settings', ['setActiveNavAction']),

    errorHandler(errorsObj) {
      console.log(errorsObj);
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

    setTheGenderToMale () {
      this.gender = 'male'
    },

    setTheGenderToFemale () {
      this.gender = 'female'
    }, 

    UpdateUserProfileData(e) {
      e.preventDefault();
      //////////////////////////////
      // TODO: Update the user data
      //////////////////////////////
      this.visible = true
      try {
        this.$apollo
          .mutate({ 
            mutation: UpdateUserProfile,
            variables: {
              fullName: this.fullName,
              phoneNumber2: this.whatsAppNumber,
              phoneNumber3: this.telegramNumber,
              gender: this.gender
            },
            refetchQueries: [{
              query: GetMyProfileData,
            }]
          })
          .then(result => {
            if (result.data.updateAccount.success) {
              this.$q.notify({
                type: "positive",
                multiLine: true,
                progress: true,
                message: this.$t('تم تحديث بياناتك بنجاح')
              })
              this.$router.push({ name: 'Home' })
            } else if (result.data.updateAccount.errors) {
              this.errorHandler(result.data.updateAccount.errors);
            }
            this.visible = false
          })
          .catch(e => {
            this.visible = false
          });

      } catch {
        this.visible = false
      }
    }
  },

  mounted() {
    //TODO: Save the active link so when render it will be make active again
    this.setActiveNavAction('PROFILE')

    const userTypes = this.$el.querySelectorAll(".type .male");

    let getSiblings = function(e) {
      // for collecting siblings
      let siblings = [];
      // if no parent, return no sibling
      if (!e.parentNode) {
        return siblings;
      }
      // first child of the parent node
      let sibling = e.parentNode.firstChild;
      // collecting siblings
      while (sibling) {
        if (sibling.nodeType === 1 && sibling !== e) {
          siblings.push(sibling);
        }
        sibling = sibling.nextSibling;
      }
      return siblings;
    };

    userTypes.forEach(type => {
      type.addEventListener("click", function() {
        let siblings = getSiblings(this);

        siblings.map(e => {
          e.classList.remove("active");
        });

        this.classList.add("active");
      });
    });
  }
};
</script>
<style lang="scss">
@import "src/assets/css/sass/helpers/_variabels.scss";
@import "src/assets/css/sass/helpers/_mixins.scss";

/*--============= Start profile style =============--*/
.profile {
  padding: 10px;
  margin: 20px 0 45px 0;
  position: relative;
  .titel {
    display: inline-block;
    width: 100%;
    padding: 12px;
    background: #fff;
    margin: 18px 0 16px 0;
    img {
      display: inline-block;
      margin: -9px 0 0 0;
    }
    h3 {
      color: $textColor;
      font-size: 22px;
      font-family: "cairoB";
      line-height: 1.7;
      margin: 0 11px 0 0;
      display: inline-block;
    }
  }
  .details {
    margin: 30px 0 30px 0;
    .bord{
        display: block;
        padding: 15px;
        background-color: #7B86FA;
        border-radius: 14px;
        height: auto;
        margin: 0 0 25px 0;
        position: relative;
        overflow: hidden;
        .money{
            width: auto;
            position: absolute;
            left: 0;
            right: -29px;
            bottom: -46px;
        }
        .all{
            display: none;
            position: relative;
            .price{
                position: relative;
                display: inline-block;
                top: 0;
                width: 100%;
                img{
                    position:absolute;
                    top: 0;
                }
                .hrcooo{
                    right: -16px;
                }
                .hrColor{
                    left: 0;
                }
                h2{
                    color: #fff;
                    font-family: 'cairoR';
                    font-size: 17px;
                }
                h3{
                    color: #FFF067;
                    font-size: 31px;
                    font-family: 'cairoR';
                }
                span{
                    display: inline-block;
                    font-size: 13px;
                    font-family: 'cairoR';
                    color: #fff;
                    margin: 0 0 0 6px;
                }
                .box{
                    text-align: center;
                    width: 78px;
                    background-color: #fff;
                    border-radius: 11px;
                    margin: 12px auto;
                    height: 64px;
                    h3{
                        font-size: 28px;
                        color: #7B86F8;
                        font-family: 'cairoB';
                        margin: 2px 0 3px 0;
                        text-align: center;
                    }
                    span{
                        display: block;
                        color: $textColor;
                        margin: 0;
                    }
                }
            }
            .right{
                h2{
                    text-align: center;
                }
            }
            .linke{
                text-decoration: none;
                margin: 0 20px 0 0;
                position: absolute;
                width: 86px;
                cursor: pointer;
                h3{
                    font-size: 12px;
                    display: inline-block;
                    color: #ffff;
                    font-family: 'cairoR';
                    .mage{
                        width: auto;
                        display: inline-block;
                        margin: 0;
                        position: unset;
                    }
                }
            }
            .share{
                text-align: center;
                margin: 0 0 7px 0;
                padding: 10px;
                form{
                    position: relative;
                    text-align: center;
                    width: 78%;
                    margin: 0 auto;
                    top: 17px;
                    //maxMobile
                    @media(max-width:767px){
                        width: 100%;
                    }
                    input{
                        background-color: #8d96ff;
                        border: none;
                        width: 100%;
                        height: 37px;
                        outline: 0;
                        padding: 0px 29px 0 0;
                        overflow: hidden;
                        border-radius: 100px;
                        font-family: 'cairoR';
                        color: #fff;
                    }
                    button{
                        width: 41px;
                        height: 33px;
                        background-color: #fcc74c;
                        position: absolute;
                        left: 5px;
                        top: 2px;
                        font-size: 16px;
                        outline: 0;
                        img{
                            width: 20px;
                        }
                    }
                }
            }
        }
        /*button*/
        .avvil{
            position: relative;
            display: block;
            text-align: center;
            h3{
                font-family: 'cairoR';
                font-size: 16px;
                line-height: 1.5;
                color: #fcfcfc;
                display: inline-block;
                margin: 5px 0 20px 0;
            }
            button{
                width: 170px;
                height: 47px;
                margin: 0 0 5px 0;
                background-color:#fcc74c;
                color: #fff;
                text-align: center;
                display: inline-block;
                outline: 0;
                transition: all .3s ease-in-out;
                &:hover{
                    background-color: #fcfcfc;
                    color: #fcc74c;
                    border: 1px solid #fcc74c;
                    transform: scale(0.9);
                }
            }
        }
    }
    .load{
        img{
            width: 100%;
            height: 147px;
            //maxMobile
            @media(max-width:767px){
                height: 207px;
            }
        }
    }
    .user {
      //maxMobile
      @media (max-width: 767px) {
        text-align: center;
        margin-bottom: 20px;
      }
      //minSmall
      @media (min-width: 768px) {
        text-align: center;
        margin-bottom: 20px;
      }
      img {
        width: 129px;
        height: 129px;
        border-radius: 50%;
      }
    }
    .all {
      background: #fff;
      padding: 14px;
      border-radius: 28px;
      .password {
        margin: 30px 0 0 0;
      }
      .titel {
        background-color: unset;
        h3 {
          font-size: 18px;
        }
      }
      form {
        .inp {
          position: relative;
          margin-bottom: 15px;
          img {
            position: absolute;
            top: 22px;
            right: 12px;
          }
        }
        .type {
          margin: 15px auto 15px auto;
          .active {
            border: 1px solid #fcc74c;
          }
          .male {
            cursor: pointer;
            background-color: #fff;
            padding: 12px;
            display: inline-block;
            width: 91px;
            height: 94px;
            text-align: center;
            border-radius: 10px;
            margin: 0 0 0 20px;
            box-shadow: 0px 3px 20px #eae8e878;
            h3 {
              font-size: 13px;
              color: $textColor;
              font-family: "cairoR";
              text-align: center;
              margin: 8px 0 5px 0;
            }
          }
        }
        .but {
          margin: 30px auto 24px auto;
          background: #fcd462;
          padding: 5px;
          width: 130px;
          border-radius: 50px;
          text-align: center;
          cursor: pointer;
          h3 {
            display: inline-block;
            color: $textColor;
            font-size: 16px;
            font-family: "cairoR";
            margin: 0;
          }
          img {
            display: inline-block;
            position: relative;
            left: 0;
            right: 21px;
          }
        }
      }
    }
  }
}
/*--============= End profile style =============--*/
</style>
