(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[15],{"1f9a":function(t,e,s){"use strict";s("98cf")},"2f83":function(t,e,s){},"98cf":function(t,e,s){},d764:function(t,e,s){"use strict";s("2f83")},f23a:function(t,e,s){"use strict";s.r(e);var a=function(){var t=this,e=t._self._c;return e("AccountHeader",{attrs:{prevRoute:t.prevRoute,dialogName:t.$t("تسجيل الدخول")}},[e("div",{staticClass:"login"},[e("div",{staticClass:"row q-ma-md justify-center"},[e("GoogleAuthentication",{staticClass:"col-11 q-ma-sm",attrs:{label:t.googleLabel,prevRoute:t.prevRoute}}),e("FacebookAuthentication",{staticClass:"col-11 q-ma-sm",attrs:{label:t.facebookLabel,prevRoute:t.prevRoute}})],1),e("div",{staticClass:"text-center textStyle q-mb-md",staticStyle:{cursor:"pointer"},on:{click:t.GO_TO_THE_TERMS_AND_CONDETIONS_PAGE}},[t._v("\n            "+t._s(t.isEnglish?"By using the platform, you agree to the terms and conditions of the platform":"بإستخدامك للمنصه فانت توافق على شروط و احكام المنصه")+"\n        ")]),e("div",{staticClass:"text-center textStyle text-h4 q-mb-md"},[t._v("\n            OR\n        ")]),e("form",{attrs:{id:"loginForm"},on:{submit:function(e){return t.LoginUser(e)}}},[e("div",{staticClass:"row"},[e("div",{staticClass:"col-lg-12 col-xs-12"},[e("div",{staticClass:"inp"},[e("img",{attrs:{src:s("98c0"),alt:""}}),e("input",{directives:[{name:"model",rawName:"v-model",value:t.email,expression:"email"}],staticClass:"input",attrs:{id:"email",type:"email",placeholder:t.$t("الإيميل")},domProps:{value:t.email},on:{input:function(e){e.target.composing||(t.email=e.target.value)}}})]),e("div",{staticClass:"inp"},[e("img",{attrs:{src:s("c119"),alt:""}}),e("input",{directives:[{name:"model",rawName:"v-model",value:t.password,expression:"password"}],staticClass:"input",attrs:{id:"password",type:"password",placeholder:t.$t("كلمة المرور")},domProps:{value:t.password},on:{input:function(e){e.target.composing||(t.password=e.target.value)}}})]),e("div",{staticClass:"forget",staticStyle:{cursor:"pointer"}},[e("h3",[t._v("\n                            "+t._s(t.$t("هل نسيت كلمة"))+"\n                            "),e("a",{on:{click:t.goToPasswordResetPage}},[e("span",{staticClass:"hvr-float-shadow"},[t._v(t._s(t.$t("السر ؟")))])])])])])]),e("div",{staticClass:"next",staticStyle:{cursor:"pointer"}},[e("button",{staticClass:"action_btn",staticStyle:{outline:"none",border:"none",background:"transparent","box-shadow":"none"},attrs:{type:"submit",id:"loginBtn"}},[e("svg",{staticClass:"nexx",attrs:{xmlns:"http://www.w3.org/2000/svg",width:"61.667",height:"54",viewBox:"0 0 61.667 54"}},[e("g",{attrs:{id:"Group_363","data-name":"Group 363",transform:"translate(0 54)"}},[e("path",{attrs:{id:"Path_55","data-name":"Path 595",d:"M61.667-27A23.678,23.678,0,0,0,38-50.667H28.333A23.678,23.678,0,0,0,4.667-27,23.678,23.678,0,0,0,28.333-3.333H38A23.678,23.678,0,0,0,61.667-27Z",fill:"#fbc74b","fill-rule":"evenodd"}}),e("path",{attrs:{id:"Path_56","data-name":"Path 596",d:"M28.333-1.333,27,0A27.013,27.013,0,0,1,0-27,27.013,27.013,0,0,1,27-54l1.333,1.333A25.679,25.679,0,0,0,2.667-27,25.679,25.679,0,0,0,28.333-1.333Z",fill:"#fbc74b","fill-rule":"evenodd"}})])]),e("img",{attrs:{src:s("1faf"),alt:""}})])])]),e("div",{staticClass:"creat"},[e("div",{staticClass:"orr"},[e("svg",{attrs:{xmlns:"http://www.w3.org/2000/svg",width:"39.286",height:"56.942",viewBox:"0 0 39.286 56.942"}},[e("g",{attrs:{id:"Group_288","data-name":"Group 288",transform:"translate(-0.501 78.915)"}},[e("path",{attrs:{id:"Path_598","data-name":"Path 598",d:"M19.172-39.572a1.129,1.129,0,0,0-.069.6,1.467,1.467,0,0,0,.112.305,2.767,2.767,0,0,0,.866.96c1.369,1.009,2.539,1.832,2.838,3.106.226.961,0,2.231-1.159,4.084a12.806,12.806,0,0,0-1.549,3.77,15.694,15.694,0,0,0-.457,4.088.645.645,0,0,1-.6.685.645.645,0,0,1-.685-.6,16.916,16.916,0,0,1,.409-4.484,14.211,14.211,0,0,1,1.651-4.216c.827-1.37,1.1-2.267.923-2.967a2.22,2.22,0,0,0-.824-1.115c-.423-.357-.935-.692-1.47-1.073a3.623,3.623,0,0,1-1.7-2.615,2.2,2.2,0,0,1,.577-1.733,1.418,1.418,0,0,1,1.063-.435l2.777-.1A17.92,17.92,0,0,0,33.262-47.24,17.808,17.808,0,0,0,37.787-59.19,17.815,17.815,0,0,0,32.575-71.8,17.862,17.862,0,0,0,19.966-77.1,17.932,17.932,0,0,0,7.216-71.94,18.062,18.062,0,0,0,1.791-59.19a.645.645,0,0,1-.645.645A.645.645,0,0,1,.5-59.19a19.458,19.458,0,0,1,5.6-13.86,19.591,19.591,0,0,1,13.86-5.865,19.655,19.655,0,0,1,14,5.723,19.7,19.7,0,0,1,5.818,14A19.687,19.687,0,0,1,34.66-45.983a19.646,19.646,0,0,1-12.6,6.349Z",fill:"#e5e5e6","fill-rule":"evenodd"}})])]),e("span",[t._v(t._s(t.$t("أو")))])]),e("a",{staticStyle:{cursor:"pointer"},on:{click:t.goToSignUpPage}},[e("h3",{staticClass:"hvr-float-shadow"},[t._v(t._s(t.$t("إنشـاء حســاب")))])])]),e("q-inner-loading",{attrs:{showing:t.visible}},[e("q-spinner-hourglass",{attrs:{color:"primary",size:"70px"}})],1)],1)])},i=[],o=(s("14d9"),s("5184"));const r=o["a"]`
mutation LoginUser($email:String!, $password: String!){
  tokenAuth(
    # username or email
    email: $email,
    password: $password,
  ) {
    success,
    errors,
    token,
    user {
      id,
      pk
      username,
      email,
      firstName,
      lastName,
      fullName,
      certificateName
      phoneNumber,
      phoneNumber2,
      phoneNumber3,
      verified,
      isAttachmentTransactionManager
      isPyramidAdmin
      isPyramidMarketer
      isInstructor
      userCurrency
    },
    refreshToken
  }
}
`;var n=s("2f62"),l=s("1da5"),c=s("be74"),u=s("ab5e"),h=s("26eb"),p=function(){var t=this,e=t._self._c;return e("div",{staticClass:"social"},[e("q-btn",{staticClass:"full-width",attrs:{label:t.label,icon:"la la-facebook",color:"primary"},on:{click:t.helloFacebookAuth}}),e("q-inner-loading",{attrs:{showing:t.visible}},[e("q-spinner-hourglass",{attrs:{color:"primary",size:"70px"}})],1)],1)},d=[],m=s("560c"),_={name:"FacebookAuthentication",data(){return{visible:!1}},props:["prevRoute","label"],methods:{...Object(n["b"])("authentication",["loginAction"]),...Object(n["b"])("settings",["setCurrencyAction"]),...Object(n["b"])("pyramidManagement",["GET_MY_MARKETING_CODE_ACCOUNT_ACTION","SET_MY_MARKETING_CODE_ACCOUNT_ACTION"]),GoToHomePage(){this.$router.push({name:"Home"})},async IS_THE_USER_HAS_VALED_INROLLMENTS_IN_ANY_COURSE(){try{const t=await this.$apollo.query({query:c["a"]});return t.data.allEnrollmentsForCurrentUser.edges.length>0}catch(t){return!1}},async CHECK_IF_THE_USER_HASE_THE_REGISTERATION_CODE(){try{await this.$apollo.query({query:l["a"]});this.GET_MY_MARKETING_CODE_ACCOUNT_ACTION();const t=await this.IS_THE_USER_HAS_VALED_INROLLMENTS_IN_ANY_COURSE();this.SET_MY_MARKETING_CODE_ACCOUNT_ACTION(""),t?this.$router.push({name:"my-courses"}):this.$router.push({name:"Home"})}catch(t){"GraphQL error: PyramidAffiliate matching query does not exist."==t.message&&(this.$q.notify({type:"positive",progress:!0,multiLine:!0,position:"top",message:"You must inter the registeration code"}),this.$router.push({name:"registeration-code"}))}},loginAuthMutation(t,e,s=""){console.log(" Triggering Apollo "),this.visible=!0,this.$apollo.mutate({mutation:m["a"],variables:{provider:e,accessToken:t,email:s}}).then((t=>{this.visible=!1;const e=t.data.socialAuth;e&&this.loginAction(e).then((()=>{try{const t=e.social.user.userCurrency;t&&("SDG"==t?this.setCurrencyAction("SDG"):this.setCurrencyAction("USD"));let s=e.social.user.email;OneSignal.push((function(){OneSignal.setExternalUserId(s)}))}catch(t){}e.token&&(this.$q.notify({type:"positive",progress:!0,multiLine:!0,position:"top",message:this.$t("تم تسجيل الدخول بنجاح")}),this.CHECK_IF_THE_USER_HASE_THE_REGISTERATION_CODE())}))})).catch((t=>{this.visible=!1}))},helloFacebookAuth(t="facebook"){const e=this.hello;this.$jquery(document).ready((()=>{this.$jquery.ajaxSetup({cache:!0}),this.$jquery.getScript("https://connect.facebook.net/en_US/sdk.js",(()=>{FB.init({appId:"757236575189030",version:"v2.7",cookie:!0,xfbml:!0}),this.$jquery("#loginbutton,#feedbutton").removeAttr("disabled"),FB.logout((t=>{})),FB.login((t=>{"connected"===t.status&&FB.getLoginStatus((t=>{const s=t.authResponse.accessToken;e("facebook").api(`/me?access_token=${s}`).then((t=>{const e=t.email;this.loginAuthMutation(s,"facebook",e)}))}))}),{scope:"email"})}))}))}}},g=_,A=(s("1f9a"),s("2877")),E=s("9c40"),b=s("74f7"),C=s("9149"),f=s("0016"),v=s("eebe"),T=s.n(v),y=Object(A["a"])(g,p,d,!1,null,null,null),S=y.exports;T()(y,"components",{QBtn:E["a"],QInnerLoading:b["a"],QSpinnerHourglass:C["a"],QIcon:f["a"]});var O={data(){return{facebookLabel:"تسجيل الدخول عن طريق ال Facebook",googleLabel:"تسجيل الدخول عن طريق ال Google",email:"",password:"",prevRoute:null,visible:!1,errorMessages:[]}},components:{AccountHeader:u["a"],GoogleAuthentication:h["a"],FacebookAuthentication:S},beforeRouteEnter(t,e,s){s((t=>{t.prevRoute=e.fullPath}))},mounted(){this.isEnglish?(this.facebookLabel="Login using Facebook",this.googleLabel="Login using Google"):(this.facebookLabel="تسجيل الدخول عن طريق ال Facebook",this.googleLabel="تسجيل الدخول عن طريق ال Google")},computed:{...Object(n["d"])("settings",["isEnglish"])},methods:{...Object(n["b"])("authentication",["loginAction"]),...Object(n["b"])("settings",["setCurrencyAction"]),...Object(n["b"])("pyramidManagement",["GET_MY_MARKETING_CODE_ACCOUNT_ACTION","SET_MY_MARKETING_CODE_ACCOUNT_ACTION"]),GO_TO_THE_TERMS_AND_CONDETIONS_PAGE(){this.$router.push({name:"termsAndConditions"})},goToPasswordResetPage(){this.$router.push({name:"password-reset"})},goToSignUpPage(){this.$router.push({name:"signUp"})},reset(){this.email="",this.password=""},errorHandler(t){for(const e in t)for(const s of t[e])this.$q.notify({type:"warning",position:"top",progress:!0,multiLine:!0,message:s.message})},LoginUser(t){t.preventDefault();try{this.visible=!0,this.errorMessages=[],this.$apollo.mutate({mutation:r,variables:{email:this.email,password:this.password}}).then((t=>{if(this.visible=!1,t.data.tokenAuth.success)if(t.data.tokenAuth.user.verified){try{const e=t.data.tokenAuth.user.userCurrency;e&&("SDG"==e?this.setCurrencyAction("SDG"):this.setCurrencyAction("USD"));let s=t.data.tokenAuth.user.email;OneSignal.push((function(){OneSignal.setExternalUserId(s)}))}catch(e){}this.loginAction(t.data.tokenAuth).then((()=>{this.$q.notify({type:"positive",progress:!0,multiLine:!0,position:"top",message:"logged in successfully"}),this.CHECK_IF_THE_USER_HASE_THE_REGISTERATION_CODE()}))}else this.$router.push({name:"password-confirm"});else t.data.tokenAuth.errors&&this.errorHandler(t.data.tokenAuth.errors)})).catch((t=>{this.visible=!1}))}catch(e){this.visible=!1}},async IS_THE_USER_HAS_VALED_INROLLMENTS_IN_ANY_COURSE(){try{const t=await this.$apollo.query({query:c["a"]});return t.data.allEnrollmentsForCurrentUser.edges.length>0}catch(t){return!1}},async CHECK_IF_THE_USER_HASE_THE_REGISTERATION_CODE(){try{await this.$apollo.query({query:l["a"]});this.GET_MY_MARKETING_CODE_ACCOUNT_ACTION();const t=await this.IS_THE_USER_HAS_VALED_INROLLMENTS_IN_ANY_COURSE();this.SET_MY_MARKETING_CODE_ACCOUNT_ACTION(""),t?this.$router.push({name:"my-courses"}):this.$router.push({name:"Home"})}catch(t){"GraphQL error: PyramidAffiliate matching query does not exist."==t.message&&(this.$q.notify({type:"positive",progress:!0,multiLine:!0,position:"top",message:"You must inter the registeration code"}),this.$router.push({name:"registeration-code"}))}}}},N=O,w=(s("d764"),Object(A["a"])(N,a,i,!1,null,null,null));e["default"]=w.exports;T()(w,"components",{QInnerLoading:b["a"],QSpinnerHourglass:C["a"]})}}]);