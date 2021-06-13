<template>
<div>
    <div class="info">
        <div class="mage">
            <img v-if="content.isFree" src="~assets/img/unlock.png" alt="" />
            <img v-else src="~assets/img/padlock.png" alt="" />
        </div>
        <h3 class="video" v-if="content.isFree"  @click="OPEN_FREE_VIDEO_COURSE(content)">{{ formatTitle }}</h3>
        <h3 v-else >{{ formatTitle }}</h3>
    </div>

    <q-dialog v-model="card">
      <q-card class="my-card">
        <q-video
          :ratio="16/9"
          :src="videoUrl"
        />

        <q-card-section>
          <div class="row no-wrap items-center" style="margin-left: 0;">
            <div class="col text-h6 ellipsis text-center">
              {{formatTitle}}
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
</div>
</template>

<script>
export default {
  data () {
    return {
      card: false,
      videoUrl: ''
    }
  },
  props: ['content'],
  computed: {
    formatTitle () {
      const result = JSON.parse(this.content.modelValue)
      if (this.content.modelName === 'ContentFile') {
        return result.attachment.split('/attachment/')[1]
      }
      return result.title
    }
  },
  methods: {
    OPEN_FREE_VIDEO_COURSE (content) {
      //TODO: Open the video card dialog
      this.card = true
      const video = JSON.parse(content.modelValue).video 
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
}
</script>

<style lang="scss">
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
