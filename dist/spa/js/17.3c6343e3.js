(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[17],{"0005":function(t,s,a){},"3edf":function(t,s,a){"use strict";a.r(s);var e=function(){var t=this,s=t._self._c;return s("q-layout",{staticClass:"web"},[s("user-nav-bar"),t.openMenu?s("Menu"):t._e(),s("q-page-container",[s("transition",{attrs:{appear:"","enter-active-class":"animated fadeIn","leave-active-class":"animated fadeOut"}},[s("router-view")],1)],1),s("Footer")],1)},n=[],i=function(){var t=this,s=t._self._c;return s("section",{staticClass:"navv"},[s("div",{staticClass:"container-fluid"},[s("div",{staticClass:"row"},[s("div",{staticClass:"col-lg-12"},[s("div",{staticClass:"menu",staticStyle:{cursor:"pointer"},on:{click:t.changeMenuState}},[s("img",{attrs:{src:a("7738"),alt:""}})]),t.lodash.get(t.user,"[firstName]")?s("div",{staticClass:"user"},[s("img",{attrs:{src:a("abc7"),alt:""}}),s("h3",[t._v("\n            "+t._s(t.lodash.get(t.user,"[firstName]"))+"\n            "+t._s(t.lodash.get(t.user,"[lastName]"))+"\n          ")])]):t.lodash.get(t.user,"[username]")?s("div",{staticClass:"user"},[s("img",{attrs:{src:a("abc7"),alt:""}}),s("h3",[t._v(t._s(t.lodash.get(t.user,"[username]")))])]):s("div",{staticClass:"user heading"},[t._v("\n          "+t._s(t.lodash.get(t.user,"[email]"))+"\n        ")])])])])])},r=[],c=a("2f62"),o={name:"CoursesNavBar",data(){return{lodash:this.$_,myNotifications:[]}},computed:{...Object(c["d"])("authentication",["user","token"])},methods:{...Object(c["b"])("settings",["setIsEnglishAction","setOpenMenuAction"]),changeMenuState(){this.setOpenMenuAction(!0)}}},h=o,l=(a("c9ee"),a("2877")),u=Object(l["a"])(h,i,r,!1,null,null,null),g=u.exports,p=a("0977"),d=a("05a4"),m=a("18d6"),f=a("b05d"),v={name:"MainLayout",data(){return{}},components:{Menu:d["a"],Footer:p["a"],UserNavBar:g},computed:{...Object(c["d"])("settings",["openMenu","isEnglish"])},mounted(){const t=m["a"].getItem("isEnglish");t?this.changeTheShoppingCarLinksToEnglish(t):this.changeTheShoppingCarLinksToArabic(t)},watch:{isEnglish(t){t?this.changeTheShoppingCarLinksToEnglish(t):this.changeTheShoppingCarLinksToArabic(t)}},methods:{...Object(c["b"])("settings",["setIsEnglishAction"]),async changeTheShoppingCarLinksToEnglish(t){this.$i18n.locale="en",this.setIsEnglishAction(t);const s="en-us";try{await a("302e")("./"+s).then((t=>{f["a"].lang.set({...t.default,rtl:!0})})),this.$jquery(".backgroun").css({transform:"rotate(180deg)"}),this.$jquery(".shoppgCart > .cart svg").css({transform:"translate(-20%, -30%)"}),this.$jquery(".shoppgCart > .cart h3").css({transform:"translate(35%, -100%)"}),this.$jquery(".shoppgCart > .cart > .notifc").css({transform:"translate(0%,0%)"})}catch(e){}},changeTheShoppingCarLinksToArabic(t){this.$i18n.locale="ar",this.setIsEnglishAction(t);try{f["a"].lang.set({isoName:"ar",nativeName:"العربية"}),this.$jquery(".backgroun").css({transform:"rotate(360deg)"}),this.$jquery(".shoppgCart > .cart svg").css({transform:"translate(0%, 0%)"}),this.$jquery(".shoppgCart > .cart h3").css({transform:"translate(0%, 0%)"}),this.$jquery(".shoppgCart > .cart > .notifc").css({transform:"translate(0%,0%)"})}catch(s){}}}},b=v,C=(a("9eb6"),a("4d5a")),y=a("09e3"),j=a("eebe"),_=a.n(j),k=Object(l["a"])(b,e,n,!1,null,null,null);s["default"]=k.exports;_()(k,"components",{QLayout:C["a"],QPageContainer:y["a"]})},"9eb6":function(t,s,a){"use strict";a("e86c")},c9ee:function(t,s,a){"use strict";a("0005")},e86c:function(t,s,a){}}]);