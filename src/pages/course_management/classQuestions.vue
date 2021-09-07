<template>
    <div class="question">
        <div class="row justify-center">
            <div class="col-lg-5 col-xs-12">
                <div class="pernt">
                  <div class="send">
                        <form @submit="createNewQuestion">
                            <input
                                type="text"
                                v-model="question"
                                style="outline: none"
                                :placeholder="$t('أسئل لتجد الاجابة')"
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
                        <class-question :question="question.node"/>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import classQuestion from 'src/components/courseClass/classQuestion.vue'
import { CreateCourseQuestion } from 'src/queries/question_management/mutation/CreateCourseQuestion'
import { AllQuestionsByCourse } from 'src/queries/question_management/query/AllQuestionsByCourse'
import gql from 'graphql-tag';

export default {
  data () {
    return {
      question: '',
      courseId: null,
      allQuestionsByCourse: []
    }
  },

  components: {
    classQuestion
  },

  props: [''],

  watch: {
    '$route': {
      handler: function(to, from) {

        this.courseId = to.params.pk
      },
      deep: true,
      immediate: true
    }
  },

  apollo: {
    allQuestionsByCourse: {
      query () {
        return AllQuestionsByCourse
      },
      variables () {
        return {
          courseId: this.courseId,
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
      question
    },
    answer {
      pk,
      answer
    }
  }
}

          `,

          variables () {
            return {
              courseId: this.courseId
            }
          },

          result({data}) {
            // console.log("GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG")
            // this.myNotifications = data.notificationCreated.notifications;
            // console.log(data.questionAnswerSubscription)
            // this.$root.$emit('updateGlobalNotification',data.questionAnswerSubscription.notification)
            // console.log()
            // if (this.$_.get(this.myNotifications, '[edges]')) {
            //   this.myNotifications.edges.push({
            //     node: data.notificationCreated.notification
            //   })
            //   this.myNotifications.totalCount++
            // } else {
            //   this.myNotifications = {
            //     totalCount: 1,
            //     edges: {
            //       node: data.notificationCreated.notification
            //     }
            //   }
            // }

            // console.log(this.notificationCreated)
            // console.log("GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG")
          },

        },

      },
  },

  methods: {
    async createNewQuestion (e) {
      e.preventDefault()
      const qResult = await this.$apollo.mutate({
        mutation: CreateCourseQuestion,
        variables: {
          courseId: this.courseId,
          question: this.question
        },
        refetchQueries: [{ query: AllQuestionsByCourse, variables: { courseId: this.courseId, orderBy: '-id' } }]
      })
      const qData = qResult.data.createCourseQuestion
      if (qData.success) {
        // this.$q.notify({
        //   color: 'success',
        //   textColor: 'white',
        //   position: 'top',
        //   icon: 'cloud_done',
        //   message: 'تم السؤال بنجاح'
        // })
        // TODO: Empty the question input for more questions
        this.question = ''
      }
    }
  }
}
</script>

<style></style>
