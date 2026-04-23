<template>
  <section class="top main-nav">
    <div class="main-nav__inner" :class="{ 'main-nav__inner--compact': hideFields }">
      <!-- Menu & logo -->
      <div class="main-nav__brand">
        <button
          type="button"
          class="main-nav__menu-btn"
          @click="changeMenuState"
          :aria-label="$t('القائمة')"
        >
          <q-icon name="menu" size="24px" />
        </button>
        <div v-if="!hideFields" class="main-nav__logo">
          <img src="~assets/img/logoB.png" alt="" />
        </div>
      </div>

      <!-- Search -->
      <div v-if="!hideFields" class="main-nav__search">
        <form class="main-nav__search-form" @submit="showTheSearchingResult">
          <q-icon
            name="search"
            size="18px"
            class="main-nav__search-icon"
          />
          <input
            v-model="search"
            type="text"
            class="main-nav__search-input"
            :placeholder="$t('ما الذي تبحث عنه؟')"
          />
          <button type="submit" class="main-nav__search-submit" :aria-label="$t('بحث')">
            <q-icon name="search" size="18px" />
          </button>
        </form>
      </div>

      <!-- Auth actions -->
      <div v-if="!hideFields" class="main-nav__auth">
        <div class="account" v-if="!token">
          <div class="sign">
            <ds-button variant="primary" size="md" @click="GO_TO_SIGN_UP_PAGE">
              <template #leading><q-icon name="person_add" size="18px" /></template>
              {{ $t("تسجيل حساب") }}
            </ds-button>
          </div>
          <div class="login">
            <ds-button variant="secondary" size="md" @click="GO_TO_LOG_IN_PAGE">
              <template #leading><q-icon name="login" size="18px" /></template>
              {{ $t("دخول") }}
            </ds-button>
          </div>
        </div>
        <div class="account" v-else>
          <ds-button
            variant="secondary"
            size="md"
            class="logOutBtn"
            @click="LOG_USER_OUT"
          >
            <template #leading><q-icon name="logout" size="18px" /></template>
            {{ $t("خروج") }}
          </ds-button>
        </div>
      </div>

      <!-- Language -->
      <div class="main-nav__lang">
        <div class="lang">
          <q-toggle
            v-model="_isEnglish"
            icon="language"
            unchecked-icon="clear"
            class="text-black"
            label="Eng"
          />
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
      hideFields: false,
      search: "",
    };
  },

  props: {},

  computed: {
    ...mapGetters("authentication", ["token", "navbarSearch"]),
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
    $route: {
      handler: function (route) {
        if (route.name === "termsAndConditions") {
          this.hideFields = true;
        } else {
          this.hideFields = false;
        }
      },
      deep: true,
      immediate: true,
    },

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

          // Adjust other layouts' cart styling when switching to English
          this.$jquery(".backgroun").css({
            transform: "rotate(180deg)",
          });
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
        this.$i18n.locale = "ar";
        this.setIsEnglishAction(value);

        try {
          Quasar.lang.set({
            isoName: "ar",
            nativeName: "العربية",
          });

          this.$jquery(".backgroun").css({
            transform: "rotate(360deg)",
          });
          this.$jquery(".shoppgCart > .cart svg").css({
            transform: "translate(0%, 0%)",
          });
          this.$jquery(".shoppgCart > .cart h3").css({
            transform: "translate(0%, 0%)",
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
      this.SET_MY_MARKETING_CODE_ACCOUNT_ACTION("");
      this.deleteShoppinCartDataListAction();
      try {
        this.removeCookie();
      } catch (error) {}
      this.logOutAction();
      this.$apollo.provider.defaultClient.resetStore();
      this.$router.push({ name: "Home" });
    },

    removeCookie() {
      const token = "csrftoken";
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

    goToCourses(e) {
      e.preventDefault();
      if (this.search) {
        this.$router.push({
          name: "courses",
          params: { search: this.search },
          query: { redirect: this.$route.fullPath },
        });
      } else {
        this.$q.notify({
          color: "success",
          textColor: "white",
          position: "top",
          icon: "cloud_done",
          message: "ما الذي تبحث عنه",
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
        params: { redirect: this.$route.fullPath },
        query: { redirect: this.$route.fullPath },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.top.main-nav {
  background-color: var(--ds-surface);
  border-block-end: 1px solid var(--ds-border);
  padding-block: var(--ds-space-3);
  padding-inline: var(--ds-space-4);
}

.main-nav__inner {
  display: grid;
  grid-template-columns: auto 1fr auto auto;
  align-items: center;
  gap: var(--ds-space-4);
  max-width: 1400px;
  margin-inline: auto;

  @media (max-width: 900px) {
    grid-template-columns: auto 1fr auto;
    .main-nav__search {
      grid-column: 1 / -1;
      order: 3;
    }
  }

  &--compact {
    grid-template-columns: auto 1fr;
  }
}

.main-nav__brand {
  display: inline-flex;
  align-items: center;
  gap: var(--ds-space-3);
}

.main-nav__menu-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border: none;
  background: transparent;
  color: var(--ds-brand-700);
  border-radius: var(--ds-radius-pill);
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover,
  &:focus-visible {
    background-color: var(--ds-surface-muted);
  }

  &:focus-visible {
    outline: none;
    box-shadow: var(--ds-shadow-focus);
  }
}

.main-nav__logo img {
  display: block;
  max-height: 42px;
  width: auto;
}

.main-nav__search {
  min-width: 0;
}

.main-nav__search-form {
  display: flex;
  align-items: center;
  gap: var(--ds-space-2);
  background-color: var(--ds-surface-muted);
  border: 1px solid var(--ds-border);
  border-radius: var(--ds-radius-pill);
  padding-inline: var(--ds-space-4);
  padding-block: var(--ds-space-2);
  transition: box-shadow 0.2s ease, border-color 0.2s ease;

  &:focus-within {
    border-color: var(--ds-brand-500);
    box-shadow: var(--ds-shadow-focus);
  }
}

.main-nav__search-icon {
  color: var(--ds-text-muted);
  flex-shrink: 0;
}

.main-nav__search-input {
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  color: var(--ds-text);
  font-family: var(--ds-font-body);
  font-size: var(--ds-text-sm);

  &::placeholder {
    color: var(--ds-text-muted);
  }
}

.main-nav__search-submit {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: var(--ds-brand-600);
  color: var(--ds-text-onBrand);
  width: 32px;
  height: 32px;
  border-radius: var(--ds-radius-pill);
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background: var(--ds-brand-700);
  }
}

.main-nav__auth .account {
  display: inline-flex;
  align-items: center;
  gap: var(--ds-space-2);
}

.main-nav__lang {
  display: inline-flex;
  align-items: center;
}

.lang {
  padding-block-start: 3px;
  h3 {
    color: var(--ds-text);
  }
}
</style>
