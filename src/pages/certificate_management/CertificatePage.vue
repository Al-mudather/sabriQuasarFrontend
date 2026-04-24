<template>
  <main class="certs-page">
    <header class="certs-page__head">
      <h1 class="certs-page__title">{{ $t('شهاداتي') }}</h1>
      <p v-if="!isLoading && certificates.length > 0" class="certs-page__subtitle">
        {{ $t('لديك {n} شهادات').replace('{n}', String(certificates.length)) }}
      </p>
    </header>

    <!-- Loading skeletons -->
    <section
      v-if="isLoading"
      class="certs-page__grid"
      aria-busy="true"
    >
      <ds-skeleton
        v-for="n in 4"
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
    <section v-else class="certs-page__grid">
      <article
        v-for="(cert, idx) in certificates"
        :key="cert.node.pk || cert.node.id || idx"
        class="cert-card"
        :style="{ '--i': idx }"
      >
        <!-- Decorative top band with wax-seal -->
        <div class="cert-card__crest" aria-hidden="true">
          <svg
            class="cert-card__seal"
            viewBox="0 0 80 80"
            width="64"
            height="64"
          >
            <defs>
              <radialGradient id="waxGrad" cx="50%" cy="40%" r="60%">
                <stop offset="0%" stop-color="#D87A54"/>
                <stop offset="55%" stop-color="#C1623C"/>
                <stop offset="100%" stop-color="#8A3E22"/>
              </radialGradient>
            </defs>
            <!-- outer scalloped wax disc -->
            <g transform="translate(40 40)">
              <g>
                <circle r="30" fill="url(#waxGrad)" />
                <!-- scallop notches -->
                <g fill="url(#waxGrad)">
                  <circle cx="0"   cy="-30" r="4"/>
                  <circle cx="21"  cy="-21" r="4"/>
                  <circle cx="30"  cy="0"   r="4"/>
                  <circle cx="21"  cy="21"  r="4"/>
                  <circle cx="0"   cy="30"  r="4"/>
                  <circle cx="-21" cy="21"  r="4"/>
                  <circle cx="-30" cy="0"   r="4"/>
                  <circle cx="-21" cy="-21" r="4"/>
                </g>
                <!-- laurel inside seal -->
                <g fill="none" stroke="#F6F1EA" stroke-width="1.4" stroke-linecap="round">
                  <path d="M-14 -6 Q -18 0 -14 10" opacity="0.9"/>
                  <path d="M-15 -3 Q -20 -3 -22 1" opacity="0.7"/>
                  <path d="M-14 3 Q -20 5 -21 9" opacity="0.7"/>
                  <path d="M14 -6 Q 18 0 14 10" opacity="0.9"/>
                  <path d="M15 -3 Q 20 -3 22 1" opacity="0.7"/>
                  <path d="M14 3 Q 20 5 21 9" opacity="0.7"/>
                </g>
                <!-- center star -->
                <path
                  d="M0 -9 L2.7 -2.7 L9 -1 L4 3 L5.5 10 L0 6.5 L-5.5 10 L-4 3 L-9 -1 L-2.7 -2.7 Z"
                  fill="#F6F1EA"
                />
              </g>
            </g>
          </svg>
        </div>

        <!-- Body -->
        <div class="cert-card__body">
          <h3 class="cert-card__course">{{ courseNameOf(cert) }}</h3>
          <dl class="cert-card__meta">
            <div class="cert-card__meta-row">
              <dt>{{ $t('تاريخ الإصدار') }}</dt>
              <dd>
                <time :datetime="isoOf(cert)">{{ formatArabicDate(issueDateOf(cert)) }}</time>
              </dd>
            </div>
            <div v-if="instructorOf(cert)" class="cert-card__meta-row">
              <dt>{{ $t('المدرّب') }}</dt>
              <dd>{{ instructorOf(cert) }}</dd>
            </div>
            <div v-if="serialOf(cert)" class="cert-card__meta-row">
              <dt>{{ $t('الرقم التسلسلي') }}</dt>
              <dd class="cert-card__serial">{{ serialOf(cert) }}</dd>
            </div>
          </dl>
        </div>

        <!-- Footer actions -->
        <div class="cert-card__actions">
          <ds-button
            variant="secondary"
            size="sm"
            :loading="downloadingPk === cert.node.pk"
            :disabled="!isDownloadable(cert)"
            @click="downloadCertificate(cert)"
          >
            {{ $t('تحميل PDF') }}
          </ds-button>
          <ds-button
            variant="ghost"
            size="sm"
            @click="shareCertificate(cert)"
          >
            {{ $t('مشاركة') }}
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
  if (!node) return ''
  return (
    node.enrollment?.course?.title ??
    node.batch?.courseName ??
    ''
  )
}

function instructorOf (_cert: CertEdge): string {
  // API currently doesn't expose instructor on certificate.
  return ''
}

