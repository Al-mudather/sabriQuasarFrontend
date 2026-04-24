<template>
  <main class="certs-page">
    <header class="certs-page__head">
      <p class="certs-page__eyebrow">{{ $t('مركز د. صبري أبوقرون للتدريب') }}</p>
      <h1 class="certs-page__title">{{ $t('شهاداتي') }}</h1>
      <p
        v-if="!isLoading && certificates.length > 0"
        class="certs-page__subtitle"
      >
        {{ $t('سجّل إنجازك التدريبي. عدد الشهادات الممنوحة') }}
        <span class="certs-page__count">{{ certificates.length }}</span>
      </p>
    </header>

    <!-- Loading skeletons -->
    <section
      v-if="isLoading"
      class="certs-page__grid"
      aria-busy="true"
    >
      <ds-skeleton
        v-for="n in 6"
        :key="'cs-' + n"
        type="card"
      />
    </section>

    <!-- Empty state -->
    <ds-empty-state
      v-else-if="certificates.length === 0"
      variant="success"
      :title="$t('لم تحصل على شهادات بعد')"
      :body="$t('أكمل دوراتك لتحصل على شهادات موثقة.')"
      :cta-label="$t('إلى دوراتي')"
      size="lg"
      @cta-click="goToMyCourses"
    />

    <!-- Certificate grid -->
    <section
      v-else
      class="certs-page__grid"
    >
      <article
        v-for="(cert, idx) in certificates"
        :key="cert.node.pk || cert.node.id || idx"
        class="cert-card"
        :style="{ '--i': idx }"
      >
        <!-- Crest seal sitting above the cream surface -->
        <div
          class="cert-card__crest"
          aria-hidden="true"
        >
          <svg
            class="cert-card__seal"
            viewBox="0 0 72 72"
            width="56"
            height="56"
          >
            <circle
              cx="36"
              cy="36"
              r="30"
              fill="#c1623c"
            />
            <circle
              cx="36"
              cy="36"
              r="24"
              fill="none"
              stroke="#fbf7f0"
              stroke-width="1"
              opacity="0.7"
            />
            <!-- eight-point star -->
            <g
              transform="translate(36 36)"
              fill="#fbf7f0"
            >
              <path d="M0 -16 L3 -3 L16 0 L3 3 L0 16 L-3 3 L-16 0 L-3 -3 Z" />
            </g>
            <!-- laurel flourishes -->
            <g
              fill="none"
              stroke="#fbf7f0"
              stroke-width="1.2"
              stroke-linecap="round"
              opacity="0.8"
            >
              <path d="M20 48 Q 36 56 52 48" />
            </g>
          </svg>
        </div>

        <div class="cert-card__label">{{ $t('شهادة إتمام') }}</div>

        <h3 class="cert-card__course">{{ courseNameOf(cert) }}</h3>

        <p class="cert-card__issuer">
          {{ $t('صادرة من مركز د. صبري أبوقرون للتدريب') }}
        </p>

        <dl class="cert-card__meta">
          <div class="cert-card__meta-row">
            <dt>{{ $t('تاريخ الإصدار') }}</dt>
            <dd>
              <time :datetime="isoOf(cert)">{{ formatGregorianDate(issueDateOf(cert)) }}</time>
            </dd>
          </div>
          <div
            v-if="totalHoursOf(cert)"
            class="cert-card__meta-row"
          >
            <dt>{{ $t('عدد الساعات') }}</dt>
            <dd>{{ totalHoursOf(cert) }}</dd>
          </div>
          <div
            v-if="serialOf(cert)"
            class="cert-card__meta-row"
          >
            <dt>{{ $t('الرقم التسلسلي') }}</dt>
            <dd class="cert-card__serial">{{ serialOf(cert) }}</dd>
          </div>
        </dl>

        <div class="cert-card__cta">
          <ds-button
            variant="primary"
            size="md"
            :loading="downloadingPk === cert.node.pk"
            :disabled="!isDownloadable(cert)"
            @click="downloadCertificate(cert)"
          >
            {{ $t('تحميل الشهادة') }}
          </ds-button>
        </div>
      </article>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar, exportFile } from 'quasar'
import { useI18n } from 'vue-i18n'
import axios from 'axios'
import { useAuthStore } from 'src/stores/auth'
import { storeToRefs } from 'pinia'
import { useQuery } from '@vue/apollo-composable'
import { AllCertificates } from 'src/graphql/certificatesManagement/query/GetAllCertificates.js'
import { API_URI } from 'src/utils/hostConfig'
import type {
  AllCertificatesResult,
  AllCertificatesVars,
} from 'src/types/certificates/types'

// -----------------------------------------------------------------------
// Stores / composables
// -----------------------------------------------------------------------
const router = useRouter()
const $q = useQuasar()
const { t } = useI18n()

const auth = useAuthStore()
const { user, token } = storeToRefs(auth)

