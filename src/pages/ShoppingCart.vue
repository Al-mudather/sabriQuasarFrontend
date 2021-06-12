<template>
  <section class="backgrou">
    <div class="container">
      <div class="row">
        <div class="clos" @click="closeShoppingCart">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="37.333"
            height="51.431"
            viewBox="0 0 37.333 51.431"
          >
            <path
              id="Path_733"
              data-name="Path 733"
              d="M2.042-41.265a13.881,13.881,0,0,0-.686-8.254A18.792,18.792,0,0,1,0-56.529v-9.138H7.851c-.129,5.6,2.188,8.745,5.436,10.486a11.388,11.388,0,0,0,10.758,0c3.248-1.741,5.566-4.884,5.436-10.487h7.851v9.138a18.792,18.792,0,0,1-1.356,7.01,13.881,13.881,0,0,0-.686,8.254c.38.83.681,1.5.842,1.925a18.474,18.474,0,0,1,1.2,6.569A18.545,18.545,0,0,1,18.8-14.236h-.261A18.545,18.545,0,0,1,0-32.772a18.474,18.474,0,0,1,1.2-6.569C1.361-39.762,1.662-40.435,2.042-41.265Z"
              transform="translate(0 65.667)"
              fill="#fc9685"
              fill-rule="evenodd"
            />
          </svg>
          <img src="~assets/img/close.png" alt="" />
        </div>
        <div class="col-lg-12">
          <section class="tabb">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="270.306"
              height="73.539"
              viewBox="0 0 270.306 73.539"
            >
              <path
                id="Path_643"
                data-name="Path 643"
                d="M76.724-31.722a13,13,0,0,0-17.367,4.87c-.19.347-.4.686-.609,1.021A25.145,25.145,0,0,0,54.924-12.5h-.04a3.529,3.529,0,0,1-1.059,2.515,3.651,3.651,0,0,1-2.559,1.037,3.651,3.651,0,0,1-2.559-1.041,3.528,3.528,0,0,1-1.06-2.514v0a1.708,1.708,0,0,0-1.687-1.684,1.689,1.689,0,0,0-.711.157,31.434,31.434,0,0,1-3.816,1.48,5.212,5.212,0,0,0-3.71,4.947h-.042a5.916,5.916,0,0,1-5.861,5.811h-.1A5.916,5.916,0,0,1,25.86-7.605a5.252,5.252,0,0,0-3.751-4.985,1.968,1.968,0,0,0-1.73.279,1.893,1.893,0,0,0-.786,1.537v7.332A3.474,3.474,0,0,1,16.151,0a3.474,3.474,0,0,1-3.442-3.442V-15.818a3.145,3.145,0,0,0-1.175-2.434.7.7,0,0,0-.73-.09.677.677,0,0,0-.394.611v2.67a2.737,2.737,0,0,1-2.735,2.682H7.652a2.737,2.737,0,0,1-2.711-2.689v-1.645a38.074,38.074,0,0,0-2.748-14.2A30.546,30.546,0,0,1,0-42.312,31.816,31.816,0,0,1,31.764-73.539,31.737,31.737,0,0,1,57.782-59.984a18.085,18.085,0,0,0,6.229,5.527l2.93,1.576A18.085,18.085,0,0,0,87.22-55.028a23.184,23.184,0,0,1,15.119-5.629,23.31,23.31,0,0,1,17.34,7.713,25.345,25.345,0,0,0,18.81,8.367A25.345,25.345,0,0,0,157.3-52.944a23.31,23.31,0,0,1,17.339-7.713,23.31,23.31,0,0,1,17.34,7.713,25.344,25.344,0,0,0,18.813,8.367h0a25.348,25.348,0,0,0,18.814-8.367,23.311,23.311,0,0,1,17.338-7.714,23.482,23.482,0,0,1,23.36,23.36,23.482,23.482,0,0,1-23.36,23.36A23.267,23.267,0,0,1,231.819-19.5a32.4,32.4,0,0,0-21.025-7.75v-.026a32.427,32.427,0,0,0-21.041,7.756,23.107,23.107,0,0,1-15.111,5.584A23.269,23.269,0,0,1,159.514-19.5a32.4,32.4,0,0,0-21.025-7.75v-.026a32.428,32.428,0,0,0-21.041,7.756,23.107,23.107,0,0,1-15.111,5.584A23.48,23.48,0,0,1,81.6-26.617a11.812,11.812,0,0,0-4.919-5.018A.581.581,0,0,0,76.724-31.722Z"
                transform="translate(0 73.539)"
                fill="#2d77d8"
                fill-rule="evenodd"
              />
            </svg>
            <div class="link">
              <div class="lii active" data-cart="cartCourses">
                <img src="~assets/img/cart.png" alt="" />
              </div>
              <div
                class="arrow show"
                data-cart="arrowOfCartCourses"
                style="transform: translate(-3px, -2px)"
              >
                <img src="~assets/img/nexxx.png" alt="" />
              </div>

              <div
                class="lii"
                style="transform: translateX(-4px)"
                data-cart="loginCart"
              >
                <img src="~assets/img/acc.png" alt="" />
              </div>
              <div
                class="arrow"
                data-cart="arrowOfLoginCart"
                style="transform: translate(-9px, -1px)"
              >
                <img src="~assets/img/nexxx.png" alt="" />
              </div>

              <div
                class="lii"
                style="transform: translateX(-9px)"
                data-cart="paymentData"
              >
                <img src="~assets/img/payment.png" alt="" />
              </div>
              <div
                class="arrow"
                data-cart="arrowOfPaymentData"
                style="transform: translate(-7px, -7px)"
              >
                <img src="~assets/img/nexxx.png" alt="" />
              </div>

              <div
                class="lii upp"
                style="transform: translateX(-11px)"
                data-cart="successMessage"
              >
                <img src="~assets/img/accses.png" alt="" />
              </div>
            </div>
          </section>
          <div class="contt">
            <div class="titell">
              <h3>{{ $t("الســـلة") }}</h3>
              <hr />
            </div>
            <div class="row">
              <div class="col-lg-12">
                <router-view></router-view>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { CheckoutSubscription } from "src/queries/notification_management/subscription/CheckoutSubscription";
