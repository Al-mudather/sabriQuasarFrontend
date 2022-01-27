(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[26],{8590:function(e,t,i){"use strict";i("a871")},"9a21":function(e,t,i){"use strict";i.r(t);var a=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("section",{staticClass:"web"},[i("div",{staticClass:"certificate-box"},[i("div",{staticClass:"container"},[i("div",{staticClass:"row"},[i("div",{staticClass:"col-lg-12"},[i("div",{staticClass:"courc"},[i("h3",[e._v("شهادتـــي")]),e._l(e.myCertificate.edges,(function(t){return i("div",{key:t.node.pk,staticClass:"tabl"},[i("h3",[e._v(e._s(e.$_.get(t,"[node][enrollment][course][title]")||e.$_.get(t,"[node][batch][courseName]")))]),i("div",{staticClass:"butt"},[e.loading?i("q-spinner-clock",{attrs:{color:"primary",size:"2em"}}):i("button",{on:{click:function(i){return e.DOWNLOAD_MY_CERTIFICATE(t)}}},[e._v("تحميـل "),i("img",{attrs:{src:"img/download.png",alt:""}})])],1)])}))],2)])])])])])},s=[],n=i("bc3a"),r=i.n(n),o=i("9530"),c=i.n(o);let l,d=e=>e;const u=c()(l||(l=d`
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
`));var p=i("2f62"),f=(i("b06b"),i("a357")),m={name:"CertificatePage",data(){return{loading:!1,myCertificate:[]}},components:{},computed:{...Object(p["c"])("authentication",["user","token"])},apollo:{allCertificates:{query(){return u},variables(){return{filters:JSON.stringify({user__id:this.user.pk})}},update(e){this.myCertificate=e.allCertificates}}},methods:{async DOWNLOAD_MY_CERTIFICATE(e){if(this.user.certificateName){this.loading=!0;try{const t=await r()({method:"GET",url:`${location.origin}/api/enrollment/certificate/download/${e.node.pk}`,responseType:"arraybuffer",headers:{Authorization:`JWT ${this.token}`,"Content-Type":"application/json"}});if(t.data){const i=`${this.$_.get(e,"[node][enrollment][course][title]")||this.$_.get(e,"[node][batch][courseName]")}-${this.user.username}.pdf`;Object(f["a"])(i,t.data,{encoding:"windows-1252",mimeType:"text/csv;charset=windows-1252;"}),this.loading=!1}else this.loading=!1}catch(t){this.loading=!1}}else this.$q.notify({type:"warning",progress:!0,multiLine:!0,position:"top",message:"يجب تعيين إسم شهادة التدريب"}),this.$router.push({name:"user-profile"})}}},h=m,g=(i("8590"),i("2877")),b=i("148b"),C=i("eebe"),y=i.n(C),_=Object(g["a"])(h,a,s,!1,null,null,null);t["default"]=_.exports;y()(_,"components",{QSpinnerClock:b["a"]})},a871:function(e,t,i){}}]);