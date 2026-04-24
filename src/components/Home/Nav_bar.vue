<template>
  <section class="top home-nav">
    <div class="home-nav__inner">
      <!-- Menu & logo -->
      <div class="home-nav__brand" @click="changeMenuState">
        <button
          type="button"
          class="home-nav__menu-btn"
          :aria-label="$t('القائمة')"
        >
          <q-icon name="menu" size="26px" />
        </button>
        <div class="home-nav__logo">
          <img src="~assets/img/logo.png" alt="" />
        </div>
      </div>

      <!-- Search -->
      <div class="home-nav__search">
        <form class="home-nav__search-form" @submit="showTheSearchingResult">
          <q-icon name="search" size="18px" class="home-nav__search-icon" />
          <input
            v-model="search"
            type="text"
            class="home-nav__search-input"
            :placeholder="$t('ما الذي تبحث عنه؟')"
          />
          <button
            type="submit"
            class="home-nav__search-submit"
            :aria-label="$t('بحث')"
          >
            <q-icon name="search" size="18px" />
          </button>
        </form>
      </div>

      <!-- Auth actions -->
      <div class="home-nav__auth">
        <div class="account m_btn" v-if="!token">
          <div class="sign m_btn">
            <ds-button variant="accent" size="md" @click="GO_TO_SIGN_UP_PAGE">
              <template #leading><q-icon name="person_add" size="18px" /></template>
              {{ $t("تسجيل حساب") }}
            </ds-button>
          </div>
          <div class="login m_btn">
            <ds-button variant="secondary" size="md" @click="GO_TO_LOG_IN_PAGE">
              <template #leading><q-icon name="login" size="18px" /></template>
              {{ $t("دخول") }}
            </ds-button>
          </div>
        </div>
        <div class="account m_btn" v-else>
          <div class="sign logOutBtn mag">
            <ds-button variant="secondary" size="md" @click="LOG_USER_OUT">
              <template #leading><q-icon name="logout" size="18px" /></template>
              {{ $t("خروج") }}
            </ds-button>
          </div>
        </div>
      </div>

      <!-- Language -->
      <div class="home-nav__lang">
        <div class="lang">
          <q-toggle
            v-model="_isEnglish"
            icon="language"
            unchecked-icon="clear"
            class="text-white"
            label="Eng"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { storeToRefs } from "pinia";
import { useAuthStore } from "src/stores/auth";
import { useSettingsStore } from "src/stores/settings";
import { useCartStore } from "src/stores/cart";
import { usePyramidStore } from "src/stores/pyramid";
import { apolloClient } from "src/apollo/client";
import { GetAllCourses } from "src/graphql/course_management/query/GetAllCourses";
import { Quasar } from "quasar";

export default {
  name: "NavBar",
  setup () {
    const auth = useAuthStore();
    const settings = useSettingsStore();
    const cart = useCartStore();
    const pyramid = usePyramidStore();
    const { token } = storeToRefs(auth);
    const { isEnglish } = storeToRefs(settings);
    return { auth, settings, cart, pyramid, token, isEnglish };
  },
  data() {
    return {
      search: "",
      visible: false,
      isDraft: false,
      courses: [],
    };
  },
  props: {},
  computed: {
    _isEnglish: {
      get() {
        return this.isEnglish;
      },
      set(newVlaue) {
        return this.settings.setIsEnglish(newVlaue);
      },
    },
  },

  watch: {
    async isEnglish(value) {
      if (value) {
        this.$i18n.locale = "en";
        this.settings.setIsEnglish(value);
        const langIso = "en-us";

        try {
          await import(
            "quasar/lang/" + langIso
          ).then((lang) => {
            Quasar.lang.set({
              ...lang.default,
              rtl: false,
            });
          });

          // Adjust cart styling in outer layouts when switching locales
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
        this.settings.setIsEnglish(value);

        try {
          const lang = await import("quasar/lang/ar");
          Quasar.lang.set({ ...lang.default, rtl: true });

          this.$jquery(".backgroun").css({
            transform: "rotate(360deg)",
          });
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
    changeMenuState() {
      this.settings.setOpenMenu(true);
    },

    LOG_USER_OUT() {
      this.pyramid.setMyMarketingCode("");
      try {
        this.removeCookie();
      } catch (error) {}
      this.cart.deleteCart();
      this.auth.logOut();
      this.$router.push({ name: "Home" });
    },

    removeCookie() {
      const token = "csrftoken";
      this.$cookies.remove(token);
    },

    showTheSearchingResult(event) {
      event.preventDefault();

      if (!this.$_.isEmpty(this.search)) {
        apolloClient
          .query({
            query: GetAllCourses,
            variables: {
              title_Icontains: this.search,
              isDraft: this.isDraft,
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

<style lang="scss" scoped>
.top.home-nav {
  background: linear-gradient(
    135deg,
    var(--ds-brand-700) 0%,
    var(--ds-brand-600) 100%
  );
  padding-block: var(--ds-space-3);
  padding-inline: var(--ds-space-4);
  color: var(--ds-text-onBrand);
}

.home-nav__inner {
  display: grid;
  grid-template-columns: auto 1fr auto auto;
  align-items: center;
  gap: var(--ds-space-4);
  max-width: 1400px;
  margin-inline: auto;

  @media (max-width: 900px) {
    grid-template-columns: auto 1fr auto;
    .home-nav__search {
      grid-column: 1 / -1;
      order: 3;
    }
  }
}

.home-nav__brand {
  display: inline-flex;
  align-items: center;
  gap: var(--ds-space-3);
  cursor: pointer;
}

.home-nav__menu-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border: none;
  background: rgba(255, 255, 255, 0.08);
  color: var(--ds-text-onBrand);
  border-radius: var(--ds-radius-pill);
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover,
  &:focus-visible {
    background-color: rgba(255, 255, 255, 0.18);
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.35);
  }
}

.home-nav__logo img {
  display: block;
  max-height: 44px;
  width: auto;
}

.home-nav__search {
  min-width: 0;
}

.home-nav__search-form {
  display: flex;
  align-items: center;
  gap: var(--ds-space-2);
  background-color: var(--ds-surface);
  border: 1px solid transparent;
  border-radius: var(--ds-radius-pill);
  padding-inline: var(--ds-space-4);
  padding-block: var(--ds-space-2);
  transition: box-shadow 0.2s ease, border-color 0.2s ease;

  &:focus-within {
    border-color: var(--ds-accent-300);
    box-shadow: 0 0 0 3px rgba(252, 199, 76, 0.35);
  }
}

.home-nav__search-icon {
  color: var(--ds-text-muted);
  flex-shrink: 0;
}

.home-nav__search-input {
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

.home-nav__search-submit {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: var(--ds-accent-300);
  color: var(--ds-brand-800);
  width: 32px;
  height: 32px;
  border-radius: var(--ds-radius-pill);
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background: var(--ds-accent-400);
  }
}

.home-nav__auth .account {
  display: inline-flex;
  align-items: center;
  gap: var(--ds-space-2);
}

.home-nav__lang {
  display: inline-flex;
  align-items: center;
}

.m_btn {
  transition: transform 0.2s ease;
  &:hover {
    transform: scale(1.03);
  }
}

.lang {
  color: var(--ds-text-onBrand);
}
</style>
