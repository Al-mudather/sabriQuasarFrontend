<template>
    <div class="all">
        <div class="hedd">
            <div class="point">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="67.452"
                    height="54.53"
                    viewBox="0 0 67.452 54.53"
                >
                    <g
                        id="Group_633"
                        data-name="Group 633"
                        transform="translate(-798.943 -217.261)"
                    >
                        <circle
                            id="Ellipse_15"
                            data-name="Ellipse 15"
                            cx="14.5"
                            cy="14.5"
                            r="14.5"
                            transform="translate(809 233)"
                            fill="#5666b9"
                        />
                        <path
                            id="Path_598"
                            data-name="Path 598"
                            d="M19.826-38.194a1.169,1.169,0,0,0-.072.62,1.519,1.519,0,0,0,.116.316,2.864,2.864,0,0,0,.9.994c1.416,1.044,2.627,1.9,2.937,3.215.234.994,0,2.31-1.2,4.227a13.254,13.254,0,0,0-1.6,3.9,16.244,16.244,0,0,0-.473,4.231.668.668,0,0,1-.623.709A.668.668,0,0,1,19.1-20.6a17.509,17.509,0,0,1,.424-4.641,14.709,14.709,0,0,1,1.709-4.363c.856-1.418,1.138-2.346.955-3.071a2.3,2.3,0,0,0-.852-1.154c-.438-.369-.968-.717-1.521-1.11a3.75,3.75,0,0,1-1.757-2.706,2.274,2.274,0,0,1,.6-1.794,1.467,1.467,0,0,1,1.1-.45L22.627-40A18.548,18.548,0,0,0,34.41-46.131,18.432,18.432,0,0,0,39.093-58.5,18.439,18.439,0,0,0,33.7-71.548a18.488,18.488,0,0,0-13.05-5.493A18.56,18.56,0,0,0,7.451-71.7,18.7,18.7,0,0,0,1.836-58.5a.668.668,0,0,1-.667.667A.668.668,0,0,1,.5-58.5,20.14,20.14,0,0,1,6.3-72.844a20.277,20.277,0,0,1,14.346-6.07,20.343,20.343,0,0,1,14.493,5.923A20.393,20.393,0,0,1,41.163-58.5a20.376,20.376,0,0,1-5.306,13.67,20.334,20.334,0,0,1-13.046,6.571Z"
                            transform="matrix(-0.259, -0.966, 0.966, -0.259, 885.823, 251.85)"
                            fill="#e5e5e6"
                            fill-rule="evenodd"
                        />
                    </g>
                </svg>
                <img src="~assets/img/exclamation.png" alt="" />
            </div>
            <h3>ما الذي سأتعلمه ؟</h3>
        </div>
        <div class="pluse" v-for="point in allWhatYouWillLearn.edges" :key="point.node.id">
            <img src="~assets/img/adedd.png" alt="" />
            <h3>{{point.node.points}}</h3>
        </div>
    </div>
</template>

<script>
import { GetAllWhatYouWillLearnByCourseID } from 'src/queries/course_management/query/GetAllWhatYouWillLearnByCourseID'

export default {
  name: 'WhatIwillLearn',
  data () {
    return {
      allWhatYouWillLearn: ''
    }
  },

  props: ['course_id'],

  apollo: {
    allWhatYouWillLearn: {
      query () {
        return GetAllWhatYouWillLearnByCourseID
      },

      variables () {
        return {
          courseID: this.course_id
        }
      }
    }
  }
}
</script>

<style></style>
