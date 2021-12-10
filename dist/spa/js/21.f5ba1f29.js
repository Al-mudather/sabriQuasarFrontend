(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[21],{"295c":function(t,i,s){t.exports=s.p+"img/no_notification.fcdbc1d1.png"},"714c":function(t,i,s){"use strict";s.r(i);var a=function(){var t=this,i=t.$createElement,a=t._self._c||i;return a("section",{staticClass:"Notific",staticStyle:{"min-height":"44vh"}},[a("div",{staticClass:"container-fluid"},[a("div",{staticClass:"row justify-center"},[a("div",{staticClass:"col-lg-12"},[a("div",{staticClass:"titel"},[a("img",{attrs:{src:s("6f4c"),alt:""}}),a("h3",[t._v(t._s(t.$t("الإشعارات")))])])]),0==t.$_.get(t.GET_NOTIFICATION_DATA,"totalCount")?a("div",{staticClass:"empty"},[a("img",{attrs:{src:s("295c"),alt:""}}),a("h3",[t._v(" عذرا لا تـوجد إشــعارات فــي الوقــت الحـالــي ")])]):t._e(),t.$_.isEmpty(t.GET_NOTIFICATION_DATA,"edges")?a("div",{staticStyle:{width:"55%"}},t._l(7,(function(t){return a("q-skeleton",{key:t,staticClass:"q-mt-sm",attrs:{height:"100px"}})})),1):a("div",{staticClass:"notifi"},[t._l(t.GET_NOTIFICATION_DATA.edges,(function(t){return a("Notification-Card",{key:t.node.pk,attrs:{notification:t.node}})})),t.$_.get(t.myNotifications,"[pageInfo][hasNextPage]")?a("div",{staticClass:"butDown text-center"},[a("button",{on:{click:t.LOAD_MORE_DATA}},[t._v(t._s(t.$t("عرض المزيد"))),a("img",{staticClass:"q-mr-sm",attrs:{src:s("c593"),alt:""}})])]):t._e()],2)])])])},e=[],o=(s("ddb0"),function(){var t=this,i=t.$createElement,a=t._self._c||i;return a("transition",{attrs:{appear:"","enter-active-class":"animated fadeIn","leave-active-class":"animated fadeOut"}},[a("div",{staticClass:"notf",staticStyle:{cursor:"pointer"},on:{click:t.goToTheNotificationSource}},[a("div",{staticClass:"row"},[a("div",{staticClass:"col-lg-2"},[a("div",{staticClass:"user"},[a("img",{attrs:{src:s("abc7"),alt:""}})])]),a("div",{staticClass:"col-lg-10 noPadding"},[a("div",{staticClass:"content"},["QUESTION_ASK"===t.notification.type?a("h3",[t._v("\n                "+t._s(t.$t("السؤال :"))+" \n                "),a("span",[t._v(t._s(t.notification.title))])]):"QUESTION_ANS"===t.notification.type?a("h3",[t._v("\n                "+t._s(t.$t("جواب السؤال :"))+" \n                "),a("span",[t._v(t._s(t.notification.title))]),t._v("\n                "+t._s(t.$t("هو :"))+" \n                "),a("span",[t._v(t._s(t.notification.description))])]):"CHECKOUT_DONE"===t.notification.type?a("h3",[t._v("\n                "+t._s(t.notification.description)+" \n                "),a("span",[t._v(t._s(t.$t("تمت عملية الدفع بنجاح يمكنك الان التعلم من خلال لوحتك التعليميه")))])]):t._e()])])])])])}),n=[],c=(s("5319"),{name:"notificationCard",data(){return{lodash:this.$_,courseID:""}},props:["notification"],mounted(){if("QUESTION_ASK"===this.lodash.get(this.notification,"[type]")||"QUESTION_ANS"===this.lodash.get(this.notification,"[type]")){const t=parseInt(this.lodash.get(this.notification,"[extraData]").split("::")[0].split(" ")[1].replace(">",""));this.courseID=t}},methods:{goToTheNotificationSource(){"QUESTION_ASK"===this.lodash.get(this.notification,"[type]")||"QUESTION_ANS"===this.lodash.get(this.notification,"[type]")?this.$router.push({name:"course-class",params:{pk:this.courseID,id:this.lodash.get(this.notification,"[type]")},query:{tab:"question"}}):"CHECKOUT_DONE"===this.lodash.get(this.notification,"[type]")&&this.$router.push({name:"my-courses"})}}}),r=c,l=s("2877"),d=Object(l["a"])(r,o,n,!1,null,null,null),f=d.exports,u=s("9530"),h=s.n(u);let p,_=t=>t;const m=h()(p||(p=_`
query GetAllMyNotifications($orderBy: [String],$cursor: String, $limit: Int){
	myNotifications(orderBy:$orderBy, after: $cursor, first: $limit){
    totalCount,
    pageInfo {
      startCursor, 
      endCursor,
      hasNextPage,
      hasPreviousPage
    },
    edges{
      node{
        pk,
        title,
        description,
        extraData,
        type,
        source {
          id,
          pk,
          email,
          firstName,
          lastName
        },
        created,
        updated
      }
    }
  }
}
`));var N=s("2f62"),g={name:"Notification",data(){return{myNotifications:"",loading:!1,notificationData:[]}},apollo:{myNotifications:{query:m,variables:{orderBy:["-id"],limit:2},result(t){this.loading=t.loading,t.loading||(this.notificationData=t.data.myNotifications)}}},components:{NotificationCard:f},mounted(){this.setActiveNavAction("NOTIFICATION")},computed:{GET_NOTIFICATION_DATA(){return this.notificationData}},methods:{...Object(N["b"])("settings",["setActiveNavAction"]),async LOAD_MORE_DATA(){await this.$apollo.queries.myNotifications.fetchMore({variables:{cursor:this.myNotifications.pageInfo.endCursor},updateQuery:(t,{fetchMoreResult:i})=>{const s=i.myNotifications.edges,a=i.myNotifications.pageInfo;return s.length?(this.myNotifications={__typename:t.myNotifications.__typename,edges:[...t.myNotifications.edges,...s],pageInfo:a},{myNotifications:this.myNotifications}):t}})}}},y=g,v=(s("b371"),s("293e")),C=s("eebe"),I=s.n(C),T=Object(l["a"])(y,a,e,!1,null,null,null);i["default"]=T.exports;I()(T,"components",{QSkeleton:v["a"]})},b371:function(t,i,s){"use strict";s("e4de")},e4de:function(t,i,s){}}]);