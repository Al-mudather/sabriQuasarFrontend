<template>
  <section class="Lecture">
    <div class="container-fluid">
      <div class="row">
        <div class="col-lg-12">
          <div class="hedeer">
            <div class="percent">
              <h3>{{ calculateTheTotalProgress }}%</h3>
              <span>{{$t('التقدم')}}</span>
            </div>
            <div class="titel">
              <img src="~assets/img/tit.png" alt="" />
              <h3>{{ lodash.get(courseData, "[title]") }}</h3>
            </div>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15.103"
            height="9.192"
            viewBox="0 0 15.103 9.192"
          >
            <path
              id="Path_998"
              data-name="Path 998"
              d="M8447.5,1553.75s.75,7.625,5.25,5.875,7.125-2.75,8.875,3.125"
              transform="translate(-8447.002 -1553.701)"
              fill="none"
              stroke="#fcd462"
              stroke-width="1"
            />
          </svg>
          <div class="progress">
            <div
              class="progress-bar"
              role="progressbar"
              :style="{ width: calculateTheTotalProgress + '%' }"
              aria-valuenow="75"
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
          </div>
        </div>
      </div>
      <!-- start tab lec -->
      <div class="tabLect">
        <div class="row">
          <div class="col-lg-12">
            <q-tabs
              v-model="tab"
              narrow-indicator
              dense
              id="myTab"
              role="tablist"
              active-color="warning"
              align="center"
              class="nav nav-tabs"
            >
              <!-- <q-tab :ripple="false" name="mails" icon="mail" label="Mails" /> -->
              <q-tab :ripple="false" name="tutorial">
                <template v-slot:default>
                  <li class="nav-item">
                    <a
                      class="nav-link"
                      id="tutorial-tab"
                      data-toggle="tab"
                      role="tab"
                      aria-controls="tutorial"
                      aria-selected="true"
                      >{{$t('الـدروس')}}</a
                    >
                  </li>
                </template>
              </q-tab>
              <q-tab :ripple="false" name="download">
                <template v-slot:default>
                  <li class="nav-item">
                    <a
                      class="nav-link"
                      id="download-tab"
                      data-toggle="tab"
                      role="tab"
                      aria-controls="download"
                      aria-selected="false"
                      >{{$t('المادة التعليمية')}}</a
                    >
                  </li>
                </template>
              </q-tab>
              <q-tab :ripple="false" name="question">
                <template v-slot:default>
                  <li class="nav-item">
                    <a
                      class="nav-link"
                      id="question-tab"
                      data-toggle="tab"
                      role="tab"
                      aria-controls="question"
                      aria-selected="false"
                      >{{$t('بوابة الاسئلة')}}</a
                    >
                  </li>
                </template>
              </q-tab>
              <q-tab :ripple="false" name="tech">
                <template v-slot:default>
                  <li class="nav-item">
                    <a
                      class="nav-link"
                      id="tech-tab"
                      data-toggle="tab"
                      role="tab"
                      aria-controls="tech"
                      aria-selected="false"
                      >{{$t('مقدمين الدورة')}}</a
                    >
                  </li>
                </template>
              </q-tab>
            </q-tabs>
          </div>
          <!-- Tab Content -->
          <div class="col-lg-12 col-xs-12">
            <div class="tab-content" id="myTabContent">
              <q-tab-panels v-model="tab" animated>
                <!-- start tutorial -->
                <q-tab-panel
                  name="tutorial"
                  class="cn"
                  id="tutorial"
                  role="tabpanel"
                  aria-labelledby="tutorial-tab"
                >
                  <classUnits :course="courseData" />
                </q-tab-panel>

                <!-- start download -->
                <q-tab-panel
                  name="download"
                  class="cn"
                  id="download"
                  role="tabpanel"
                  aria-labelledby="download-tab"
                > 
                  <classMaterials :course="courseData" />
                </q-tab-panel>

                <!-- start question -->
                <q-tab-panel
                  name="question"
                  class="cn"
                  id="question"
                  role="tabpanel"
                  aria-labelledby="question-tab"
                >
                  <classQuestionAndAnswer :course="courseData" />
                  <!-- <router-view></router-view> -->
                </q-tab-panel>

                <!-- start Tetch -->
                <q-tab-panel
                  name="tech"
                  class="cn"
                  id="tech"
                  role="tabpanel"
                  aria-labelledby="tech-tab"
                >
                  <classinstructors
                    :instructors="
                      lodash.get(courseData, '[courseinstructorSet]')
                    "
                  />
                </q-tab-panel>
              </q-tab-panels>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { mapActions } from "vuex";