function issueDateOf (cert: CertEdge): string | null {
  const node = cert.node
  if (!node) return null
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

function isDownloadable (cert: CertEdge): boolean {
  const node = cert.node
  if (!node) return false
  return node.isPrintable !== false
}

function formatArabicDate (d: string | null): string {
  if (!d) return t('—')
  try {
    return new Intl.DateTimeFormat('ar-EG', {
      day: 'numeric',
      month: 'long',
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
    const res = await axios({
      method: 'GET',
      url: `${location.origin}/api/enrollment/certificate/download/${pk}`,
      responseType: 'arraybuffer',
      headers: {
        Authorization: `JWT ${token.value}`,
        'Content-Type': 'application/json',
      },
    })
    if (res.data) {
      const nameSlug = user.value?.fullName ?? user.value?.email ?? 'user'
      const fileName = `${courseNameOf(cert)}-${nameSlug}.pdf`
      exportFile(fileName, res.data as ArrayBuffer, {
        encoding: 'windows-1252',
        mimeType: 'application/pdf',
      })
    }
  } catch {
    // Apollo/axios interceptor surfaces errors globally
  } finally {
    downloadingPk.value = null
  }
}

async function shareCertificate (cert: CertEdge): Promise<void> {
  const title = courseNameOf(cert)
  const text = t('شهادتي من مركز د. صبري أبوقرون للتدريب')
  const url = `${location.origin}/Certificates#${cert.node?.pk}`
  if (navigator.share) {
    try {
      await navigator.share({ title, text, url })
      return
    } catch {
      /* user cancelled */
    }
  }
  try {
    await navigator.clipboard.writeText(url)
    $q.notify({
      type: 'positive',
      position: 'top',
      message: t('تم نسخ الرابط'),
    })
  } catch {
    /* noop */
  }
}

function goToMyCourses (): void {
  void router.push({ name: 'my-courses' })
}

</script>

<style lang="scss" scoped>
.certs-page {
  max-inline-size: 1100px;
  margin-inline: auto;
  padding: var(--ds-space-5) var(--ds-space-3) var(--ds-space-12);

  @media (min-width: 600px) {
    padding: var(--ds-space-8) var(--ds-space-4) var(--ds-space-16);
  }

  &__head {
    margin-block-end: var(--ds-space-6);
  }

  &__title {
    font-family: var(--ds-font-heading, 'Tajawal', system-ui, sans-serif);
    font-weight: 700;
    font-size: clamp(28px, 4vw, 44px);
    color: var(--ds-ink, var(--ds-text));
    margin: 0 0 var(--ds-space-2);
    line-height: 1.2;
  }

  &__subtitle {
    font-family: var(--ds-font-body);
    font-size: var(--ds-text-md);
    color: var(--ds-taupe, var(--ds-text-muted));
    margin: 0;
  }

  &__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--ds-space-5);

    @media (min-width: 768px) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
}

.cert-card {
  --cert-indigo: var(--ds-brand-600, #322873);
  --cert-cream:  var(--ds-cream,     #F6F1EA);
  --cert-terra:  var(--ds-accent-300, #C1623C);

  position: relative;
  background: var(--cert-cream);
  border: 2px solid var(--cert-indigo);
  border-radius: var(--ds-radius-lg);
  padding: calc(var(--ds-space-6) + 32px) var(--ds-space-5) var(--ds-space-5);
  box-shadow: var(--ds-shadow-sm);
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-4);
  isolation: isolate;
  animation: cert-rise 480ms var(--ds-ease-out, ease-out) both;
  animation-delay: calc(var(--i, 0) * 60ms);

  // ornamental inner rule
  &::before {
    content: "";
    position: absolute;
    inset-block-start: 12px;
    inset-inline: 12px;
    block-size: calc(100% - 24px);
    border: 1px dashed rgba(50, 40, 115, 0.35);
    border-radius: calc(var(--ds-radius-lg) - 4px);
    pointer-events: none;
    z-index: 0;
  }

  &__crest {
    position: absolute;
    inset-block-start: -32px;
    inset-inline-start: 50%;
    transform: translateX(-50%);
    inline-size: 64px;
    block-size: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
    filter: drop-shadow(0 4px 10px rgba(139, 62, 34, 0.35));
  }

  &__seal {
    display: block;
    inline-size: 100%;
    block-size: 100%;
  }

  &__body {
    position: relative;
    z-index: 1;
    text-align: center;
  }

  &__course {
    font-family: var(--ds-font-heading, 'Tajawal', system-ui, sans-serif);
    font-weight: 700;
    font-size: var(--ds-text-lg);
    color: var(--cert-indigo);
    margin: 0 0 var(--ds-space-3);
    line-height: 1.35;
  }

  &__meta {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--ds-space-1);
    margin: 0;
    padding: 0;
  }

  &__meta-row {
    display: flex;
    justify-content: center;
    align-items: baseline;
    gap: var(--ds-space-2);
    flex-wrap: wrap;

    dt {
      font-family: var(--ds-font-body);
      font-size: var(--ds-text-xs);
      color: var(--ds-taupe, var(--ds-text-muted));
      font-weight: 500;
      margin: 0;
    }
    dd {
      font-family: var(--ds-font-body);
      font-size: var(--ds-text-sm);
      color: var(--ds-ink, var(--ds-text));
      margin: 0;
      font-variant-numeric: tabular-nums;
    }
  }

  &__serial {
    font-family: var(--ds-font-mono, ui-monospace, monospace);
    font-size: var(--ds-text-xs) !important;
    letter-spacing: 0.04em;
  }

  &__actions {
    position: relative;
    z-index: 1;
    display: flex;
    gap: var(--ds-space-3);
    justify-content: center;
    flex-wrap: wrap;
    margin-block-start: auto;
    padding-block-start: var(--ds-space-3);
    border-block-start: 1px solid rgba(50, 40, 115, 0.18);
  }
}

@keyframes cert-rise {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: none; }
}

@media (prefers-reduced-motion: reduce) {
  .cert-card { animation: none; }
}
</style>
