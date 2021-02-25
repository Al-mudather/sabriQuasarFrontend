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
                            <img src="~assets/img/logoB.png" alt="" />
                        </div>
                    </div>
                </div>
                <!-- search box -->
                <div class="col-lg-6">
                    <div class="search">
                        <form v-if="navbarSearch"  @submit="showTheSearchingResult">
                            <input
                                type="text"
                                v-model="search"
                                placeholder="ما الذي تبحث عنة؟"
                                style="color: #7B7B7B"
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
                                <h3 class="q-pr-sm">تسجيل حساب</h3>
                            </a>
                        </div>
                        <div class="login">
                            <a @click="goToLoginPage" style="cursor: pointer">
                                <img src="~assets/img/login.png" alt="" />
                                <h3 class="q-pr-sm">دخول</h3>
                            </a>
                        </div>
                    </div>
                </div>
                <!-- Language -->
                <div class="col-lg-1">
                    <div class="lang">
                        <q-toggle v-model="englishLang" icon="language" unchecked-icon="clear" label="English"/>
                        <!-- <img src="~assets/img/doown.png" alt="" />
                        <h3>Ar</h3>
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

export default {
    name: "NavBar",
    data() {
        return {
            search: "",
            englishLang: false
        };
    },
    props: {},
    computed: {
        ...mapGetters("authentication", ["token", "navbarSearch"])
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
            } else {
                this.$q.notify({
                    type: 'warning',
                    position: 'top',
                    progress: true,
                    multiLine: true,
                    message: 'ما الذي تبحث عنه'
                })
            }
        },

        goToCourses(e) {
            e.preventDefault();
            if (this.search) {
                this.$router.push({
                    name: "courses",
                    params: { search: this.search }
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

        goToSignUpPage() {
            this.$router.push({ name: "signUp" });
        },

        goToLoginPage() {
            this.$router.push({ name: "login" });
        }
    }
};
</script>
<style lang="scss" scoped>
@import "src/css/helpers/_mixins.scss";
@import "src/css/helpers/_variabels.scss";
.top {
    background-color: #fcfcfc;
    .search {
        display: block;
        form {
            input {
                background-color: #fafafa;
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
