<template>
  <section class="top">
    <div class="container-fluid">
      <div class="row">
        <div class="col-lg-2">
          <!--menu & logo -->
          <div class="minlog" @click="changeMenuState" style="cursor: pointer">
            <div class="menu">
              <img src="~assets/img/menu.png" alt="" />
            </div>
            <!--logo-->
            <div class="logo">
              <img src="~assets/img/logo.png" alt="" />
            </div>
          </div>
        </div>
        <!-- search box -->
        <div class="col-lg-6">
          <div class="search">
            <form @submit="showTheSearchingResult">
              <input
                v-model="search"
                type="text"
                v-bind:placeholder="$t('ما الذي تبحث عنه؟')"
              />
              <button>
                <img src="~assets/img/search.png" />
              </button>
            </form>
          </div>
        </div>
        <!--login $ sign-->
        <div class="col-lg-3">
          <div class="account" v-if="!token">
            <div class="sign m_btn">
              <a @click="GO_TO_SIGN_UP_PAGE" style="cursor: pointer">
                <img src="~assets/img/sign.png" alt="" />
                <h3 class="q-pr-sm">{{ $t("تسجيل حساب") }}</h3>
              </a>
            </div>
            <div class="login m_btn">
              <a @click="GO_TO_LOG_IN_PAGE" style="cursor: pointer">
                <img src="~assets/img/login.png" alt="" />
                <h3 class="q-pr-sm">{{ $t("دخول") }}</h3>
              </a>
            </div>
          </div>
          <div class="account m_btn" v-else>
            <div
              @click="LOG_USER_OUT"
              style="cursor: pointer"
              class="sign logOutBtn mag"
            >
              <div class="mag">
                <img src="~assets/img/enter.png" alt="" />
              </div>
              <h3 class="q-pr-sm">{{ $t("خروج") }}</h3>
            </div>
          </div>
        </div>
        <!-- Language -->
        <div class="col-lg-1">
          <div class="lang">
            <q-toggle
              v-model="_isEnglish"
              icon="language"
              unchecked-icon="clear"
              class="text-white"
              label="Eng"
            />
            <!-- <img src="~assets/img/doown.png" alt="" />
                        <q-toggle v-model="englishLang"/>
                        <h3 class="q-pq-sm">Ar</h3>
                        <div class="contry">
                            <img src="~assets/img/ar.png" alt="" />
                        </div> -->
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { mapGetters, mapState, mapActions } from "vuex";
import { GetAllCourses } from "src/queries/course_management/query/GetAllCourses";
import { Quasar } from "quasar";

