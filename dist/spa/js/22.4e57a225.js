(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[22],{"295c":function(t,i,s){t.exports=s.p+"img/no_notification.fcdbc1d1.png"},"48e3":function(t,i,s){"use strict";s("a42f")},"714c":function(t,i,s){"use strict";s.r(i);var a=function(){var t=this,i=t._self._c;return i("section",{staticClass:"Notific",staticStyle:{"min-height":"44vh"}},[i("div",{staticClass:"container-fluid"},[i("div",{staticClass:"row justify-center"},[i("div",{staticClass:"col-lg-12"},[i("div",{staticClass:"titel"},[i("img",{attrs:{src:s("6f4c"),alt:""}}),i("h3",[t._v(t._s(t.$t("الإشعارات")))])])]),0==t.$_.get(t.GET_NOTIFICATION_DATA,"totalCount")?i("div",{staticClass:"empty"},[i("img",{attrs:{src:s("295c"),alt:""}}),i("h3",[t._v(" عذرا لا تـوجد إشــعارات فــي الوقــت الحـالــي ")])]):t._e(),t.$_.isEmpty(t.GET_NOTIFICATION_DATA,"edges")?i("div",{staticStyle:{width:"55%"}},t._l(7,(function(t){return i("q-skeleton",{key:t,staticClass:"q-mt-sm",attrs:{height:"100px"}})})),1):i("div",{staticClass:"notifi"},[t._l(t.GET_NOTIFICATION_DATA.edges,(function(t){return i("Notification-Card",{key:t.node.pk,attrs:{notification:t.node}})})),t.$_.get(t.myNotifications,"[pageInfo][hasNextPage]")?i("div",{staticClass:"butDown text-center"},[i("button",{on:{click:t.LOAD_MORE_DATA}},[t._v(t._s(t.$t("عرض المزيد"))),i("img",{staticClass:"q-mr-sm",attrs:{src:s("c593"),alt:""}})])]):t._e()],2)])])])},o=[],e=(s("ddb0"),function(){var t=this,i=t._self._c;return i("transition",{attrs:{appear:"","enter-active-class":"animated fadeIn","leave-active-class":"animated fadeOut"}},[i("div",{staticClass:"notf",staticStyle:{cursor:"pointer"},on:{click:t.goToTheNotificationSource}},[i("div",{staticClass:"row"},[i("div",{staticClass:"col-lg-2"},[i("div",{staticClass:"user"},[i("img",{attrs:{src:s("abc7"),alt:""}})])]),i("div",{staticClass:"col-lg-10 noPadding"},[i("div",{staticClass:"content"},["QUESTION_ASK"===t.notification.type?i("h3",[t._v("\n                "+t._s(t.$t("السؤال :"))+" \n                "),i("span",[t._v(t._s(t.notification.title))])]):"QUESTION_ANS"===t.notification.type?i("h3",[t._v("\n                "+t._s(t.$t("جواب السؤال :"))+" \n                "),i("span",[t._v(t._s(t.notification.title))]),t._v("\n                "+t._s(t.$t("هو :"))+" \n                "),i("span",[t._v(t._s(t.notification.description))])]):"CHECKOUT_DONE"===t.notification.type?i("h3",[t._v("\n                "+t._s(t.notification.description)+" \n                "),i("span",[t._v(t._s(t.$t("تمت عملية الدفع بنجاح يمكنك الان التعلم من خلال لوحتك التعليميه")))])]):t._e()])])])])])}),n=[],c=(s("5319"),s("14d9"),{name:"notificationCard",data(){return{lodash:this.$_,courseID:""}},props:["notification"],mounted(){if("QUESTION_ASK"===this.lodash.get(this.notification,"[type]")||"QUESTION_ANS"===this.lodash.get(this.notification,"[type]")){const t=parseInt(this.lodash.get(this.notification,"[extraData]").split("::")[0].split(" ")[1].replace(">",""));this.courseID=t}},methods:{goToTheNotificationSource(){"QUESTION_ASK"===this.lodash.get(this.notification,"[type]")||"QUESTION_ANS"===this.lodash.get(this.notification,"[type]")?this.$router.push({name:"course-class",params:{pk:this.courseID,id:this.lodash.get(this.notification,"[type]")},query:{tab:"question"}}):"CHECKOUT_DONE"===this.lodash.get(this.notification,"[type]")&&this.$router.push({name:"my-courses"})}}}),r=c,l=s("2877"),d=Object(l["a"])(r,e,n,!1,null,null,null),f=d.exports,u=s("5184");const h=u["a"]`
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
`;var p=s("2f62"),_={name:"Notification",data(){return{myNotifications:"",loading:!1,notificationData:[]}},apollo:{myNotifications:{query:h,variables:{orderBy:["-id"],limit:2},result(t){this.loading=t.loading,t.loading||(this.notificationData=t.data.myNotifications)}}},components:{NotificationCard:f},mounted(){this.setActiveNavAction("NOTIFICATION")},computed:{GET_NOTIFICATION_DATA(){return this.notificationData}},methods:{...Object(p["b"])("settings",["setActiveNavAction"]),async LOAD_MORE_DATA(){await this.$apollo.queries.myNotifications.fetchMore({variables:{cursor:this.myNotifications.pageInfo.endCursor},updateQuery:(t,{fetchMoreResult:i})=>{const s=i.myNotifications.edges,a=i.myNotifications.pageInfo;return s.length?(this.myNotifications={__typename:t.myNotifications.__typename,edges:[...t.myNotifications.edges,...s],pageInfo:a},{myNotifications:this.myNotifications}):t}})}}},m=_,N=(s("48e3"),s("293e")),g=s("eebe"),y=s.n(g),v=Object(l["a"])(m,a,o,!1,null,null,null);i["default"]=v.exports;y()(v,"components",{QSkeleton:N["a"]})},a42f:function(t,i,s){}}]);