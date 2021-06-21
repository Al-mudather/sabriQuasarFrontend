<template>
    <section class="training">
        <div class="container-fluid">
            <div class="row">
                <div ref="col" class="col-lg-12">
                    <div ref="cat" @click="changeTab" class="swiper-container">
                        <swiper
                            ref="mySwiper"
                            class="nav nav-tabs"
                            :space-between="1"
                            :options="swiperOptions"
                            
                        >
                            <swiper-slide class="nav-item" v-for="spec in allCourseSpecialities.edges" :key="spec.node.id">
                                <a
                                style="outline: 0"
                                :data-course="
                                    JSON.stringify(spec.node.courseSet)
                                "
                                @click="changeCourseData(spec.node.courseSet)"
                                class="nav-link"
                                id="home-tab"
                                data-toggle="tab"
                                role="tab"
                                aria-controls="home"
                                aria-selected="true"
                            >
                                <img src="~assets/img/brain.png" alt="" />{{
                                    spec.node.speciality
                                }}
                            </a>
                            </swiper-slide>
                            <div class="swiper-pagination" slot="pagination"></div>
                        </swiper>
                    </div>
                    
                    <div class="txt">
                        <h3>{{$t('الــــدورات')}}</h3>
                        <h4>
                            {{$t('عرض')}} <span>{{ courses.edgeCount || 0 }}</span> {{$t('من اصل')}}
                            {{ courses.totalCount || 0 }}
                        </h4>
                    </div>
                    <!-- start rate -->
                    <div class="rate" v-if="courses.edgeCount > 0">
                        <div class="container">
                            <div class="cn fadeIn row justify-center">
                                <q-intersection transition="scale" v-for="course in courses.edges" :key="course.node.id" class="col-lg-3 col-md-5 col-sm-5 col-xs-12">
                                    <course-card
                                        class="hvr-grow"
                                        style="cursor: pointer"
                                        :course="course.node"
                                        :name="course.node.title"
                                        instructor="مركز دكتور صبري ابو قرون"
                                        :price="course.node.courseFee"
                                    />
                                </q-intersection>
                            </div>
                            <div class="butDown">
                                <svg
                                    class="right"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="96.539"
                                    height="96.161"
                                    viewBox="0 0 96.539 96.161"
                                >
                                    <g
                                        id="Group_174"
                                        data-name="Group 174"
                                        transform="translate(986.419 -1011.895) rotate(51)"
                                        opacity="0.15"
                                    >
                                        <g
                                            id="Group_172"
                                            data-name="Group 172"
                                            transform="translate(181.283 1368.988)"
                                        >
                                            <path
                                                id="path142"
                                                d="M800.1-631.858s-5.932-6.921-.366-11.317c0,0,4.065-2.46,7.38-2.26,0,0-4.7,7.877-3.178,8.659s4.6-9.154,4.6-9.154,9.252-.9,12.228.535c0,0-7.909,6.471-6.243,6.856s10.209-5.967,10.209-5.967,8.611,1.466,8.152,6.719-3.426,6.873-4.73,6.734-8.932-3.052-9.1-1.982,4.425,4.56,7.641,4.724c0,0-6.071,6.694-10.105,4.762s-4.379-4.994-6.894-6.144-4.662-1.146-3.624.027,5.59,2.31,7.029,4.853,2.729,4.261-1.446,3.633-10.96-3.682-11.257-7.18l-.3-3.5"
                                                transform="translate(-744.753 680.058)"
                                                fill="#aec3ff"
                                            />
                                            <path
                                                id="path144"
                                                d="M813.906-586.5s-23.387-.9-28.552,5.788a16.911,16.911,0,0,1-4.657,6.536l-.548,1.493s4.053-4.272,5.5-4.531c0,0-2.268-8.286,28.254-9.285"
                                                transform="translate(-730.005 628.907)"
                                                fill="#aec3ff"
                                            />
                                            <path
                                                id="path146"
                                                d="M751.757-503.483a14.687,14.687,0,0,0-5.368,10.346l.911.08s1.6-6.858,4.5-9.541-.044-.885-.044-.885"
                                                transform="translate(-701.065 558.219)"
                                                fill="#aec3ff"
                                            />
                                            <path
                                                id="path148"
                                                d="M463.6-753.345s9.436-5.283,5.032-12.456c0,0-3.523-4.4-7.3-5.535,0,0,2.013,10.692,0,10.944s-1.384-12.077-1.384-12.077-9.939-4.781-13.839-4.4c0,0,6.165,10.443,4.152,10.192s-8.932-10.82-8.932-10.82-10.19-1.887-11.826,4.151,1.006,9.059,2.516,9.436,11.2.251,10.945,1.51-6.794,3.271-10.442,2.14c0,0,4.026,9.939,9.31,9.434s6.919-3.774,10.19-4.025,5.661.628,4.026,1.51-7.171.287-9.813,2.534-4.781,3.631.126,4.636,13.713.379,15.475-3.4l1.761-3.773"
                                                transform="translate(-428.986 792.842)"
                                                fill="#d4e4f8"
                                            />
                                            <path
                                                id="path150"
                                                d="M465.2-733.545s26.42,8.556,29.439,18.118a20.075,20.075,0,0,0,2.516,9.185v1.887s-2.768-6.416-4.278-7.3c0,0,5.913-8.3-27.678-21.891"
                                                transform="translate(-460.028 754.924)"
                                                fill="#d4e4f8"
                                            />
                                            <path
                                                id="path152"
                                                d="M681.407-549.4a17.422,17.422,0,0,1,1.751,13.718l-1.048-.282s1.017-8.3-1.114-12.467.411-.969.411-.969"
                                                transform="translate(-644.281 598.082)"
                                                fill="#d4e4f8"
                                            />
                                            <path
                                                id="path154"
                                                d="M727.4-851.057s-12.438-6.965-6.633-16.418c0,0,4.643-5.805,9.619-7.3,0,0-2.654,14.1,0,14.43s1.824-15.921,1.824-15.921,13.1-6.3,18.242-5.805c0,0-8.126,13.763-5.473,13.432S756.756-882.9,756.756-882.9s13.433-2.487,15.589,5.474-1.327,11.939-3.317,12.438-14.76.331-14.428,1.99,8.955,4.312,13.765,2.82c0,0-5.307,13.1-12.272,12.436s-9.121-4.975-13.433-5.306-7.463.83-5.307,1.99,9.453.381,12.935,3.341,6.3,4.784-.166,6.112-18.077.5-20.4-4.478l-2.322-4.975"
                                                transform="translate(-677.781 883.266)"
                                                fill="#d2e0ff"
                                            />
                                            <path
                                                id="path156"
                                                d="M795.384-824.945s-34.826,11.277-38.806,23.881a26.459,26.459,0,0,1-3.317,12.107v2.488s3.649-8.459,5.639-9.62c0,0-7.795-10.944,36.484-28.856"
                                                transform="translate(-706.956 833.273)"
                                                fill="#d4e4f8"
                                            />
                                            <path
                                                id="path158"
                                                d="M733.737-582.216a22.97,22.97,0,0,0-2.309,18.083l1.382-.371s-1.341-10.934,1.469-16.435-.542-1.278-.542-1.278"
                                                transform="translate(-687.432 626.532)"
                                                fill="#d4e4f8"
                                            />
                                        </g>
                                    </g>
                                </svg>
                                <svg
                                    class="left"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="97.967"
                                    height="90.915"
                                    viewBox="0 0 97.967 90.915"
                                >
                                    <g
                                        id="Group_178"
                                        data-name="Group 178"
                                        transform="translate(-774.282 1197.49) rotate(-135)"
                                        opacity="0.15"
                                    >
                                        <g
                                            id="Group_172"
                                            data-name="Group 172"
                                            transform="translate(181.283 1368.988)"
                                        >
                                            <path
                                                id="path142"
                                                d="M800.029-632.24s-5.774-6.736-.356-11.015c0,0,3.957-2.394,7.184-2.2,0,0-4.572,7.667-3.093,8.428s4.479-8.91,4.479-8.91,9.005-.873,11.9.521c0,0-7.7,6.3-6.077,6.673S824-644.551,824-644.551s8.381,1.427,7.934,6.54-3.335,6.69-4.6,6.555-8.694-2.971-8.856-1.929,4.307,4.438,7.437,4.6c0,0-5.909,6.516-9.836,4.635s-4.262-4.861-6.71-5.98-4.538-1.116-3.527.026,5.441,2.248,6.841,4.724,2.656,4.147-1.407,3.536-10.668-3.584-10.957-6.988l-.29-3.4"
                                                transform="translate(-746.155 679.155)"
                                                fill="#aec3ff"
                                            />
                                            <path
                                                id="path144"
                                                d="M813.006-586.5s-22.764-.877-27.791,5.634a16.459,16.459,0,0,1-4.533,6.362l-.533,1.453s3.945-4.159,5.356-4.411c0,0-2.208-8.065,27.5-9.038"
                                                transform="translate(-731.341 627.778)"
                                                fill="#aec3ff"
                                            />
                                            <path
                                                id="path146"
                                                d="M751.614-503.5a14.3,14.3,0,0,0-5.225,10.07l.887.078s1.561-6.675,4.381-9.286-.043-.862-.043-.862"
                                                transform="translate(-702.274 556.776)"
                                                fill="#aec3ff"
                                            />
                                            <path
                                                id="path148"
                                                d="M462.674-754s9.184-5.142,4.9-12.124c0,0-3.429-4.286-7.1-5.387,0,0,1.959,10.407,0,10.652s-1.347-11.755-1.347-11.755-9.674-4.653-13.47-4.286c0,0,6,10.165,4.041,9.92S441-777.508,441-777.508s-9.919-1.836-11.511,4.04.98,8.817,2.449,9.184,10.9.245,10.654,1.47-6.612,3.184-10.164,2.083c0,0,3.918,9.674,9.062,9.182s6.735-3.673,9.919-3.918,5.511.612,3.919,1.47-6.98.28-9.551,2.467-4.653,3.534.123,4.512,13.348.369,15.062-3.306L462.674-754"
                                                transform="translate(-428.986 792.441)"
                                                fill="#d4e4f8"
                                            />
                                            <path
                                                id="path150"
                                                d="M465.2-733.545s25.715,8.328,28.654,17.635a19.54,19.54,0,0,0,2.449,8.94v1.837s-2.694-6.245-4.164-7.1c0,0,5.755-8.082-26.94-21.308"
                                                transform="translate(-460.166 754.354)"
                                                fill="#d4e4f8"
                                            />
                                            <path
                                                id="path152"
                                                d="M681.374-549.432a16.957,16.957,0,0,1,1.7,13.352l-1.02-.274s.99-8.074-1.084-12.134.4-.943.4-.943"
                                                transform="translate(-645.237 596.815)"
                                                fill="#d4e4f8"
                                            />
                                            <path
                                                id="path154"
                                                d="M727.185-851.915s-12.106-6.779-6.457-15.98c0,0,4.52-5.65,9.362-7.1,0,0-2.583,13.721,0,14.045s1.776-15.5,1.776-15.5,12.752-6.134,17.756-5.65c0,0-7.909,13.4-5.327,13.074s11.461-13.882,11.461-13.882,13.075-2.42,15.173,5.328-1.291,11.621-3.228,12.107-14.366.322-14.043,1.937,8.717,4.2,13.4,2.745c0,0-5.165,12.752-11.945,12.1s-8.878-4.842-13.075-5.165-7.264.808-5.165,1.937,9.2.371,12.591,3.252,6.134,4.657-.161,5.949-17.595.486-19.855-4.359l-2.26-4.842"
                                                transform="translate(-678.886 883.266)"
                                                fill="#d2e0ff"
                                            />
                                            <path
                                                id="path156"
                                                d="M794.261-824.945s-33.9,10.976-37.772,23.244a25.753,25.753,0,0,1-3.228,11.784v2.422s3.551-8.234,5.488-9.364c0,0-7.587-10.652,35.512-28.087"
                                                transform="translate(-708.19 833.051)"
                                                fill="#d4e4f8"
                                            />
                                            <path
                                                id="path158"
                                                d="M733.65-582.257a22.358,22.358,0,0,0-2.247,17.6l1.345-.361s-1.306-10.643,1.43-16-.527-1.244-.527-1.244"
                                                transform="translate(-688.58 625.391)"
                                                fill="#d4e4f8"
                                            />
                                        </g>
                                    </g>
                                </svg>
                                <button class="hvr-float-shadow" @click="gotTocoursesPage">
                                    {{$t('جمــــيع الدورات')}}
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="notCources" v-else>
                        <img src="~assets/img/Blue.png" alt="">
                        <p>{{$t('لا توجد دورات في هذا القسم في الوقت الحالي')}}</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import courseCard from "components/utils/courseCard";
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import 'swiper/swiper-bundle.css'
import 'swiper/swiper.min.css'
// import catItem from 'components/utils/category_item'
// import { GetAllCourses } from 'src/queries/course_management/query/GetAllCourses'
import { GetSpecialities } from "src/queries/course_management/query/GetAllSpeciallites";
import { mapActions } from "vuex";

