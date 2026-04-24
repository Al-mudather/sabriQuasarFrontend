<script setup lang="ts">
/**
 * QuestionItem — one row in the Q&A list.
 *
 * Collapsed by default. When expanded, renders the child `QuestionReplyList`
 * which lazy-loads replies. Archive button is shown only when the current
 * user owns the question.
 */
import { computed, ref } from 'vue'
import { useMutation } from '@vue/apollo-composable'
import { useI18n } from 'vue-i18n'
import { ArchiveCourseQuestion } from 'src/graphql/question_management/mutation/ArchiveCourseQuestion'
import { useAuthStore } from 'src/stores/auth'
import QuestionReplyList from './QuestionReplyList.vue'
import type {
  ArchiveCourseQuestionResult,
  ArchiveCourseQuestionVars,
  CourseQuestion,
} from 'src/types/qa/types'

const props = defineProps<{ question: CourseQuestion }>()

const { t } = useI18n()
const auth = useAuthStore()

const expanded = ref(false)
const archiving = ref(false)
const archivedLocally = ref(false)

const authorName = computed(() => {
  const u = props.question.user
  if (!u) return ''
  const full = [u.firstName, u.lastName].filter(Boolean).join(' ').trim()
  return full || u.email || ''
})

const replyCount = computed<number>(
  () => props.question.questionreplySet?.totalCount ?? 0,
)

const isOwn = computed(() => {
  const me = (auth.user as { pk?: number | null } | null)?.pk ?? null
  const uPk = props.question.user?.pk ?? null
  return me != null && uPk != null && me === uPk
})

const { mutate: runArchive } = useMutation<
  ArchiveCourseQuestionResult,
  ArchiveCourseQuestionVars
>(ArchiveCourseQuestion)

async function onArchive(): Promise<void> {
  if (archiving.value || props.question.pk == null) return
  archiving.value = true
  try {
    const res = await runArchive({ questionId: props.question.pk })
    if (res?.data?.archiveCourseQuestion?.success) {
      archivedLocally.value = true
    }
  } catch (err) {
    console.warn('[qa/QuestionItem] archive failed', err)
  } finally {
    archiving.value = false
  }
}

function toggle(): void {
  expanded.value = !expanded.value
}

// Slot the pluralized reply-count label through i18n's message-compiler so
// Arabic/English can use different templates.
const repliesLabel = computed(() =>
  t('classroom.qa.nReplies', { n: replyCount.value }, replyCount.value),
)
</script>

<template>
  <article class="qa-item" :class="{ 'qa-item--archived': archivedLocally }">
    <header class="qa-item__head">
      <div class="qa-item__meta">
        <span class="qa-item__author">{{ authorName }}</span>
        <span v-if="isOwn && !archivedLocally" class="qa-item__own-badge">{{ t('classroom.qa.ownBadge') }}</span>
      </div>
      <button
        v-if="isOwn && !archivedLocally"
        type="button"
        class="qa-item__archive"
        :disabled="archiving"
        :aria-label="t('classroom.qa.archive')"
        @click="onArchive"
      >
        {{ t('classroom.qa.archive') }}
      </button>
      <span v-if="archivedLocally" class="qa-item__archived-badge">
        {{ t('classroom.qa.archived') }}
      </span>
    </header>

    <p class="qa-item__body">{{ question.question }}</p>

    <button
      type="button"
      class="qa-item__toggle"
      :aria-expanded="expanded"
      :aria-controls="`qa-thread-${question.pk ?? 0}`"
      @click="toggle"
    >
      <q-icon :name="expanded ? 'expand_less' : 'expand_more'" size="18px" />
      <span>{{ repliesLabel }}</span>
    </button>

    <div v-if="expanded" :id="`qa-thread-${question.pk ?? 0}`">
      <QuestionReplyList
        :question-pk="question.pk ?? 0"
        :active="expanded"
        :can-reply="true"
      />
    </div>
  </article>
</template>

<style lang="scss" scoped>
.qa-item {
  background: var(--cls-surface-elevated);
  border: 1px solid var(--cls-divider);
  border-radius: var(--cls-radius-md);
  padding: var(--ds-space-3);
  color: var(--cls-text-primary);
  transition: border-color var(--cls-dur-fast) var(--cls-ease);

  &--archived { opacity: 0.55; }

  &__head {
    display: flex;
    align-items: center;
    gap: var(--ds-space-2);
  }

  &__meta {
    flex: 1;
    display: flex;
    align-items: center;
    gap: var(--ds-space-2);
  }

  &__author {
    font-weight: var(--ds-weight-semibold);
    font-size: var(--ds-text-sm);
  }

  &__own-badge {
    font-size: var(--ds-text-xs);
    color: var(--cls-accent);
    background: var(--cls-accent-soft);
    border-radius: var(--cls-radius-sm);
    padding: 1px 8px;
  }

  &__archive {
    background: transparent;
    border: 1px solid var(--cls-divider);
    color: var(--cls-text-muted);
    border-radius: var(--cls-radius-sm);
    padding: 4px 10px;
    font-size: var(--ds-text-xs);
    cursor: pointer;
    transition: color var(--cls-dur-fast) var(--cls-ease), border-color var(--cls-dur-fast) var(--cls-ease);

    &:hover:not(:disabled) {
      color: var(--cls-accent);
      border-color: var(--cls-accent);
    }
    &:focus-visible {
      outline: var(--cls-focus-ring);
      outline-offset: 2px;
    }
    &:disabled { opacity: 0.5; cursor: not-allowed; }
  }

  &__archived-badge {
    font-size: var(--ds-text-xs);
    color: var(--cls-text-dim);
    font-style: italic;
  }

  &__body {
    margin: var(--ds-space-2) 0;
    font-size: var(--ds-text-sm);
    line-height: var(--ds-leading-normal);
    white-space: pre-wrap;
    word-break: break-word;
  }

  &__toggle {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: transparent;
    border: none;
    color: var(--cls-text-muted);
    font-size: var(--ds-text-xs);
    cursor: pointer;
    padding: 4px 0;

    &:hover { color: var(--cls-accent); }
    &:focus-visible {
      outline: var(--cls-focus-ring);
      outline-offset: 2px;
    }
  }
}
</style>
