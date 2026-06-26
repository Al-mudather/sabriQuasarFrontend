<template>
  <article
    class="notif-card"
    role="button"
    tabindex="0"
    @click="goToTheNotificationSource"
    @keydown.enter="goToTheNotificationSource"
  >
    <img src="~assets/img/man.png" alt="" class="notif-card__avatar" />
    <div class="notif-card__body">
      <p v-if="notification.type === 'QUESTION_ASK'">
        <span class="notif-card__label">{{ $t('السؤال :') }}</span>
        <strong>{{ notification.title }}</strong>
      </p>
      <p v-else-if="notification.type === 'QUESTION_ANS'">
        <span class="notif-card__label">{{ $t('جواب السؤال :') }}</span>
        <strong>{{ notification.title }}</strong>
        <br />
        {{ $t('هو :') }} <span>{{ notification.description }}</span>
      </p>
      <p v-else-if="notification.type === 'CHECKOUT_DONE'">
        {{ notification.description }}
        <br />
        <span class="notif-card__muted">{{ $t('تمت عملية الدفع بنجاح يمكنك الان التعلم من خلال لوحتك التعليميه') }}</span>
      </p>
    </div>
  </article>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { Notification } from 'src/types/notifications/types'

interface Props {
  notification: Notification
}

const props = defineProps<Props>()

const router = useRouter()
const courseID = ref('')

onMounted(() => {
  const type = props.notification?.type
  if (type === 'QUESTION_ASK' || type === 'QUESTION_ANS') {
    const extraData = props.notification?.extraData ?? ''
    try {
      courseID.value = String(
        parseInt(String(extraData).split('::')[0].split(' ')[1].replace('>', ''))
      )
    } catch { /* malformed payload; ignore */ }
  }
})

function goToTheNotificationSource (): void {
  const type = props.notification?.type
  if (type === 'QUESTION_ASK' || type === 'QUESTION_ANS') {
    // In-app classroom route (the old /classroom/#/class/:pk/ hard-link is a
    // dead separate app that bounced to login).
    if (courseID.value) {
      void router.push({ name: 'classroom-shell', params: { coursePk: String(courseID.value) } })
    }
  } else if (type === 'CHECKOUT_DONE') {
    void router.push({ name: 'my-courses' })
  }
}
</script>

<style lang="scss" scoped>
.notif-card {
  display: flex;
  align-items: flex-start;
  gap: var(--ds-space-3);
  background: var(--ds-surface);
  border: 1px solid var(--ds-border);
  border-radius: var(--ds-radius-lg);
  padding: var(--ds-space-4);
  cursor: pointer;
  box-shadow: var(--ds-shadow-xs);
  transition:
    transform var(--ds-duration-fast) var(--ds-ease-out),
    box-shadow var(--ds-duration-fast) var(--ds-ease-out);

  &:hover {
    transform: translateY(-1px);
    box-shadow: var(--ds-shadow-sm);
  }
  &:focus-visible {
    outline: 2px solid transparent;
    box-shadow: var(--ds-shadow-focus);
  }

  &__avatar {
    inline-size: 2.5rem;
    block-size: 2.5rem;
    border-radius: 50%;
    flex-shrink: 0;
    background: var(--ds-surface-muted);
  }

  &__body {
    flex: 1;
    min-inline-size: 0;

    p {
      margin: 0;
      font-size: var(--ds-text-sm);
      line-height: var(--ds-leading-arabic);
      color: var(--ds-text);

      strong {
        color: var(--ds-brand-700);
        font-weight: var(--ds-weight-bold);
      }
    }
  }

  &__label {
    color: var(--ds-text-muted);
    font-size: var(--ds-text-xs);
    text-transform: uppercase;
    letter-spacing: 0.04em;
    margin-inline-end: var(--ds-space-1);
  }

  &__muted { color: var(--ds-text-muted); font-size: var(--ds-text-xs); }
}
</style>
