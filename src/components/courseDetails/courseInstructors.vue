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
                <img src="~assets/img/tech.png" alt="">
            </div>
            <h3>{{$t('المحاضرون')}}</h3>
        </div>
        <div class="tetch">
            <div class="container">
                <div class="row justify-center">
                    <div v-if="allCourseInstructors.edges.length === 0" class="col-lg-6 col-xs-12">
                      <skeletonUserInfo />
                    </div>
                    <div v-if="allCourseInstructors.edges.length === 0" class="col-lg-6 col-xs-12">
                      <skeletonUserInfo />
                    </div>
                    <div class="col-lg-6 col-xs-12" v-for="instructor in allCourseInstructors.edges" :key="instructor.node.id">
                        <div class="tech">
                            <div class="img-user">
                              <svg xmlns="http://www.w3.org/2000/svg" width="102.018" height="78.632" viewBox="0 0 102.018 78.632">
                                  <g id="Group_652" data-name="Group 652" transform="translate(0 78.632)">
                                    <path id="Path_979" data-name="Path 979" d="M62.7-76.632a37.495,37.495,0,0,1,37.316,37.316A37.495,37.495,0,0,1,62.7-2,37.494,37.494,0,0,1,25.385-39.316c0-6.916-2.648-10.63-5.783-11.972a8.669,8.669,0,0,0-9.792,2.65c-3.3,3.727-4.579,10.513.817,18.735,2.944,4.485,3.728,7.964,3.168,10.382a4.19,4.19,0,0,1-3.9,3.4c-4.123.275-9.032-4.3-7.658-14.191a1,1,0,0,0-.853-1.128,1,1,0,0,0-1.128.853C-1.375-18.842,5.134-13.8,10.028-14.127,15.011-14.459,19.277-20.368,12.3-31c-5.841-8.9-3.1-15.867,1.347-18.141a5.882,5.882,0,0,1,6.342.375c2.019,1.529,3.4,4.588,3.4,9.449A39.5,39.5,0,0,0,62.7,0a39.5,39.5,0,0,0,39.316-39.316A39.5,39.5,0,0,0,62.7-78.632a1,1,0,0,0-1,1A1,1,0,0,0,62.7-76.632Z" fill="#5666b9" fill-rule="evenodd"/>
                                    <path id="Path_980" data-name="Path 980" d="M27.281-51.273a37.037,37.037,0,0,1,1.688-4.053,37.354,37.354,0,0,1,27.8-20.535A1.217,1.217,0,0,0,57.79-77.25,1.217,1.217,0,0,0,56.4-78.266,39.792,39.792,0,0,0,26.782-56.393a39.478,39.478,0,0,0-1.8,4.32,1.217,1.217,0,0,0,.749,1.549A1.217,1.217,0,0,0,27.281-51.273Z" fill="#fbc74b" fill-rule="evenodd"/>
                                  </g>
                              </svg>
                              <img v-if="lodash.get(instructor,'[node][instructor][image]')" :src="GET_IMAGE_URL(lodash.get(instructor,'[node][instructor][image]'))" alt="" />
                              <img v-else src="~assets/img/user-13.jpg" alt="" />
                            </div>
                            {{ lodash.get(instructor,'[node][instructor][user][fullName]') || lodash.get(instructor,'[node][instructor][user][username]').split('@')[0] }} 
                            <!-- <h3>{{instructor.node.instructor.user.firstName}} {{instructor.node.instructor.user.lastName}}</h3> -->
                            <p>
                                {{ lodash.get(instructor,'[node][instructor][qualification]') }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { GetAllCourseInstructors } from 'src/queries/course_management/query/GetAllCourseInstructors'
import skeletonUserInfo from 'src/components/skeleton/skeletonUserInfo'

export default {
  name: 'CourseInstructors',
  data () {
    return {
      lodash: this.$_,
      allCourseInstructors: { edges: [] }
    }
  },
  props: ['course_id'],
  components: {
    skeletonUserInfo
  },
  methods: {
    GET_IMAGE_URL (instructorImage) {
      if (process.env.NODE_ENV == 'development') {
        return  'http://localhost:8000/media/' + instructorImage
      } else {
        return location.origin + '/media/' + instructorImage
      }
      
    }
  },
  apollo: {
    allCourseInstructors: {
      query () {
        return GetAllCourseInstructors
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
