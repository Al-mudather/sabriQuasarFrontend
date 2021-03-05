<template>
  <div class="row col-lg-5 col-xs-12">
    <div class="col-12 text-right">
      <span class="text-overline">
        {{ selectedQuestionData.question }}
      </span>
      <button
        class="text-center q-ma-sm"
        style="width: 20%; height: 20%"
        @click="closeTheAnswers"
      >
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
            :placeholder="$t('ما هي إيجابتك')"
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
          <Answer-card :replay="replay.node" />
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import AnswerCard from "src/components/courseClass/question_and_answer_managements/AnswerCard";
import { CreateQuestionReply } from "src/queries/question_management/mutation/CreateQuestionReply";

export default {
  data() {
    return {
      lodash: this.$_,
      answer: ""
    };
  },
  components: {
    AnswerCard
  },
  props: ["selectedQuestionData"],
  methods: {
    closeTheAnswers() {
      this.showQuestions = true;
      this.$emit("closeTheAnswersList", true);
    },
    async createNewReplay(e) {
      e.preventDefault();
      const qResult = await this.$apollo.mutate({
        mutation: CreateQuestionReply,
        variables: {
          questionId: this.selectedQuestionData.pk,
          answer: this.answer
        }
      });
      const qData = qResult.data.createQuestionReply;
      if (qData.success) {
        // TODO: Empty the question input for more questions
        this.answer = "";
      }
    }
  }
};
</script>

<style></style>
