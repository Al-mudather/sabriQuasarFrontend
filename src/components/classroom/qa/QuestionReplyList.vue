<script setup lang="ts">
/**
 * QuestionReplyList — lazy-loads replies for a question on first expand and
 * shows a reply composer at the bottom. Reply creation hits
 * CreateQuestionReply; the QuestionAndAnswerSubscription (wired up higher in
 * QuestionList) patches the cache so the parent question's reply count and
 * the reply list both refresh.
 *
 * We only fetch `AllQuestionRepliesForQuestion` on first expand so collapsed
 * threads cost nothing. After a successful post, we refetch to include the
 * new row (the subscription merges into the *questions* cache, but not the
 * dedicated reply-list cache entry).
 */
import { computed, ref, watch } from 'vue'
import { useQuery, useMutation } from '@vue/apollo-composable'
import { useI18n } from 'vue-i18n'
import { AllQuestionRepliesForQuestion } from 'src/graphql/question_management/query/AllQuestionRepliesForQuestion'
import { CreateQuestionReply } from 'src/graphql/question_management/mutation/CreateQuestionReply'
import QuestionReplyItem from './QuestionReplyItem.vue'
import type {
  CreateQuestionReplyResult,
  CreateQuestionReplyVars,
  QuestionReply,
  QuestionRepliesForQuestionResult,
  QuestionRepliesForQuestionVars,
} from 'src/types/qa/types'

const props = defineProps<{
  questionPk: number
  /** When `true`, the reply query is enabled and the UI renders. */
  active: boolean
  canReply?: boolean
}>()

const { t } = useI18n()

const variables = computed<QuestionRepliesForQuestionVars>(() => ({
  questionId: props.questionPk,
  orderBy: ['pk'],
  limit: 50,
  cursor: null,
}))

const { result, loading, error, refetch } = useQuery<
  QuestionRepliesForQuestionResult,
  QuestionRepliesForQuestionVars
>(AllQuestionRepliesForQuestion, variables, () => ({
  enabled: props.active && props.questionPk > 0,
  errorPolicy: 'all',
  fetchPolicy: 'cache-and-network',
}))

const replies = computed<QuestionReply[]>(() => {
  const edges = result.value?.allQuestionRepliesForQuestion?.edges ?? []
  const out: QuestionReply[] = []
  for (const e of edges) if (e?.node) out.push(e.node)
  return out
})

// --- Reply composer --------------------------------------------------------
const replyText = ref('')
const sending = ref(false)

const { mutate: runCreate } = useMutation<
  CreateQuestionReplyResult,
  CreateQuestionReplyVars
>(CreateQuestionReply)

async function submitReply(): Promise<void> {
  const body = replyText.value.trim()
  if (!body || sending.value || props.questionPk <= 0) return
  sending.value = true
  try {
    const res = await runCreate({ questionId: props.questionPk, answer: body })
    if (res?.data?.createQuestionReply?.success) {
      replyText.value = ''
      // Refresh the reply list — the subscription updates the parent's
      // reply count in the questions cache, but the dedicated reply query
      // has its own cache entry and needs a refetch to show the new row.
      void refetch()
    }
  } catch (err) {
    console.warn('[qa/QuestionReplyList] createReply failed', err)
  } finally {
    sending.value = false
  }
}

// If the parent collapses and re-expands the thread, refetch once so a
// subscription-driven update that arrived while hidden is reflected.
watch(
  () => props.active,
  (next, prev) => {
    if (next && !prev) void refetch()
  },
)
</script>

<template>
  <div class="qa-replies">
    <div v-if="loading && replies.length === 0" class="qa-replies__loading">
      <q-spinner size="18px" />
    </div>
    <div v-else-if="error" class="qa-replies__error" role="alert">
      {{ t('classroom.qa.errorTitle') }}
    </div>
    <ul v-else-if="replies.length > 0" class="qa-replies__list">
      <QuestionReplyItem
        v-for="r in replies"
        :key="r.id"
        :reply="r"
      />
    </ul>

    <form
      v-if="canReply !== false"
      class="qa-replies__composer"
      @submit.prevent="submitReply"
    >
      <input
        v-model="replyText"
        type="text"
        class="qa-replies__input"
        :placeholder="t('classroom.qa.replyPlaceholder')"
        :disabled="sending"
        :aria-label="t('classroom.qa.replyPlaceholder')"
      />
      <q-btn
        type="submit"
        unelevated
        no-caps
        dense
        class="qa-replies__btn"
        :disable="!replyText.trim() || sending"
        :loading="sending"
        :label="t('classroom.qa.replyBtn')"
      />
    </form>
  </div>
</template>

<style lang="scss" scoped>
.qa-replies {
  margin-top: var(--ds-space-2);
  padding: var(--ds-space-2) var(--ds-space-3);
  background: rgba(255, 255, 255, 0.02);
  border-radius: var(--cls-radius-sm);

  &__loading {
    display: flex;
    justify-content: center;
    padding: var(--ds-space-2);
    color: var(--cls-text-muted);
  }

  &__error {
    color: #E77C5C;
    font-size: var(--ds-text-xs);
    padding: var(--ds-space-2);
  }

  &__list {
    margin: 0;
    padding: 0;
  }

  &__composer {
    display: flex;
    gap: var(--ds-space-2);
    align-items: center;
    margin-top: var(--ds-space-2);
    padding-top: var(--ds-space-2);
    border-top: 1px solid var(--cls-divider);
  }

  &__input {
    flex: 1;
    background: var(--cls-surface);
    color: var(--cls-text-primary);
    border: 1px solid var(--cls-divider);
    border-radius: var(--cls-radius-sm);
    padding: 6px var(--ds-space-2);
    font-family: var(--ds-font-body);
    font-size: var(--ds-text-sm);
    outline: none;
    transition: border-color var(--cls-dur-fast) var(--cls-ease);

    &::placeholder { color: var(--cls-text-dim); }
    &:focus { border-color: var(--cls-accent); }
  }

  &__btn {
    background: var(--cls-accent);
    color: var(--cls-text-primary);
    border-radius: var(--cls-radius-sm);
    font-weight: var(--ds-weight-semibold);
    padding: 0 var(--ds-space-3);

    &:focus-visible {
      outline: var(--cls-focus-ring);
      outline-offset: 2px;
    }
  }
}
</style>
