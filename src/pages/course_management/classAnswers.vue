<template>
    <div class="question">
        <div class="row justify-center">
            <div class="col-lg-5 col-xs-12">
                <div class="pernt">
                  <div class="send">
                        <!-- <form @submit="createNewQuestion"> -->
                        <form>
                            <input
                                type="text"
                                v-model="question"
                                style="outline: none"
                                placeholder="ما هي إجابتكٍ"
                            />
                            <button type="submit">
                                <img src="~assets/img/send.png" />
                            </button>
                        </form>
                    </div>
                    <!-- <div
                        class="ask"
                        v-for="question in allQuestionsByCourse.edges"
                        :key="question.node.id"
                    >
                        <class-question :question="question.node"/>
                    </div> -->
                </div>
            </div>
        </div>
    </div>
</template>

<script>
// import classQuestion from 'src/components/courseClass/classQuestion'
// import { CreateCourseQuestion } from 'src/queries/question_management/mutation/CreateCourseQuestion'
// import { AllQuestionsByCourse } from 'src/queries/question_management/query/AllQuestionsByCourse'
// import gql from 'graphql-tag';

export default {
  data () {
    return {
      question: '',
      courseId: null,
      allQuestionsByCourse: []
    }
  },

  components: {
    // classQuestion
  },

  props: [''],

  watch: {
    '$route': {
      handler: function(to, from) {
        console.log('fffffffffffffffff')
        console.log(to.params.pk)
        console.log('fffffffffffffffff')
        this.courseId = to.params.pk
      },
      deep: true,
      immediate: true
    }
  },

//   apollo: {
//     allQuestionsByCourse: {
//       query () {
//         return AllQuestionsByCourse
//       },
//       variables () {
//         return {
//           courseId: this.courseId,
//           orderBy: '-id'
//         }
//       }
//     },
//     $subscribe: {

//         notificationCreated: {

//           query: gql`

// subscription QuestionAndAnswer($courseId: Int) {
//   questionAnswerSubscription(courseId: $courseId) {
//     notification{
//       id,
//       pk,
//       title
//       description
//       extraData
//       type
//       created
//       updated
//     },
//     question{
//       pk,
//       question
//     },
//     answer {
//       pk,
//       answer
//     }
//   }
// }

//           `,

//           variables () {
//             return {
//               courseId: this.courseId
//             }
//           },

//           result({data}) {
//             // console.log("GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG")
//             // this.myNotifications = data.notificationCreated.notifications;
//             // console.log(data.questionAnswerSubscription)
//             // this.$root.$emit('updateGlobalNotification',data.questionAnswerSubscription.notification)
//             // console.log()
//             // if (this.$_.get(this.myNotifications, '[edges]')) {
//             //   this.myNotifications.edges.push({
//             //     node: data.notificationCreated.notification
//             //   })
//             //   this.myNotifications.totalCount++
//             // } else {
//             //   this.myNotifications = {
//             //     totalCount: 1,
//             //     edges: {
//             //       node: data.notificationCreated.notification
//             //     }
//             //   }
//             // }

//             // console.log(this.notificationCreated)
//             // console.log("GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG")
//           },

//         },

//       },
//   },

  // methods: {
  //   async createNewQuestion (e) {
  //     e.preventDefault()
  //     const qResult = await this.$apollo.mutate({
  //       mutation: CreateCourseQuestion,
  //       variables: {
  //         courseId: this.courseId,
  //         question: this.question
  //       },
  //       refetchQueries: [{ query: AllQuestionsByCourse, variables: { courseId: this.courseId, orderBy: '-id' } }]
  //     })
  //     const qData = qResult.data.createCourseQuestion
  //     if (qData.success) {
  //       // this.$q.notify({
  //       //   color: 'success',
  //       //   textColor: 'white',
  //       //   position: 'top',
  //       //   icon: 'cloud_done',
  //       //   message: 'تم السؤال بنجاح'
  //       // })
  //       // TODO: Empty the question input for more questions
  //       this.question = ''
  //     }
  //   }
  // }
}
</script>

<style lang="scss">
@import "src/css/helpers/_mixins.scss";
@import "src/css/helpers/_variabels.scss";
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
        .megx {
          width: 100%;
          height: 611px;
          border-radius: 44px;
          overflow: hidden;
          position: relative;
          margin: 0 0 30px 0;
          img {
            width: 100%;
          }
          .play {
            position: absolute;
            width: auto;
            top: 43%;
            left: 46%;
            cursor: pointer;
          }
        }
        .arrow {
          margin: 47px 0 0 0;
          .next {
            display: inline-block;
            margin: 0 0 0 36px;
            img {
              display: inline-block;
              margin: 0 10px 0 10px;
              cursor: pointer;
            }
            h3 {
              display: inline-block;
              font-size: 15px;
              font-family: "cairoR";
              color: $textColor;
            }
          }
        }
      }
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
