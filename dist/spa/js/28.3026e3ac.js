(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[28],{"0bab":function(e,t,i){"use strict";i("af49")},"9a21":function(e,t,i){"use strict";i.r(t);var s=function(){var e=this,t=e._self._c;return t("section",{staticClass:"web"},[t("div",{staticClass:"certificate-box"},[t("div",{staticClass:"container"},[t("div",{staticClass:"row"},[t("div",{staticClass:"col-lg-12 col-sm-7 col-md-12 col-xs-6"},[t("div",{staticClass:"courc"},[t("h3",[e._v("شهادتـــي")]),e._l(e.myCertificate.edges,(function(i){return t("div",{key:i.node.pk,staticClass:"tabl"},[t("h3",[e._v(e._s(e.$_.get(i,"[node][enrollment][course][title]")||e.$_.get(i,"[node][batch][courseName]")))]),t("h3",[e._v(e._s(e.FORMAT_DATE(e.$_.get(i,"[node][created]"))))]),t("div",{staticClass:"butt"},[e.loading?t("q-spinner-clock",{attrs:{color:"primary",size:"2em"}}):t("button",{on:{click:function(t){return e.DOWNLOAD_MY_CERTIFICATE(i)}}},[e._v("تحميـل "),t("img",{attrs:{src:"img/download.png",alt:""}})])],1)])}))],2)])])])])])},a=[],n=(i("14d9"),i("bc3a")),d=i.n(n),o=i("5184");const r=o["a"]`
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
`;var c=i("2f62"),l=i("a357");const u=i("c1df");var f={name:"CertificatePage",data(){return{loading:!1,myCertificate:[]}},components:{},computed:{...Object(c["c"])("authentication",["user","token"])},apollo:{allCertificates:{query(){return r},variables(){return{filters:JSON.stringify({user__id:this.user.pk})}},update(e){this.myCertificate=e.allCertificates,console.log("dddddddddddddddddddddd"),console.log(this.myCertificate),console.log("dddddddddddddddddddddd")}}},methods:{FORMAT_DATE(e){return e?u(e).format("YYYY-MM-DD HH:mm:ss"):"Not Defined"},async DOWNLOAD_MY_CERTIFICATE(e){if(this.user.certificateName){this.loading=!0;try{const t=await d()({method:"GET",url:`${location.origin}/api/enrollment/certificate/download/${e.node.pk}`,responseType:"arraybuffer",headers:{Authorization:`JWT ${this.token}`,"Content-Type":"application/json"}});if(t.data){const i=`${this.$_.get(e,"[node][enrollment][course][title]")||this.$_.get(e,"[node][batch][courseName]")}-${this.user.username}.pdf`;Object(l["a"])(i,t.data,{encoding:"windows-1252",mimeType:"text/csv;charset=windows-1252;"}),this.loading=!1}else this.loading=!1}catch(t){this.loading=!1}}else this.$q.notify({type:"warning",progress:!0,multiLine:!0,position:"top",message:"يجب تعيين إسم شهادة التدريب"}),this.$router.push({name:"user-profile"})}}},p=f,m=(i("0bab"),i("2877")),h=i("148b"),g=i("eebe"),b=i.n(g),C=Object(m["a"])(p,s,a,!1,null,null,null);t["default"]=C.exports;b()(C,"components",{QSpinnerClock:h["a"]})},af49:function(e,t,i){}}]);