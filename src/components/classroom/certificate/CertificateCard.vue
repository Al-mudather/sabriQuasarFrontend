<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useQuasar, exportFile } from 'quasar'
import { storeToRefs } from 'pinia'
import axios from 'axios'
import { useAuthStore } from 'src/stores/auth'
import { API_URI } from 'src/utils/hostConfig'
import type { Certificate } from 'src/types/certificates/types'

defineOptions({ name: 'CertificateCard' })

interface Props {
  certificate: Certificate
}

const props = defineProps<Props>()
const { t, locale } = useI18n()
const $q = useQuasar()
const { user, token } = storeToRefs(useAuthStore())

function formatDate(value: string | null | undefined): string {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return '—'
  try {
    return d.toLocaleDateString(locale.value === 'ar' ? 'ar' : 'en', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return d.toISOString().slice(0, 10)
  }
}

const courseTitle = computed(
  () =>
    props.certificate.enrollment?.course?.title ||
    props.certificate.batch?.courseName ||
    '',
)

const periodLabel = computed(() => {
  const start = formatDate(props.certificate.startDate)
  const end = formatDate(props.certificate.endDate)
  return `${start} – ${end}`
})

// The CertificateNode exposes no PDF URL — the PDF is served by an
// authenticated REST endpoint, same as the /Certificates page. Fetch it as a
// blob with the JWT and hand it to exportFile.
const downloading = ref(false)

async function onDownload(): Promise<void> {
  const pk = props.certificate.pk
  if (!pk) return

  downloading.value = true
  try {
    const res = await axios({
      method: 'GET',
      url: `${API_URI}/api/enrollment/certificate/download/${pk}`,
      responseType: 'blob',
      headers: {
        Authorization: `JWT ${token.value ?? ''}`,
        // '*/*' — see CertificatePage.vue: `application/pdf` gets a 406 from
        // DRF content negotiation before auth runs.
        Accept: '*/*',
      },
    })

    const pdfBlob = res.data instanceof Blob
      ? new Blob([res.data], { type: 'application/pdf' })
      : new Blob([res.data as BlobPart], { type: 'application/pdf' })

    const safe = (s: string) => s.replace(/[\\/:*?"<>|]+/g, '-')
    const fileName = `${safe(courseTitle.value || 'certificate')}-${safe(user.value?.fullName ?? user.value?.email ?? 'user')}.pdf`

    if (exportFile(fileName, pdfBlob, { mimeType: 'application/pdf' }) !== true) {
      $q.notify({ type: 'negative', position: 'bottom', message: t('تعذّر حفظ الملف') })
    }
  } catch {
    $q.notify({
      type: 'negative',
      position: 'bottom',
      timeout: 6000,
      message: t('تعذّر تحميل الشهادة، حاول مرة أخرى'),
    })
  } finally {
    downloading.value = false
  }
}

function onShare(): void {
  const url = typeof window !== 'undefined' ? window.location.href : ''
  if (typeof navigator !== 'undefined' && 'share' in navigator && url) {
    void (navigator as Navigator & {
      share: (data: { title?: string; url?: string }) => Promise<void>
    }).share({
      title: courseTitle.value,
      url,
    }).catch(() => { /* user cancelled */ })
  }
}
</script>

<template>
  <article class="cls-cert" aria-labelledby="cls-cert-title">
    <header class="cls-cert__header">
      <q-icon
        name="workspace_premium"
        size="40px"
        class="cls-cert__icon"
        aria-hidden="true"
      />
      <div class="cls-cert__heading">
        <p class="cls-cert__eyebrow">{{ t('classroom.certificate.pageTitle') }}</p>
        <h2 id="cls-cert-title" class="cls-cert__title">{{ courseTitle }}</h2>
      </div>
    </header>

    <dl class="cls-cert__meta">
      <div class="cls-cert__meta-row">
        <dt>{{ t('classroom.certificate.serial') }}</dt>
        <dd>{{ certificate.serial || '—' }}</dd>
      </div>
      <div class="cls-cert__meta-row">
        <dt>{{ t('classroom.certificate.issuedOn') }}</dt>
        <dd>{{ formatDate(certificate.issueDate) }}</dd>
      </div>
      <div class="cls-cert__meta-row">
        <dt>{{ t('classroom.certificate.period') }}</dt>
        <dd>{{ periodLabel }}</dd>
      </div>
      <div class="cls-cert__meta-row">
        <dt>{{ t('classroom.certificate.totalHours') }}</dt>
        <dd>{{ certificate.totalHours ?? '—' }}</dd>
      </div>
    </dl>

    <footer class="cls-cert__actions">
      <q-btn
        unelevated
        no-caps
        class="cls-cert__cta"
        :loading="downloading"
        icon="download"
        :label="t('classroom.certificate.downloadCertificate')"
        @click="onDownload"
      />
      <q-btn
        flat
        no-caps
        class="cls-cert__secondary"
        icon="share"
        :label="t('classroom.certificate.share')"
        @click="onShare"
      />
    </footer>
  </article>
</template>

<style lang="scss" scoped>
.cls-cert {
  max-width: 640px;
  margin: 0 auto;
  padding: var(--ds-space-6);
  background: var(--cls-surface-elevated);
  color: var(--cls-text-primary);
  border-radius: var(--cls-radius-lg);
  border: 1px solid var(--cls-divider);
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-5);

  &__header {
    display: flex;
    align-items: center;
    gap: var(--ds-space-4);
  }

  &__icon {
    color: var(--cls-accent);
    flex-shrink: 0;
  }

  &__heading { display: flex; flex-direction: column; gap: 4px; min-width: 0; }

  &__eyebrow {
    margin: 0;
    font-size: var(--ds-text-xs);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--cls-text-muted);
  }

  &__title {
    margin: 0;
    font-family: var(--ds-font-heading);
    font-size: var(--ds-text-xl);
    font-weight: var(--ds-weight-semibold);
    color: var(--cls-text-primary);
    line-height: var(--ds-leading-tight);
    overflow-wrap: anywhere;
  }

  &__meta {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--ds-space-3);
    margin: 0;
    padding: var(--ds-space-4);
    border-top: 1px solid var(--cls-divider);
    border-bottom: 1px solid var(--cls-divider);

    @media (max-width: 520px) { grid-template-columns: 1fr; }
  }

  &__meta-row {
    display: flex;
    flex-direction: column;
    gap: 2px;

    dt {
      font-size: var(--ds-text-xs);
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--cls-text-muted);
    }
    dd {
      margin: 0;
      font-size: var(--ds-text-md);
      color: var(--cls-text-primary);
      font-variant-numeric: tabular-nums;
    }
  }

  &__actions {
    display: flex;
    gap: var(--ds-space-3);
    flex-wrap: wrap;
  }

  &__cta {
    background: var(--cls-accent);
    color: var(--cls-text-primary);
    border-radius: var(--cls-radius-md);
    padding: var(--ds-space-2) var(--ds-space-5);
    font-weight: var(--ds-weight-semibold);

    &:hover { filter: brightness(1.08); }
    &:focus-visible { outline: var(--cls-focus-ring); outline-offset: 2px; }
  }

  &__secondary {
    color: var(--cls-text-primary);
    border-radius: var(--cls-radius-md);
  }
}
</style>
