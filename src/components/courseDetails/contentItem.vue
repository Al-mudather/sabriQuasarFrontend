<template>
<div>
  <!-- <pre>{{content}}</pre> -->
    <div class="info flex q-mb-sm">
        <div class="mage q-ml-sm">
          <!-- <img v-if="content.isFree" src="~assets/img/unlock.png" alt="" /> -->
          <img v-if="content.isFree" src="~assets/img/unlock.png" alt="" />
          <img v-else src="~assets/img/padlock.png" alt="" />
        </div>
        <h6 class="video" v-if="content.isFree"  @click="OPEN_FREE_VIDEO_COURSE($event ,content)">{{ formatTitle }}</h6>
        <h6 v-else >{{ formatTitle }}</h6>
    </div>

    <q-dialog v-model="card" persistent>
      <q-card class="my-card">
        <AlhasifVideoPlayer ref="alhasifPlayer" id="videoPlayer" v-if="video_type === 'TYPE_HASIF' " :videoUuid="videoUuid" />
        <div v-else>
          <div v-show="player" style="padding-top:56.25%;position:relative;">
            <div style="border:0;max-width:100%;position:absolute;top:0;left:0;height:100%;width:100%; padding-bottom: 2rem;"  id="videoPlayer" :data-id="$_.get(content, '[pk]')"></div>
          </div>
          <div v-if="!player">
            <div v-if="cipherVideo" v-html="cipherVideo"></div>
            <q-video
              v-else
              :ratio="16/9"
              :src="videoUrl"
            />
          </div>
        </div>
        <!-- <div v-show="player" style="padding-top:56.25%;position:relative;">
          <AlhasifVideoPlayer ref="alhasifPlayer" id="videoPlayer" v-if="video_type === 'TYPE_HASIF' " :videoUuid="videoUuid" />
          <div v-else style="border:0;max-width:100%;position:absolute;top:0;left:0;height:100%;width:100%; padding-bottom: 2rem;"  id="videoPlayer" :data-id="$_.get(content, '[pk]')"></div>
        </div>
        <div v-if="!player">
          <div v-if="cipherVideo" v-html="cipherVideo"></div>
          <q-video
            v-else
            :ratio="16/9"
            :src="videoUrl"
          />
        </div> -->

        <q-card-section>
          <div class="row no-wrap items-center" style="margin-left: 0;">
            <div class="col text-h6 ellipsis text-center">
              {{formatTitle}}
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="center" style="width: 100%;">
          <q-btn label="Stop the video" @click="UNINITIALIZE_THE_VIDEO" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
</div>
</template>

<script>
import videoPlayer from 'src/utils/video-client.js'
import AlhasifVideoPlayer from 'src/utils/AlhasifVideoPlayer.vue'

import {mapGetters} from 'vuex'

export default {
  data () {
    return {
      card: false,
      player: null,
      cipherVideo: null,
      videoUrl: '',
      video_type: "",
      videoUuid: null,
    }
  },
  props: ['content'],
  components: {
    AlhasifVideoPlayer
  },
  // mounted () {
  //   console.log('cccccccccccccccc')
  //   console.log(this.content)
  //   console.log('cccccccccccccccc')
  // },
  computed: {
    ...mapGetters("authentication", ["token"]),

    formatTitle () {
      const result = JSON.parse(this.content.modelValue)
      if (this.content.modelName === 'ContentFile') {
        return result.attachment.split('/attachment/')[1]
      }
      if (this.content.modelName === 'ContentQuiz') {
        return result.quiz_title
      }
      return result.title
    }
  },

  methods: {
    PREPARE_THE_SMART_NOD_VIDEO (video_metadata) {
      this.videoLoaded = true

      setTimeout(() => {
        this.UNINITIALIZE_THE_VIDEO ()
        const key = this.$_.get(video_metadata, "[path]") ? this.$_.get(video_metadata, "[path]") : this.$_.get(video_metadata, "[id]")
        // this.player= new videoPlayer('dev', `http://localhost:8000/api/course/video/auth`)
        this.player= new videoPlayer('prod', `${location.origin}/api/course/video/auth`)
        //TODO: The play function take =>> the video key / the inrollment / the course pk
        try {
          this.player.play(`[data-id="${this.$_.get(this.content, '[pk]')}"]`,key, 7 , this.$_.get(this.$route, '[params][pk]'))
        } catch (error) {
          this.$q.notify({
              type: 'warning',
              multiLine: true,
              progress: true,
              message: "هنالك ضعف في الشبكه, من فضلك اعد تحميل الصفحه و قم بشغيل الفيديو مجددا"
          })
        }
      }, 1000);
    },

    UNINITIALIZE_THE_VIDEO () {
      try {
        this.player.uninitializeTheVideo()
        } catch (error) {
      }
    },

    OPEN_FREE_VIDEO_COURSE (e, content) {
      try {
        e.preventDefault();
        //TODO: empty the cipher
        this.cipherVideo = null
        //TODO: Unintialize the player
        this.player = null
        //TODO: Unintialize the alhasif videoUuid
        this.videoUuid = null
        this.video_type = null
        //TODO: Open the video card dialog
        this.card = true
        const contentData = JSON.parse(content.modelValue)
        const video_metadata = this.$_.get(contentData, '[video_metadata]')
        this.video_type = this.$_.get(contentData, '[video_type]')

        // console.log(this.$_.get(video_metadata,'[videoData][videoUuid]'))
        // console.log('gggggggggggggggggg')
        if (video_metadata) {
          if ( this.video_type === 'TYPE_HASIF' ) {
            // this.$refs.alhasifPlayer.STOP_THE_VIDEO_PLAYER()
            this.videoUuid = this.$_.get(video_metadata,'[videoData][videoUuid]')
          } else {
            //TODO: run the video
            this.PREPARE_THE_SMART_NOD_VIDEO(video_metadata)
          }
        } else {
          const cipher = this.$_.get(contentData, '[cipher_iframe]')
           if (cipher) {
            this.cipherVideo = cipher
          } else {
            const video = this.$_.get(contentData, '[video]')
            //TODO: If the video from the youtube git it
            const i = video.indexOf("v");
            const videoKey = video.slice(i + 2);
            if ( video.indexOf('youtube') > 0) {
              this.videoUrl =  "https://www.youtube.com/embed?=" + videoKey;
            } else {
              //TODO: if the video from the vimeo git it
              this.videoUrl =  'https://player.vimeo.com/video/' +  String(video);
            }
          }

        }
      } catch (error) {

      }

    }
  }
}
</script>

<style lang="scss">
.vjs-button {
  background-color: transparent !important;
}

.my-card {
  width: 100rem;
  min-width: 23rem;
}
.video {
  cursor: pointer;
  color: $positive !important;
  transition: all ease-in-out 0.3s;
  backface-visibility: hidden;

  &:hover {
    transform: scale(1.05);
  }
}
</style>
