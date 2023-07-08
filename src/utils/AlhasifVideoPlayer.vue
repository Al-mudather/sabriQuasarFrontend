<template>
<div style="width: 100%; height: 52vh;">
  <video ref="videoPlayer" controls style="width: 100%; height: 52vh;" class="video-js vjs-theme-fantasy"></video>
</div>
</template>

<script>
import videojs from 'video.js';
import 'videojs-contrib-hls';
import 'videojs-contrib-quality-levels';
import videojsqualityselector from 'videojs-hls-quality-selector';
import _ from 'lodash';

export default {
  name: "VideoPlayer",
  props: ['videoUuid'],
  data() {
    return {
      player: null,
      videoID: null,
      videoOptions: {
        controlBar: {
          children: [
            'playToggle',
            'progressControl',
            'volumePanel',
            'qualitySelector',
            'fullscreenToggle',
          ],
        },
        // autoplay: true,
        controls: true,
        playbackRates: [0.5, 1, 1.5, 2],
        html5: {
          nativeAudioTracks: false,
          nativeVideoTracks: false,
          vhs: {
            cacheEncryptionKeys: true
          },
          hls: {
            overrideNative: true,
            debug: true,
            // withCredentials: true
          }
        },
        // sources: [
        //   {
        //     src: "http://localhost:8000/media/hls/b7301ccff06a51b8fc3894b7dae161b4/playlist.m3u8",
        //     type: "video/mp4"
        //   }
        // ]
      }
    }
  },

  mounted() {
    //TODO: intializ the video id
    this.videoID = this.videoUuid

    this.player = videojs(this.$refs.videoPlayer, this.videoOptions, function onPlayerReady() {
      this.hlsQualitySelector = videojsqualityselector


      this.hlsQualitySelector({
        displayCurrentQuality: true,
      });

    });

    this.playVideo(this.videoUuid)

    // this.player.src({
    //   src: `https://video.cdn1.stc.training/stream/hls/${this.videoID}/playlist.m3u8`,
    //   type: 'application/vnd.apple.mpegurl',
    //   keySystems: {
    //     'org.w3.clearkey': {
    //       // getLicense: function (emeOptions, keyMessage, callback) {
    //       //   console.log(emeOptions, keyMessage, callback)
    //       //   // request license
    //       //   // if err, callback(err)
    //       //   // if success, callback(null, license)
    //       // }
    //     }
    //   }
    // });

    // videojs.Hls.xhr.beforeRequest = (options) => {
    //   // options.uri = options.uri.replace('example.com', 'foo.com');
    //   if (options.uri.includes('.m3u8') || options.uri.includes('.ts')) {
    //     console.log('Getting Video: ', options);
    //     console.log("[*] Getting blob file as uri")
    //   } else {
    //     options.uri = `https://video.cdn1.stc.training/api/video/key/${this.videoID}/`;
    //     // console.log('Getting Key: ', options);
    //   }
    //   // console.log('Getting Key: ', options);
    //   return options;
    // };

  },
  beforeDestroy() {
    if (this.player) {
      this.player.dispose()
    }
  },

  watch: {
    videoUuid (val) {
      if (val) {
        this.playVideo(val)
      }
    }

  },

  methods: {
    async playVideo(videoUuid) {
      //TODO: initializ the video src path
      let src = `https://video.cdn1.stc.training/stream/hls/${videoUuid}/playlist.m3u8`
      this.player.src({
        src: src,
        type: 'application/vnd.apple.mpegurl',
        keySystems: {
          'org.w3.clearkey': {
            // getLicense: function (emeOptions, keyMessage, callback) {
            //   console.log(emeOptions, keyMessage, callback)
            //   // request license
            //   // if err, callback(err)
            //   // if success, callback(null, license)
            // }
          }
        }
      });

      videojs.Hls.xhr.beforeRequest = (options) => {
        // options.uri = options.uri.replace('example.com', 'foo.com');
        if (options.uri.includes('.m3u8') || options.uri.includes('.ts')) {
          // console.log('Getting Video: ', options);
          // console.log("[*] Getting blob file as uri")
        } else {
          options.uri = `https://video.cdn1.stc.training/api/video/key/${videoUuid}/`;
          // console.log('Getting Key: ', options);
        }
        // console.log('Getting Key: ', options);
        return options;
      };

    }
  },
}
</script>

<style scoped>
/* @import "https://unpkg.com/video.js/dist/video-js.min.css"; */
.video-js .vjs-time-control {
  display: block;
}
.video-js.vjs-http-source-selector{display:block !important}
</style>
