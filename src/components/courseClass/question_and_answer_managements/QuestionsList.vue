<template>
  <div class="col-lg-12 col-xs-12">
    <div class="pernt">
      <div class="send">
        <form @submit="createNewQuestion">
          <input
            type="text"
            v-model="question"
            style="outline: none"
            :placeholder="$t('أسئل لتجد الاجابة')"
          />
          <button type="submit" class="m_btn">
            <img class="m_btn__visible" src="~assets/img/send.png" />
            <span class="m_btn__invisible">Ask</span>
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
      <div class="butDown text-center" v-if='$_.get(allQuestionsByCourse,"[pageInfo][hasNextPage]")'>
        <button @click="LOAD_MORE_DATA">{{$t('عرض المزيد')}}<img class="q-mr-sm" src="~assets/img/moree.png" alt=""></button>
      </div>
    </div>
  </div>
</template>

<script>
import QuestionCard from "src/components/courseClass/question_and_answer_managements/QuestionCard.vue";
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
    LOAD_MORE_DATA () {
      this.$emit('loadMoreQuestions')
    },
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

<style lang="scss">
.m_btn {
    min-height: 2rem;
    width: 3rem;
    position: relative;
    overflow: hidden;
    cursor: pointer;

    & > * {
        display: inline-block;
        transition: all .4s;
    }

    // &__visible {
    //     padding: 2rem 7.5rem;
    // }

    &__invisible {
        position: absolute;
        padding-left: 0.3rem;
        padding-top: 0.3rem;
        padding-right: 0.3rem;
        width: 100%;
        left: 0;
        top: -100%;
    }

    &:hover &__visible {
        transform: translateY(100%);
    }

    &:hover &__invisible {
        top: 0;
        background-color: $color-primary-dark;
        color: $color-grey-light-2;
    }

    &:focus {
        outline: none;
        animation: pulsate 1s infinite;
    }
}

.input {
    font-size: 1.5rem;
    font-family: inherit;
    color: inherit;
    padding: 1.5rem 2rem;
    border-radius: 2px;
    background-color: rgba($color-white, .5);
    // border: none;
    border-bottom: 3px solid transparent;
    width: 90%;
    display: block;
    transition: all .3s;

    // @include respond(tab-port) {
    //     width: 100%;
    // }

    &-search {

      &:focus {
          border-bottom: 3px solid #FCC74C;
      }
    }

    &:focus {
        outline: none;
        box-shadow: 0 1rem 2rem rgba($color-black, .1);
        border-bottom: 3px solid $color-primary;
    }

    &:focus:invalid {
        border-bottom: 3px solid $color-secondary-dark;
    }

    &::-webkit-input-placeholder {
        color: $color-grey-dark-2;
    }
}
</style>
