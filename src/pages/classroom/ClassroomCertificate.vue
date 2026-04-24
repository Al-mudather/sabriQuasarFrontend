<template>
  <section class="cls-cert-page">
    <h1 class="cls-cert-page__heading">{{ t('classroom.certificate.pageTitle') }}</h1>

    <ClassroomEmptyState
      v-if="!bootstrap"
      icon="school"
      :title="t('classroom.empty.errorTitle')"
      :description="t('classroom.empty.errorDescription')"
    />

    <template v-else>
      <CertificateCard
        v-if="certificate"
        :certificate="certificate"
      />
      <CertificateProgress
        v-else
        :enrollment="bootstrap"
      />
    </template>
  </section>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import { useI18n } from 'vue-i18n'
import ClassroomEmptyState from 'src/components/classroom/ClassroomEmptyState.vue'
import CertificateCard from 'src/components/classroom/certificate/CertificateCard.vue'
import CertificateProgress from 'src/components/classroom/certificate/CertificateProgress.vue'
import { ClassroomContextKey } from 'src/composables/classroom/classroomContext'
import { useEnrollmentCertificate } from 'src/composables/classroom/useEnrollmentCertificate'

defineOptions({ name: 'ClassroomCertificate' })

const { t } = useI18n()

const ctx = inject(ClassroomContextKey, null)
const bootstrap = computed(() => ctx?.bootstrap.value ?? null)
const enrollmentPk = computed<number | null>(() => bootstrap.value?.enrollmentPk ?? null)

const { certificate } = useEnrollmentCertificate(enrollmentPk)
</script>

<style lang="scss" scoped>
.cls-cert-page {
  padding: var(--ds-space-6);
  color: var(--cls-text-primary);
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-5);
}

.cls-cert-page__heading {
  margin: 0;
  font-family: var(--ds-font-heading);
  font-size: var(--ds-text-xl);
  font-weight: var(--ds-weight-semibold);
}
</style>
