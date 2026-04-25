<script setup lang="ts">
/**
 * ClassroomOverviewPanel — body of the "Overview" tab in the side panel.
 *
 * Two course-level actions live here, mirroring CourseClassRoom2's
 * `course_info.vue`:
 *
 *   - Join Telegram group  → opens `bootstrap.telegramLink` in a new tab.
 *     If the field is null (course owner never set one), warns via a toast.
 *   - Request certificate  → fires `CreateCertificate` mutation with the
 *     learner's enrollment pk and an empty input. Only renders when
 *     `bootstrap.hasCertificate` is true.
 *
 * The buttons themselves don't expose any URL/label of the underlying
 * resource — the surface area is intentionally just the two CTAs.
 */
import { computed, ref } from 'vue'
import { useMutation } from '@vue/apollo-composable'
import { useI18n } from 'vue-i18n'
import { useQuasar } from 'quasar'
import { CreateCertificate } from 'src/graphql/certificatesManagement/mutation/CreateCertificate'
import type {
  CreateCertificateMutation,
  CreateCertificateMutationVariables,
} from 'src/graphql/generated'
import type { ClassroomBootstrap } from 'src/types/classroom/types'

const props = defineProps<{ bootstrap: ClassroomBootstrap | null }>()

const { t } = useI18n()
const $q = useQuasar()

const requesting = ref(false)

const completed = computed<number>(() => props.bootstrap?.completedContents ?? 0)
const total = computed<number>(() => props.bootstrap?.totalVideos ?? 0)
const percent = computed<number>(() => props.bootstrap?.progressPercent ?? 0)
const hasCertificate = computed<boolean>(() => Boolean(props.bootstrap?.hasCertificate))

const { mutate: runCreateCert } = useMutation<
  CreateCertificateMutation,
  CreateCertificateMutationVariables
>(CreateCertificate)

function onJoinTelegram(): void {
  const link = props.bootstrap?.telegramLink ?? null
  if (!link) {
    $q.notify({
      type: 'warning',
      position: 'top',
      multiLine: true,
      progress: true,
      message: t('classroom.overview.telegramMissing'),
    })
    return
  }
  window.open(link, '_blank', 'noopener,noreferrer')
}

async function onRequestCertificate(): Promise<void> {
  const enrollmentPk = props.bootstrap?.enrollmentPk
  if (!enrollmentPk || requesting.value) return
  requesting.value = true
  try {
    const res = await runCreateCert({ enrollmentId: enrollmentPk, input: {} })
    const ok = res?.data?.createCertificate?.success
    if (ok) {
      $q.notify({
        type: 'positive',
        position: 'top',
        multiLine: true,
        progress: true,
        message: t('classroom.overview.certificateSuccess'),
      })
    } else {
      const errs = res?.data?.createCertificate?.errors
      const msg =
        (typeof errs === 'object' && errs !== null && 'message' in errs
          ? String((errs as { message?: unknown }).message ?? '')
          : '') || t('classroom.overview.certificateError')
      $q.notify({
        type: 'negative',
        position: 'top',
        multiLine: true,
        progress: true,
        message: msg,
      })
    }
  } catch (err) {
    console.warn('[classroom/overview] createCertificate failed', err)
    $q.notify({
      type: 'negative',
      position: 'top',
      multiLine: true,
      progress: true,
      message: t('classroom.overview.certificateError'),
    })
  } finally {
    requesting.value = false
  }
}
</script>

<template>
  <div class="cls-overview">
    <header class="cls-overview__head">
      <h3 class="cls-overview__title">{{ t('classroom.panel.overview') }}</h3>
      <div class="cls-overview__progress" v-if="bootstrap">
        <span class="cls-overview__progress-num">
          {{ completed }} / {{ total }}
        </span>
        <span class="cls-overview__progress-pct">{{ percent }}%</span>
      </div>
    </header>

    <div class="cls-overview__actions">
      <button
        type="button"
        class="cls-overview__btn cls-overview__btn--telegram"
        @click="onJoinTelegram"
      >
        <q-icon name="lab la-telegram" size="22px" />
        <span>{{ t('classroom.overview.joinTelegram') }}</span>
      </button>

      <button
        v-if="hasCertificate"
        type="button"
        class="cls-overview__btn cls-overview__btn--cert"
        :disabled="requesting || !bootstrap?.enrollmentPk"
        @click="onRequestCertificate"
      >
        <q-spinner v-if="requesting" size="20px" />
        <q-icon v-else name="workspace_premium" size="22px" />
        <span>{{ t('classroom.overview.requestCertificate') }}</span>
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.cls-overview {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  color: var(--cls-text-primary, #F5F2EA);

  &__head {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  &__title {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
  }

  &__progress {
    display: inline-flex;
    align-items: baseline;
    gap: 10px;
    color: var(--cls-text-muted, #9890A8);
    font-size: 13px;
  }

  &__progress-num { font-variant-numeric: tabular-nums; }
  &__progress-pct {
    color: var(--cls-accent, #C1623C);
    font-weight: 600;
  }

  &__actions {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    width: 100%;
    padding: 14px 16px;
    border-radius: var(--cls-radius-md, 12px);
    font-family: var(--ds-font-body);
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    border: 1px solid transparent;
    transition:
      transform var(--cls-dur-fast, 180ms) var(--cls-ease, ease),
      box-shadow var(--cls-dur-fast, 180ms) var(--cls-ease, ease),
      opacity var(--cls-dur-fast, 180ms) var(--cls-ease, ease);

    &:hover:not(:disabled) {
      transform: translateY(-1px);
    }

    &:focus-visible {
      outline: var(--cls-focus-ring);
      outline-offset: 2px;
    }

    &:disabled {
      opacity: 0.55;
      cursor: not-allowed;
    }

    &--telegram {
      background: rgba(84, 169, 235, 0.12);
      color: #54A9EB;
      border-color: rgba(84, 169, 235, 0.4);

      &:hover:not(:disabled) {
        background: rgba(84, 169, 235, 0.18);
        box-shadow: 0 8px 22px rgba(84, 169, 235, 0.2);
      }
    }

    &--cert {
      background: var(--cls-accent, #C1623C);
      color: var(--cls-text-primary, #F5F2EA);
      border-color: transparent;
      box-shadow: 0 4px 14px rgba(193, 98, 60, 0.25);

      &:hover:not(:disabled) {
        box-shadow: 0 8px 22px rgba(193, 98, 60, 0.35);
      }
    }
  }
}
</style>
