<template>
  <main class="certs-page">
    <header class="certs-page__head">
      <h1>
        <img src="~assets/img/tit.png" alt="" aria-hidden="true" />
        <span>{{ $t('شهادتـــي') }}</span>
      </h1>
    </header>

    <section class="certs-page__body">
      <ds-empty-state
        v-if="certificates.length === 0"
        :title="$t('لا توجد شهادات بعد')"
        :description="$t('ستظهر هنا شهاداتك فور إكمال أي كورس.')"
        size="md"
      />

      <div v-else class="certs-page__list">
        <article
          v-for="cert in certificates"
          :key="cert.node.pk"
          class="cert-card"
        >
          <div class="cert-card__meta">
            <h3>{{ courseNameOf(cert) }}</h3>
            <time>{{ FORMAT_DATE($_.get(cert, '[node][created]')) }}</time>
          </div>
          <ds-button
            variant="accent"
            :loading="loading"
            @click="DOWNLOAD_MY_CERTIFICATE(cert)"
          >
            {{ $t('تحميل') }}
          </ds-button>
        </article>
      </div>
    </section>
  </main>
</template>

<script>
import axios from 'axios'
import { AllCertificates } from 'src/queries/certificatesManagement/query/GetAllCertificates.js'
import { mapGetters } from 'vuex'
import { exportFile } from 'quasar'
import moment from 'moment'

export default {
  name: 'CertificatePage',

  data () { return { loading: false, myCertificate: [] } },

  computed: {
    ...mapGetters('authentication', ['user', 'token']),
    certificates () { return this.$_.get(this.myCertificate, 'edges', []) || [] }
  },

  apollo: {
    allCertificates: {
      query () { return AllCertificates },
      variables () {
        return {
          filters: JSON.stringify({ user__id: this.user.pk })
        }
      },
      update (data) { this.myCertificate = data.allCertificates }
    }
  },

  methods: {
    courseNameOf (cert) {
      return this.$_.get(cert, '[node][enrollment][course][title]') ||
             this.$_.get(cert, '[node][batch][courseName]')
    },

    FORMAT_DATE (date) {
      return date ? moment(date).format('YYYY-MM-DD HH:mm') : 'Not Defined'
    },

    async DOWNLOAD_MY_CERTIFICATE (certificate) {
      if (!this.user.certificateName) {
        this.$q.notify({
          type: 'warning',
          progress: true,
          multiLine: true,
          position: 'top',
          message: 'يجب تعيين إسم شهادة التدريب'
        })
        this.$router.push({ name: 'user-profile' })
        return
      }

      this.loading = true
      try {
        const res = await axios({
          method: 'GET',
          url: `${location.origin}/api/enrollment/certificate/download/${certificate.node.pk}`,
          responseType: 'arraybuffer',
          headers: {
            'Authorization': `JWT ${this.token}`,
            'Content-Type': 'application/json'
          }
        })
        if (res.data) {
          const fileName = `${this.courseNameOf(certificate)}-${this.user.username}.pdf`
          exportFile(fileName, res.data, {
            encoding: 'windows-1252',
            mimeType: 'text/csv;charset=windows-1252;'
          })
        }
      } catch (e) { /* apolloProvider surfaces errors */ }
      finally { this.loading = false }
    }
  }
}
</script>

<style lang="scss" scoped>
.certs-page {
  max-inline-size: 880px;
  margin-inline: auto;
  padding: var(--ds-space-6) var(--ds-space-3) var(--ds-space-12);

  @media (min-width: 600px) {
    padding: var(--ds-space-8) var(--ds-space-4) var(--ds-space-16);
  }

  &__head {
    margin-block-end: var(--ds-space-6);
    h1 {
      display: inline-flex;
      align-items: center;
      gap: var(--ds-space-2);
      font-family: var(--ds-font-heading);
      font-size: var(--ds-text-3xl);
      font-weight: var(--ds-weight-bold);
      color: var(--ds-text);
      margin: 0;
      img { block-size: 1.75rem; inline-size: auto; }
    }
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-3);
  }
}

.cert-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ds-space-4);
  background: var(--ds-surface);
  border: 1px solid var(--ds-border);
  border-radius: var(--ds-radius-lg);
  padding: var(--ds-space-4) var(--ds-space-5);
  box-shadow: var(--ds-shadow-xs);
  flex-wrap: wrap;

  &__meta {
    flex: 1;
    min-inline-size: 0;
    h3 {
      font-family: var(--ds-font-heading);
      font-size: var(--ds-text-md);
      font-weight: var(--ds-weight-bold);
      color: var(--ds-text);
      margin: 0 0 var(--ds-space-1);
    }
    time {
      font-size: var(--ds-text-xs);
      color: var(--ds-text-muted);
      font-variant-numeric: tabular-nums;
    }
  }
}
</style>
