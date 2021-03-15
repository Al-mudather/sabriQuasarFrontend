<template>
  <div class="asid">
    <div class="rate" style="display: none">
      <img src="~assets/img/raha.png" alt="" />
    </div>
    <div class="vidd">
      <div class="mag">
        <img src="~assets/img/Mask Group 5.png" alt="" />
      </div>
      <img class="playy" src="~assets/img/playy.png" alt="" />
    </div>
    <div class="content">
      <div class="uper">
        <div v-if="courseData.enrollmentSet" class="tow ordO">
          <h3>
            {{ courseData.enrollmentSet.totalCount
            }}<span v-if="courseData.enrollmentSet.totalCount >= 1000">K</span>
          </h3>
          <P>{{$t('الطلاب الملتحقين')}}</P>
        </div>

        <div v-else class="tow ordO">
          <q-skeleton type="text" width="50px" />
          <P>{{$t('الطلاب الملتحقين')}}</P>
          <hr />
        </div>

        <div class="tow">
          <h3>42<span>H</span></h3>
          <P>{{$t('عدد الساعات')}}</P>
        </div>
        <div v-if="courseData.courseLanguage" class="tow ordT">
          <img src="~assets/img/languages.png" alt="" />
          <P>{{ courseData.courseLanguage.languageName }}</P>
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
          <h3>{{ formatCoureFee }}<span>SDG</span></h3>
          <button @click="AddTheCourseToTheBasket">{{$t('أمتلك الأن')}}</button>
        </div>
        <img
          class="share"
          src="~assets/img/share.png"
          alt=""
        />
        <img class="addCou" src="~assets/img/addCou.png" alt="" />
      </div>
      <div class="share" v-if="!$_.isEmpty( $_.get(user, '[affiliateSet][edges]') )">
        <form>
          <input id="shar-link" type="text" :value="preparTheSharingLink">
          <button @click="CopyTheLinkHandler"><q-tooltip>{{message}}</q-tooltip><img src="~assets/img/copy.png"></button>
        </form>
    </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "CourseMainCard",
  data() {
    return {
      message: this.$t('انسخ الرابط'),
      fab2: true
    };
  },
  props: ["courseData"],

  computed: {
    ...mapState("authentication", ["user"]),

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
          "/#/course/" +
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

    CopyTheLinkHandler(e) {
      e.preventDefault();

      let copyText = document.getElementById("shar-link");

      /* Select the text field */
      copyText.select();
      copyText.setSelectionRange(0, 99999); /* For mobile devices */

      /* Copy the text inside the text field */
      document.execCommand("copy");
      this.message = this.$t('تم النسخ')

    },

    AddTheCourseToTheBasket() {

      const data = {
        user: this.user,
        course: this.courseData
      };

      this.setShoppingCartDataListAction(data);

      // TODO: Go to the shopping cart
      this.$router.push({ name: 'cart' })
    }
  }
};
</script>

<style></style>
 