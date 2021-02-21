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
                                placeholder="ما الذي تبحث عنة؟"
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
                                <h3>تسجيل حساب</h3>
                            </a>
                        </div>
                        <div class="login">
                            <a @click="goToLoginPage" style="cursor: pointer">
                                <img src="~assets/img/login.png" alt="" />
                                <h3>دخول</h3>
                            </a>
                        </div>
                    </div>
                </div>
                <!-- Language -->
                <div class="col-lg-1">
                    <div class="lang">
                        <img src="~assets/img/doown.png" alt="" />
                        <h3>Ar</h3>
                        <div class="contry">
                            <img src="~assets/img/ar.png" alt="" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { GetAllCourses } from "src/queries/course_management/query/GetAllCourses";

export default {
    name: "NavBar",
    data() {
        return {
            search: "",
            visible: false,
            courses: []
        };
    },
    props: {},
    computed: {
        ...mapGetters("authentication", ["token"])
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
