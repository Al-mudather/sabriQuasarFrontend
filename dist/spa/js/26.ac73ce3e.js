(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[26],{8590:function(t,e,i){"use strict";i("a871")},"9a21":function(t,e,i){"use strict";i.r(e);var a=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("section",{staticClass:"web"},[i("div",{staticClass:"certificate-box"},[i("div",{staticClass:"container"},[i("div",{staticClass:"row"},[i("div",{staticClass:"col-lg-12"},[i("div",{staticClass:"courc"},[i("h3",[t._v("شهادتـــي")]),t._l(t.myCertificate.edges,(function(e){return i("div",{key:e.node.pk,staticClass:"tabl"},[i("h3",[t._v(t._s(e.node.enrollment.course.title))]),i("div",{staticClass:"butt"},[t.loading?i("q-spinner-clock",{attrs:{color:"primary",size:"2em"}}):i("button",{on:{click:function(i){return t.DOWNLOAD_MY_CERTIFICATE(e)}}},[t._v("تحميـل "),i("img",{attrs:{src:"img/download.png",alt:""}})])],1)])}))],2)])])])])])},s=[],n=i("bc3a"),r=i.n(n),o=i("9530"),l=i.n(o);let c,d=t=>t;const u=l()(c||(c=d`
query AllCertificates($filters: JSONString) {

  allCertificates(
    filters: $filters
  ) {

      edges {

          node {
            id
            pk
            enrollment {
              pk
              id
              user {
                id
                pk
                email
                fullName
              }
              
              course {
                id
                pk
                title
              }
            }    
            serial
            startDate
            endDate
            issueDate
            period
            totalHours
            isManual
            isReady
            isPrinted
            isPrintable
            #
            created
            updated

          }

      }

  }

}
`));var p=i("2f62");const f=i("19de");var m={name:"CertificatePage",data(){return{loading:!1,myCertificate:[]}},components:{},computed:{...Object(p["c"])("authentication",["user","token"])},apollo:{allCertificates:{query(){return u},variables(){return{filters:JSON.stringify({enrollment__user__id:this.user.pk})}},result(t){t.loading||(this.myCertificate=t.data.allCertificates)}}},methods:{async DOWNLOAD_MY_CERTIFICATE(t){if(this.user.certificateName){this.loading=!0;try{const e=await r()({method:"GET",url:`http://localhost:8000/api/enrollment/certificate/download/${t.node.pk}`,responseType:"arraybuffer",headers:{Authorization:`JWT ${this.token}`,"Content-Type":"application/json"}});e.data?(f(e.data,`${t.node.enrollment.course.title}-${this.user.username}.pdf`),this.loading=!1):this.loading=!1}catch(e){this.loading=!1}}else this.$q.notify({type:"warning",progress:!0,multiLine:!0,position:"top",message:"يجب تعيين إسم شهادة التدريب"}),this.$router.push({name:"user-profile"})}}},h=m,C=(i("8590"),i("2877")),g=i("148b"),y=i("eebe"),b=i.n(y),k=Object(C["a"])(h,a,s,!1,null,null,null);e["default"]=k.exports;b()(k,"components",{QSpinnerClock:g["a"]})},a871:function(t,e,i){}}]);