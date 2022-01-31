<template>
  <div class="rate">
    <ApolloQuery
      :query="GetAllCourses"
      :variables="{
        courseSpeciality: courseSpecialityID,
        execludeIds: [courseData.pk],
        first: 4
      }"
    >
      <template v-slot="{ result: { loading, error, data } }">
        <!-- Loading -->
        <div v-if="loading" class="loading apollo">
          <div class="row justify-center">
            <skeletonCard
              class="col-lg-3 col-md-6 col-sm-6 col-xs-12"
              v-for="sk in 4"
              :key="sk"
            />
          </div>
        </div>

        <!-- Error -->
        <div v-else-if="error" class="error apollo">An error occurred</div>

        <!-- Result -->
        <div v-else-if="data" class="result apollo">
          <!-- {{data.allCourses.edges}} -->
          <div class="row justify-center">
            <div
              v-for="course in lodash.get(data.allCourses, '[edges]')"
              :key="course.node.id"
              class="col-lg-3 col-md-6 col-sm-6 col-xs-12"
            >
              <relatedCourseCard
                :name="course.node.title"
                :instructor="course.node.courseinstructorSet"
                :course="course.node"
                :price="course.node.courseFee"
                unit="SD"
              />
            </div>
          </div>
        </div>

        <!-- No result -->
        <div v-else class="no-result apollo">No result :(</div>
      </template>
    </ApolloQuery>
  </div>
</template>

<script>
import relatedCourseCard from "src/components/utils/relatedCourseCard.vue";
import skeletonCard from "src/components/skeleton/skeletonCard";
import { GetAllCourses } from "src/queries/course_management/query/GetAllCourses";

export default {
  data() {
    return {
      GetAllCourses: GetAllCourses,
      courseSpecialityID: "",
      lodash: this.$_
    };
  },
  props: ["courseData"],
  components: {
    relatedCourseCard,
    skeletonCard
  },
  watch: {
    courseData(data) {
      this.courseSpecialityID = data.courseSpeciality.id;
    }
  }
};
</script>

<style lang="scss">
@import "src/assets/css/sass/helpers/_variabels.scss";
@import "src/assets/css/sass/helpers/_mixins.scss";

.training {
    padding: 20px 0;
    margin-top: 0;
    .nav-tabs {
        margin: 0 0 20px 0;
        padding: 15px;
        border: 1px dashed #f1f0f0;
        border-radius: 52px;
        .nav-link {
            img {
                margin-left: 4px;
            }
            font-size: 18px;
            font-family: "cairoR";
            // width: 155px;
            height: 44px;
            margin-left: 10px;
            border-radius: 50px;
            color: $textColor;
            border: 1px solid #f6f6f6;
            background-color: #fff;
            @include prefixer(
                box-shadow,
                2px 9px 18.79px 2.21px rgba(147, 147, 147, 0.14),
                webkit moz o ms
            );
            &.active {
                background-color: #2d77d8;
                color: #fff;
            }
        }
    }
    
    .rate {
        margin-top: 30px;

        .cn {
            padding: 0 0 0 0;
            position: relative;
            right: 8%;
            @media (min-width: 320px) and (max-width: 700px) {
                right: 0;
            }
            .card{
                position: relative;
                border: 0;
                box-shadow: 3px 7px 15px #eceaea;
                border-radius: 37px;
                background: #E3EDFA;
                width: 100%;
                padding: 10px;
                height: 441px;
                .pattern{
                    position: absolute;
                    top: 0;
                    width: 100%;
                    left: 0;
                    right: 0;
                    height: 100%;
                }
                .card-img-top{
                    position: relative;
                    padding: 14px;
                    height: 294px;
                    width: 100%;
                    overflow: hidden;
                    border-radius: 30px;
                    .plays{
                        position: absolute;
                        width: auto;
                        top: 45%;
                        left: 0;
                        right: 44%;
                        height: unset;
                        z-index: 5;
                    }
                    img{
                        width: 100%;
                        height: 100%;
                        position: absolute;
                        border-width: 0;
                        left: 0;
                        right: 0;
                        top: 0;
                    }
                } 
                .card-body{
                    position: relative;
                    padding: unset;
                    border-radius: 29px;
                    background: #F78A78;
                    margin: -37px auto 2px auto;
                    width: 100%;
                    top: -6px;
                    height: 164px;
                    .card-title{
                        margin-bottom: 7px;
                        color: #fff;
                        font-size: 17px;
                        font-family: cairoR;
                        line-height: 1.8;
                        background-color: #FC9685;
                        padding: 8px;
                        border-top-left-radius: 26px;
                        border-top-right-radius: 26px;
                        height: 72px;
                        overflow: hidden;
                        -webkit-line-clamp: 2;
                        display: -webkit-box;
                        -webkit-box-orient: vertical;
                    }
                    .detai{
                        position: relative;
                        width: 100%;
                        .added{
                            display: inline-block;
                            position: absolute;
                            left: 0;
                            right: -7px;
                            width: 148px;
                            top: 40px;
                            svg{
                                path{
                                    fill: #FFF067;
                                }
                                
                            }
                            button{
                                color: #fff;
                                font-size: 14px;
                                font-family: cairoR;
                                position: absolute;
                                left: 0;
                                right: 0;
                                top: 16px;
                                text-align: center;
                                width: 129px;
                                background-color: unset;
                                box-shadow: none;
                                height: unset;
                                outline: 0;
                                color: #7B7B7B;
                            }
                        }
                        h3{
                            display: inline-block;
                            color: #fff067;
                            font-size: 31px;
                            font-family: cairoR;
                            margin-right: 8px;
                        }
                        span{
                            display: inline-block;
                            font-size: 13px;
                            font-family: cairoR;
                            color: #fff;
                        }
                    }
                    .details{
                        display: inline-block;
                        background-color: unset;
                        height: unset;
                        box-shadow: unset;
                        color: #fff;
                        font-size: 14px;
                        font-family: cairoR;
                        outline: 0;
                        float: left;
                        margin: 4px 0 0 -38px;
                    }
                }
            }
        }

        /*parent2*/
        .butDown {
            position: relative;
            margin: 0 auto;
            width: 205px;
            text-align: center;

            .right {
                position: absolute;
                top: -32px;
                right: -49px;
                width: auto;
            }

            .left {
                position: absolute;
                top: 0;
                left: -58px;
                width: auto;
            }

            button {
                position: relative;
                text-align: center;
                margin: 0 auto;
            }
        }
    }
}
</style>
