<template>
  <div class="asid">
    <div class="rate" style="display: none">
      <img src="~assets/img/raha.png" alt="" />
    </div>
    <div class="vidd">
      <div class="mag">
        <!-- <img v-if="courseData.profile" :src="CALCULATE_IMAGE_URL" alt=""> -->
        <img v-if="courseData.profile" :src="FORMAT_THE_IAMGE_URL( $_.get(courseData, '[profile]'))" :alt="$_.get(courseData, '[title]')">
        <img v-else src="~assets/img/Mask Group 5.png" alt="" />
      </div>
      <!-- <img class="playy" src="~assets/img/playy.png" alt="" /> -->
    </div>
    <div class="content" style="display: block;">
      <div class="uper">
        <div v-if="$_.get(courseData, '[enrollmentCount]')" class="tow ordO">
          <h3>
            {{ $_.get(courseData, '[enrollmentCount]')
            }}<span v-if="$_.get(courseData, '[enrollmentCount]') >= 1000">K</span>
          </h3>
          <P>{{$t('الطلاب الملتحقين')}}</P>
        </div>

        <div v-else class="tow ordO">
          <q-skeleton type="text" width="50px" />
          <P>{{$t('الطلاب الملتحقين')}}</P>
          <hr />
        </div>

        <div v-if="$_.get(courseData, '[courseHours]')" class="tow">
          <h3>{{$_.get(courseData, '[courseHours]')}}<span>H</span></h3>
          <P>{{$t('عدد الساعات')}}</P>
        </div>
        <div v-if="$_.get(courseData, '[courseLanguage]')" class="tow ordT">
          <img src="~assets/img/languages.png" alt="" />
          <P>{{ $_.get(courseData, '[courseLanguage][languageName]') }}</P>
        </div>

        <div v-else class="tow ordT">
          <img src="~assets/img/languages.png" alt="" />
          <q-skeleton type="text" width="50px" />
        </div>
      </div>
      <div class="more">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="241.182"
          height="148.667"
          viewBox="0 0 241.182 148.667"
        >
          <g
            id="Group_671"
            data-name="Group 671"
            transform="translate(-987 -499.333)"
          >
            <path
              id="Path_943"
              data-name="Path 943"
              d="M102.943-65.266A38.216,38.216,0,0,1,73.732-51.691c-19.052.025-42.564.025-42.564.025A31.183,31.183,0,0,1,0-82.834,31.183,31.183,0,0,1,31.168-114h4.576a17.068,17.068,0,0,0,17.068-17.068h0a69.3,69.3,0,0,1,69.263-69.262,69.3,69.3,0,0,1,69.262,69.262h0A17.069,17.069,0,0,0,208.406-114h1.608a31.183,31.183,0,0,1,31.168,31.168,31.183,31.183,0,0,1-31.168,31.168H167.45a38.241,38.241,0,0,1-29.23-13.584,22.852,22.852,0,0,0-17.629-8.271A22.96,22.96,0,0,0,102.943-65.266Z"
              transform="translate(987 699.666)"
              fill="#5666b9"
              fill-rule="evenodd"
            />
            <g
              id="Group_582"
              data-name="Group 582"
              transform="translate(1089.758 503.14) rotate(3)"
              opacity="0.49"
            >
              <path
                id="Path_942"
                data-name="Path 942"
                d="M1.5,7.4a58.942,58.942,0,0,1,23.316-4.4A59.092,59.092,0,0,1,44.947,6.758a60.867,60.867,0,0,1,12.215,6.158,59.088,59.088,0,0,1,21.9,25.965,1.075,1.075,0,0,0,1.987-.821A60.932,60.932,0,0,0,58.933,10.277,58.4,58.4,0,0,0,46.107,3.622,59.988,59.988,0,0,0,24.819,0,60.927,60.927,0,0,0,12.431,1.457,60.074,60.074,0,0,0,.647,5.423,1.075,1.075,0,1,0,1.5,7.4Z"
                transform="translate(0)"
                fill="#fbc74b"
                fill-rule="evenodd"
              />
            </g>
          </g>
        </svg>
        <div class="pric">
          <h3>{{FORMAT_COUSRE_PRICE(JSON.parse(courseData.currency)[currency], 3) }}<span>{{currency}}</span></h3>
          <!-- <button v-if="openCourse" @click="GO_TO_THE_COURSE_LEARNING_CLASS">{{$t('الى الدرس')}}</button> -->
          <button @click="AddTheCourseToTheBasket">{{$t('أمتلك الأن')}}</button>
        </div>
      </div>

      <div class="share" v-if="$_.size(myMarketingCode) > 4">
      <!-- <div class="share"> -->
          <form @submit="COPY_THE_SHARING_LINK($event)">
            <input id="shar-link" type="text" :value="PREPARE_THE_COURSE_SHARING_LINK">
            <button style="cursor: pointer;" type="submit"><q-tooltip>{{message}}</q-tooltip><img src="~assets/img/copyed.png"></button>
          </form>
        </div>

    </div>
  </div>
