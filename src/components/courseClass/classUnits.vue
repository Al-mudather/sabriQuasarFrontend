<template>

    <div class="row unitContent">
        <div class="col-lg-4 col-xs-12">
            <div class="asid">
                <div class="titel">
                    <img src="~assets/img/tit2.png" alt="" />
                    <h3>{{$t('المحتــوى')}}</h3>
                    <div class="butt" v-if="false">
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
        <div class="col-lg-8 col-xs-12">
            <q-skeleton
                v-if="lodash.isEmpty(currentContent)"
                height="500px"
                square
            />
            <div v-else class="vedio">
                <!-- <q-inner-loading :showing="visible">
                    <q-spinner-gears size="10vh" color="primary" />
                </q-inner-loading> -->
                <div
                    class="megx"
                    v-if="!lodash.isEmpty(currentContent)"
                    disable="1"
                >
                    <q-video
                        :ratio="13 / 11"
                        ref="videoPlayer"
                        controls = "false"
                        id="video"
                        @loaded="PLAYER_IS_LOADED"
                        @onPlay="START_LEARNING_UNIT_TRAKING"
                        @ended="END_LEARNING_UNIT_TRAKING"
                        :src="viomURL"
                    />

                    <!-- <video
                        id="my-video"
                        class="video-js"
                        controls
                        preload="auto"
                        width="640"
                        height="264"
                        poster="MY_VIDEO_POSTER.jpg"
                        :data-setup='{ "techOrder": ["vimeo"], "sources": [{ "type": "video/vimeo", "src": viomURL}], "vimeo": { "color": "#fbc51b"} }'
                    >
                    </video> -->
                    <!-- <videojsVimeo
                        ref="videoPlayer"
                        class="video-player-box"
                        :options="playerOptions"
                        @play="START_LEARNING_UNIT_TRAKING"
                        @ready="END_LEARNING_UNIT_TRAKING"
                    >
                    </videojsVimeo> -->
                    <!-- <video
                        id="my-video"
                        class="video-js"
                        controls
                        preload="auto"
                        width="640"
                        height="264"
                        poster="MY_VIDEO_POSTER.jpg"
                        data-setup="{}"
                    >
                        <source :src="viomURL" type="video/vimeo" />
                        <p class="vjs-no-js">
                            To view this video please enable JavaScript.
                        </p>
                    </video> -->
                    <!-- <div id="made-in-ny" :data-vimeo-url="GET_VIMO_VIDEO_URL" class="megx"></div> -->
                    <!-- <iframe id="iframe" :src="viomURL"  frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe> -->
                    <!-- <vimeo-player
                        ref="player"
                        class="megx"
                        @loaded="VIMO_PLAYER_IS_LOADED"
                        @play="START_LEARNING_UNIT_TRAKING"
                        @ended="END_LEARNING_UNIT_TRAKING"
                        @playbackratechange="DATA_CHANGED"
                        :video-url="GET_VIMO_VIDEO_URL"
                        :video-id="null"
                        :options="options"
                    ></vimeo-player> -->

                    <!-- <iframe 
                        :src="viomURL"
                        width="100%" 
                        height="100%" 
                        frameborder="0"
                        @loaded="VIMO_PLAYER_IS_LOADED"
                        @play="START_LEARNING_UNIT_TRAKING"
                        @ended="END_LEARNING_UNIT_TRAKING"
                        webkitallowfullscreen 
                        mozallowfullscreen
                        allowfullscreen>
                    </iframe> -->

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
                        @click="START_LEARNING_UNIT_TRAKING"
                        src="~assets/img/player.png"
                        alt=""
                    />
                </div>
                <div class="arrow">
                    <div
                        @click="GO_TO_THE_PREVIOUS_LESSON"
                        :disabled="!hasPrevContent"
                        class="next"
                    >
                        <img src="~assets/img/previous.png" alt="" />
                        <h3>{{$t('الدرس السابق')}}</h3>
                    </div>
                    <div
                        @click="GOT_TO_THE_NEXT_LESSON"
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
<script src="../../../node_modules/video.js/dist/video.min.js"></script> 
<script src="../dist/Vimeo.min.js"></script> 
<script>

