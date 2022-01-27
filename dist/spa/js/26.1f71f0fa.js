(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[26],{8590:function(t,e,i){"use strict";i("a871")},"9a21":function(t,e,i){"use strict";i.r(e);var a=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("section",{staticClass:"web"},[i("div",{staticClass:"certificate-box"},[i("div",{staticClass:"container"},[i("div",{staticClass:"row"},[i("div",{staticClass:"col-lg-12"},[i("div",{staticClass:"courc"},[i("h3",[t._v("شهادتـــي")]),t._l(t.myCertificate.edges,(function(e){return i("div",{key:e.node.pk,staticClass:"tabl"},[i("h3",[t._v(t._s(t.$_.get(e,"[node][enrollment][course][title]")||t.$_.get(e,"[node][batch][courseName]")))]),i("div",{staticClass:"butt"},[t.loading?i("q-spinner-clock",{attrs:{color:"primary",size:"2em"}}):i("button",{on:{click:function(i){return t.DOWNLOAD_MY_CERTIFICATE(e)}}},[t._v("تحميـل "),i("img",{attrs:{src:"img/download.png",alt:""}})])],1)])}))],2)])])])])])},s=[],n=i("bc3a"),r=i.n(n),o=i("9530"),l=i.n(o);let c,u=t=>t;const d=l()(c||(c=u`
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
              course {
                id
                pk
                title
              }
            }
            batch {
              id
              pk
              batchName
              courseName
            }
            user {
              id
              pk
              email
              fullName
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
`));var p=i("2f62"),f=i("b06b"),m={name:"CertificatePage",data(){return{loading:!1,myCertificate:[]}},components:{},computed:{...Object(p["c"])("authentication",["user","token"])},apollo:{allCertificates:{query(){return d},variables(){return{filters:JSON.stringify({user__id:this.user.pk})}},update(t){this.myCertificate=t.allCertificates}}},methods:{async DOWNLOAD_MY_CERTIFICATE(t){if(this.user.certificateName){this.loading=!0;try{const e=await r()({method:"GET",url:`${location.origin}/api/enrollment/certificate/download/${t.node.pk}`,responseType:"arraybuffer",headers:{Authorization:`JWT ${this.token}`,"Content-Type":"application/json"}});e.data?(Object(f["a"])(e.config.url),this.loading=!1):this.loading=!1}catch(e){this.loading=!1}}else this.$q.notify({type:"warning",progress:!0,multiLine:!0,position:"top",message:"يجب تعيين إسم شهادة التدريب"}),this.$router.push({name:"user-profile"})}}},h=m,g=(i("8590"),i("2877")),C=i("148b"),b=i("eebe"),k=i.n(b),y=Object(g["a"])(h,a,s,!1,null,null,null);e["default"]=y.exports;k()(y,"components",{QSpinnerClock:C["a"]})},a871:function(t,e,i){}}]);