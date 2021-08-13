(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[25],{"5a06":function(t,e,o){},e8f1:function(t,e,o){"use strict";o("5a06")},eb2c:function(t,e,o){"use strict";o.r(e);var n=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"confirm"},[n("div",{staticClass:"imaagg"},[n("img",{attrs:{src:o("d284"),alt:""}}),n("p",[t._v(t._s(t.$t("تم تفعيل حسابك يرجى تسجيل الدخول للموقع")))]),n("div",{staticClass:"login"},[n("a",{staticStyle:{cursor:"pointer"},on:{click:t.GotToLoginPage}},[n("h3",[t._v(t._s(t.$t("دخول")))])])])])])},s=[],i=o("9530"),a=o.n(i);let c,r=t=>t;const u=a()(c||(c=r`
mutation VerifyUserAccount($token: String!){
  verifyAccount(
    token:$token,
  ) {
    success, errors
  }
}
`));var l={name:"Home",data(){return{goToLogin:!1}},components:{},methods:{GotToLoginPage(){this.$router.push({name:"login"})}},watch:{"$route.params":{handler:function(t){this.$apollo.mutate({mutation:u,variables:{token:t.token}}).then((t=>{t.data.success&&this.$q.notify({type:"positive",progress:!0,multiLine:!0,position:"top",message:"Your accout has been verified :)"})}))},deep:!0,immediate:!0}}},p=l,m=(o("e8f1"),o("2877")),d=Object(m["a"])(p,n,s,!1,null,null,null);e["default"]=d.exports}}]);