import { StartLearningUnit } from 'src/queries/learning_management/mutation/StartLearningUnit';
import { EndLearningUnit } from 'src/queries/learning_management/mutation/EndLearningUnit';
import { GetAllLearningProgressByCourse } from 'src/queries/learning_management/query/GetAllLearningProgressByCourse';
// import { GetCourseByID } from 'src/queries/course_management/query/GetCourseByID';

import skeletonList from 'src/components/skeleton/skeletonList';
import contentHeader from 'components/utils/contentHeader';
import classContentItem from 'components/courseClass/classContentItem';
import { GetAllCourseUnitsByCourseID } from 'src/queries/course_management/query/GetAllCourseUnitsByCourseID';
import { mapState, mapActions } from 'vuex';
import _ from 'lodash';
import playerjs from 'player.js'

export default {
    data() {
        return {
            counter: 0,
            isOpen: false,
            visible: true,
            vimoID: '',
            viomURL: '',
            VideoPlayer: '',
            playerOptions: {
                playbackRates: [0.5, 1.0, 1.5, 2.0], //可选择的播放速度
                height: '166', // 视频默认高度
                autoplay: false, //如果true,浏览器准备好时开始回放。
                muted: false, // 默认情况下将会消除任何音频。
                loop: false, // 视频一结束就重新开始。
                preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
                language: 'zh-CN',
                aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
                fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
                sources: [
                    {
                        type: 'video/mp4', // 视频类型 ： type: "video/mp4",
                        src: '' //视频源url地址
                    }
                ],
                poster: '', //你的封面地址
                // width: document.documentElement.clientWidth,
                notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
                controlBar: {
                    timeDivider: true, //当前时间和持续时间的分隔符
                    durationDisplay: true, //显示持续时间
                    remainingTimeDisplay: false, //是否显示剩余时间功能
                    fullscreenToggle: true //全屏按钮
                }
            },
            startLearningTrackingID: '',
            courseEnrollment: '',
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
        ...mapState('courseManagement', [
            'selectedClassUnitContent',
            'contentLists',
            'currentContent'
        ]),
        ...mapState('learningProgress', ['enrollmentId']),
    },

    // mounted () {
    //     document.on('load', () => {
    //         const iframe = this.$_.get(this.$refs,'videoPlayer')
    //         console.log('XXXXXXXXXXXX')
    //         console.log(iframe)
    //         console.log('XXXXXXXXXXXX')
    //     })

    // },

    beforeDestroy() {
        // TODO: If the learning tracker is started, end it
        this.END_LEARNING_UNIT_TRAKING();
        //TODO: reset the content list, so the video player can be initialized
        this.resetContentListsAction()
    },

    watch: {

        currentContent(value) {

            this.viomURL = this.GET_VIMO_VIDEO_URL(value.modelValue)

            // const player = new playerjs.Player(iframe)
            // //TODO: Play the video
            this.playerOptions.sources = [
                {
                    type: 'video/vimeo',
                    // type: 'video/mp4',
                    src: this.viomURL
                }
            ]
            // console.log(this.playerOptions.sources)
            // this.playVideo(this.viomURL)
            // ?loop=false&amp;byline=false&amp;portrait=false&amp;title=false&amp;speed=true&amp;transparent=0&amp;gesture=media
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
            this.END_LEARNING_UNIT_TRAKING();
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

    // mounted () {
    //     console.log('???????????????')
    //     console.log(playerjs)
    //     console.log('???????????????')
    // },

    updated() {
        if (this.counter === 0) {
            // TODO: When the page is updated, select the first content and activate it
            const infoes = document.querySelectorAll('.info');
            infoes[0].classList.add('active');

            this.counter += 10;
        }
    },

    methods: {
        ...mapActions('courseManagement', ['setCurrentContentAction', 'resetContentListsAction']),

        playVideo (source) {
            const video = {
                withCredentials: false,
                type: 'application/x-mpegurl',
                src: source
            }

            this.player.reset()
            this.player.src(video)
            this.player.play()
        },


        GET_VIMO_VIDEO_URL (data) {
            try {
                const video = JSON.parse(data).video;
                // this.viomURL = 'https://player.vimeo.com/video/' +  String(video)
                //TODO: If the video from the youtube git it
                const i = video.indexOf('v');
                const videoKey = video.slice(i + 2);
                if ( video.indexOf('youtube') > 0) {
                   return 'https://www.youtube.com/embed?=' + videoKey;
                } else {
                    //TODO: if the video from the vimeo git it
                   return 'https://player.vimeo.com/video/' +  String(video);
                }
            } catch (error) {
                
            }
        },

        PLAYER_IS_LOADED () {
            this.visible = false
            // const controls = document.querySelector('#player')
            console.log('CCCCCCCCCCCCCCCC')
            console.log('ssssssssssssssssssssssssssssssssssssssss')
            console.log('CCCCCCCCCCCCCCCC')
            
        },

        /////////////////////////////////////////////////////////////
        // Start Learning Tracking
        /////////////////////////////////////////////////////////////
        async START_LEARNING_UNIT_TRAKING() {
            console.log('ggggggggggggggggggggg')
            console.log('Starting')
            console.log('ggggggggggggggggggggg')
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
                        '[data][startLearningUnit][success]'
                    )
                ) {
                    this.startLearningTrackingID = this.$_.get(
                        startTrackingResult,
                        '[data][startLearningUnit][learning][pk]'
                    );
                    this.isOpen = true;
                }
                if (
                    this.$_.get(
                        startTrackingResult,
                        '[data][startLearningUnit][errors]'
                    )
                ) {
                    this.$q.notify({
                        color: "negative",
                        textColor: "white",
                        position: "top",
                        icon: "cloud_done",
                        message: this.$_.get(
                            startTrackingResult,
                            '[data][startLearningUnit][errors]'
                        ).nonFieldErrors
                    });
                }
            }
        },

        /////////////////////////////////////////////////////////////
        // End Learning Tracking
        /////////////////////////////////////////////////////////////
        async END_LEARNING_UNIT_TRAKING() {
            console.log('kkkkkkkkkkkkkkkkkkkkk')
            console.log('Ending')
            console.log('kkkkkkkkkkkkkkkkkkkkk')
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
                        '[data][endLearningUnit][success]'
                    )
                ) {
                    // TODO: empty the start tracking progress id
                    this.startLearningTrackingID = '';
                }
            }
        },

        clickedItem(e) {
            // TODO: remove the active class from all the contents
            const infoes = document.querySelectorAll('.info');
            for (const info of infoes) {
                info.classList.remove('active');
            }

            // TODO: if the clicked item is the class info make it active
            if (_.indexOf(e.target.classList, 'info') === 0) {
                e.target.classList.add('active');
            }

            // TODO: if the clicked item is not class info, search about it and make it active
            if (_.indexOf(e.target.classList, 'q-item') === -1) {
                e.target.parentNode.classList.add('active');
            } else {
                for (const item of e.target.childNodes) {
                    item.classList.add('active');
                }
            }
        },

        // TODO: Go to the next lesson
        GOT_TO_THE_NEXT_LESSON() {
            // this.player.setVideoUrl(this.viomURL)
            // TODO: End the learning tracker vido
            this.END_LEARNING_UNIT_TRAKING();
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
        GO_TO_THE_PREVIOUS_LESSON() {
            // TODO: End the learning tracker vido
            this.END_LEARNING_UNIT_TRAKING();
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
            const i = videoUrl.indexOf('v');
            const videoKey = videoUrl.slice(i + 2);
            return 'https://www.youtube.com/embed?=' + videoKey;
        }
    }
};
</script>

<style lang="scss">

.hide-controls {
    display: none;
    visibility: hidden;
    width: 0;
}
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
.unitContent {
    height: 100%;
    @media(max-width:991px){
        flex-direction: column-reverse !important;  
    }

    & > * {
        @media(max-width:991px){
            padding-right: 0 !important;
            padding-left: 0 !important;
        } 
    }

}

.q-tabs__content {
    @media(max-width:991px){
        flex-wrap: nowrap !important;
        overflow: auto;
        // margin-top: 5rem;
    }
}
#myTab {
    @media(max-width:991px){
        margin-top: 5rem;
    }
}

.hedder > .title {
    @media(max-width:991px){
        margin-bottom: 1rem;
    }

}
// .unitContent > * {
//     @media(max-width:991px){
//         padding-right: 0 !important;
//         padding-left: 0 !important;
//     } 
// }
</style>