// -----------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------
const certQuery = useQuery<AllCertificatesResult, AllCertificatesVars>(
  AllCertificates,
  () => ({
    // JSONString scalar: schema expects a JSON-encoded string at runtime,
    // but codegen typed it as Record<string, number>. Cast to satisfy TS.
    filters: JSON.stringify({ user__id: user.value?.pk ?? null }) as unknown as Record<string, number>,
  }),
)
const myCertificate = computed(() => certQuery.result.value?.allCertificates ?? null)
const queryLoading = certQuery.loading

// -----------------------------------------------------------------------
// Derived state
// -----------------------------------------------------------------------
type CertEdgeRaw = NonNullable<
  NonNullable<AllCertificatesResult['allCertificates']>['edges'][number]
>
type CertEdge = CertEdgeRaw & {
  node: NonNullable<CertEdgeRaw['node']>
}

const certificates = computed<CertEdge[]>(
  () =>
    (myCertificate.value?.edges ?? []).filter(
      (e): e is CertEdge => !!e && !!e.node,
    ),
)

const isLoading = computed(() => queryLoading.value && certificates.value.length === 0)

const downloadingPk = ref<number | null>(null)

// -----------------------------------------------------------------------
// Helper functions
// -----------------------------------------------------------------------
function courseNameOf (cert: CertEdge): string {
  const node = cert.node
  return (
    node.enrollment?.course?.title ??
    node.batch?.courseName ??
    ''
  )
}

function issueDateOf (cert: CertEdge): string | null {
  const node = cert.node
  return node.issueDate ?? node.endDate ?? node.created ?? null
}

function isoOf (cert: CertEdge): string {
  const d = issueDateOf(cert)
  if (!d) return ''
  try {
    return new Date(d).toISOString()
  } catch {
    return ''
  }
}

function serialOf (cert: CertEdge): string {
  return cert.node?.serial ?? ''
}

function totalHoursOf (cert: CertEdge): string {
  const h = cert.node?.totalHours
  return h != null && h > 0 ? String(h) : ''
}

function isDownloadable (cert: CertEdge): boolean {
  return cert.node?.isPrintable !== false
}

function formatGregorianDate (d: string | null): string {
  if (!d) return '—'
  try {
    // Brand rule: English numerals for dates/counts.
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(d))
  } catch {
    return d
  }
}

