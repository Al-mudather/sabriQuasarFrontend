<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Certificate } from 'src/types/certificates/types'

defineOptions({ name: 'CertificateCard' })

interface Props {
  certificate: Certificate
}

const props = defineProps<Props>()
const { t, locale } = useI18n()

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

// The CertificateNode does not currently expose a PDF URL. When/if a
// `pdfUrl` (or similar) field is added, surface it here.
const pdfUrl = computed<string | null>(() => {
  const node = props.certificate as unknown as Record<string, unknown>
  const candidate = node.pdfUrl ?? node.pdf ?? node.fileUrl ?? null
  return typeof candidate === 'string' && candidate.length > 0 ? candidate : null
})

const canDownload = computed(() => {
  return props.certificate.isPrintable && (pdfUrl.value !== null)
})

function onDownload(): void {
  if (!pdfUrl.value) return
  window.open(pdfUrl.value, '_blank', 'noopener,noreferrer')
}

function onShare(): void {
  // Stub — a future phase will wire real share.
  if (typeof navigator !== 'undefined' && 'share' in navigator && pdfUrl.value) {
    void (navigator as Navigator & {
      share: (data: { title?: string; url?: string }) => Promise<void>
    }).share({
      title: courseTitle.value,
      url: pdfUrl.value,
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
        :disable="!canDownload"
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
