<template>
    <div class="row">
        <div class="col-lg-5 ">
            <div class="asid">
                <div class="titel">
                    <img src="~assets/img/tit2.png" alt="" />
                    <h3>{{$t('المحتــوى')}}</h3>
                    <div class="butt">
                        <img src="~assets/img/visibility.png" alt="" />
                        <img src="~assets/img/full screen.png" alt="" />
                    </div>
                </div>
                <!--colapss-->
                <skeletonList v-if="lodash.isEmpty(allCourseUnits.edges)" />
                <div class="accord" id="accordion">
                    <q-list ref="contentList" class="rounded-borders">
                        <transition-group
                            appear
                            enter-active-class="animated fadeIn"
                            leave-active-class="animated fadeOut"
                        >
                            <q-expansion-item
                                header-class="text-white"
                                class="card"
                                ref="card"
                                v-for="unit in allCourseUnits.edges"
                                :key="unit.node.id"
                            >
                                <template slot="header">
                                    <contentHeader
                                        :headerText="unit.node.title"
                                    />
                                </template>

                                <div
                                    id="collapseOne"
                                    class="collapse show"
                                    aria-labelledby="headingOne"
                                    data-parent="#accordion"
                                >
                                    <div @click="clickedItem" class="card-body">
                                        <q-item
                                            style="width: 95%"
                                            v-for="content in unit.node
                                                .courseunitcontentSet.edges"
                                            :key="content.node.id"
                                            clickable
                                            v-ripple
                                        >
                                            <classContentItem
                                                :content="content.node"
                                                :courseId="course.pk"
                                            />
                                        </q-item>
                                    </div>
                                </div>
                            </q-expansion-item>
                        </transition-group>
                    </q-list>
                </div>
            </div>
        </div>
        <div class="col-lg-7 ">
            <q-skeleton
                v-if="lodash.isEmpty(currentContent)"
                height="500px"
                square
            />
            <div v-else class="vedio">
                <q-inner-loading :showing="visible">
                    <q-spinner-gears size="50px" color="primary" />
                </q-inner-loading>
                <div
                    class="megx"
                    v-if="!lodash.isEmpty(currentContent)"
                    disable="1"
                >
                    <!-- <q-video
                        :ratio="13 / 11"
                        controls = "false"
                        @play="StartPlayingTheLesson"
                        :src="
                            prepareVideoUrl(
                                JSON.parse(currentContent.modelValue).video
                            )
                        "
                    /> -->
                    <vimeo-player
                        ref="player"
                        class="megx"
                        @loaded="visible = false"
                        @play="startlearningUnitTraking"
                        @ended="endlearningUnitTraking"
                        :video-id="vimoID"
                    ></vimeo-player>

                    <!-- <vimeo-player
                        ref="player"
                        class="megx"
                        heigth="100%"
                        width="100%"
                        @play="StartPlayingTheLesson"
                        @pause="StartPlayingTheLesson"
                        @progress="StartPlayingTheLesson"
                        @ended="StartPlayingTheLesson"
                        :video-id="507727334"
                    ></vimeo-player> -->
                </div>
                <div v-else class="megx">
                    <img src="~assets/img/pexels.png" alt="" />
                    <img
                        class="play"
                        @click="startlearningUnitTraking"
                        src="~assets/img/player.png"
                        alt=""
                    />
                </div>
                <div class="arrow">
                    <div
                        @click="GoToThePrevLesson"
                        :disabled="!hasPrevContent"
                        class="next"
                    >
                        <img src="~assets/img/previous.png" alt="" />
                        <h3>{{$t('الدرس السابق')}}</h3>
                    </div>
                    <div
                        @click="GoToTheNexLesson"
                        :disabled="!hasNextContent"
                        class="next"
                    >
                        <h3>{{$t('الدرس التالي')}}</h3>
                        <img src="~assets/img/next.png" alt="" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { StartLearningUnit } from "src/queries/learning_management/mutation/StartLearningUnit";
import { EndLearningUnit } from "src/queries/learning_management/mutation/EndLearningUnit";
import { GetAllLearningProgressByCourse } from "src/queries/learning_management/query/GetAllLearningProgressByCourse";
// import { GetCourseByID } from "src/queries/course_management/query/GetCourseByID";

