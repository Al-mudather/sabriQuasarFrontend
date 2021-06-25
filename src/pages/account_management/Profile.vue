<template>
  <div>
    <!-- <div lass="row justify-center" v-if="lodash.isEmpty(myAffiliateLink)">
      <q-btn @click="AddMeToTheAffiliateProgram" class="col-3" color="primary" label="Join affillite programe" />
    </div> -->
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
                      <div class="inp">
                        <img src="~assets/img/usser.png" alt="" />
                        <input
                          v-model="fullName"
                          type="text"
                          :placeholder="$t('الاسم الحقيقي')"
                        />
                      </div>
                    </div>
                    <div class="col-lg-6 col-xs-12">
                      <div class="inp">
                        <img src="~assets/img/gmail.png" alt="" />
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
                        <img src="~assets/img/phone-call.png" alt="" />
                        <input type="text" v-model="phoneNumber" :placeholder="$t('رقم الهاتف')" />
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
                <Password-Reset-Profile />
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
import PasswordResetProfile from 'src/components/Profile_managements/PasswordResetProfile'

import { GetMyProfileData } from "src/queries/account_management/query/GetMyProfileData";
import { UpdateUserProfile } from "src/queries/account_management/mutation/UpdateUserProfile";
import { JoinAffiliateProgram } from "src/queries/afilliate_management/mutation/JoinAffiliateProgram";
import { mapActions } from 'vuex'

export default {
  name: "Home",
  data() {
    return {
      lodash: this.$_,
      visible: false,
      fullName: "",
      phoneNumber: "",
      email: "",
      myAffiliateLink: "",
      errorMessages: [],
      genderOptions: ['male', 'female', 'not_set']
    }
  },
  components: {
    'Password-Reset-Profile': PasswordResetProfile
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
      this.phoneNumber = value.phoneNumber;
      this.myAffiliateLink = value.affiliateSet.edges[0].node.affiliateLink;
      
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

    ///////////////////////////////////
    // JOIN to the affilliate programme
    ///////////////////////////////////
    AddMeToTheAffiliateProgram() {
      this.errorMessages = [];
      this.$apollo
        .mutate({
          mutation: JoinAffiliateProgram
        })
        .then(result => {
          if ( this.$_.get(result,'[data][joinAffiliateProgram][success]') ) {
            this.myAffiliateLink = location.origin + '/course/' + this.$_.get(result,'[data][joinAffiliateProgram][affiliate][affiliateLink]')
          } else if ( this.$_.get(result,'[data][joinAffiliateProgram][errors]') ) {
            this.errorHandler(this.$_.get(result,'[data][joinAffiliateProgram][errors]'));
          }
        });
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
              phoneNumber: this.phoneNumber,
              gender: this.gender
            }
          })
          .then(result => {
            if (result.data.updateAccount.success) {
              this.$q.notify({
                type: "positive",
                multiLine: true,
                progress: true,
                message: "Profile wase updated"
              })
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