export default {
    name: "Training",
    data() {
        return {
            counter: 0,
            navTab: "",
            allCourseSpecialities: "",
            courses: [],
            allCourses: null,
            swiperOptions: {
                effect: 'coverflow',
                grabCursor: true,
                centeredSlides: true,
                slidesPerView: 'auto',
                coverflowEffect: {
                    rotate: 500,
                    stretch: 0,
                    depth: 100,
                    modifier: 1,
                    slideShadows: false
                },
                pagination: {
                    el: '.swiper-pagination'
                },
            },

            swiperCoursesOptions: {
                effect: 'coverflow',
                grabCursor: true,
                centeredSlides: true,
                slidesPerView: 'auto',
                coverflowEffect: {
                rotate: 500,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows: false
                }
            }
        };
    },
    props: {},
    components: {
        courseCard,
        Swiper,
        SwiperSlide
        // catItem
    },

    created () {
        new Swiper('.swiper-container', {
            // Optional parameters
            direction: 'vertical',
            loop: true,

            // If we need pagination
            pagination: {
                el: '.swiper-pagination',
            },

            // Navigation arrows
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },

            // And if we need scrollbar
            scrollbar: {
                el: '.swiper-scrollbar',
            },
        });

    },

    apollo: {
        allCourseSpecialities: {
            query() {
                return GetSpecialities;
            },
            variables() {
                return {
                    courseNumber: 5
                };
            },
            result (data) {
                if (!data.loading) {
                    console.log('bbbbbbbbbbbbbbbbbbbbb')
                    console.log(data)
                    console.log('bbbbbbbbbbbbbbbbbbbbb')
                }
            }
        }
    },

    watch: {
        allCourseSpecialities(val) {
            this.navTab = val.edges[0].node.speciality;
        }
    },

    computed: {
      swiper() {
        return this.$refs.mySwiper.$swiper
      }
    },

    mounted() {
        this.swiper.slideTo(4, 1000, false)
    },

    updated() {
        if (this.counter === 0) {
            // TODO: When the page is loadded, select the first category with it's
            // data courses to be viewd
            // this.$refs.cat.firstChild.firstChild.classList.add("active");
            this.$refs.cat.firstChild.firstChild.firstChild.firstChild.classList.add("active");
            const data = JSON.parse(
                this.$refs.cat.firstChild.firstChild.firstChild.firstChild.dataset.course
            );
            this.courses = data;
            this.counter += 10;
        }
    },

    methods: {
        ...mapActions('settings', ['setActiveNavAction']),

        next() {
            this.$refs.flickity.next();
        },
    
        previous() {
            this.$refs.flickity.previous();
        },

        gotTocoursesPage() {
            //TODO: Save the active link so when render it will be make active again
            this.setActiveNavAction('COURSES')
            this.$router.push({ name: "courses" }); 
        },

        changeCourseData(courses) {
            this.courses = courses;
        },

        changeTab(e) {
            e.preventDefault();
            // TODO: Get the cliked li parent for the a child
            const clickedLiParent = e.target.parentElement;
            // TODO: Get the parent ul element
            const ulParent = clickedLiParent.parentElement;
            if (clickedLiParent.classList.contains("nav-item")) {
                // TODO: Remove the class active from all the li elements
                for (const liParent of ulParent.childNodes) {
                    liParent.firstChild.classList.remove("active");
                }
                // TODO: Add the class active to only the cliked item
                clickedLiParent.firstChild.classList.add("active");
            }
        }
    }
};
</script>
<style lang="scss">
@import "src/css/helpers/_mixins.scss";
@import "src/css/helpers/_variabels.scss";

