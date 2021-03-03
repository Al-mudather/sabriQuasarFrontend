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
                      <transition
                        appear
                        enter-active-class="animated fadeIn"
                        leave-active-class="animated fadeOut"
                      >
                        <class-question v-on:questionData="showQuestionAnswers" :question="question.node"/>
                      </transition>
                    </div>
                </div>
            </div>
            <!-- Answers -->
            <div class="row col-lg-5 col-xs-12" v-if="!showQuestions">
                <div class="col-12 text-right">
                  <span class="text-overline">
                    {{selectedQuestionData.question}}
                  </span>
                  <button class="text-center q-ma-sm" style="width: 20%; height: 20%" @click="closeTheAnswers">
                    Back
                    <img src="~assets/img/send.png" />
                  </button>
                </div>
                <div class="col-12 pernt">
                  <div class="send">
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
                    <transition
                      appear
                      enter-active-class="animated fadeIn"
                      leave-active-class="animated fadeOut"
                    >
                      <classAnswer :replay="replay.node"/>
                    </transition>
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
import { QuestionAndAnswerSubscription } from 'src/queries/question_management/subscription/QuestionAndAnswerSubscription'

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

        questionAnswerSubscription: {

          query: QuestionAndAnswerSubscription,

          variables () {
            return {
              courseId: this.course.pk
            }
          },

          result({data}) {

            const { notification, answer, question } = data.questionAnswerSubscription;

            console.log(notification, answer, question)
            if (notification.type === "QUESTION_ASK") {
              // console.log(question)
              this.allQuestionsByCourse.edges.unshift({
                node: question
              })
            }
            if (notification.type === "QUESTION_ANS") {
              // console.log(question)

              if (this.$_.get(this.selectedQuestionData, '[questionreplySet][edges]')) {
                this.selectedQuestionData.questionreplySet.edges.unshift({
                  node: answer
                })
                this.selectedQuestionData.questionreplySet.totalCount++
              } else {
                this.selectedQuestionData.questionreplySet.edges = {
                  totalCount: 1,
                  edges: {
                    node: answer
                  }
                }
              }
            }
          },

        },

      },
  },

  methods: {
    showQuestionAnswers (question) {
      // TODO: Save the related question
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
        // TODO: Empty the question input for more questions
        this.answer = ''
      }
    }
  }
}
</script>

<style></style>
