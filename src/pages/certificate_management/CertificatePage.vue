<template>
  <main class="certs-page">
    <header class="certs-page__head">
      <h1 class="certs-page__title">{{ $t('شهاداتي') }}</h1>
      <p v-if="!isLoading && certificates.length > 0" class="certs-page__subtitle">
        {{ $t('لديك {n} شهادات').replace('{n}', certificates.length) }}
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

<script>
import axios from 'axios'
import moment from 'moment'
import { exportFile } from 'quasar'
import { useAuthStore } from 'src/stores/auth'
import { storeToRefs } from 'pinia'
import { useQuery } from '@vue/apollo-composable'
import { computed } from 'vue'
import { AllCertificates } from 'src/queries/certificatesManagement/query/GetAllCertificates.js'

/** @typedef {import('src/features/certificates/types').Certificate} Certificate */
/** @typedef {import('src/features/certificates/types').AllCertificatesResult} AllCertificatesResult */
/** @typedef {import('src/features/certificates/types').AllCertificatesVars} AllCertificatesVars */

export default {
  name: 'CertificatePage',

  setup () {
    const auth = useAuthStore()
    const { user, token } = storeToRefs(auth)

    /** @type {ReturnType<typeof useQuery<AllCertificatesResult, AllCertificatesVars>>} */
    const certQuery = useQuery(
      AllCertificates,
      () => ({ filters: JSON.stringify({ user__id: user.value && user.value.pk }) })
    )
    const myCertificate = computed(() => certQuery.result.value?.allCertificates || null)
    const queryLoading = certQuery.loading

    return { user, token, myCertificate, _queryLoading: queryLoading }
  },

  data () {
    return {
      downloadingPk: null
    }
  },

  computed: {
    certificates () {
      return (this.myCertificate && this.myCertificate.edges) || []
    },

    isLoading () {
      return this._queryLoading && this.certificates.length === 0
    }
  },

  methods: {
    courseNameOf (cert) {
      const node = cert && cert.node
      if (!node) return ''
      return (node.enrollment && node.enrollment.course && node.enrollment.course.title) ||
             (node.batch && node.batch.courseName) ||
             ''
    },

    instructorOf (cert) {
      const node = cert && cert.node
      if (!node) return ''
      // API currently doesn't expose instructor on certificate.
      // Fallback to user fullName if batch/enrollment doesn't carry it.
      return ''
    },

    issueDateOf (cert) {
      const node = cert && cert.node
      if (!node) return null
      return node.issueDate || node.endDate || node.created || null
    },

    isoOf (cert) {
      const d = this.issueDateOf(cert)
      return d ? moment(d).toISOString() : ''
    },

    serialOf (cert) {
      return (cert && cert.node && cert.node.serial) || ''
    },

    isDownloadable (cert) {
      const node = cert && cert.node
      if (!node) return false
      // isPrintable signals the backend has finalised the PDF.
      return node.isPrintable !== false
    },

    formatArabicDate (d) {
      if (!d) return this.$t('—')
      try {
        return new Intl.DateTimeFormat('ar-EG', {
          day: 'numeric', month: 'long', year: 'numeric'
        }).format(new Date(d))
      } catch (_) {
        return moment(d).format('YYYY-MM-DD')
      }
    },

    async downloadCertificate (cert) {
      if (!this.user || !this.user.certificateName) {
        this.$q && this.$q.notify && this.$q.notify({
          type: 'warning',
          progress: true,
          multiLine: true,
          position: 'top',
          message: this.$t('يجب تعيين اسم شهادة التدريب من ملفك الشخصي')
        })
        this.$router.push({ name: 'user-profile' })
        return
      }

      const pk = cert.node.pk
      this.downloadingPk = pk
      try {
        const res = await axios({
          method: 'GET',
          url: `${location.origin}/api/enrollment/certificate/download/${pk}`,
          responseType: 'arraybuffer',
          headers: {
            'Authorization': `JWT ${this.token}`,
            'Content-Type': 'application/json'
          }
        })
        if (res.data) {
          const fileName = `${this.courseNameOf(cert)}-${this.user.username}.pdf`
          exportFile(fileName, res.data, {
            encoding: 'windows-1252',
            mimeType: 'application/pdf'
          })
        }
      } catch (_) {
        // apolloProvider / axios interceptor surfaces errors globally
      } finally {
        this.downloadingPk = null
      }
    },

    async shareCertificate (cert) {
      const title = this.courseNameOf(cert)
      const text = this.$t('شهادتي من مركز د. صبري أبوقرون للتدريب')
      const url = `${location.origin}/Certificates#${cert.node.pk}`
      if (navigator.share) {
        try {
          await navigator.share({ title, text, url })
          return
        } catch (_) { /* user cancelled */ }
      }
      try {
        await navigator.clipboard.writeText(url)
        this.$q && this.$q.notify && this.$q.notify({
          type: 'positive',
          position: 'top',
          message: this.$t('تم نسخ الرابط')
        })
      } catch (_) { /* noop */ }
    },

    goToMyCourses () {
      this.$router.push({ name: 'my-courses' })
    }
  }
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
