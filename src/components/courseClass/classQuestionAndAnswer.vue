<template>
    <div class="question">
        <div class="row justify-center">
            <div class="col-lg-5 col-xs-12" v-if="showQuestions">
                <div class="pernt">
                  <div class="send">
                        <form @submit="createNewQuestion">
                            <input
                                type="text"
                                v-model="question"
                                style="outline: none"
                                placeholder="أسئل لتجد الاجابة"
                            />
                            <button type="submit">
                                <img src="~assets/img/send.png" />
                            </button>
                        </form>
                    </div>
                    <div
                        class="ask"
                        v-for="question in allQuestionsByCourse.edges"
                        :key="question.node.id"
                    >
                        <class-question v-on:questionData="showQuestionAnswers" :question="question.node"/>
                    </div>
                </div>
            </div>
            <!-- Answers -->
            <div class="col-lg-5 col-xs-12" v-if="!showQuestions">
                <div class="pernt">
                  <div class="send">
                      <button class="text-center q-ma-sm" style="width: 20%; height: 20%" @click="closeTheAnswers">
                        Back
                        <img src="~assets/img/send.png" />
                      </button>
                      <form @submit="createNewReplay">
                          <input
                              type="text"
                              v-model="answer"
                              style="outline: none"
                              placeholder="ما هي إيجابتك"
                          />
                          <button type="submit">
                              <img src="~assets/img/send.png" />
                          </button>
                      </form>
                  </div>

                  <div
                      class="ask"
                      v-for="replay in selectedQuestionData.questionreplySet.edges"
                      :key="replay.node.id"
                  >
                      <classAnswer :replay="replay.node"/>
                  </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import classQuestion from 'src/components/courseClass/classQuestion'
import classAnswer from 'src/components/courseClass/classAnswer'
import { CreateCourseQuestion } from 'src/queries/question_management/mutation/CreateCourseQuestion'
import { AllQuestionsByCourse } from 'src/queries/question_management/query/AllQuestionsByCourse'

import { CreateQuestionReply } from 'src/queries/question_management/mutation/CreateQuestionReply'
import gql from 'graphql-tag';

export default {
  data () {
    return {
      question: '',
      answer: '',
      selectedQuestionData: '',
      showQuestions: true,
      allQuestionsByCourse: []
    }
  },

  components: {
    classQuestion,
    classAnswer
  },

  props: ['course'],

  apollo: {
    allQuestionsByCourse: {
      query () {
        return AllQuestionsByCourse
      },
      variables () {
        return {
          courseId: this.course.pk,
          orderBy: '-id'
        }
      }
    },
    $subscribe: {

        notificationCreated: {

          query: gql`

subscription QuestionAndAnswer($courseId: Int) {
  questionAnswerSubscription(courseId: $courseId) {
    notification{
      id,
      pk,
      title
      description
      extraData
      type
      created
      updated
    },
    question{
      pk,
      question,
      user {
        id,
        pk,
        firstName,
        lastName,
        email
      }
    },
    answer {
      pk,
      answer,
      user {
        id,
        pk,
        firstName,
        lastName,
        email
      }
    }
  }
}

          `,


          variables () {
            return {
              courseId: this.course.pk
            }
          },

          result({data}) {
            console.log("fffffffffffffffffffffffffffffff")
            console.log(data)
            const { notification, answer, question } = data.questionAnswerSubscription;

            console.log(notification, answer, question)
            if (notification.type === "QUESTION_ASK") {
              // console.log(question)
              this.allQuestionsByCourse.edges.push({
                node: question
              })
            }
            // console.log()
            // if (this.$_.get(this.selectedQuestionData, '[questionreplySet][edges]')) {
            //   this.selectedQuestionData.questionreplySet.edges.push({
            //     node: data.questionAnswerSubscription.notification
            //   })
            //   this.selectedQuestionData.questionreplySet.totalCount++
            // } else {
            //   this.selectedQuestionData.questionreplySet = {
            //     totalCount: 1,
            //     edges: {
            //       node: data.questionAnswerSubscription.notification
            //     }
            //   }
            // }
            // if (this.$_.get(this.selectedQuestionData, '[questionreplySet][edges]')) {
            //   this.selectedQuestionData.questionreplySet.edges.push({
            //     node: data.questionAnswerSubscription.notification
            //   })
            //   this.selectedQuestionData.questionreplySet.totalCount++
            // } else {
            //   this.selectedQuestionData.questionreplySet = {
            //     totalCount: 1,
            //     edges: {
            //       node: data.questionAnswerSubscription.notification
            //     }
            //   }
            // }

            // console.log(this.notificationCreated)
            console.log("fffffffffffffffffffffffffffffff")
          },

        },

        

      },
  },

  methods: {
    showQuestionAnswers (question) {
      // console.log('llllllllllllllllllllllllll')
      // console.log(question.pk)
      // console.log('llllllllllllllllllllllllll')
      this.selectedQuestionData = question
      this.showQuestions = false
    },

    closeTheAnswers () {

      this.showQuestions = true
    },

    async createNewQuestion (e) {
      e.preventDefault()
      const qResult = await this.$apollo.mutate({
        mutation: CreateCourseQuestion,
        variables: {
          courseId: this.course.pk,
          question: this.question
        }
        // refetchQueries: [{ query: AllQuestionsByCourse, variables: { courseId: this.course.pk, orderBy: '-id' } }]
      })
      const qData = qResult.data.createCourseQuestion
      if (qData.success) {

        // TODO: Empty the question input for more questions
        this.question = ''
      }
    },

    async createNewReplay (e) {
      e.preventDefault()
      const qResult = await this.$apollo.mutate({
        mutation: CreateQuestionReply,
        variables: {
          questionId: this.selectedQuestionData.pk,
          answer: this.answer
        }
      })
      const qData = qResult.data.createQuestionReply
      if (qData.success) {
        const replay = qData.questionReply
        console.log('kkkkkkkkkkkkkkk')
        console.log(replay)
        console.log('kkkkkkkkkkkkkkk')
        this.selectedQuestionData
        // TODO: Empty the question input for more questions
        this.question = ''
      }
    }
  }
}
</script>

<style></style>