.cn {
    right: 0% !important;
}
/*--- Start Training ---*/
.nav-item {
    width: max-content !important;
}
.training {
    padding: 20px 0;
    margin-top: 0;
    .nav-tabs {
        margin: 0 0 20px 0;
        padding: 15px;
        border: 1px dashed #f1f0f0;
        border-radius: 52px;
        .nav-link {
            img {
                margin-left: 4px;
            }
            font-size: 18px;
            font-family: "cairoR";
            // width: 155px;
            height: 44px;
            margin-left: 10px;
            border-radius: 50px;
            color: $textColor;
            border: 1px solid #f6f6f6;
            background-color: #fff;
            @include prefixer(
                box-shadow,
                2px 9px 18.79px 2.21px rgba(147, 147, 147, 0.14),
                webkit moz o ms
            );
            &.active {
                background-color: #2d77d8;
                color: #fff;
            }
        }
    }
    .txt {
        position: relative;
        margin-bottom: 40px;
        h3 {
            font-size: 25px;
            font-family: "cairoR";
            display: inline-block;
            color: $textColor;
            margin-right: 7px;
        }
        h4 {
            font-family: "cairoR";
            font-size: 14px;
            color: #bbbaba;
            margin-right: 8px;
            span {
                color: $yalloColor;
                font-family: "cairoR";
            }
        }
    }

    .rate {
        margin-top: 30px;

        .cn {
            padding: 0 0 0 0;
            position: relative;
            right: 8%;
            @media (min-width: 320px) and (max-width: 700px) {
                right: 0;
            }
            .parent {
                margin-bottom: 20px;
                @media (min-width: 320px) and (max-width: 700px) {
                    margin-bottom: 0;
                }
                .imag {
                    position: relative;
                    border-radius: 50px;
                    overflow: hidden;
                    margin: 0 auto 0 auto;
                    height: 238px;
                    width: 82%;

                    .overlay {
                        @include overlay;
                        background-color: rgba(#fbfbff, 0.6);
                    }

                    img {
                        width: 100%;
                    }

                    .magtxt {
                        h4 {
                            position: absolute;
                            top: 25px;
                            left: 0;
                            color: #7b7b7b;
                            font-size: 17px;
                            font-family: "cairoR";
                            width: 100%;
                            padding: 0 8% 0 13%;
                        }

                        img {
                            position: absolute;
                            width: 26px;
                            top: 45%;
                            left: 44%;
                        }
                    }
                }

                .pric {
                    background-color: #7b86fa;
                    padding: 20px;
                    border-radius: 107px 107px 27px 27px;
                    height: 117px;
                    width: 158px;
                    margin: -59px auto;
                    position: relative;
                    z-index: 2;

                    .detai {
                        text-align: center;

                        span {
                            display: inline-block;
                            font-size: 13px;
                            font-family: "cairoR";
                            color: #fff;
                            margin: 0 0 0 6px;
                        }

                        h3 {
                            display: inline-block;
                            color: #fff067;
                            font-size: 31px;
                            font-family: "cairoR";
                        }
                    }

                    button {
                        width: 85px;
                        height: 33px;
                        background-color: #fff067;
                        color: $textColor;
                        font-size: 14px;
                        outline: 0;
                        margin: 13px 0 0 0;
                        @include prefixer(
                            box-shadow,
                            8px 3px 7px #9e9e9e36,
                            webkit moz ms
                        );
                    }

                    .cart {
                        position: relative;
                        cursor: pointer;
                        right: 12px;
                        margin: 0 0 0 0;

                        .sala {
                            position: absolute;
                            left: 4px;
                            top: -31px;
                            width: auto;
                        }

                        img {
                            width: auto;
                            position: absolute;
                            left: 19px;
                            top: -21px;
                        }
                    }
                }

                .name {
                    border-radius: 50px;
                    background-color: #5666b9;
                    width: 100%;
                    padding-top: 178px;
                    height: 222px;
                    position: relative;
                    top: -108px;
                    z-index: -1;
                    @include prefixer(
                        box-shadow,
                        8px 12px 8px #eceaea,
                        webkit moz ms
                    );

                    .user {
                        margin-right: 23px;

                        img {
                            display: inline-block;
                            width: 25px;
                        }

                        h3 {
                            display: inline-block;
                            font-size: 12px;
                            color: #fff;
                        }
                    }
                }
            }
        }

        /*parent2*/
        .butDown {
            position: relative;
            margin: 0 auto;
            width: 205px;
            text-align: center;

            .right {
                position: absolute;
                top: -32px;
                right: -49px;
                width: auto;
            }

            .left {
                position: absolute;
                top: 0;
                left: -58px;
                width: auto;
            }

            button {
                position: relative;
                text-align: center;
                margin: 0 auto;
            }
        }
    }
}

/*--- End Training ---*/
</style>
