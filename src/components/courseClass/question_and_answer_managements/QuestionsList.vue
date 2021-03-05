<template>
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
        <transition
          appear
          enter-active-class="animated fadeIn"
          leave-active-class="animated fadeOut"
        >
          <Question-card
            v-on:questionData="showQuestionAnswersHandleer"
            :question="question.node"
          />
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import QuestionCard from "src/components/courseClass/question_and_answer_managements/QuestionCard";
import { CreateCourseQuestion } from "src/queries/question_management/mutation/CreateCourseQuestion";

export default {
  data() {
    return {
      lodash: this.$_,
      question: ""
    };
  },
  components: {
    QuestionCard
  },
  props: ["course", "allQuestionsByCourse"],
  methods: {
    showQuestionAnswersHandleer (question) {
      // TODO: Save the related question
      this.$emit('questionData', question)
    },
    async createNewQuestion(e) {
      e.preventDefault();
      const qResult = await this.$apollo.mutate({
        mutation: CreateCourseQuestion,
        variables: {
          courseId: this.course.pk,
          question: this.question
        }
      });
      const qData = qResult.data.createCourseQuestion;
      if (qData.success) {
        // TODO: Empty the question input for more questions
        this.question = "";
      }
    }
  }
};
</script>

<style></style>