import { GetCourseByID } from "src/queries/course_management/query/GetCourseByID";
import { GetEnrollmentByCourseForCurrentUser } from "src/queries/enrollment_management/query/GetEnrollmentByCourseForCurrentUser";
import classUnits from "src/components/courseClass/classUnits";
import classMaterials from "src/components/courseClass/classMaterials";
import classinstructors from "src/components/courseClass/classinstructors";
import classQuestionAndAnswer from "src/components/courseClass/question_and_answer_managements/classQuestionAndAnswer";

export default {
  name: "CourseClass",
  data() {
    return {
      tab: "tutorial",
      courseID: "",
      courseData: "",
      totalFinishedCourseContents: 0,
      lodash: this.$_
    };
  },
  components: {
    classUnits,
    classMaterials,
    classQuestionAndAnswer,
    classinstructors
  },

  methods: {
    ...mapActions("learningProgress", ["setUpdateEnrollmentIdAction"])
  },

  computed: {
    calculateTheTotalProgress() {
      let totalCourseContents = 0;
      try {
        this.courseData.courseunitSet.edges.map(unit => {
          totalCourseContents += unit.node.courseunitcontentSet.totalCount;
        });
        if (totalCourseContents > 0) {
          return parseInt(
            (this.totalFinishedCourseContents / totalCourseContents) * 100
          );
        }
        return 0;
      } catch {
        return 0;
      }
    }
  },
 
  watch: {
    "$route": {
      handler: function(route) {
        // TODO: Get the course by ID
        if (route.query) {
          this.tab = route.query.tab 
        }
        this.$apollo
          .query({
            query: GetCourseByID,
            variables: {
              coursePk: route.params.pk
            }
          })
          .then(res => {
            this.courseData = res.data.course;

            if (res.data.course.pk) {
              // TODO: Get the enrollment of the course
              this.$apollo
                .query({
                  query: GetEnrollmentByCourseForCurrentUser,
                  variables: {
                    courseId: res.data.course.pk
                  }
                })
                .then(res => {
                  const enrollmentID =
                    res.data.enrollmentByCourseForCurrentUser.pk;
                  // TODO: Save the enrollmentId to the store
                  if (enrollmentID) {
                    this.setUpdateEnrollmentIdAction(enrollmentID);
                  }
                  // TODO: Get the total of finished content to calculate the progress
                  this.totalFinishedCourseContents =
                    res.data.enrollmentByCourseForCurrentUser.learningprogressSet.totalCount;
                });
            }
          });
      },
      deep: true,
      immediate: true
    }
  }
};
</script>
<style lang="scss">
@import "src/css/helpers/_mixins.scss";
@import "src/css/helpers/_variabels.scss";
// @import "src/assets/css/Lecture.scss";
/*--- start navbar ---*/
.q-tab__indicator {
    opacity: 0 !important;
}
.q-tab--active {
    background-color: 2px solid #FCD462;
}
.navv {
  background-color: #fcfcfc;
  padding: 10px;
  margin: 20px 0 20px 0;
  .menu {
    display: inline-block;
    margin-left: 20px;
    img {
      width: auto;
    }
  }
  .user {
    display: inline-block;
    img {
      display: inline-block;
      width: 45px;
      height: 45px;
      border-radius: 50px;
      margin: 0 0 0 5px;
    }
    h3 {
      display: inline-block;
      font-size: 18px;
      font-family: "cairoR";
      color: $textColor;
    }
  }
}
/*--- End navbar ---*/

