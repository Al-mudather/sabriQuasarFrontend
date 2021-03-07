<template>
  <div>
    <MainNavBar />
    <ShoppingCart />
    <transition
      appear
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
    >
      <router-view></router-view>
    </transition>
    <Footer />
  </div>
</template>

<script>
import MainNavBar from "components/utils/MainNavBar";
import Footer from "src/components/utils/Footer";
import ShoppingCart from "components/Home/Shopping_cart";
import { LocalStorage, Quasar } from 'quasar'

export default {
    name: "MainLayout",
    data() {
        return {};
    },
    components: {
        MainNavBar,
        Footer,
        ShoppingCart
    },
    mounted () {
        const _isEnglish = LocalStorage.getItem('isEnglish') || false

        if (_isEnglish) {
            // TODO: Change the shopping cart elements style when english
            this.changeTheShoppingCarLinksToEnglish ()
            
        } else {
            // TODO: Change the shopping cart elements style when arabic
            this.changeTheShoppingCarLinksToArabic ()
        }
    },
    methods: {
        async changeTheShoppingCarLinksToEnglish () {
            this.$i18n.locale = 'en'
            LocalStorage.set('isEnglish', true)
            const langIso = 'en-us'

            try {
                await import(
                /* webpackInclude: /(de|en-us)\.js$/ */
                'quasar/lang/' + langIso
                )
                .then(lang => {
                    Quasar.lang.set({
                        ...lang.default,
                        rtl: true,
                    })
                })

                // TODO: Change the style of the backet when English
                this.$jquery('.backgroun').css({
                    'transform': 'rotate(180deg)'
                })
                // TODO: Change the style of the backet when English
                this.$jquery('.shoppgCart > .cart svg').css({
                    'transform': 'translate(-20%, -30%)'
                })
                
                this.$jquery('.shoppgCart > .cart h3').css({
                    'transform': 'translate(35%, -100%)'
                })


            }
            catch (err) {
                // Requested Quasar Language Pack does not exist,
                // let's not break the app, so catching 
            }
        },

        changeTheShoppingCarLinksToArabic () {
            const langIso = 'ar'
            this.$i18n.locale = 'ar'
            // TODO: Save the language
            LocalStorage.set('isEnglish', false)

            try {
                Quasar.lang.set({
                    isoName: 'ar',
                    nativeName: 'العربية',
                    // rtl: true,
                })

                this.$jquery('.backgroun').css({
                    'transform': 'rotate(360deg)'
                })

                // TODO: Change the style of the backet when English
                this.$jquery('.shoppgCart > .cart svg').css({
                    'transform': 'translate(0%, 0%)'
                })
                
                this.$jquery('.shoppgCart > .cart h3').css({
                    'transform': 'translate(0%, 0%)'
                })



            }
            catch (err) {
            }
        }

    }
};
</script>
<style lang="scss">
@import "src/css/helpers/_mixins.scss";
@import "src/css/helpers/_variabels.scss";
// .top{
//     background-color: #fff;
//     .search{
//         form{
//             input{
//                 background-color:#FAFAFA;
//             }
//             button{
//             }
//         }
//     }
//     .lang{
//         background-color: #fff;
//         border: 2px solid #ECEAEA;
//         padding: 3px 1px 0 0;
//         h3{
//             color: #474747;
//         }
//     }
// }
/*--- End navbar ---*/

