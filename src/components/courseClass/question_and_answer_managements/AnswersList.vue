<template>
  <div class="row col-lg-12 col-xs-12">
    <div class="col-12 text-right" style="z-index: 9">
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
    <div class="col-12 pernt" style="margin: -55px 0 20px 0;">
      <div class="send">
        <form @submit="createNewReplay">
          <input
          class="input"
            type="text"
            v-model="answer"
            style="outline: none"
            :placeholder="$t('ما هي إيجابتك')"
          />
          <button type="submit" class="m_btn">
            <img class="m_btn__visible" src="~assets/img/send.png" />
            <span class="m_btn__invisible">Ans</span>
          </button>
        </form>
      </div>

      <div
        class="ask"
        v-for="replay in allQuestionRepliesForQuestion.edges"
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
      <div class="butDown text-center" v-if='$_.get(allQuestionRepliesForQuestion,"[pageInfo][hasNextPage]")'>
        <button @click="LOAD_MORE_DATA">{{$t('عرض المزيد')}}<img class="q-mr-sm" src="~assets/img/moree.png" alt=""></button>
      </div>
    </div>
  </div>
</template>

<script>
import AnswerCard from "src/components/courseClass/question_and_answer_managements/AnswerCard";
import { CreateQuestionReply } from "src/queries/question_management/mutation/CreateQuestionReply";
import { AllQuestionRepliesForQuestion } from "src/queries/question_management/query/AllQuestionRepliesForQuestion.js"

export default {
  data() {
    return {
      lodash: this.$_,
      allQuestionRepliesForQuestion: "",
      answer: ""
    };
  },
  components: {
    AnswerCard
  },
  apollo: {
    allQuestionRepliesForQuestion: {
      query () {
        return AllQuestionRepliesForQuestion
      },
      variables () {
        return {
          questionId: this.selectedQuestionData.pk,
          orderBy: '-id',
          limit: 10
        }
      }
    }
  },
  props: ["selectedQuestionData"],
  methods: {
    closeTheAnswers() {
      this.showQuestions = true;
      this.$emit("closeTheAnswersList", true);
    },
    async LOAD_MORE_DATA () {
      await this.$apollo.queries.allQuestionRepliesForQuestion.fetchMore({
        variables: {
          questionId: this.selectedQuestionData.pk,
          orderBy: '-id',
          cursor: this.allQuestionRepliesForQuestion.pageInfo.endCursor
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          const newEdges = fetchMoreResult.allQuestionRepliesForQuestion.edges
          const pageInfo = fetchMoreResult.allQuestionRepliesForQuestion.pageInfo

          if (newEdges.length) {
            this.allQuestionRepliesForQuestion = {
              __typename:
                                previousResult.allQuestionRepliesForQuestion.__typename,
              edges: [
                ...previousResult.allQuestionRepliesForQuestion.edges,
                ...newEdges
              ],
              pageInfo
            }

            return { allQuestionRepliesForQuestion: this.allQuestionRepliesForQuestion }
          }
          return previousResult
        }
      })
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
