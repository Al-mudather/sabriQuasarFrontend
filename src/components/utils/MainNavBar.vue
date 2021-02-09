<template>
   <section class="top">
            <div class="container-fluid">
                <div class="row">
                    <div class="col-lg-2">
                        <!--menu & logo -->
                        <div class="minlog">
                            <div class="menu">
                                <img src="~assets/img/menu.png" alt="">
                            </div>
                            <!--logo-->
                            <div class="logo">
                                <img src="~assets/img/logoB.png" alt="">
                            </div>
                        </div>
                    </div>
                    <!-- search box -->
                    <div class="col-lg-6">
                        <div class="search">
                            <form v-if="navbarSearch">
                                <input type="text" placeholder="ما الذي تبحث عنة؟">
                                <button><img src="~assets/img/search.png"></button>
                            </form>
                        </div>
                    </div>
                    <!--login $ sign-->
                    <div class="col-lg-3">
                        <div class="account">
                            <div class="sign">
                                <a href="#">
                                    <img src="~assets/img/sign.png" alt="">
                                    <h3> تسجيل حساب</h3>
                                </a>
                            </div>
                            <div class="login">
                                <a href="#">
                                    <img src="~assets/img/login.png" alt="">
                                    <h3>دخول</h3>
                                </a>
                            </div>
                        </div>
                    </div>
                    <!-- Language -->
                    <div class="col-lg-1">
                        <div class="lang">
                            <img src="~assets/img/doown.png" alt="">
                            <h3>Ar</h3>
                            <div class="contry">
                                <img src="~assets/img/ar.png" alt="">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'NavBar',
  props: {
  },
  computed: {
    ...mapGetters('authentication', ['token', 'navbarSearch'])
  },

  methods: {
    ...mapActions('authentication', ['setLoginDialogAction', 'setSignUpDialogAction', 'setRegisterationDialogAction']),

    openLoginDailog () {
      // TODO: Close the registeration Dialog
      this.setRegisterationDialogAction(false)
      this.setLoginDialogAction(true)
    },

    openSignUpDailog () {
      this.setSignUpDialogAction(true)
    }
  }
}
</script>
<style lang="scss" scoped>
@import "src/css/helpers/_mixins.scss";
@import "src/css/helpers/_variabels.scss";
.top{
    background-color: #fcfcfc;
    .search{
        display: block;
        form{
            input{
                background-color:#FAFAFA;
            }
        }
    }
    .lang{
        background-color: #fff;
        border: 2px solid #ECEAEA;
        padding: 3px 1px 0 0;
        h3{
            color: #474747;
        }
    }
}
</style>
