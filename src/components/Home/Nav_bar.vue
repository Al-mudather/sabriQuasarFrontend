<template>
    <section class="top">
        <div class="container-fluid">
            <div class="row">
                <div class="col-lg-2">
                    <!--menu & logo -->
                    <div class="minlog">
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
                    <div class="account">
                        <div class="sign">
                            <a @click="goToSignUpPage" style="cursor: pointer">
                                <img src="~assets/img/sign.png" alt="" />
                                <h3 class="q-pr-sm">{{ $t('تسجيل حساب') }}</h3>
                            </a>
                        </div>
                        <div class="login">
                            <a @click="goToLoginPage" style="cursor: pointer">
                                <img src="~assets/img/login.png" alt="" />
                                <h3 class="q-pr-sm">{{ $t('دخول') }}</h3>
                            </a>
                        </div>
                    </div>
                </div>
                <!-- Language -->
                <div class="col-lg-1">
                    <div class="lang">
                        <q-toggle v-model="isEnglish" icon="language" unchecked-icon="clear" class="text-white" label="English"/>
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
import { mapGetters } from "vuex";
import { GetAllCourses } from "src/queries/course_management/query/GetAllCourses";
import { LocalStorage, Quasar } from 'quasar'

export default {
    name: "NavBar",
    data() {
        return {
            search: "",
            visible: false,
            isEnglish: true,
            courses: []
        };
    },
    props: {},
    computed: {
        ...mapGetters("authentication", ["token"])
    },

    created () {
        const _isEnglish = LocalStorage.getItem('isEnglish') || false
        this.isEnglish = _isEnglish
    },

    watch: {
        async isEnglish (value) {
            if (value) {
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

                    this.$jquery('.backgroun').css({
                        'transform': 'rotate(180deg)'
                    })

                    

                    // document.querySelector('.backgroun').style({
                    //     'transform': 'rotate(180deg);'
                    // })
                }
                catch (err) {
                    // Requested Quasar Language Pack does not exist,
                    // let's not break the app, so catching 
                }
                
            } else {
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
                }
                catch (err) {
                }
            }
        }
    },

    methods: {

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
                            message: 'No result'
                        })
                    }
                })

            }
        },

        goToSignUpPage() {
            this.$router.push({ name: "signUp" });
        },

        goToLoginPage() {
            this.$router.push({ name: "login" });
        }
    }
};
</script>