/*--- START lecture ---*/
.Lecture {
  padding: 10px;
  margin: 20px 0 45px 0;
  position: relative;
  svg {
    position: absolute;
    top: 57px;
    right: 27px;
    width: auto;
  }
  .hedeer {
    height: 56px;
    margin: 0 0 12px 0;
    .percent {
      display: inline-block;
      width: 54px;
      height: 54px;
      border: 2px solid #fcd462;
      border-radius: 4px;
      text-align: center;
      margin-left: 14px;
      h3 {
        font-size: 18px;
        font-family: "cairoR";
        margin: 2px 0 4px 0;
        color: $textColor;
      }
      span {
        font-size: 13px;
        font-family: "cairoR";
        display: block;
        color: #a1a1a1;
      }
    }
    .titel {
      display: inline-block;
      position: relative;
      top: -6px;
      img {
        display: inline-block;
        margin: -9px 0 0 0;
      }
      h3 {
        color: $textColor;
        font-size: 22px;
        font-family: "cairoB";
        line-height: 1.7;
        margin: 0 11px 0 0;
        display: inline-block;
        //maxMobile
        @media(max-width:767px){
            font-size: 18px;
        }
      }
    }
  }
  /*progress*/
  .progress {
    margin: 17px 0 0 0;
    height: 7px;
    .progress-bar {
      background: linear-gradient(
        90deg,
        rgba(123, 134, 250, 1) 17%,
        rgba(252, 212, 98, 1) 66%
      );
    }
  }
  /*tab Lect*/
  .tabLect {
    padding: 10px;
    .nav-tabs {
      margin: 0 0 20px 0;
      background: #ffff;
      padding: 10px;
      border: 0;
      @include prefixer(
        box-shadow,
        2px 9px 18.79px 2.21px rgba(147, 147, 147, 0.14),
        webkit moz o
      );
      .nav-link {
        color: $textColor;
        font-size: 17px;
        font-family: "cairoB";
        border: 0;
        &.active {
          border-bottom: 2px solid #fcd462;
        }
      }
    }
    .tab-content {
      margin: 20px 0 0 0;
      .asid {
        width: 100%;
        background: #fff;
        // height: 409px;
        border-bottom-left-radius: 42px;
        border-bottom-right-radius: 42px;
        margin: 0 0 30px 0;
        //maxMobile
        @media(max-width:767px){
            height: auto;
            margin: 0 0 50px 0;
        }
        .titel {
          display: inline-block;
          background-color: #7b86fa;
          width: 100%;
          padding: 27px;
          border-top-left-radius: 42px;
          border-top-right-radius: 42px;
          margin: 0 0 20px 0;
          img {
            display: inline-block;
            margin: -9px 0 0 0;
          }
          h3 {
            color: #fff;
            font-size: 18px;
            font-family: "cairoR";
            line-height: 1.7;
            margin: 0 11px 0 0;
            display: inline-block;
          }
          .butt {
            display: inline-block;
            float: left;
            img {
              cursor: pointer;
              width: auto;
              margin: 0 0 0 7px;
            }
          }
        }
        /* Collaps */
        .accord {
          padding: 0 10px 0 10px;
          .card {
            margin: 0 0 10px 0;
            border: 0;
            .card-header {
              background-color: #fff;
              border-bottom: 2px solid #f2f2f2;
              a {
                color: #9c9c9c;
                font-size: 16px;
                font-family: "cairoR";
                cursor: pointer;
                @media(max-width:767px){
                  font-size: 15px;
                }
                .linke {
                  background-color: #0c7ad8;
                  width: 35px;
                  height: 31px;
                  display: inline-block;
                  text-align: center;
                  margin: 0 -20px 0 9px;
                  line-height: 1.7;
                }
              }
            }
            .info {
              padding: 7px;
              border-bottom: 1px solid #f2f2f2;
              .mage {
                background-color: #fbc74b;
                width: 31px;
                height: 38px;
                text-align: center;
                line-height: 2;
                margin-left: 10px;
                display: inline-block;
              }
              h3 {
                display: inline-block;
                color: #9c9c9c;
                font-size: 15px;
                font-family: "cairoR";
              }
              &.active {
                background: #fcd462;
                color: #fff;
              }
            }
          }
        }
      }
      .vedio {
        //maxMobile
        @media(max-width:767px){
            margin: 0 0 25px 0;
        }
        .megx {
          width: 100%;
          height: 611px;
          border-radius: 44px;
          overflow: hidden;
          position: relative;
          margin: 0 0 30px 0;
          //maxMobile
          @media(max-width:767px){
              margin: 0;
              height: 411px;
          }
          img {
            width: 100%;
          }
          .play {
            position: absolute;
            width: auto;
            top: 43%;
            left: 46%;
            cursor: pointer;
            //maxMobile
            @media(max-width:767px){
                left:98px
            }
          }
        }
        .arrow {
          margin: 47px 0 0 0;
          text-align: center;
          //maxMobile
          @media(max-width:767px){
              text-align: center;
              margin: 25px 0 25px 0;
              position: fixed;
              bottom: 56px;
              background: #fff;
              left: 0;
              z-index: 3;
              width: 100%;
              padding: 12px;
              box-shadow: 3px 3px 15px #c5c5c5e3;
              display: flex;
              justify-content: space-around;
          }
          //maxSmall
          @media(max-width:991px){
              text-align: center;
              margin: 25px 0 25px 0;
              position: fixed;
              bottom: -23px;
              background: #fff;
              left: 0;
              z-index: 3;
              width: 100%;
              padding: 12px;
              box-shadow: 3px 3px 15px #c5c5c5e3;
              display: flex;
              justify-content: space-around;
          }
          .next {
            display: inline-block;
            margin: 0 0 0 36px;
            //maxMobile
            @media(max-width:767px){
                margin: 0;
            }
            img {
              display: inline-block;
              margin: 0 10px 0 10px;
              cursor: pointer;
              //maxMobile
              @media(max-width:767px){
                  margin: 0;
                  width: 40px;
              }
            }
            h3 {
              display: inline-block;
              font-size: 15px;
              font-family: "cairoR";
              color: $textColor;
              //maxMobile
              @media(max-width:767px){
                  display: block;
                  display:unset
              }
            }
          }
        }
      }
      // .mobailScreen{
      //   display: none;
      //   //maxMobile
      //   @media(max-width:767px){
      //       display: block;
      //   }
      //   //maxSmall
      //   @media(max-width:991px){
      //       display: block;
      //   }
      // }
      // .largScreen{
      //     //maxMobile
      //     @media(max-width:767px){
      //         display: none;
      //     }
      //     //maxSmall
      //     @media(max-width:991px){
      //         display: none;
      //     }
      // }
      /* start download */
      .download {
        .down {
          background-color: #fff;
          padding: 20px;
          text-align: center;
          border-radius: 25px;
          h3 {
            font-size: 15px;
            color: #a1a1a1;
            font-family: "cairoR";
            margin: 10px 0 24px 0;
          }
        }
        button {
          text-align: center;
          width: 128px;
          margin: 0 auto;
          height: 49px;
          box-shadow: none;
          background-color: #f9f9f9;
          outline: 0;
          font-family: "cairoB";
          .immag {
            display: inline-block;
            background: #fbc74b;
            width: 36px;
            height: 30px;
            border-radius: 17px;
            margin: 0 -16px 0 4px;
          }
        }
      }
      /* start Question */
      .question {
        width: 100%;
        height: auto;
        .pernt {
          background-color: #fff;
          border-radius: 15px;
          // padding: 50px 20px 20px 20px;
          .ask {
            background-color: #fff;
            padding: 10px;
            position: relative;
            border-radius: 15px;
            margin: 0 0 35px 0;
            @include prefixer(
              box-shadow,
              2px 9px 18.79px 2.21px rgba(185, 183, 183, 0.14),
              webkit moz o
            );
            .point {
              position: absolute;
              top: 11px;
              left: 16px;
            }
            .users {
              text-align: center;
              position: relative;
              top: -18px;
              img {
                margin: 0 0 6px 0;
              }
              h3 {
                font-size: 10px;
                font-family: "cairoR";
                color: $textColor;
                @media (max-width: 767px) {
                  font-size: 14px;
                }
              }
            }
            .pragh {
              h3 {
                font-size: 15px;
                width: 80%;
                font-family: "cairoR";
                color: #7b7b7b;
                line-height: 1.8;
                margin: 0 0 33px 0;
                //maxMobile
                @media (max-width: 767px) {
                  width: 100%;
                }
              }
            }
            .bottom {
              //maxMobile
              @media (max-width: 767px) {
                padding: 0 10px 0 10px;
              }
              .like {
                display: inline-block;
                margin: 0 0 0 30px;
                h4 {
                  font-size: 14px;
                  font-family: "cairoR";
                  color: $textColor;
                  display: inline-block;
                  svg {
                    display: inline-block;
                    position: unset;
                    margin: 0 3px 0 0;
                    cursor: pointer;
                  }
                }
              }
              .reply {
                display: inline-block;
                h4 {
                  font-size: 14px;
                  font-family: "cairoR";
                  color: $textColor;
                  display: inline-block;
                  margin: 0 0 0 10px;
                }
                .person {
                  width: 25px;
                  height: 25px;
                  display: inline-block;
                  border-radius: 50px;
                  margin: 0 0 0 10px;
                }
                img {
                  width: auto;
                  display: inline-block;
                  cursor: pointer;
                }
              }
              .more {
                display: inline-block;
                float: left;
                cursor: pointer;
                h4 {
                  font-size: 14px;
                  font-family: "cairoR";
                  color: $textColor;
                  img {
                    margin: 0 4px 0 0;
                  }
                }
              }
            }
          }
          .send {
            // margin: 84px 0 12px 0;
            margin-bottom: 5rem;
            form {
              position: relative;
              input {
                width: 100%;
                height: 49px;
                padding: 15px 15px 15px 47px;
                font-size: 16px;
                font-family: "cairoR";
                border-radius: 50px;
                color: $textColor;
                ::placeholder {
                  font-size: 14px;
                  font-family: "cairoR";
                  color: $textColor;
                }
              }
              button {
                position: absolute;
                left: 7px;
                top: 9px;
                width: unset;
                height: 0;
              }
            }
          }
        }
      }
      /* start Tetch */
      .tetch {
        .tech {
          text-align: center;
          margin: 0 0 25px 0;
          position: relative;
          background: #fff;
          padding: 25px 0 25px 0;
          border-radius: 30px;
          .img-user {
            position: relative;
            width: 97px;
            text-align: center;
            margin: 0 auto;
            svg {
              position: absolute;
              top: 0;
              right: 9px;
              left: 0;
            }
            img {
              border-radius: 50%;
              width: 69px;
              position: relative;
              height: 69px;
              margin: 5px 0 14px 0;
            }
          }
          h3 {
            font-size: 18px;
            font-family: "cairoR";
            color: #7b7b7b;
            margin: 8px 0 14px 0;
          }
          p {
            margin: 0 auto 34px auto;
            width: 82%;
            color: #9c9c9c;
            font-size: 16px;
            font-family: "cairoR";
            line-height: 1.7;
          }
          a {
            text-decoration: none;
            h3 {
              font-size: 11px;
              color: $textColor;
              font-family: "cairoB";
              margin: 0;
              img {
                width: auto;
                height: auto;
                margin: 0 5px 0 0;
              }
            }
          }
        }
      }
    }
  }
}

/*--- End lecture ---*/
</style>