import { LocalStorage } from "quasar";

import { mapActions } from "vuex";

export default {
  name: "ShoppingCartPage",
  data() {
    return {
      prevRoute: null
    };
  },

  apollo: {
    $subscribe: {
      checkoutSubscription: {
        query: CheckoutSubscription
      }
    }
  },

  mounted() {
    // TODO: import the shooping cart animation
    this.$el.querySelector(".lii.active").nextSibling.classList.add("show");
    this.$root.$on("activateShoppingProgress", cart_name => {
      if (cart_name) {
        const name = `[data-cart="${cart_name}"]`;
        this.$el.querySelector(name).classList.add("active");
        this.$el.querySelector(name).nextSibling.classList.add("show");
      }
    });

    const _isEnglish = LocalStorage.getItem("isEnglish") || false;

    if (_isEnglish) {
      // TODO: Change the shopping cart elements style when english
      this.changeTheShoppingCarLinksToEnglish();
    } else {
      // TODO: Change the shopping cart elements style when arabic
      this.changeTheShoppingCarLinksToArabic();
    }
  },

  beforeDestroy() {
    this.$root.$off("activateShoppingProgress");
  },

  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.prevRoute = from
    })
  },

  methods: {
    ...mapActions("shoppingCart", ["setShoppinCartDialogAction"]),

    changeTheShoppingCarLinksToEnglish() {
      this.$jquery(".tabb svg").css({
        transform: "rotateY(180deg)"
      });

      // TODO: Change the shopping cart arrows
      this.$jquery("[data-cart=arrowOfCartCourses]").css({
        transform: "rotateY(180deg) translate(-50%, -7%)"
      });

      this.$jquery("[data-cart=arrowOfLoginCart]").css({
        transform: "rotateY(180deg) translate(-120%, -5%)"
      });

      this.$jquery("[data-cart=arrowOfPaymentData]").css({
        transform: "rotateY(180deg) translate(-125%, -30%)"
      });

      // TODO: Change the divs
      this.$jquery("[data-cart=loginCart]").css({
        transform: "translateX(15%)"
      });

      this.$jquery("[data-cart=paymentData]").css({
        transform: "translateX(30%)"
      });

      this.$jquery("[data-cart=paymentData]").css({
        transform: "translateX(30%)"
      });

      this.$jquery("[data-cart=successMessage]").css({
        transform: "translate(25%, -1%)"
      });
    },

    changeTheShoppingCarLinksToArabic() {
      // TODO: Change the shopping cart elements style when arabic
      this.$jquery(".tabb svg").css({
        transform: "rotateY(360deg)"
      });

      // TODO: Change the shopping cart arrows
      this.$jquery("[data-cart=arrowOfCartCourses]").css({
        transform: "rotateY(360deg) translate(-3px, -2px)"
      });

      this.$jquery("[data-cart=arrowOfLoginCart]").css({
        transform: "rotateY(360deg) translate(-9px, -1px)"
      });

      this.$jquery("[data-cart=arrowOfPaymentData]").css({
        transform: "rotateY(360deg) translate(-7px, -7px)"
      });

      // TODO: Change the divs
      this.$jquery("[data-cart=loginCart]").css({
        transform: "translateX(-15%)"
      });

      this.$jquery("[data-cart=paymentData]").css({
        transform: "translateX(-30%)"
      });

      this.$jquery("[data-cart=paymentData]").css({
        transform: "translateX(-30%)"
      });

      this.$jquery("[data-cart=successMessage]").css({
        transform: "translate(-25%, 1%)"
      });
    },

    closeShoppingCart() {
      // TODO: if you are in the payment page, go to the page before the shopping page
      if ( this.$route.fullPath === '/cart/payment') {
        this.$router.go(-4)
      } else {
        this.$router.push( this.prevRoute.path || { name: 'Home' })
      }
    }
  }
};
</script>
<style lang="scss">
@import "src/css/helpers/_mixins.scss";
@import "src/css/helpers/_variabels.scss";
/*--- start shopping popup ---*/
.router-link-active {
  background-color: $yalloColor !important;
}

