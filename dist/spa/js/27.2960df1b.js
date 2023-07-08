(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[27],{"12e6":function(t,e,o){"use strict";o("e67d")},e67d:function(t,e,o){},eb2c:function(t,e,o){"use strict";o.r(e);var s=function(){var t=this,e=t._self._c;return e("div",{staticClass:"confirm"},[e("div",{staticClass:"imaagg"},[e("img",{attrs:{src:o("d284"),alt:""}}),e("p",[t._v(t._s(t.$t("تم تفعيل حسابك يرجى تسجيل الدخول للموقع")))]),e("div",{staticClass:"login"},[e("a",{staticStyle:{cursor:"pointer"},on:{click:t.GotToLoginPage}},[e("h3",[t._v(t._s(t.$t("دخول")))])])])])])},n=[],i=(o("14d9"),o("5184"));const a=i["a"]`
mutation VerifyUserAccount($token: String!){
  verifyAccount(
    token:$token,
  ) {
    success, errors
  }
}
`;var c={name:"Home",data(){return{goToLogin:!1}},components:{},methods:{GotToLoginPage(){this.$router.push({name:"login"})}},watch:{"$route.params":{handler:function(t){this.$apollo.mutate({mutation:a,variables:{token:t.token}}).then((t=>{t.data.success&&this.$q.notify({type:"positive",progress:!0,multiLine:!0,position:"top",message:"Your accout has been verified :)"})}))},deep:!0,immediate:!0}}},r=c,u=(o("12e6"),o("2877")),l=Object(u["a"])(r,s,n,!1,null,null,null);e["default"]=l.exports}}]);