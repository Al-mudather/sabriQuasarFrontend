(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[28],{"934b":function(e,t,i){},"9a21":function(e,t,i){"use strict";i.r(t);var s=function(){var e=this,t=e._self._c;return t("section",{staticClass:"web"},[t("div",{staticClass:"certificate-box"},[t("div",{staticClass:"container"},[t("div",{staticClass:"row"},[t("div",{staticClass:"col-lg-12 col-sm-7 col-md-12 col-xs-6"},[t("div",{staticClass:"courc"},[t("h3",[e._v("شهادتـــي")]),e._l(e.myCertificate.edges,(function(i){return t("div",{key:i.node.pk,staticClass:"tabl"},[t("h3",[e._v(e._s(e.$_.get(i,"[node][enrollment][course][title]")||e.$_.get(i,"[node][batch][courseName]")))]),t("div",{staticClass:"butt"},[e.loading?t("q-spinner-clock",{attrs:{color:"primary",size:"2em"}}):t("button",{on:{click:function(t){return e.DOWNLOAD_MY_CERTIFICATE(i)}}},[e._v("تحميـل "),t("img",{attrs:{src:"img/download.png",alt:""}})])],1)])}))],2)])])])])])},a=[],n=(i("14d9"),i("bc3a")),r=i.n(n),o=i("5184");const c=o["a"]`
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
`;var l=i("2f62"),d=i("a357"),u={name:"CertificatePage",data(){return{loading:!1,myCertificate:[]}},components:{},computed:{...Object(l["c"])("authentication",["user","token"])},apollo:{allCertificates:{query(){return c},variables(){return{filters:JSON.stringify({user__id:this.user.pk})}},update(e){this.myCertificate=e.allCertificates}}},methods:{async DOWNLOAD_MY_CERTIFICATE(e){if(this.user.certificateName){this.loading=!0;try{const t=await r()({method:"GET",url:`${location.origin}/api/enrollment/certificate/download/${e.node.pk}`,responseType:"arraybuffer",headers:{Authorization:`JWT ${this.token}`,"Content-Type":"application/json"}});if(t.data){const i=`${this.$_.get(e,"[node][enrollment][course][title]")||this.$_.get(e,"[node][batch][courseName]")}-${this.user.username}.pdf`;Object(d["a"])(i,t.data,{encoding:"windows-1252",mimeType:"text/csv;charset=windows-1252;"}),this.loading=!1}else this.loading=!1}catch(t){this.loading=!1}}else this.$q.notify({type:"warning",progress:!0,multiLine:!0,position:"top",message:"يجب تعيين إسم شهادة التدريب"}),this.$router.push({name:"user-profile"})}}},p=u,f=(i("e685"),i("2877")),m=i("148b"),h=i("eebe"),g=i.n(h),b=Object(f["a"])(p,s,a,!1,null,null,null);t["default"]=b.exports;g()(b,"components",{QSpinnerClock:m["a"]})},e685:function(e,t,i){"use strict";i("934b")}}]);