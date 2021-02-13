<template>
    <div class="question">
        <div class="row justify-center">
            <div class="col-lg-5 col-xs-12">
                <div class="pernt">
                    <div
                        class="ask"
                        v-for="question in allQuestionsByCourse.edges"
                        :key="question.node.id"
                    >
                        <class-question :question="question.node"/>
                    </div>
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
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import question from 'src/components/courseClass/question'
import { CreateCourseQuestion } from 'src/queries/question_management/mutation/CreateCourseQuestion'
import { AllQuestionsByCourse } from 'src/queries/question_management/query/AllQuestionsByCourse'

export default {
  data () {
    return {
      question: '',
      allQuestionsByCourse: []
    }
  },

  components: {
    'class-question': question
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
    }
  },

  methods: {
    async createNewQuestion (e) {
      e.preventDefault()
      const qResult = await this.$apollo.mutate({
        mutation: CreateCourseQuestion,
        variables: {
          courseId: this.course.pk,
          question: this.question
        },
        refetchQueries: [{ query: AllQuestionsByCourse, variables: { courseId: this.course.pk, orderBy: '-id' } }]
      })
      const qData = qResult.data.createCourseQuestion
      if (qData.success) {
        this.$q.notify({
          color: 'success',
          textColor: 'white',
          position: 'top',
          icon: 'cloud_done',
          message: 'تم السؤال بنجاح'
        })
        // TODO: Empty the question input for more questions
        this.question = ''
      }
    }
  }
}
</script>

<style></style>