// -----------------------------------------------------------------------
// Actions
// -----------------------------------------------------------------------
async function downloadCertificate (cert: CertEdge): Promise<void> {
  if (!user.value || !('certificateName' in user.value && user.value.certificateName)) {
    $q.notify({
      type: 'warning',
      progress: true,
      multiLine: true,
      position: 'top',
      message: t('يجب تعيين اسم شهادة التدريب من ملفك الشخصي'),
    })
    void router.push({ name: 'user-profile' })
    return
  }

  const pk = cert.node?.pk
  if (!pk) return
  downloadingPk.value = pk
  try {
    // Root-cause fix: the previous code used `location.origin` which in dev
    // resolves to `http://localhost:9000` (no proxy), and even in prod the
    // download endpoint lives behind `API_URI`. Use the canonical base URL.
    // Also: drop the bogus `Content-Type: application/json` (this is a GET
    // with no body, and the wrong content-type can trip server-side asserts).
    const res = await axios({
      method: 'GET',
      url: `${API_URI}/api/enrollment/certificate/download/${pk}`,
      responseType: 'blob',
      headers: {
        Authorization: `JWT ${token.value ?? ''}`,
        Accept: 'application/pdf',
      },
    })

    // `exportFile(name, ArrayBuffer, { encoding: 'windows-1252' })` re-encodes
    // the binary as a windows-1252 string, which corrupts every PDF past the
    // first non-ASCII byte. Hand exportFile a Blob directly; it writes bytes
    // verbatim.
    const pdfBlob = res.data instanceof Blob
      ? new Blob([res.data], { type: 'application/pdf' })
      : new Blob([res.data as BlobPart], { type: 'application/pdf' })

    const safeCourse = (courseNameOf(cert) || 'certificate').replace(/[\\/:*?"<>|]+/g, '-')
    const safeName = (user.value?.fullName ?? user.value?.email ?? 'user').replace(/[\\/:*?"<>|]+/g, '-')
    const fileName = `${safeCourse}-${safeName}.pdf`

    const ok = exportFile(fileName, pdfBlob, { mimeType: 'application/pdf' })
    if (ok !== true) {
      $q.notify({ type: 'negative', position: 'top', message: t('تعذّر حفظ الملف') })
    }
  } catch {
    $q.notify({
      type: 'negative',
      position: 'top',
      message: t('تعذّر تحميل الشهادة، حاول مرة أخرى'),
    })
  } finally {
    downloadingPk.value = null
  }
}

function goToMyCourses (): void {
  void router.push({ name: 'my-courses' })
}
</script>

<style lang="scss" scoped>
.certs-page {
  max-inline-size: 1200px;
  margin-inline: auto;
  padding: var(--ds-space-6) var(--ds-space-4) var(--ds-space-12);
  background: var(--ds-cream);
  min-block-size: 100%;

  @media (min-width: 768px) {
    padding: var(--ds-space-10) var(--ds-space-6) var(--ds-space-16);
  }

  &__head {
    margin-block-end: var(--ds-space-8);
    padding-block-end: var(--ds-space-5);
    border-block-end: 1px solid rgba(50, 40, 115, 0.14);
  }

  &__eyebrow {
    font-family: var(--ds-font-body);
    font-size: var(--ds-text-xs);
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--ds-accent-300);
    margin: 0 0 var(--ds-space-2);
    font-weight: 600;
  }

  &__title {
    font-family: var(--ds-font-heading);
    font-weight: 700;
    font-size: clamp(28px, 4vw, 44px);
    color: var(--ds-brand-600);
    margin: 0 0 var(--ds-space-2);
    line-height: 1.15;
    letter-spacing: -0.01em;
  }

  &__subtitle {
    font-family: var(--ds-font-body);
    font-size: var(--ds-text-md);
    color: var(--ds-taupe);
    margin: 0;
  }

  &__count {
    display: inline-block;
    margin-inline-start: var(--ds-space-2);
    padding: 2px 10px;
    background: var(--ds-brand-600);
    color: var(--ds-ivory);
    border-radius: 999px;
    font-variant-numeric: tabular-nums;
    font-weight: 600;
    font-size: var(--ds-text-sm);
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: var(--ds-space-6);
    align-items: stretch;
  }
}

.cert-card {
  position: relative;
  display: flex;
  flex-direction: column;
  background: var(--ds-ivory);
  border: 1px solid rgba(50, 40, 115, 0.16);
  border-radius: var(--ds-radius-lg, 12px);
  padding: var(--ds-space-8) var(--ds-space-5) var(--ds-space-5);
  box-shadow: 0 1px 2px rgba(27, 20, 16, 0.04),
              0 6px 16px -10px rgba(50, 40, 115, 0.18);
  transition: transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease;
  animation: cert-rise 420ms ease-out both;
  animation-delay: calc(var(--i, 0) * 55ms);

  &:hover {
    transform: translateY(-2px);
    border-color: rgba(50, 40, 115, 0.28);
    box-shadow: 0 2px 4px rgba(27, 20, 16, 0.05),
                0 16px 28px -14px rgba(50, 40, 115, 0.28);
  }

  &__crest {
    position: absolute;
    inset-block-start: -22px;
    inset-inline-start: var(--ds-space-5);
    inline-size: 56px;
    block-size: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
    filter: drop-shadow(0 4px 10px rgba(193, 98, 60, 0.35));
  }

  &__seal {
    display: block;
  }

  &__label {
    font-family: var(--ds-font-body);
    font-size: var(--ds-text-2xs);
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--ds-accent-300);
    font-weight: 600;
    margin-block-end: var(--ds-space-2);
  }

  &__course {
    font-family: var(--ds-font-heading);
    font-weight: 700;
    font-size: var(--ds-text-xl);
    color: var(--ds-brand-600);
    margin: 0 0 var(--ds-space-2);
    line-height: 1.3;
    letter-spacing: -0.005em;
    min-block-size: calc(var(--ds-text-xl) * 1.3 * 2);
  }

  &__issuer {
    font-family: var(--ds-font-body);
    font-size: var(--ds-text-sm);
    color: var(--ds-taupe);
    margin: 0 0 var(--ds-space-5);
    line-height: 1.5;
  }

  &__meta {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--ds-space-2);
    margin: 0 0 var(--ds-space-5);
    padding-block: var(--ds-space-4) 0;
    border-block-start: 1px dashed rgba(50, 40, 115, 0.18);
    padding-block-start: var(--ds-space-4);
  }

  &__meta-row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: var(--ds-space-3);

    dt {
      font-family: var(--ds-font-body);
      font-size: var(--ds-text-xs);
      color: var(--ds-taupe);
      font-weight: 500;
      margin: 0;
    }
    dd {
      font-family: var(--ds-font-body);
      font-size: var(--ds-text-sm);
      color: var(--ds-ink);
      margin: 0;
      font-variant-numeric: tabular-nums;
      font-weight: 500;
    }
  }

  &__serial {
    font-family: var(--ds-font-mono);
    font-size: var(--ds-text-xs) !important;
    letter-spacing: 0.04em;
    color: var(--ds-brand-600) !important;
  }

  &__cta {
    margin-block-start: auto;
    display: flex;

    :deep(.ds-btn) {
      inline-size: 100%;
      justify-content: center;
    }
  }
}

@keyframes cert-rise {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: none; }
}

@media (prefers-reduced-motion: reduce) {
  .cert-card { animation: none; }
  .cert-card:hover { transform: none; }
}
</style>
