<template>
  <footer>
    <div class="container">
      <div class="row">
        <!--links-->
        <div class="col-lg-4 col-md-4 col-sm-12">
          <div class="links">
            <a
              class="links__link"
              @click="$router.push({ name: 'termsAndConditions' })"
              >{{ isEnglish ? "Terms and Conditions" : "الأحكام والشروط" }}</a
            >
            <a
              class="links__link"
              @click="$router.push({ name: 'privacyPolicy' })"
              >{{ isEnglish ? "Privacy Policy" : "سياسة الخصوصيه" }}</a
            >
          </div>
        </div>
        <!--logo-->
        <div class="col-lg-4 col-md-4 col-sm-12">
          <div class="logo">
            <img src="~assets/img/suppo.png" alt="" />
            <h2>جميع الحقوق محفوظة 2024-2021</h2>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Footer",

  computed: {
    ...mapState("settings", ["isEnglish"]),
  },
};
</script>
<style lang="scss">
.links {
  &__link {
    color: white !important;
    cursor: pointer;
    transition: all 5ms cubic-bezier(0.075, 0.82, 0.165, 1);

    &:hover {
      transform: scale(1.1);
    }
  }
}
/*--- Start Footer ---*/
footer {
  padding: 10px 0;
  margin: 150px 0 0 0;
  .support {
    cursor: pointer;
    text-align: center;
    position: fixed;
    bottom: 27px;
    right: 17px;
    z-index: 5;
    img {
      width: auto;
    }
  }
  .foo {
    background-color: #f9f9f9;
    .copright {
      text-align: center;
      background-color: #f9f9f9;
      width: 173px;
      margin: 0 auto;
      padding: 10px;
      border-radius: 55px;
      position: relative;
      top: -41px;
      h3 {
        font-size: 16px;
        color: #5666b9;
        font-family: "cairoB";
        margin: 0 auto;
        line-height: 1.5;
        position: relative;
        width: 161px;
        top: -35px;
        text-align: center;
        span {
          color: #5666b9;
          font-family: "cairoB";
        }
      }
      .logos {
        position: relative;
        margin: -42px 0 0 0;
        text-align: center;
        img {
          width: auto;
        }
      }
    }
    .method {
      text-align: center;
      margin: -54px 0 0 0;
      ul {
        list-style: none;
        margin: 0;
        h3 {
          color: $textColor;
          font-size: 18px;
          font-family: "cairoR";
          display: inline-block;
          margin-left: 10px;
        }
        li {
          margin-left: 20px;
          display: inline-block;
        }
      }
    }
  }
}
/*--- End Footer ---*/
</style>
