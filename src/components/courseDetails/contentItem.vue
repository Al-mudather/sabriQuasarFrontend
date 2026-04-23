<template>
<div>
    <component
      :is="content.isFree ? 'button' : 'div'"
      class="content-row"
      :class="{ 'content-row--locked': !content.isFree, 'content-row--free': content.isFree }"
      :type="content.isFree ? 'button' : null"
      @click="content.isFree && OPEN_FREE_VIDEO_COURSE($event, content)"
    >
      <span class="content-row__icon" aria-hidden="true">
        <img v-if="content.isFree" src="~assets/img/unlock.png" alt="" />
        <img v-else src="~assets/img/padlock.png" alt="" />
      </span>
      <span class="content-row__title">{{ formatTitle }}</span>
      <ds-badge v-if="content.isFree" variant="success" size="sm">{{ $t('مجاني') }}</ds-badge>
    </component>

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

<style lang="scss" scoped>
.content-row {
  display: flex;
  align-items: center;
  gap: var(--ds-space-3);
  inline-size: 100%;
  text-align: inherit;
  padding: var(--ds-space-2) var(--ds-space-3);
  border: 0;
  border-radius: var(--ds-radius-md);
  background: transparent;
  color: var(--ds-text);
  font-family: var(--ds-font-body);
  font-size: var(--ds-text-sm);
  line-height: var(--ds-leading-normal);
  transition:
    background-color var(--ds-duration-fast) var(--ds-ease-out),
    color            var(--ds-duration-fast) var(--ds-ease-out);

  &--locked {
    color: var(--ds-text-muted);
    cursor: default;
  }

  &--free {
    cursor: pointer;
    &:hover {
      background: var(--ds-brand-50);
      color: var(--ds-brand-700);
    }
    &:focus-visible {
      outline: 2px solid transparent;
      box-shadow: var(--ds-shadow-focus);
    }
  }

  &__icon {
    flex-shrink: 0;
    inline-size: 1.15rem;
    block-size: 1.15rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    img { max-inline-size: 100%; max-block-size: 100%; opacity: 0.7; }
  }

  &--free &__icon img { opacity: 1; }

  &__title {
    flex: 1;
    min-inline-size: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>

