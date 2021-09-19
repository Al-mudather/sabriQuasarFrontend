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
                                            v-show="content.node.modelName === 'ContentVideo'"
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
            <!-- <div style="padding-top:56.25%;position:relative;">
            <iframe src="https://player.vdocipher.com/playerAssets/1.x/vdo/embed/index.html#otp=20160313versUSE323ki2XFnmmzAwxxVxW3cJqivFXAvCSaIgvdgMOrpne9r6z4K&playbackInfo=eyJ2aWRlb0lkIjoiNTRkZWI0MmQ1ZGQ0NDk5NzlkMWJlNTY1NTg4MjExYjQifQ==" style="border:0;max-width:100%;position:absolute;top:0;left:0;height:100%;width:100%;" allowFullScreen="true" allow="encrypted-media"></iframe>
            </div> -->
            <!-- <div ref="embedBox" v-html="VideoData">

            </div> -->
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
                    v-if="!lodash.isEmpty(currentContent)"
                    disable="1"
                >
                    <!-- <q-video
                        :ratio="13 / 11"
                        ref="videoPlayer"
                        controls = "false"
                        id="video"
                        @playing="START_LEARNING_UNIT_TRAKING"
                        @loaded="PLAYER_IS_LOADED"
                        @onPlay="START_LEARNING_UNIT_TRAKING"
                        @ended="END_LEARNING_UNIT_TRAKING"
                        :src="viomURL"
                    /> -->
                    <q-video
                        :ratio="13 / 11"
                        ref="videoPlayer"
                        controls = "false"
                        id="video"
                        @playing="START_LEARNING_UNIT_TRAKING"
                        @loaded="PLAYER_IS_LOADED"
                        @onPlay="START_LEARNING_UNIT_TRAKING"
                        @ended="END_LEARNING_UNIT_TRAKING"
                        allow="encrypted-media"
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
                        ref="video-player"
                        class="video-js vjs-big-play-centered"
                        controls
                        preload="auto"
                        width="640"
                        height="264"
                        data-setup="{}"
                    >
                        <source :src="viomURL" type="application/x-mpeg-url" />
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
                        :video-url="viomURL"
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
                        @play="START_LEARNING_UNIT_TRAKING"
                        @pause="START_LEARNING_UNIT_TRAKING"
                        @progress="START_LEARNING_UNIT_TRAKING"
                        @ended="START_LEARNING_UNIT_TRAKING"
                        :video-id="'507727334'"
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
<script src="https://player.vdocipher.com/playerAssets/1.6.10/vdo.js"></script>

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
// import playerjs from 'player.js'

export default {
    data() {
        return {
            counter: 0,
            isOpen: false,
            visible: true,
            vimoID: '',
            viomURL: '',
            VideoPlayer: '',
            VideoData: '',
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

    created() {
    },

    beforeDestroy() {
        // TODO: If the learning tracker is started, end it
        this.END_LEARNING_UNIT_TRAKING();
        //TODO: reset the content list, so the video player can be initialized
        this.resetContentListsAction()
    },

    watch: {

        currentContent(value) {
            // const el = this.$refs.videoPlayer
            // console.log('???????????????????????')
            // console.log(el)
            // console.log('???????????????????????')

            this.viomURL = this.GET_VIMO_VIDEO_URL(value.modelValue)

            // this.VideoData = JSON.parse(value.modelValue).video;
            // console.log('llllllllllllllllllllllllllll')
            // console.log(this.VideoData)
            // console.log('llllllllllllllllllllllllllll')

            // const player = new playerjs.Player(iframe)
            // //TODO: Play the video
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
            //TODO: Temp: Start traking the learning
            // this.START_LEARNING_UNIT_TRAKING()

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

    //     try {
    //         const video = new VdoPlayer({
    //             container: this.$refs['videoPlayer'],
    //         });

    //         console.log('????????????????')
    //         console.log(video)
    //         console.log('????????????????')

    //         // you can directly call any methods of VdoPlayer class from here. e.g:// 
    //         // video.addEventListener('load', () => {
    //         //     video.play(); 
    //         //     // this will auto-start the video//
    //         //     console.log('????????????????')
    //         //     console.log('loaded');//
    //         //     console.log('????????????????') 
    //         // });
    //     } catch (error) {
    //         console.log('eeeeeeeeeeeeeeeeeeeeeeeee')
    //         console.log(error);//
    //         console.log('eeeeeeeeeeeeeeeeeeeeeeeee')
            
    //     }
        
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
        },

        /////////////////////////////////////////////////////////////
        // Start Learning Tracking
        /////////////////////////////////////////////////////////////
        async START_LEARNING_UNIT_TRAKING() {
            // console.log('ggggggggggggggggggggg')
            // console.log('Starting')
            // console.log('ggggggggggggggggggggg')
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
            // console.log('kkkkkkkkkkkkkkkkkkkkk')
            // console.log('Ending')
            // console.log('kkkkkkkkkkkkkkkkkkkkk')
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

.hideItem {
    display: none !important;
    visibility: hidden !important;
    width: 0 !important;
    height: 0 !important;
}

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
