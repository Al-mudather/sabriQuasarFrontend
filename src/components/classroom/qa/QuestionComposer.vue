<script setup lang="ts">
/**
 * QuestionComposer — textarea + "Ask" button wired to CreateCourseQuestion.
 *
 * On success we clear the input and rely on QuestionAndAnswerSubscription to
 * push the new question into the cached list. No local optimistic insert:
 * the subscription is authoritative for list membership, and a double-insert
 * (optimistic + subscription) is a worse failure mode than a ~200ms delay.
 */
import { ref } from 'vue'
import { useMutation } from '@vue/apollo-composable'
import { useI18n } from 'vue-i18n'
import { CreateCourseQuestion } from 'src/graphql/question_management/mutation/CreateCourseQuestion'
import type {
  CreateCourseQuestionResult,
  CreateCourseQuestionVars,
} from 'src/types/qa/types'

const props = defineProps<{ courseId: number }>()
const emit = defineEmits<{ created: [questionPk: number] }>()

const { t } = useI18n()
const text = ref('')
const submitting = ref(false)
const errorMsg = ref<string | null>(null)

const { mutate } = useMutation<CreateCourseQuestionResult, CreateCourseQuestionVars>(
  CreateCourseQuestion,
)

async function submit(): Promise<void> {
  const trimmed = text.value.trim()
  if (!trimmed || submitting.value || !props.courseId) return
  submitting.value = true
  errorMsg.value = null
  try {
    const res = await mutate({ courseId: props.courseId, question: trimmed })
    const pk = res?.data?.createCourseQuestion?.question?.pk ?? null
    const ok = res?.data?.createCourseQuestion?.success
    if (ok) {
      text.value = ''
      if (pk != null) emit('created', pk)
    } else {
      errorMsg.value = t('classroom.qa.errorTitle')
    }
  } catch (err) {
    console.warn('[qa/QuestionComposer] createCourseQuestion failed', err)
    errorMsg.value = t('classroom.qa.errorTitle')
  } finally {
    submitting.value = false
  }
}

function onKeydown(e: KeyboardEvent): void {
  // Cmd/Ctrl+Enter submits — power-user shortcut, doesn't break a11y.
  if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
    e.preventDefault()
    void submit()
  }
}
</script>

<template>
  <form class="qa-composer" @submit.prevent="submit">
    <textarea
      v-model="text"
      class="qa-composer__input"
      rows="3"
      :placeholder="t('classroom.qa.composerPlaceholder')"
      :disabled="submitting"
      :aria-label="t('classroom.qa.composerPlaceholder')"
      @keydown="onKeydown"
    />
    <div class="qa-composer__row">
      <span v-if="errorMsg" class="qa-composer__error" role="alert">{{ errorMsg }}</span>
      <span v-else class="qa-composer__spacer" />
      <q-btn
        type="submit"
        unelevated
        no-caps
        class="qa-composer__btn"
        :disable="!text.trim() || submitting"
        :loading="submitting"
        :label="t('classroom.qa.askBtn')"
      />
    </div>
  </form>
</template>

<style lang="scss" scoped>
.qa-composer {
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-2);
  background: var(--cls-surface-elevated);
  border: 1px solid var(--cls-divider);
  border-radius: var(--cls-radius-md);
  padding: var(--ds-space-3);

  &__input {
    width: 100%;
    resize: vertical;
    min-height: 72px;
    background: transparent;
    color: var(--cls-text-primary);
    border: 1px solid var(--cls-divider);
    border-radius: var(--cls-radius-sm);
    padding: var(--ds-space-2) var(--ds-space-3);
    font-family: var(--ds-font-body);
    font-size: var(--ds-text-sm);
    line-height: var(--ds-leading-normal);
    outline: none;
    transition: border-color var(--cls-dur-fast) var(--cls-ease);

    &::placeholder { color: var(--cls-text-dim); }
    &:focus { border-color: var(--cls-accent); }
  }

  &__row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--ds-space-3);
  }

  &__spacer { flex: 1; }

  &__error {
    flex: 1;
    color: #E77C5C;
    font-size: var(--ds-text-xs);
  }

  &__btn {
    background: var(--cls-accent);
    color: var(--cls-text-primary);
    border-radius: var(--cls-radius-sm);
    font-weight: var(--ds-weight-semibold);
    padding: 0 var(--ds-space-4);

    &:focus-visible {
      outline: var(--cls-focus-ring);
      outline-offset: 2px;
    }
  }
}
</style>
