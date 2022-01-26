<template>
  <div class="row">
      <div class="col-lg-4 col-sm-4 col-xs-12">
          <div class="itemImg" style="left: -0.5rem;">                                  
              <!-- <img class="d-block w-100" :src="FORMAT_COURSE_COVER_IMAGE()" :alt="slider.slide.title">                                   -->
              <img class="d-block w-100" :src="FORMAT_THE_IAMGE_URL(slider.slide.cover)" :alt="slider.slide.title">                                  
          </div>
      </div>
      <div class="col-lg-8 col-sm-8 col-xs-12">
          <div class="allSize text-center">
              <div class="hedDet">
                  <h2>{{slider.slide.title}}</h2>
                  <p>{{slider.slide.brief}}</p>
              </div>
              <div class="conta">
                <vue-countdown-timer
                  class="text-h6"
                  :start-time="now"
                  :end-time="start"
                  :interval="1000"
                  :day-txt="'days'"
                  :hour-txt="'hours'"
                  :minutes-txt="'minutes'"
                  :seconds-txt="'seconds'"
                  >

                  <template slot="countdown" slot-scope="scope">
                    <div class="numb">
                        <svg xmlns="http://www.w3.org/2000/svg" width="71.515" height="68.729" viewBox="0 0 71.515 68.729">
                            <g id="Group_65738" data-name="Group 65738" transform="translate(-601.056 -367.622)">
                              <path id="Path_158457" data-name="Path 158457" d="M655.656,436.351a3.012,3.012,0,0,1-1.814-5.417,32.069,32.069,0,0,0,9.46-11.448,31.511,31.511,0,0,0,3.229-13.987,31.857,31.857,0,0,0-42.394-30.037,3.011,3.011,0,1,1-2-5.681,37.857,37.857,0,0,1,35.329,65.963A2.989,2.989,0,0,1,655.656,436.351ZM634.7,373.006A32.529,32.529,0,0,1,667.189,405.5a32.172,32.172,0,0,1-3.3,14.279,32.748,32.748,0,0,1-9.658,11.686,2.351,2.351,0,0,0-.461,3.289,2.4,2.4,0,0,0,3.29.461,37.477,37.477,0,0,0,11.047-13.369,36.84,36.84,0,0,0,3.776-16.346,37.216,37.216,0,0,0-49.527-35.093,2.349,2.349,0,1,0,1.559,4.432A32.416,32.416,0,0,1,634.7,373.006Z" fill="#a4b3c2"/>
                              <path id="Path_158458" data-name="Path 158458" d="M604.065,391.887a3.011,3.011,0,0,1-2.643-4.45,37.907,37.907,0,0,1,5.812-7.99,3,3,0,0,1,2.1-.939,2.943,2.943,0,0,1,2.153.827,3.014,3.014,0,0,1,.111,4.256,32.044,32.044,0,0,0-4.889,6.722A3.013,3.013,0,0,1,604.065,391.887Zm5.355-12.717h-.064a2.336,2.336,0,0,0-1.642.731A37.323,37.323,0,0,0,602,387.752,2.349,2.349,0,0,0,606.13,390a32.525,32.525,0,0,1,4.992-6.862,2.35,2.35,0,0,0-1.7-3.966Z" fill="#a4b3c2"/>
                            </g>
                          </svg>                                          
                        <h3>{{scope.props.seconds}}</h3>
                        <span>ثانيه</span>
                    </div>
                    <div class="numb">
                        <svg xmlns="http://www.w3.org/2000/svg" width="71.515" height="68.729" viewBox="0 0 71.515 68.729">
                            <g id="Group_65738" data-name="Group 65738" transform="translate(-601.056 -367.622)">
                              <path id="Path_158457" data-name="Path 158457" d="M655.656,436.351a3.012,3.012,0,0,1-1.814-5.417,32.069,32.069,0,0,0,9.46-11.448,31.511,31.511,0,0,0,3.229-13.987,31.857,31.857,0,0,0-42.394-30.037,3.011,3.011,0,1,1-2-5.681,37.857,37.857,0,0,1,35.329,65.963A2.989,2.989,0,0,1,655.656,436.351ZM634.7,373.006A32.529,32.529,0,0,1,667.189,405.5a32.172,32.172,0,0,1-3.3,14.279,32.748,32.748,0,0,1-9.658,11.686,2.351,2.351,0,0,0-.461,3.289,2.4,2.4,0,0,0,3.29.461,37.477,37.477,0,0,0,11.047-13.369,36.84,36.84,0,0,0,3.776-16.346,37.216,37.216,0,0,0-49.527-35.093,2.349,2.349,0,1,0,1.559,4.432A32.416,32.416,0,0,1,634.7,373.006Z" fill="#a4b3c2"/>
                              <path id="Path_158458" data-name="Path 158458" d="M604.065,391.887a3.011,3.011,0,0,1-2.643-4.45,37.907,37.907,0,0,1,5.812-7.99,3,3,0,0,1,2.1-.939,2.943,2.943,0,0,1,2.153.827,3.014,3.014,0,0,1,.111,4.256,32.044,32.044,0,0,0-4.889,6.722A3.013,3.013,0,0,1,604.065,391.887Zm5.355-12.717h-.064a2.336,2.336,0,0,0-1.642.731A37.323,37.323,0,0,0,602,387.752,2.349,2.349,0,0,0,606.13,390a32.525,32.525,0,0,1,4.992-6.862,2.35,2.35,0,0,0-1.7-3.966Z" fill="#a4b3c2"/>
                            </g>
                          </svg>                                          
                        <h3>{{scope.props.minutes}}</h3>
                        <span>دقيقة</span>
                    </div>
                    <div class="numb">
                        <svg xmlns="http://www.w3.org/2000/svg" width="71.515" height="68.729" viewBox="0 0 71.515 68.729">
                            <g id="Group_65738" data-name="Group 65738" transform="translate(-601.056 -367.622)">
                              <path id="Path_158457" data-name="Path 158457" d="M655.656,436.351a3.012,3.012,0,0,1-1.814-5.417,32.069,32.069,0,0,0,9.46-11.448,31.511,31.511,0,0,0,3.229-13.987,31.857,31.857,0,0,0-42.394-30.037,3.011,3.011,0,1,1-2-5.681,37.857,37.857,0,0,1,35.329,65.963A2.989,2.989,0,0,1,655.656,436.351ZM634.7,373.006A32.529,32.529,0,0,1,667.189,405.5a32.172,32.172,0,0,1-3.3,14.279,32.748,32.748,0,0,1-9.658,11.686,2.351,2.351,0,0,0-.461,3.289,2.4,2.4,0,0,0,3.29.461,37.477,37.477,0,0,0,11.047-13.369,36.84,36.84,0,0,0,3.776-16.346,37.216,37.216,0,0,0-49.527-35.093,2.349,2.349,0,1,0,1.559,4.432A32.416,32.416,0,0,1,634.7,373.006Z" fill="#a4b3c2"/>
                              <path id="Path_158458" data-name="Path 158458" d="M604.065,391.887a3.011,3.011,0,0,1-2.643-4.45,37.907,37.907,0,0,1,5.812-7.99,3,3,0,0,1,2.1-.939,2.943,2.943,0,0,1,2.153.827,3.014,3.014,0,0,1,.111,4.256,32.044,32.044,0,0,0-4.889,6.722A3.013,3.013,0,0,1,604.065,391.887Zm5.355-12.717h-.064a2.336,2.336,0,0,0-1.642.731A37.323,37.323,0,0,0,602,387.752,2.349,2.349,0,0,0,606.13,390a32.525,32.525,0,0,1,4.992-6.862,2.35,2.35,0,0,0-1.7-3.966Z" fill="#a4b3c2"/>
                            </g>
                          </svg>                                          
                        <h3>{{scope.props.hours}}</h3>
                        <span>ساعة</span>
                    </div>
                    <div class="numb">
                      <svg xmlns="http://www.w3.org/2000/svg" width="71.515" height="68.729" viewBox="0 0 71.515 68.729">
                          <g id="Group_65738" data-name="Group 65738" transform="translate(-601.056 -367.622)">
                            <path id="Path_158457" data-name="Path 158457" d="M655.656,436.351a3.012,3.012,0,0,1-1.814-5.417,32.069,32.069,0,0,0,9.46-11.448,31.511,31.511,0,0,0,3.229-13.987,31.857,31.857,0,0,0-42.394-30.037,3.011,3.011,0,1,1-2-5.681,37.857,37.857,0,0,1,35.329,65.963A2.989,2.989,0,0,1,655.656,436.351ZM634.7,373.006A32.529,32.529,0,0,1,667.189,405.5a32.172,32.172,0,0,1-3.3,14.279,32.748,32.748,0,0,1-9.658,11.686,2.351,2.351,0,0,0-.461,3.289,2.4,2.4,0,0,0,3.29.461,37.477,37.477,0,0,0,11.047-13.369,36.84,36.84,0,0,0,3.776-16.346,37.216,37.216,0,0,0-49.527-35.093,2.349,2.349,0,1,0,1.559,4.432A32.416,32.416,0,0,1,634.7,373.006Z" fill="#a4b3c2"/>
                            <path id="Path_158458" data-name="Path 158458" d="M604.065,391.887a3.011,3.011,0,0,1-2.643-4.45,37.907,37.907,0,0,1,5.812-7.99,3,3,0,0,1,2.1-.939,2.943,2.943,0,0,1,2.153.827,3.014,3.014,0,0,1,.111,4.256,32.044,32.044,0,0,0-4.889,6.722A3.013,3.013,0,0,1,604.065,391.887Zm5.355-12.717h-.064a2.336,2.336,0,0,0-1.642.731A37.323,37.323,0,0,0,602,387.752,2.349,2.349,0,0,0,606.13,390a32.525,32.525,0,0,1,4.992-6.862,2.35,2.35,0,0,0-1.7-3.966Z" fill="#a4b3c2"/>
                          </g>
                        </svg>                                          
                      <h3>{{scope.props.days}}</h3>
                      <span>يـوم</span>
                    </div>
                  </template>

                  <template slot="start-label">
                  </template>
                  <template slot="end-label">
                  </template>

                  <template slot="start-text">
                    <span style="color: green"></span>
                  </template>
                  <template slot="end-text">
                    <span style="color: green"></span>
                  </template>

                </vue-countdown-timer>
                  
                  
              </div>
              <button @click=" $router.push( { name: 'course-details', params: { pk: slider.slide.pk, id: slider.slide.id } } ) " class="details"> {{$t('التفاصيل')}} <img src="~assets/img/send.png" alt=""></button>     
              <!-- <button>التفاصيل <img style="display: inline-block !important;" src="~assets/img/send.png" alt=""></button> -->
          </div>
      </div>
  </div>
