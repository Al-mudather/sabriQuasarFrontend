<template>

    <div class="row">
        <div class="col-lg-12 col-xs-12">
            <div class="asid">
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
                                default-opened
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
                                    <div @click="clickedItem($event)" class="card-body">
                                        <q-item
                                            style="width: 95%"
                                            v-for="content in unit.node
                                                .courseunitcontentSet.edges"
                                            :key="content.node.id"
                                            clickable
                                            v-ripple
                                        >
                                            <!-- v-show="content.node.modelName === 'ContentVideo'" -->
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
    </div>
</template>

<script>
// import { GetCourseByID } from 'src/queries/course_management/query/GetCourseByID';

import skeletonList from 'src/components/skeleton/skeletonList';
import contentHeader from 'components/utils/contentHeader.vue';
import classContentItem from 'components/courseClass/classContentItem.vue';
import { GetAllCourseUnitsByCourseID } from 'src/queries/course_management/query/GetAllCourseUnitsByCourseID';
import { mapState, mapActions } from 'vuex';
import _ from 'lodash';
import { openURL } from 'quasar'

export default {
    data() {
        return {
            counter: 0,
            videoLoaded: false,
            visible: true,
            vimoID: '',
            VideoPlayer: '',
            VideoData: '',
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
            'fileData',
            'selectedClassUnitContent',
            'startLearningTrackingID',
            'contentLists',
            'currentContent'
        ]),
        ...mapState('learningProgress', ['enrollmentId']),
    },

    beforeDestroy() {
        // TODO: If the learning tracker is started, end it
        // this.END_LEARNING_UNIT_TRAKING();
        //TODO: reset the content list, so the video player can be initialized
        this.resetContentListsAction()
    },

    watch: {
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

        const video = this.$refs['videoPlayer']
        const child = video.$el.firstChild
        child.addEventListener('load', () => {
            this.videoLoaded = true
        })
        
        if (this.counter === 0) {
            // TODO: When the page is updated, select the first content and activate it
            const infoes = document.querySelectorAll('.info');
            infoes[0].classList.add('active');

            this.counter += 10;
        }
    },

    methods: {
        ...mapActions('courseManagement', [
            'setCurrentContentAction'
        ]),

        downloadFile (fileURL) {
            openURL(location.origin + fileURL)
        },

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

        PLAYER_IS_LOADED () {
            this.visible = false
            // const controls = document.querySelector('#player')
        },

        clickedItem(e) {

            if (this.fileData) {
                this.downloadFile(this.fileData.attachment)
            }
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

        prepareVideoUrl(videoUrl) {
            const i = videoUrl.indexOf('v');
            const videoKey = videoUrl.slice(i + 2);
            return 'https://www.youtube.com/embed?=' + videoKey;
        }
    }
};
</script>

<style lang="scss">

.scroll {
    overflow: hidden;
}

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
        margin-top: 0.5rem;
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
