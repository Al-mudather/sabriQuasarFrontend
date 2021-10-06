<template>
    <div class="question">
        <div class="row justify-center">
           <!-- 
            Start of Questions List
          --> 
            <Questions-List 
              v-if="showQuestions"
              v-on:questionData="showQuestionAnswersHandler"
              :course="course"
              :allQuestionsByCourse="allQuestionsByCourse"
            />
          <!-- 
            End of Questions List
          -->
            
          <!-- 
            Start of Answers List
          -->
            <Answers-List
              v-if="!showQuestions" 
              v-on:closeTheAnswersList="closeTheAnswersListHandler"
              :selectedQuestionData="selectedQuestionData"
            />
          <!-- 
            End of Answers List
          -->

        </div>
    </div>
</template>

<script>
import QuestionsList from 'src/components/courseClass/question_and_answer_managements/QuestionsList.vue'
import AnswersList from 'src/components/courseClass/question_and_answer_managements/AnswersList.vue'
import { AllQuestionsByCourse } from 'src/queries/question_management/query/AllQuestionsByCourse'
import { QuestionAndAnswerSubscription } from 'src/queries/question_management/subscription/QuestionAndAnswerSubscription'


export default {
  data () {
    return {
      selectedQuestionData: '',
      showQuestions: true,
      allQuestionsByCourse: []
    }
  },

  components: {
    QuestionsList,
    AnswersList
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
    showQuestionAnswersHandler (question) {
      // TODO: Save the related question
      this.selectedQuestionData = question
      this.showQuestions = false
    },

    closeTheAnswersListHandler (value) {
      this.showQuestions = value
    }
  }
}
</script>

<style></style>
