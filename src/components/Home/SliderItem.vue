<template>
  <div class="slide">
    <div class="slide__media">
      <img
        class="slide__image"
        :src="FORMAT_THE_IAMGE_URL(slider.slide.cover)"
        :alt="slider.slide.title"
      />
    </div>

    <div class="slide__body">
      <div class="slide__heading">
        <h2 class="slide__title">{{ slider.slide.title }}</h2>
        <p class="slide__brief">{{ slider.slide.brief }}</p>
      </div>

      <div class="slide__countdown">
        <vue-countdown-timer
          :start-time="now"
          :end-time="start"
          :interval="1000"
          :day-txt="'days'"
          :hour-txt="'hours'"
          :minutes-txt="'minutes'"
          :seconds-txt="'seconds'"
        >
          <template slot="countdown" slot-scope="scope">
            <div class="unit">
              <h3 class="unit__value">{{ scope.props.seconds }}</h3>
              <span class="unit__label">ثانيه</span>
            </div>
            <div class="unit">
              <h3 class="unit__value">{{ scope.props.minutes }}</h3>
              <span class="unit__label">دقيقة</span>
            </div>
            <div class="unit">
              <h3 class="unit__value">{{ scope.props.hours }}</h3>
              <span class="unit__label">ساعة</span>
            </div>
            <div class="unit">
              <h3 class="unit__value">{{ scope.props.days }}</h3>
              <span class="unit__label">يـوم</span>
            </div>
          </template>

          <template slot="start-label"></template>
          <template slot="end-label"></template>
          <template slot="start-text"><span></span></template>
          <template slot="end-text"><span></span></template>
        </vue-countdown-timer>
      </div>

      <DsButton
        variant="primary"
        size="md"
        @click="goToCourseDetails"
      >
        {{ $t('التفاصيل') }}
      </DsButton>
    </div>
  </div>
</template>

<script>
const moment = require('moment')
import { FORMAT_THE_IAMGE_URL } from 'src/utils/functions.js'

export default {
  name: 'SliderItem',
  data () {
    return {
      FORMAT_THE_IAMGE_URL: FORMAT_THE_IAMGE_URL,
      now: 0,
      start: 0
    }
  },

  props: ['slider'],

  components: {},

  mounted () {
    this.start = moment(this.slider.startDate)
    this.now = moment(new Date())
  },

  methods: {
    startCallBack: function (x) {},
    endCallBack: function (x) {},

    goToCourseDetails () {
      this.$router.push({
        name: 'course-details',
        params: {
          name: this.slider.slide.title,
          pk: this.slider.slide.pk,
          id: this.slider.slide.id
        }
      })
    },

    FORMAT_COURSE_COVER_IMAGE () {
      if (process.env.NODE_ENV == 'development') {
        return 'http://localhost:8000/media/' + this.slider.slide.cover
      } else {
        return 'https://api.stc.training' + '/media/' + this.slider.slide.cover
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
}
</script>

<style lang="scss" scoped>
.slide {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: var(--ds-space-6, 1.5rem);
  align-items: center;
  padding: var(--ds-space-6, 1.5rem);
}

.slide__media {
  display: flex;
  justify-content: center;
}

.slide__image {
  inline-size: 100%;
  max-inline-size: 320px;
  block-size: auto;
  border-radius: var(--ds-radius-lg, 16px);
  object-fit: cover;
  box-shadow: var(--ds-shadow-md, 0 4px 12px rgba(0, 0, 0, 0.08));
}

.slide__body {
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-5, 1.25rem);
  text-align: center;
}

.slide__title {
  font-family: var(--ds-font-heading, inherit);
  font-weight: var(--ds-weight-bold, 700);
  font-size: var(--ds-font-size-2xl, 1.5rem);
  color: var(--ds-color-text-primary, #104982);
  margin: 0 0 var(--ds-space-2, 0.5rem);
}

.slide__brief {
  font-size: var(--ds-font-size-md, 1rem);
  color: var(--ds-color-text-secondary, #5a6a7a);
  line-height: var(--ds-line-height-relaxed, 1.6);
  margin: 0;
}

.slide__countdown {
  display: flex;
  justify-content: center;
  gap: var(--ds-space-3, 0.75rem);
  flex-wrap: wrap;
}

.slide__countdown ::v-deep > * {
  display: flex;
  gap: var(--ds-space-3, 0.75rem);
  flex-wrap: wrap;
  justify-content: center;
}

.unit {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-inline-size: 64px;
  padding: var(--ds-space-3, 0.75rem);
  background: var(--ds-color-surface-subtle, #f4f7fb);
  border-radius: var(--ds-radius-md, 12px);
}

.unit__value {
  font-family: var(--ds-font-heading, inherit);
  font-weight: var(--ds-weight-bold, 700);
  font-size: var(--ds-font-size-xl, 1.25rem);
  color: var(--ds-color-text-primary, #104982);
  margin: 0;
}

.unit__label {
  font-size: var(--ds-font-size-xs, 0.75rem);
  color: var(--ds-color-text-secondary, #5a6a7a);
  margin-block-start: var(--ds-space-1, 0.25rem);
}

@media (max-width: 768px) {
  .slide {
    grid-template-columns: 1fr;
  }
}
</style>