</template>

<script>
import { copyToClipboard } from 'quasar'
import { mapState, mapActions } from "vuex";
import {FORMAT_THE_IAMGE_URL} from 'src/utils/functions.js'

export default {
  name: "CourseMainCard",
  data() {
    return {
      FORMAT_THE_IAMGE_URL: FORMAT_THE_IAMGE_URL,
      message: this.$t('انسخ الرابط')
    };
  },

  props: ['courseData'],

  mounted() {
    if (this.token) {
      //TODO: Get the marketer code
      this.GET_MY_MARKETING_CODE_ACCOUNT_ACTION()
    }

  },

  computed: {
    ...mapState("authentication", ["user", 'token']),
    ...mapState('settings',['currency']),
    ...mapState('pyramidManagement', ['myMarketingCode']),

    CALCULATE_IMAGE_URL () {
      if (process.env.NODE_ENV == 'development') {
        return 'http://localhost:8000/media/' + this.courseData.profile
      }
      return location.origin + '/media/' + this.courseData.profile
    },

    PREPARE_THE_COURSE_SHARING_LINK () {
      // return `${location.origin}/#/course/${this.courseData.title}/${this.myMarketingCode}/${this.$_.get(this.$route, "[params][pk]")}/${this.$_.get(this.$route, "[params][id]")}`
      return `${location.origin}/#/course/${this.myMarketingCode}/${this.$_.get(this.$route, "[params][pk]")}/${this.$_.get(this.$route, "[params][id]")}`
    },

    formatCoureFee() {
      if (this.courseData.courseFee) {
        return this.courseData.courseFee.split(".")[0];
      }
      return "";
    },

    preparTheSharingLink () {
      if ( !this.$_.isEmpty( this.$_.get(this.user, "[affiliateSet][edges]") ) ) {
        const aff =
          location.origin +
          "/#/course/" + `${this.courseData.title}` +
          this.$_.get(
            this.user,
            "[affiliateSet][edges[0]][node][affiliateLink]"
          ) +
          "/" +
          this.courseData.pk +
          "/" +
          this.courseData.id;
        return aff
      }
      return ''
    }
  },

  methods: {
    ...mapActions("shoppingCart", ["setShoppingCartDataListAction"]),
    ...mapActions('pyramidManagement', ['GET_MY_MARKETING_CODE_ACCOUNT_ACTION']),

    COPY_THE_SHARING_LINK(e) {
      e.preventDefault();

      let copyText = document.getElementById("shar-link");

      /* Select the text field */
      copyText.focus();
      copyText.select();

      copyToClipboard(copyText.value)
        .then(() => {
          // success!
          this.message = this.$t('تم النسخ')
          this.$q.notify({
              type: 'positive',
              progress: true,
              multiLine: true,
              position: 'top',
              message: this.$t('تم النسخ')
          })

        })
        .catch((e) => {
          // fail
        })
    },

    GO_TO_THE_COURSE_LEARNING_CLASS () {
      this.$router.push({ name: 'course-class', params: { pk: this.$route.params.pk, id: this.$route.params.id }, query:{ tab: 'tutorial' } })
    },

    FORMAT_COUSRE_PRICE(num, digits) {
      const lookup = [
        { value: 1, symbol: "" },
        { value: 1e3, symbol: "k" },
        { value: 1e6, symbol: "M" },
        { value: 1e9, symbol: "G" },
        { value: 1e12, symbol: "T" },
        { value: 1e15, symbol: "P" },
        { value: 1e18, symbol: "E" }
      ];

      if ( (num.toString().split('.')[0] == 0) || num == 0 ) {
        return num
      }
      const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
      var item = lookup.slice().reverse().find(function(item) {
        return num >= item.value;
      });

      return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0";
    },

    AddTheCourseToTheBasket() {

      let data = {
        user: this.user,
        course: this.courseData
      }

      this.setShoppingCartDataListAction(data);

      // TODO: Go to the shopping cart
      this.$router.push({ name: 'cart' })
    }
  }
};
</script>

<style></style>