</template>

<script>
const moment = require('moment')
import {FORMAT_THE_IAMGE_URL} from 'src/utils/functions.js'


export default {
  name: "SliderItem",
  data() {
    return {
      FORMAT_THE_IAMGE_URL: FORMAT_THE_IAMGE_URL,
      now: 0,
      start: 0,
    };
  },

  props:['slider'],

  components: {},

  mounted () {
    this.start = moment(this.slider.startDate)
    this.now = moment(new Date())
    // const duration = moment.duration(start.diff(now))
    // this.duration = duration.asSeconds()
  },

  methods: {

    startCallBack: function(x) {
      console.log(x);
    },
    endCallBack: function(x) {
      console.log(x);
    },

    FORMAT_COURSE_COVER_IMAGE () {
      if (process.env.NODE_ENV == 'development') {
        return 'http://localhost:8000/media/' + this.slider.slide.cover
      } else {
        // return  location.origin + '/media/' + this.slider.slide.cover 
        return  'https://api.stc.training' + '/media/' + this.slider.slide.cover 
      }
    },

    CHANGE_THE_SLIDER () {
      const parent = this.$jquery('.parientSlider')
      const activeChild = parent.find('.active')
      const nextChild = activeChild.next()
      if (activeChild.length > 0) {
          if (nextChild.length) {
            nextChild.addClass('active')
          } else {
            parent.children().first().addClass('active')
          }
          activeChild.removeClass('active')
      } else {
        parent.children().first().addClass('active')
      }
    }

  }
};
</script>

<style lang="scss">

</style>
