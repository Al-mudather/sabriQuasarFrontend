<template>
    <div class="asid" v-if="courseData">
        <h3>{{courseData.title}}</h3>
        <div class="rate">
            <img src="~assets/img/rate.png" alt="" />
            <h3>أعلي تقييم</h3>
        </div>
        <div class="vidd">
            <div class="mag">
                <img src="~assets/img/Mask Group 5.png" alt="" />
            </div>
            <img class="playy" src="~assets/img/playy.png" alt="" />
        </div>
        <div class="content">
            <div class="tow">
                <h3>{{courseData.enrollmentSet.totalCount}}<span v-if="courseData.enrollmentSet.totalCount >= 1000">K</span></h3>
                <P>الطلاب الملتحقين</P>
                <hr />
            </div>
            <div class="tow">
                <h3>42</h3>
                <P>عدد الساعات</P>
                <hr class="hr-2" />
            </div>
            <div class="tow">
                <img src="~assets/img/languages.png" alt="" />
                <P>{{courseData.courseLanguage.languageName}}</P>
            </div>
            <div class="more">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="325"
                    height="200.333"
                    viewBox="0 0 325 200.333"
                >
                    <g
                        id="Group_633"
                        data-name="Group 633"
                        transform="translate(-972 -677.333)"
                    >
                        <g
                            id="Group_584"
                            data-name="Group 584"
                            transform="translate(972 877.666)"
                        >
                            <path
                                id="Path_943"
                                data-name="Path 943"
                                d="M138.718-18.326A51.5,51.5,0,0,1,99.356-.034C73.683,0,42,0,42,0A42.02,42.02,0,0,1,0-42,42.02,42.02,0,0,1,42-84h6.167a23,23,0,0,0,23-23h0A93.377,93.377,0,0,1,164.5-200.333,93.377,93.377,0,0,1,257.833-107h0a23,23,0,0,0,23,23H283a42.02,42.02,0,0,1,42,42A42.02,42.02,0,0,1,283,0H225.644a51.531,51.531,0,0,1-39.388-18.3A30.793,30.793,0,0,0,162.5-29.45,30.939,30.939,0,0,0,138.718-18.326Z"
                                fill="#5666b9"
                                fill-rule="evenodd"
                            />
                        </g>
                        <g
                            id="Group_582"
                            data-name="Group 582"
                            transform="translate(1107.681 735.678) rotate(3)"
                            opacity="0.49"
                        >
                            <path
                                id="Path_942"
                                data-name="Path 942"
                                d="M2.026-43.322A78.761,78.761,0,0,1,17.46-47.891a79.34,79.34,0,0,1,15.984-1.364,79.628,79.628,0,0,1,27.123,5.074,82.02,82.02,0,0,1,16.46,8.3A79.622,79.622,0,0,1,106.544-.9a1.449,1.449,0,0,0,1.892.786A1.449,1.449,0,0,0,109.222-2,82.108,82.108,0,0,0,79.414-39.44a78.7,78.7,0,0,0-17.283-8.967,80.836,80.836,0,0,0-28.687-4.878,82.1,82.1,0,0,0-16.693,1.96A80.952,80.952,0,0,0,.872-45.98,1.449,1.449,0,0,0,.12-44.074,1.449,1.449,0,0,0,2.026-43.322Z"
                                fill="#fbc74b"
                                fill-rule="evenodd"
                            />
                        </g>
                    </g>
                </svg>
                <div class="pric">
                    <h3>{{formatCoureFee}}<span>SDG</span></h3>
                    <button>أمتلك الأن</button>
                </div>
                <img class="share" src="~assets/img/share.png" alt="" />
                <img class="addCou" src="~assets/img/addCou.png" alt="" />
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: 'CourseMainCard',
  props: ['courseData'],
  computed: {
    formatCoureFee () {
      return this.courseData.courseFee.split('.')[0]
    }
  }
}
</script>

<style></style>