export default {
  name: "NavBar",
  data() {
    return {
      search: "",
      visible: false,
      courses: [],
    };
  },
  props: {},
  computed: {
    ...mapGetters("authentication", ["token"]),
    ...mapState("settings", ["isEnglish"]),
    _isEnglish: {
      get() {
        return this.isEnglish;
      },
      set(newVlaue) {
        return this.setIsEnglishAction(newVlaue);
      },
    },
  },

  watch: {
    async isEnglish(value) {
      if (value) {
        this.$i18n.locale = "en";
        this.setIsEnglishAction(value);
        const langIso = "en-us";

        try {
          await import(
            /* webpackInclude: /(de|en-us)\.js$/ */
            "quasar/lang/" + langIso
          ).then((lang) => {
            Quasar.lang.set({
              ...lang.default,
              rtl: true,
            });
          });

          // TODO: Change the style of the backet when English
          this.$jquery(".backgroun").css({
            transform: "rotate(180deg)",
          });
          // TODO: Change the style of the backet when English
          this.$jquery(".shoppgCart > .cart svg").css({
            transform: "translate(-20%, -30%)",
          });

          this.$jquery(".shoppgCart > .cart h3").css({
            transform: "translate(35%, -100%)",
          });

          this.$jquery(".shoppgCart > .cart > .notifc").css({
            transform: "translate(-5%,-43%)",
          });
        } catch (err) {
          // Requested Quasar Language Pack does not exist,
          // let's not break the app, so catching
        }
      } else {
        const langIso = "ar";
        this.$i18n.locale = "ar";
        // TODO: Save the language
        this.setIsEnglishAction(value);

        try {
          Quasar.lang.set({
            isoName: "ar",
            nativeName: "العربية",
            // rtl: true,
          });

          this.$jquery(".backgroun").css({
            transform: "rotate(360deg)",
          });

          // TODO: Change the style of the backet when English
          this.$jquery(".shoppgCart > .cart svg").css({
            transform: "translate(0%, 0%)",
          });

          this.$jquery(".shoppgCart > .cart h3").css({
            transform: "translate(0%, 0%)",
          });

          this.$jquery(".shoppgCart > .cart > .notifc").css({
            transform: "translate(0%,0%)",
          });
        } catch (err) {}
      }
    },
  },

  methods: {
    ...mapActions("authentication", ["logOutAction"]),
    ...mapActions("settings", ["setIsEnglishAction", "setOpenMenuAction"]),
    ...mapActions("shoppingCart", ["deleteShoppinCartDataListAction"]),
    ...mapActions("pyramidManagement", [
      "SET_MY_MARKETING_CODE_ACCOUNT_ACTION",
    ]),

    changeMenuState() {
      this.setOpenMenuAction(true);
    },

    LOG_USER_OUT() {
      //TODO: Delete the marketer code
      this.SET_MY_MARKETING_CODE_ACCOUNT_ACTION("");
      //todo: Remove all the cookies of the tap
      try {
        this.removeCookie();
      } catch (error) {}
      //TODO: Empty the shopping cart
      this.deleteShoppinCartDataListAction();
      //TODO: redirect the user to the home page
      this.logOutAction();
      this.$apollo.provider.defaultClient.resetStore();
      this.$router.push({ name: "Home" });
    },
    removeCookie() {
      const token = "csrftoken";
      // var cookies = this.$cookies.get(token);
      this.$cookies.remove(token);
    },

    showTheSearchingResult(event) {
      event.preventDefault();

      if (!this.$_.isEmpty(this.search)) {
        this.$apollo
          .query({
            query: GetAllCourses,
            variables: {
              title_Icontains: this.search,
            },
          })
          .then((res) => {
            const searchResult = res.data.allCourses.edges.map((course) => {
              return {
                label: course.node.title,
                id: course.node.id,
                pk: course.node.pk,
              };
            });
            if (!this.$_.isEmpty(searchResult)) {
              this.$q
                .bottomSheet({
                  style: {
                    textAlign: "center",
                    padding: "20px",
                    "border-bottom": "1px solid #000 !important",
                  },
                  actions: searchResult,
                })
                .onOk((action) => {
                  // TODO: Go to the course details
                  this.$router.push({
                    name: "course-details",
                    params: {
                      name: action.label.replaceAll(" ", "-"),
                      pk: action.pk,
                      id: action.id,
                    },
                  });
                })
                .onDismiss(() => {
                  // TODO: Clear the search
                  this.search = "";
                });
            } else {
              this.$q.notify({
                color: "negative",
                position: "top",
                progress: true,
                multiLine: true,
                message: this.$t("لا توجد نتائج"),
              });
            }
          });
      } else {
        this.$q.notify({
          type: "warning",
          position: "top",
          progress: true,
          multiLine: true,
          message: this.$t("ما الذي تبحث عنه"),
        });
      }
    },

    GO_TO_SIGN_UP_PAGE() {
      this.$router.push({
        name: "signUp",
        query: { redirect: this.$route.fullPath },
      });
    },

    GO_TO_LOG_IN_PAGE() {
      this.$router.push({
        name: "login",
        query: { redirect: this.$route.fullPath },
      });
    },
  },
};
</script>
<style lang="scss">
.m_btn {
  transition: all 0.5s;
  backface-visibility: hidden;

  &:hover {
    backface-visibility: hidden;
    transform: scale(1.07);
  }
}

.s_btn {
  &,
  &:link,
  &:visited {
    // text-transform: uppercase;
    // text-decoration: none;
    // padding: 0.5rem 0.1rem;
    // display: inline-block;
    // border-radius: 10rem;

    transition: all 0.2s;
    position: relative;
    // font-size: $default-font-size;

    // Change for button element
    border: none;
    cursor: pointer;
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 1rem 2rem rgba($color-black, 0.2);

    &::after {
      transform: scaleX(1.4) scaleY(1.6);
      opacity: 0;
    }
  }

  &:active,
  &:focus {
    outline: none;
    transform: translateY(-1px);
    box-shadow: 0 0.5rem 1rem rgba($color-black, 0.2);
  }

  &--white {
    background-color: $color-white;
    color: $color-gray-dark;

    &::after {
      background-color: $color-white;
    }
  }

  &--green {
    background-color: $color-primary;
    color: $color-white;

    &::after {
      background-color: $color-primary;
    }
  }

  &::after {
    content: "";
    display: inline-block;
    width: 100%;
    height: 100%;
    border-radius: 10rem;

    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
    transition: all 0.4s;
  }

  &--animated {
    animation: moveInBottom 0.5s ease-out 0.75s;
    animation-fill-mode: backwards;
  }
}

.logOutBtn {
  height: 41px;
  width: 137px;
  color: #fff;
  background-color: #1c508d;
  border-radius: 50px;
  padding: 8px 16px;
  text-align: center;
  margin: 0 auto 26px auto;
  overflow: hidden;
  .mag {
    background: #e57e6d;
    padding: 4px;
    border-radius: 50%;
    display: inline-block;
    width: 32px;
    height: 32px;
    line-height: 1.2;
    margin: -3px 0 0 0;
  }
  h3 {
    display: inline-block;
    font-size: 16px;
    font-family: "cairoR";
  }
}
</style>
