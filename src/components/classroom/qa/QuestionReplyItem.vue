<script setup lang="ts">
/**
 * QuestionReplyItem — a single reply row.
 * Shows author, text, and an archive button when the current user owns it.
 */
import { computed, ref } from 'vue'
import { useMutation } from '@vue/apollo-composable'
import { useI18n } from 'vue-i18n'
import { ArchiveQuestionReply } from 'src/graphql/question_management/mutation/ArchiveQuestionReply'
import { useAuthStore } from 'src/stores/auth'
import { renderQaContent } from 'src/utils/renderQaContent'
import type {
  ArchiveQuestionReplyResult,
  ArchiveQuestionReplyVars,
  QuestionReply,
} from 'src/types/qa/types'

const props = defineProps<{ reply: QuestionReply }>()

const { t } = useI18n()
const auth = useAuthStore()
const archiving = ref(false)
const archivedLocally = ref(false)

const authorName = computed(() => {
  const u = props.reply.user
  if (!u) return ''
  const full = [u.firstName, u.lastName].filter(Boolean).join(' ').trim()
  return full || u.email || ''
})

const renderedAnswer = computed(() => renderQaContent(props.reply.answer))

const isOwn = computed(() => {
  const me = (auth.user as { pk?: number | null } | null)?.pk ?? null
  const uPk = props.reply.user?.pk ?? null
  return me != null && uPk != null && me === uPk
})

const { mutate: runArchive } = useMutation<
  ArchiveQuestionReplyResult,
  ArchiveQuestionReplyVars
>(ArchiveQuestionReply)

async function onArchive(): Promise<void> {
  if (archiving.value || props.reply.pk == null) return
  archiving.value = true
  try {
    const res = await runArchive({ questionReplyId: props.reply.pk })
    if (res?.data?.archiveQuestionReply?.success) {
      archivedLocally.value = true
    }
  } catch (err) {
    console.warn('[qa/QuestionReplyItem] archive failed', err)
  } finally {
    archiving.value = false
  }
}
</script>

<template>
  <li class="qa-reply" :class="{ 'qa-reply--archived': archivedLocally }">
    <header class="qa-reply__head">
      <span class="qa-reply__author">{{ authorName }}</span>
      <button
        v-if="isOwn && !archivedLocally"
        type="button"
        class="qa-reply__archive"
        :disabled="archiving"
        :aria-label="t('classroom.qa.archive')"
        @click="onArchive"
      >
        {{ t('classroom.qa.archive') }}
      </button>
      <span v-if="archivedLocally" class="qa-reply__badge">
        {{ t('classroom.qa.archived') }}
      </span>
    </header>
    <div class="qa-reply__body qa-prose" v-html="renderedAnswer" />
  </li>
</template>

<style lang="scss" scoped>
.qa-reply {
  list-style: none;
  padding: var(--ds-space-2) 0;
  border-top: 1px solid var(--cls-divider);
  color: var(--cls-text-primary);

  &--archived { opacity: 0.55; }

  &__head {
    display: flex;
    align-items: center;
    gap: var(--ds-space-2);
    font-size: var(--ds-text-xs);
    color: var(--cls-text-muted);
  }

  &__author {
    font-weight: var(--ds-weight-semibold);
    color: var(--cls-text-primary);
    flex: 1;
  }

  &__archive {
    background: transparent;
    border: 1px solid var(--cls-divider);
    color: var(--cls-text-muted);
    border-radius: var(--cls-radius-sm);
    padding: 2px 8px;
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

  &__badge {
    font-size: var(--ds-text-xs);
    color: var(--cls-text-dim);
    font-style: italic;
  }

  &__body {
    margin: var(--ds-space-1) 0 0;
    font-size: var(--ds-text-sm);
    line-height: var(--ds-leading-normal);
    white-space: pre-wrap;
    word-break: break-word;
  }
}
</style>