.show {
  opacity: 1;
  transition: all ease-in-out 0.5s;
}

/*--- start shopping popup ---*/
.backgrou {
  display: block;
  min-height: 100vh;
  width: 100%;
  padding: 0 5%;
  background-color: #f5f6ff;
  .clos {
    position: relative;
    margin: 0 auto;
    height: 52px;
    width: 38px;
    cursor: pointer;

    &:hover > svg > path {
      fill: $red-5;   
    }

    svg {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      
      & > path {
        transition: all ease-in-out 0.3s;
      }
    }
    img {
      position: absolute;
      width: auto;
      top: 24px;
      right: 11px;
    }
  }
  .tabb {
    position: relative;
    height: 87px;
    width: 271px;
    margin: 0 auto;
    svg {
      position: absolute;
      top: 12px;
      width: auto;
      left: 0;
    }
    .link {
      position: absolute;
      width: 310px;
      backface-visibility: hidden;
      .arrow {
        position: absolute;
        display: inline-block;
        top: 36px;
        margin: 0 -15px 0 0;
        opacity: 0;
        transition: all ease-in-out 0.5s;
        img {
          width: auto;
        }
      }
      .show {
        opacity: 1;
        transition: all ease-in-out 0.5s;
      }
      .lii {
        // cursor: pointer;
        position: relative;
        top: 33px;
        right: 8px;
        background: #f2f2f9;
        width: 33px;
        height: 33px;
        text-align: center;
        border-radius: 100px;
        line-height: 1.8;
        margin-left: 34px;
        display: inline-block;
      }
      .active {
        background-color: $yalloColor;
        // cursor: pointer;
      }
      .upp {
        top: 18px;
        width: 50px;
        right: 1px;
        height: 50px;
        img {
          position: relative;
          top: 9px;
        }
      }
    }
  }
  .contt {
    background-color: #fff;
    margin: 34px auto;
    max-width: 666px;
    border-radius: 45px;
    height: auto;
    padding: 33px;
    .titell {
      h3 {
        font-size: 18px;
        font-family: "cairoR";
        color: $textColor;
        text-align: right;
      }
      hr {
        margin: 21px auto 29px auto;
        border: 0;
        border-top: 2px solid #f2f2f2;
        max-width: 666px;
      }
    }
    /* courses step */
    .courses {
      display: block;
      .groupp {
        position: relative;
        .man {
          text-align: initial;
          z-index: 1;
          position: relative;
          background-color: #fff;
          padding: 9px 8px 10px 15px;
          border-radius: 31px;
          margin: 0px 0 27px 51px;
          @include prefixer(box-shadow, 2px 7px 9px #9e9e9e36, webkit moz ms);
          .compon {
            display: flex;
            position: relative;
            .mag {
              margin-left: 5px;
              display: inline-block;
              //maxMobile
              @media (max-width: 767px) {
                display: none;
                text-align: center;
                margin: 0 0 26px 0;
              }
              img {
                width: 88px;
                height: 84px;
                border-radius: 20px;
              }
            }
            h2 {
              font-size: 18px;
              font-family: "cairoR";
              color: $textColor;
              margin: 0 5px 10px 0;
              line-height: 1.7;
              @media (max-width: 767px) {
                font-size: 15px;
                text-align: center;
                display: block;
                margin: 10px 0 30px 0;
              }
            }
            h3 {
              color: $yalloColor;
              font-size: 18px;
              font-family: "cairoR";
              text-align: left;
              margin: -22px 0 0px 11px;
              position: absolute;
              left: 0;
              bottom: 0;
              span {
                font-size: 9px;
                font-family: "cairoR";
                color: $textColor;
                margin: 0 0 0 6px;
              }
            }
          }
        }
        .delate {
          width: 97px;
          height: 67px;
          background-color: #f8f8f8;
          border-radius: 51px;
          position: absolute;
          top: 20px;
          left: 1px;
          text-align: center;
          cursor: pointer;
          //maxMobile
          @media (max-width: 767px) {
            top: 11px;
          }
          img {
            width: auto;
            position: relative;
            top: 18px;
            left: -17px;
          }
        }
      }
      .notCources {
        padding: 10px;
        margin: 30px auto 30px auto;
        text-align: center;
        img {
          width: auto;
        }
        p {
          font-size: 18px;
          color: $textColor;
          font-family: "cairoR";
          margin: 30px 0 20px 0;
        }
      }
    }
    /*-- Account --*/
    .dataUser {
      display: block;
      .creatt {
        .logBy {
          margin: 0 auto 26px auto;
          text-align: center;
          .social {
            display: inline-block;
            margin: 0 13px 0 0;
            background-color: #fff;
            padding: 5px;
            @include prefixer(box-shadow, 0px 4px 10px #e4e4e45c, webkit moz o);
            width: 60px;
            height: 42px;
            text-align: center;
            line-height: 1.7;
            border-radius: 36px;
            cursor: pointer;
            img {
              width: auto;
            }
          }
          .login {
            height: 41px;
            color: #926d05;
            background-color: $yalloColor;
            border-radius: 50px;
            padding: 7px 15px;
            text-align: center;
            display: inline-block;
            a {
              text-decoration: none;
              font-size: 16px;
              color: #926d05;
              img {
                margin-left: 0;
              }
              h3 {
                display: inline-block;
                font-size: 16px;
                font-family: "cairoR";
              }
            }
          }
        }
        .creat {
          text-align: center;
          position: relative;
          margin: 28px 0 38px 0;
          .orr {
            position: relative;
            margin: 0 auto;
            max-width: 41px;
            svg {
              position: absolute;
              top: 0;
              left: 0;
            }
            span {
              font-size: 18px;
              color: $textColor;
              font-family: "cairoR";
              position: relative;
              top: 5px;
              left: 1px;
            }
          }
          h3 {
            font-size: 18px;
            color: $textColor;
            font-family: "cairoR";
            display: block;
            text-align: center;
            margin: 38px 0 0 0;
          }
        }
        form {
          position: relative;
          margin: 0;
          overflow: hidden;
          padding: 0 0 0 16px;
          .inp {
            position: relative;
            margin-bottom: 15px;
            img {
              position: absolute;
              top: 17px;
              right: 12px;
            }
            input {
              padding: 10px;
              border: 1px solid #e1e1e1;
              color: $textColor;
              font-size: 17px;
              font-family: "cairoR";
              padding: 0px 37px 0 0;
              height: 50px;
              width: 100%;
              border-radius: 50px;
              outline: none;
              ::placeholder {
                font-size: 14px;
                font-family: "cairoR";
              }
            }
          }
          .terms {
            margin: 0;
            .check {
              position: relative;
              width: 20px;
              height: 19px;
              overflow: hidden;
              display: inline-block;
              label {
                position: relative;
                width: 25px;
                height: 25px;
                z-index: 99;
                cursor: pointer;
                img {
                  width: auto;
                  position: absolute;
                  top: 6px;
                  right: 3px;
                  opacity: 0;
                  transition: all ease-in 0.3s;
                }
              }
              input[type="checkbox"] {
                display: none;
                position: absolute;
                top: 4px;
                right: 3px;
              }
              input:checked ~ label img {
                opacity: 1;
                transition: all ease-in 0.3s;
              }
              svg {
                position: absolute;
                top: 0;
                right: 0;
                width: auto;
              }
            }
            h3 {
              font-size: 11px;
              font-family: "cairoR";
              color: $textColor;
              margin: 0 5px 0 0;
              display: inline-block;
              position: relative;
              top: -5px;
              span {
                color: $yalloColor;
              }
            }
          }
          .but {
            width: 52%;
            height: 47px;
            background-color: #7b86fa;
            margin: 20px auto 0 auto;
            text-align: center;
            @include prefixer(border-radius, 68px, webkit moz o);
            cursor: pointer;
            h3 {
              font-size: 16px;
              font-family: "cairoR";
              text-align: center;
              color: #fff;
              padding: 15px 0 0 0;
              img {
                width: auto;
                margin-left: 6px;
              }
            }
          }
        }
      }
    }
    /*-- Payment Method --*/
    .msPayment {
      display: block;
      .options {
        display: block;
        .sele {
          background-color: #fff;
          cursor: pointer;
          padding: 0 9px 0 0;
          width: 100%;
          height: 81px;
          margin: 0 0 12px 0;
          @include prefixer(border-radius, 98px, webkit moz o);
          @include prefixer(box-shadow, 8px 7px 10px #b9b9b952, webkit moz o);
          img {
            width: auto;
            margin: 0 12px 0 0;
            display: inline-block;
          }
          h3 {
            display: inline-block;
            font-size: 16px;
            font-family: "cairoR";
            margin-right: 10px;
          }
        }
        .active {
          border: 2px solid $yalloColor;
        }
        .edit {
          line-height: 5;
          padding: 0 11px 0 0;
        }
      }
      /*-- details Payment --*/
      .details {
        display: block;
        .error {
          background-color: #f67a66;
          padding: 10px;
          width: 100%;
          height: 41px;
          margin: -17px 0 35px 0;
          @include prefixer(border-radius, 7px, webkit moz o);
          h3 {
            color: #fff;
            font-size: 14px;
            font-family: "cairoR";
            margin: 0;
            img {
              margin-left: 6px;
              width: auto;
            }
          }
        }
        .logoPay {
          margin: -13px 0 11px 0;
          text-align: center;
          img {
            width: auto;
          }
        }
        form {
          position: relative;
          margin: 0;
          overflow: hidden;
          padding: 0 0 0 16px;
          .inp {
            position: relative;
            margin-bottom: 15px;
            img {
              position: absolute;
              top: 13px;
              left: 15px;
              width: auto;
            }
            input {
              padding: 10px;
              color: $textColor;
              font-size: 17px;
              padding: 0px 15px 0 0;
              height: 50px;
              width: 100%;
              border-radius: 50px;
              outline: none;
              border: 1px solid #e1e1e1;
              ::placeholder {
                font-size: 14px;
                font-family: "cairoR";
              }
            }
          }
          .but {
            width: 84%;
            height: 50px;
            background-color: #fcc74c;
            margin: 46px auto 0 auto;
            text-align: center;
            @include prefixer(border-radius, 68px, webkit moz o);
            cursor: pointer;
            h3 {
              font-size: 16px;
              font-family: "cairoR";
              text-align: center;
              color: #fff;
              padding: 15px 0 0 0;
              img {
                width: auto;
                margin-left: 10px;
              }
            }
          }
        }
      }
    }

    /*-- Succsess Payment --*/
    .succses {
      display: block;
      text-align: center;
      h3 {
        font-size: 18px;
        text-align: center;
        margin: 0 0 33px 0;
        color: $textColor;
        font-family: "cairoB";
        span {
          font-size: 18px;
          margin-right: 10px;
          color: #949494;
          font-family: "cairoR";
        }
      }
      .imaagg {
        img {
          width: auto;
        }
        h2 {
          font-family: "cairoB";
          color: #03e88b;
          margin: 11px 0 31px 0;
        }
        p {
          color: #949494;
          font-size: 16px;
          font-family: "cairoR";
          span {
            color: $yalloColor;
            margin-right: 4px;
            cursor: pointer;
          }
        }
      }
    }
    /* Total Price */
    .total {
      margin-top: 90px;

      // margin-top: 90px;
      // width: 69%;
      // left: 0;
      // right: 0;
      // bottom: 46px;
      // margin: 0 auto;
      // padding: 0 5% 0 5%;
      // //maxMobile
      // @media(max-width:767px){
      //     width: 100%;
      // }
      // //maxSmall
      // @media(max-width:991px){
      //     width: 100%;
      // }
      // //minSmall
      // @media(min-width:768px){
      //     width: 100%;
      // }
      // //minLarg
      // @media(min-width:1200px){
      //     width: 69%;
      // }
      .price {
        background-color: #f8f8f8;
        padding: 10px;
        border-radius: 100px;
        width: 84%;
        //maxMobile
        @media (max-width: 767px) {
          width: 76%;
        }
        //minSmall
        @media (min-width: 768px) {
          width: 86%;
        }
        //minLarg
        @media (min-width: 1200px) {
          width: 84%;
        }
        h2 {
          font-size: 18px;
          font-family: "cairoR";
          color: $textColor;
          text-align: right;
          margin: 0 11px 7px 0;
          //maxMobile
          @media (max-width: 767px) {
            font-size: 13px;
          }
        }
        h3 {
          color: $yalloColor;
          font-size: 18px;
          font-family: "cairoR";
          margin: -33px 0 0px -2px;
          background-color: #f2f2f2;
          width: 90px;
          text-align: center;
          padding: 9px;
          float: left;
          border-radius: 55px;
          span {
            font-size: 9px;
            font-family: "cairoR";
            color: $textColor;
            margin: 0 0 0 6px;
          }
        }
      }
      .next {
        position: relative;
        .nexx {
          position: absolute;
          top: -50px;
          left: 0;
          width: auto;
        }
        img {
          position: absolute;
          width: auto;
          left: 18px;
          top: -35px;
        }
      }
    }
  }
}
/*--- End shopping popup ---*/
</style>
