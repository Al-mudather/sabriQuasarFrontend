(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[21],{4936:function(t,e,i){"use strict";i("c8cb")},"7c45":function(t,e,i){t.exports=i.p+"img/OBJECTS.0a299fa4.png"},"8fc1":function(t,e,i){"use strict";i.r(e);var s=function(){var t=this,e=t._self._c;return e("div",{staticClass:"marketing"},[e("img",{attrs:{src:i("7c45"),alt:""}}),e("h3",[t._v("كود الدخول (الإحالة)")]),e("div",{staticClass:"inp"},[e("q-input",{staticClass:"r_code-input registerationInputCode",attrs:{rounded:"",outlined:"",hint:"registeration code: P01xxxxxx",label:"كود الإحالة"},model:{value:t.r_code,callback:function(e){t.r_code=e},expression:"r_code"}})],1),e("div",{staticClass:"next"},[e("button",{staticStyle:{outline:"none",border:"none",background:"transparent","box-shadow":"none"},attrs:{id:"registerationCodeAction"},on:{click:function(e){return t.REGISTER_THE_USER_WITH_REGISTERATION_CODE(e)}}},[e("svg",{staticClass:"nexx",attrs:{xmlns:"http://www.w3.org/2000/svg",width:"61.667",height:"54",viewBox:"0 0 61.667 54"}},[e("g",{attrs:{id:"Group_363","data-name":"Group 363",transform:"translate(0 54)"}},[e("path",{attrs:{id:"Path_55","data-name":"Path 595",d:"M61.667-27A23.678,23.678,0,0,0,38-50.667H28.333A23.678,23.678,0,0,0,4.667-27,23.678,23.678,0,0,0,28.333-3.333H38A23.678,23.678,0,0,0,61.667-27Z",fill:"#fbc74b","fill-rule":"evenodd"}}),e("path",{attrs:{id:"Path_56","data-name":"Path 596",d:"M28.333-1.333,27,0A27.013,27.013,0,0,1,0-27,27.013,27.013,0,0,1,27-54l1.333,1.333A25.679,25.679,0,0,0,2.667-27,25.679,25.679,0,0,0,28.333-1.333Z",fill:"#fbc74b","fill-rule":"evenodd"}})])]),e("img",{attrs:{src:i("1faf"),alt:""}})])]),e("q-inner-loading",{attrs:{showing:t.visible}},[e("q-spinner-hourglass",{attrs:{color:"primary",size:"70px"}})],1)],1)},n=[],o=(i("14d9"),i("5184"));const a=o["a"]`
mutation JoinPlatform($marketingCode: String!, $input: JoinPlatformInput!) {

  joinPlatform(marketingCode:$marketingCode, input: $input) {

      success,
      errors,
      pyramidAffiliate: instance {
        pk,
        id,
        user {
          id,
          pk,
          email
        }
      },
      clientMutationId

  }

}
`;var r=i("2f62"),l={data(){return{r_code:null,visible:!1}},computed:{...Object(r["d"])("pyramidManagement",["registerationCode"])},beforeDestroy(){this.SET_REGISTERATION_CODE_ACTION("")},mounted(){this.$q.notify({type:"warning",progress:!0,multiLine:!0,position:"top",message:this.$t("قم بإدخال كود التسجيل")}),this.registerationCode.length>4&&(this.r_code=this.registerationCode,this.REGISTER_THE_USER_WITH_REGISTERATION_CODE())},methods:{...Object(r["b"])("pyramidManagement",["SET_REGISTERATION_CODE_ACTION"]),async REGISTER_THE_USER_WITH_REGISTERATION_CODE(t){if(t&&t.preventDefault(),this.r_code)try{this.visible=!0;const t=await this.$apollo.mutate({mutation:a,variables:{marketingCode:this.r_code,input:{}}});this.visible=!1,t.data.joinPlatform.success&&(this.$q.notify({type:"positive",progress:!0,multiLine:!0,position:"top",message:this.$t("مرحبا بك")}),this.SET_REGISTERATION_CODE_ACTION(""),this.GO_TO_HOME_PAGE())}catch(e){"GraphQL error: Pyramid matching query does not exist."==e.message&&(this.$q.notify({type:"negative",progress:!0,multiLine:!0,position:"top",message:this.$t("هذا الكود خاطئ ادخل الكود الصحيح")}),this.$router.push({name:"registeration-code"})),this.visible=!1}else this.$q.notify({type:"negative",position:"top",progress:!0,multiLine:!0,message:"You must enter the registeration code"})},GO_TO_HOME_PAGE(){this.$router.push({name:"Home"})},errorHandler(t){for(const e in t)for(const i of t[e])this.$q.notify({type:"warning",progress:!0,multiLine:!0,position:"top",message:i.message})}}},c=l,d=(i("4936"),i("2877")),p=i("27f9"),u=i("74f7"),m=i("9149"),g=i("8572"),h=i("eebe"),_=i.n(h),f=Object(d["a"])(c,s,n,!1,null,null,null);e["default"]=f.exports;_()(f,"components",{QInput:p["a"],QInnerLoading:u["a"],QSpinnerHourglass:m["a"],QField:g["a"]})},c8cb:function(t,e,i){}}]);