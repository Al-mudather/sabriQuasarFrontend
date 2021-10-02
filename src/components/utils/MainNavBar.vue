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
                            <img src="~assets/img/logoB.png" alt="" />
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
                        <div class="sign">
                            <a @click="GO_TO_SIGN_UP_PAGE" style="cursor: pointer">
                                <img src="~assets/img/sign.png" alt="" />
                                <h3 class="q-pr-sm">{{ $t('تسجيل حساب') }}</h3>
                            </a>
                        </div>
                        <div class="login">
                            <a  @click="GO_TO_LOG_IN_PAGE" style="cursor: pointer">
                                <img src="~assets/img/login.png" alt="" />
                                <h3 class="q-pr-sm">{{ $t('دخول') }}</h3>
                            </a>
                        </div>
                    </div>
                    <div class="account" v-else>
                        <div @click="LOG_USER_OUT" style="cursor: pointer" class="sign logOutBtn mag">
                            <div class="mag">
                                <img src="~assets/img/enter.png" alt="">
                            </div>
                            <h3 class="q-pr-sm">{{ $t('خروج') }}</h3>
                        </div>
                    </div>
                </div>
                <!-- Language -->
                <div class="col-lg-1">
                    <div class="lang">
                        <q-toggle v-model="_isEnglish" icon="language" unchecked-icon="clear" class="text-black" label="Eng"/>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
 
<script>
import { mapGetters, mapState, mapActions } from "vuex";
import { GetAllCourses } from "src/queries/course_management/query/GetAllCourses";
import { Quasar } from 'quasar'

export default {
    name: "NavBar",
    data() {
        return {
            search: ""
        };
    },

    props: {},

    computed: {
        ...mapGetters("authentication", ["token", "navbarSearch"]),
        ...mapState("settings", ["isEnglish"]),
        _isEnglish: {
            get () {
                return this.isEnglish
            },
            set (newVlaue) {
                return this.setIsEnglishAction(newVlaue)
            }
        }
    },

    watch: {
        async isEnglish (value) {
            if (value) {
                this.$i18n.locale = 'en'
                this.setIsEnglishAction(value)
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

                    this.$jquery('.shoppgCart > .cart > .notifc').css({
                        'transform': 'translate(-5%,-43%)'
                    })


                }
                catch (err) {
                    // Requested Quasar Language Pack does not exist,
                    // let's not break the app, so catching
                }
                
            } else {
                this.$i18n.locale = 'ar'
                // TODO: Save the language
                this.setIsEnglishAction(value)

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
    },

    methods: {
        ...mapActions('authentication', ['logOutAction']),
        ...mapActions('settings', ['setIsEnglishAction', 'setOpenMenuAction']),
        ...mapActions('shoppingCart', ['deleteShoppinCartDataListAction']),

        changeMenuState () {
            this.setOpenMenuAction(true)
        }, 

        LOG_USER_OUT () {
            //TODO: Empty the shopping cart
            this.deleteShoppinCartDataListAction()
            //TODO: redirect the user to the home page
            this.logOutAction()
            this.$apollo.provider.defaultClient.resetStore()
            this.$router.push({ name: "Home" });
        },

        showTheSearchingResult (event) {
            event.preventDefault();

            if (!this.$_.isEmpty(this.search)) {
                this.$apollo.query({
                    query: GetAllCourses,
                    variables: {
                        title_Icontains: this.search
                    }
                }).then(res => {
                    const searchResult = res.data.allCourses.edges.map(course => {
                        return {
                            label: course.node.title,
                            id: course.node.id,
                            pk: course.node.pk
                        }
                    })
                    if (!this.$_.isEmpty(searchResult)) {
                        this.$q.bottomSheet({
                            style: {
                                textAlign: 'center',
                                padding: '20px',
                                'border-bottom': '1px solid #000 !important'
                            },
                            actions: searchResult
                        }).onOk(action => {
                            // TODO: Go to the course details
                            this.$router.push({ name: 'course-details', params: { pk: action.pk, id: action.id} })
                        }).onDismiss(() => {
                            // TODO: Clear the search
                            this.search = ''
                        })
                    } else {
                        this.$q.notify({
                            color: 'negative',
                            position: 'top',
                            progress: true,
                            multiLine: true,
                            message: this.$t('لا توجد نتائج')
                        })
                    }
                })
            } else {
                this.$q.notify({
                    type: 'warning',
                    position: 'top',
                    progress: true,
                    multiLine: true,
                    message: this.$t('ما الذي تبحث عنه')
                })
            }
        },

        goToCourses(e) {
            e.preventDefault();
            if (this.search) {
                this.$router.push({
                    name: "courses",
                    params: { search: this.search },
                    query: { redirect: this.$route.fullPath }
                });

            } else {
                this.$q.notify({
                    color: 'success',
                    textColor: 'white',
                    position: 'top',
                    icon: 'cloud_done',
                    message: 'ما الذي تبحث عنه'
                })
            }
        },

        GO_TO_SIGN_UP_PAGE() {
            this.$router.push({ name: "signUp", query: { redirect: this.$route.fullPath } });
        },

        GO_TO_LOG_IN_PAGE() {
            this.$router.push({ name: "login", params: { redirect: this.$route.fullPath }, query: { redirect: this.$route.fullPath } });
        }
    }
};
</script>
<style lang="scss" scoped>
@import "src/css/helpers/_mixins.scss";
@import "src/css/helpers/_variabels.scss";
.logOutBtn {
    height: 41px;
    width: 137px;
    color: #fff;
    background-color: #1C508D;
    border-radius: 50px;
    padding: 8px 16px;
    text-align: center;
    margin:0 auto 26px auto;
    overflow: hidden;
    .mag{
        background: #E57E6D;
        padding: 4px;
        border-radius: 50%;
        display: inline-block;
        width: 32px;
        height: 32px;
        line-height: 1.2;
        margin: -3px 0 0 0;

    }
    h3{
        display: inline-block;
        font-size: 16px;
        font-family: 'cairoR';
    }
}
.top {
    background-color: #fcfcfc;
    .search {
        display: block;
        //maxMobile
        @media(max-width:767px){
            display: none;
        }
        //minSmall
        @media(min-width:768px){
            display: none;
        }
        //minLarg
        @media(min-width:1200px){
            display: block;
        } 
        form {
            input {
                background-color: #fafafa;
                color: #7B7B7B;
            }
        }
    }
    .lang {
        // background-color: #fff;
        // border: 2px solid #eceaea;
        padding: 3px 1px 0 0;
        h3 {
            color: #474747;
        }
    }
}
</style>