import skeletonList from "src/components/skeleton/skeletonList";
import contentHeader from "components/utils/contentHeader";
import classContentItem from "components/courseClass/classContentItem";
import { GetAllCourseUnitsByCourseID } from "src/queries/course_management/query/GetAllCourseUnitsByCourseID";
import { mapState, mapActions } from "vuex";
import _ from "lodash";

export default {
    data() {
        return {
            counter: 0,
            isOpen: false,
            visible: true,
            vimoID: 507727334,
            startLearningTrackingID: "",
            courseEnrollment: "",
            hasNextContent: true,
            hasPrevContent: false,
            lodash: _,
            allCourseUnits: {
                type: Object
            }
        };
    },

    components: {
        classContentItem,
        skeletonList,
        contentHeader
    },

    computed: {
        ...mapState("courseManagement", [
            "selectedClassUnitContent",
            "contentLists",
            "currentContent"
        ]),
        ...mapState("learningProgress", ["enrollmentId"])
    },

    beforeDestroy() {
        // TODO: If the learning tracker is started, end it
        this.endlearningUnitTraking();
    },

    watch: {
        currentContent(value) {
            this.vimoID = 76979871;
            this.visible = true;

            const currentContentIndex = _.indexOf(this.contentLists, value);
            // TODO: Is this content has NEXT content
            if (this.contentLists[currentContentIndex + 1] === undefined) {
                this.hasNextContent = false;
            } else {
                this.hasNextContent = true;
            }

            // TODO: Is this content has PREV content
            if (this.contentLists[currentContentIndex - 1] === undefined) {
                this.hasPrevContent = false;
            } else {
                this.hasPrevContent = true;
            }

            // TODO: If the learning tracker is started, end it
            this.endlearningUnitTraking();
        },

        contentLists(val) {
            // TODO: initialize the class with the first video
            this.setCurrentContentAction(val[0]);
        }
    },

    props: ["course"],

    apollo: {
        allCourseUnits: {
            query() {
                return GetAllCourseUnitsByCourseID;
            },

            variables() {
                return {
                    courseID: this.course.id
                };
            }
        }
    },

    updated() {
        if (this.counter === 0) {
            // TODO: When the page is updated, select the first content and activate it
            const infoes = document.querySelectorAll(".info");
            infoes[0].classList.add("active");
            this.counter += 10;
        }
    },

    methods: {
        ...mapActions("courseManagement", ["setCurrentContentAction"]),
        /////////////////////////////////////////////////////////////
        // Start Learning Tracking
        /////////////////////////////////////////////////////////////
        async startlearningUnitTraking() {
            if (!this.startLearningTrackingID) {
                // TODO: 1) Fill the progress data
                const progressData = {
                    courseId: this.course.pk,
                    enrollmentId: this.enrollmentId,
                    courseUnitId: this.currentContent.courseUnit.pk,
                    courseUnitContentId: this.currentContent.pk
                };
                // TODO: 2) Start lesson tracking
                const startTrackingResult = await this.$apollo.mutate({
                    mutation: StartLearningUnit,
                    variables: {
                        progressData: progressData
                    }
                });

                if (
                    this.$_.get(
                        startTrackingResult,
                        "[data][startLearningUnit][success]"
                    )
                ) {
                    // this.$q.notify({
                    //     color: "success",
                    //     textColor: "white",
                    //     position: "top",
                    //     icon: "cloud_done",
                    //     message: "بدا الدرس"
                    // });
                    this.startLearningTrackingID = this.$_.get(
                        startTrackingResult,
                        "[data][startLearningUnit][learning][pk]"
                    );
                    this.isOpen = true;
                }
                if (
                    this.$_.get(
                        startTrackingResult,
                        "[data][startLearningUnit][errors]"
                    )
                ) {
                    this.$q.notify({
                        color: "negative",
                        textColor: "white",
                        position: "top",
                        icon: "cloud_done",
                        message: this.$_.get(
                            startTrackingResult,
                            "[data][startLearningUnit][errors]"
                        ).nonFieldErrors
                    });
                }
            }
        },

        /////////////////////////////////////////////////////////////
        // End Learning Tracking
        /////////////////////////////////////////////////////////////
        async endlearningUnitTraking() {
            if (this.startLearningTrackingID) {
                // TODO: 1) Fill the end learning tracker data
                const progressData = {
                    courseId: this.course.pk,
                    enrollmentId: this.enrollmentId,
                    courseUnitId: this.currentContent.courseUnit.pk,
                    courseUnitContentId: this.currentContent.pk
                };
                // TODO: 2) End Learning tracker
                const endTrackingResult = await this.$apollo.mutate({
                    mutation: EndLearningUnit,
                    variables: {
                        progressData: progressData,
                        progressId: this.startLearningTrackingID
                    },
                    refetchQueries: [
                        {
                            query: GetAllLearningProgressByCourse,
                            variables: {
                                enrollmentId: this.enrollmentId,
                                courseId: this.course.pk
                            }
                        }
                        // {
                        //     query: GetCourseByID,
                        //     variables: {
                        //         courseId: this.course.pk
                        //     }
                        // }
                    ]
                });
                if (
                    this.$_.get(
                        endTrackingResult,
                        "[data][endLearningUnit][success]"
                    )
                ) {
                    // TODO: empty the start tracking progress id
                    this.startLearningTrackingID = "";
                }
            }
        },

        clickedItem(e) {
            // TODO: remove the active class from all the contents
            const infoes = document.querySelectorAll(".info");
            for (const info of infoes) {
                info.classList.remove("active");
            }

            // TODO: if the clicked item is the class info make it active
            if (_.indexOf(e.target.classList, "info") === 0) {
                e.target.classList.add("active");
            }

            // TODO: if the clicked item is not class info, search about it and make it active
            if (_.indexOf(e.target.classList, "q-item") === -1) {
                e.target.parentNode.classList.add("active");
            } else {
                for (const item of e.target.childNodes) {
                    item.classList.add("active");
                }
            }
        },

        // TODO: Go to the next lesson
        GoToTheNexLesson() {
            // TODO: End the learning tracker vido
            this.endlearningUnitTraking();
            // TODO: Go to next lesson
            const currentContentIndex = _.indexOf(
                this.contentLists,
                this.currentContent
            );
            const nextContent = this.contentLists[currentContentIndex + 1];
            // TODO: Is this content has NEXT content
            if (nextContent === undefined) {
                this.hasNextContent = false;
            } else {
                this.hasNextContent = true;
                this.setCurrentContentAction(nextContent);
            }

            // TODO: Is this content has PREV content
            if (this.contentLists[currentContentIndex - 1] === undefined) {
                this.hasPrevContent = false;
            } else {
                this.hasPrevContent = true;
            }
        },

        // TODO: Go to the previouse lesson
        GoToThePrevLesson() {
            // TODO: End the learning tracker vido
            this.endlearningUnitTraking();
            // TODO: Got to previouse lesson
            const currentContentIndex = _.indexOf(
                this.contentLists,
                this.currentContent
            );
            const prevContent = this.contentLists[currentContentIndex - 1];
            // TODO: Is this content has NEXT content
            if (this.contentLists[currentContentIndex + 1] === undefined) {
                this.hasNextContent = false;
            } else {
                this.hasNextContent = true;
            }

            // TODO: Is this content has PREV content
            if (prevContent === undefined) {
                this.hasPrevContent = false;
            } else {
                this.hasPrevContent = true;
                this.setCurrentContentAction(prevContent);
            }
        },

        prepareVideoUrl(videoUrl) {
            const i = videoUrl.indexOf("v");
            const videoKey = videoUrl.slice(i + 2);
            return "https://www.youtube.com/embed?=" + videoKey;
        }
    }
};
</script>

<style lang="scss">
.q-inner-loading {
    top: 10% !important;
    right: 50% !important;
}
#vimeo-player-1 > iframe {
    height: 100%;
    width: 100%;
}
.card-body {
    padding: 0 !important;
    margin-right: 20px !important;
}
.q-card__section--vert {
    padding: 0 !important;
}
.q-item__section--side {
    display: none;
    visibility: hidden;
    width: 0;
}
.item-active {
    background-color: #fcd462 !important;
    color: #fff;
}
// .unint {
//     @media(max-width:767px){
//         flex-direction: column-reverse !important;  
//     }
// }
</style>