/*--- START cources ---*/
.cources {
  padding: 50px 0;
  margin: 80px 0 50px 0;
  .asid {
    margin: 0 0 50px 0;
    h3 {
      color: $textColor;
      font-size: 17px;
      font-family: "cairoB";
      line-height: 1.7;
      margin: 0;
    }
    .rate {
      background-color: #fb9f94;
      padding: 5px;
      width: 133px;
      height: 38px;
      border-radius: 55px;
      margin: 0 0 4px 0;
      position: relative;
      z-index: 2;
      top: 28px;
      right: 7px;
      img {
        width: auto;
        display: inline-block;
        position: relative;
        top: -14px;
      }
      h3 {
        font-size: 13px;
        font-family: "cairoR";
        color: #fff;
        display: inline-block;
        margin: 0;
        position: relative;
        line-height: 0;
        top: -13px;
      }
    }
    .vidd {
      position: relative;
      right: 20px;
      z-index: 1;
      .mag {
        width: 314px;
        height: 243px;
        border-radius: 47px;
        img {
          width: auto;
        }
      }
      .playy {
        position: absolute;
        width: auto;
        top: 39%;
        left: 48%;
        cursor: pointer;
      }
    }
    .content {
      color: #fff;
      padding: 118px 8px 12px 8px;
      top: -104px;
      text-align: center;
      position: relative;
      margin: 22px 0 0 0;
      border-radius: 43px;
      background-color: #fff;
      @include prefixer(
        box-shadow,
        2px 9px 18.79px 2.21px rgba(147, 147, 147, 0.14),
        webkit moz o ms
      );
      .tow {
        text-align: center;
        display: inline-block;
        margin: 0 0 20px 18px;
        position: relative;
        h3 {
          font-size: 27px;
          font-family: "cairoR";
          color: $textColor;
          margin: 0;
          span {
            color: $yalloColor;
          }
        }
        p {
          font-size: 16px;
          color: $textColor;
          font-family: "cairoR";
        }
        img {
          width: auto;
          margin: -24px 0 0 0;
        }
        hr {
          border: 1px solid #eeeeee;
          width: 41px;
          position: absolute;
          transform: rotate(90deg);
          top: 13px;
          right: 103px;
        }
        .hr-2 {
          right: 71px !important;
        }
      }
      .more {
        position: relative;
        width: 100%;
        height: 214px;
        svg {
          position: absolute;
          top: 0;
          width: 100%;
          left: 5px;
          text-align: center;
        }
        .pric {
          position: relative;
          top: 26px;
          text-align: center;
          h3 {
            color: #f3ecaa;
            font-size: 33px;
            font-family: "cairoR";
            margin: 0 0 7px 0;
            span {
              font-size: 13px;
              color: #f2f2f2;
              margin-left: 10px;
            }
          }
          button {
            background-color: $yalloColor;
            color: $textColor;
            outline: 0;
            height: 53px;
            width: 142px;
          }
        }
        .share {
          position: absolute;
          top: 137px;
          right: 23px;
          width: auto;
          cursor: pointer;
        }
        .addCou {
          position: absolute;
          top: 137px;
          left: 23px;
          width: auto;
          cursor: pointer;
        }
      }
    }
  }

  /*-- detailes --*/
  .detailes {
    padding: 10px;
    border-right: 7px solid #f6f6f6;
    .all {
      margin: 0 0 40px 0;
      .hedd {
        position: relative;
        margin: -13px 0 23px 0;
        .point {
          display: inline-block;
          svg {
            position: absolute;
            top: 0;
            right: -15px;
          }
          img {
            position: absolute;
            top: 10px;
            right: 24px;
          }
        }
        h3 {
          color: $textColor;
          font-size: 18px;
          font-family: "cairoR";
          display: inline-block;
          margin: 17px 55px 0 0;
        }
      }
      p {
        color: #9c9c9c;
        font-size: 16px;
        font-family: "cairoR";
        line-height: 1.7;
        width: 90%;
        margin-right: 39px;
      }
      .pluse {
        margin: 0 50px 17px 0;
        img {
          width: auto;
          display: inline-block;
        }
        h3 {
          display: inline-block;
          color: #9c9c9c;
          font-size: 16px;
          font-family: "cairoR";
        }
      }
      /*colaps*/
      .card {
        margin: 0 0 10px 0;
        border: 0;
        .card-header {
          background-color: #fff;
          border: 0;
          @include prefixer(
            box-shadow,
            2px 9px 18.79px 2.21px rgba(147, 147, 147, 0.14),
            webkit moz o ms
          );
          a {
            color: #9c9c9c;
            font-size: 16px;
            font-family: "cairoR";
            cursor: pointer;
            .linke {
              background-color: #0c7ad8;
              width: 35px;
              height: 31px;
              display: inline-block;
              text-align: center;
              margin-left: 12px;
              line-height: 1.7;
            }
          }
        }
        .info {
          padding: 7px;
          border: 1px solid #f2f2f2;
          .mage {
            background-color: #e8edfe;
            width: 30px;
            height: 27px;
            text-align: center;
            line-height: 1.5;
            margin-left: 10px;
            display: inline-block;
            img {
              width: auto;
            }
          }
          h3 {
            display: inline-block;
            color: #9c9c9c;
            font-size: 15px;
            font-family: "cairoR";
          }
        }
      }
      /* Tetcher */
      .tetch {
        margin: 30px 0 0 0;
        .tech {
          text-align: center;
          margin: 0 0 25px 0;
          img {
            border-radius: 50%;
            width: 80px;
            height: 80px;
            margin: 0 0 14px 0;
          }
          h3 {
            font-size: 18px;
            font-family: "cairoR";
            color: $textColor;
          }
          p {
            margin: 0;
            width: 100%;
          }
        }
      }
    }
    .butDown {
      position: relative;
      margin: 64px auto 69px auto;
      width: 205px;
      text-align: center;
      button {
        outline: 0;
        position: relative;
      }
      .right {
        position: absolute;
        top: -19px;
        right: -19px;
        width: auto;
      }
      .left {
        position: absolute;
        top: 11px;
        left: -19px;
        width: auto;
      }
    }
  }
}
/*---   End cources ---*/
</style>
