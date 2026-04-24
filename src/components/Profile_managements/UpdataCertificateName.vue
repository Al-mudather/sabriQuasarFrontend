<template>
  <section class="cert-name">
    <header class="cert-name__head">
      <h2 v-if="certificateNameData">{{ $t('اسم إستخراج شهادة التدريب') }}</h2>
      <h2 v-else>{{ $t('تعيين اسم إستخراج شهادة التدريب') }}</h2>
    </header>

    <q-banner
      v-if="!certificateNameData"
      class="cert-name__banner"
      inline-actions
    >
      {{ $t('تذكر اسمك الرباعي باللغه الإنجليزيه سوف يكتب في الشهاده و لايمكن تغييره مره اخرى... الأفضل كتابة اسمك من جواز السفر.') }}
    </q-banner>

    <form @submit.prevent="updataCertificateName" class="cert-name__form">
      <q-input
        rounded outlined
        :readonly="!!certificateNameData"
        v-model="certificateName"
        :label="$t('الإسم رباعيا باللغه الإنجليزيه للإستخراج الشهاده')"
        hint="The certificate Name"
      />
      <q-input
        v-if="!certificateNameData"
        rounded outlined
        v-model="certificateNameConfirm"
        :label="$t('تأكيد الإسم باللغه الإنجليزيه')"
        hint="The certificate Name Confirm"
      />
      <div v-if="!certificateNameData" class="cert-name__actions">
        <ds-button type="submit" variant="primary" :loading="visible">
          {{ $t('تعيين') }}
        </ds-button>
      </div>
    </form>
  </section>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { apolloClient } from 'src/apollo/client'
import { useAuthStore } from 'src/stores/auth'
import { UpdateCertificateNameQuery } from 'src/graphql/account_management/mutation/UpdateCertificateName'
import { GetMyProfileData } from 'src/graphql/account_management/query/GetMyProfileData'
import type {
  UpdateCertificateNameResult,
  UpdateCertificateNameVariables,
} from 'src/types/auth/types'

interface Props {
  certificateNameData?: string | null
}

const props = withDefaults(defineProps<Props>(), {
  certificateNameData: null,
})

const $q = useQuasar()
const auth = useAuthStore()

const visible = ref(false)
const certificateName = ref<string | null>(null)
const certificateNameConfirm = ref<string | null>(null)

watch(
  () => props.certificateNameData,
  (data) => {
    if (data) certificateName.value = data
  },
)

onMounted(() => {
  if (props.certificateNameData) certificateName.value = props.certificateNameData
})

function errorHandler (errorsObj: Record<string, Array<{ message: string }>>): void {
  for (const key in errorsObj) {
    for (const val of errorsObj[key]) {
      $q.notify({ type: 'negative', multiLine: true, progress: true, message: val.message })
    }
  }
}

function resetFields (): void {
  certificateName.value = null
  certificateNameConfirm.value = null
}

async function updataCertificateName (): Promise<void> {
  if (certificateName.value !== certificateNameConfirm.value) {
    $q.notify({
      type: 'negative',
      multiLine: true,
      progress: true,
      message: 'اسمك الرباعي غير متطابق',
    })
    return
  }
  if (!certificateName.value || !certificateNameConfirm.value) return
  visible.value = true
  try {
    const result = await apolloClient.mutate<UpdateCertificateNameResult, UpdateCertificateNameVariables>({
      mutation: UpdateCertificateNameQuery,
      variables: {
        input: {
          certificateName: certificateName.value.toUpperCase(),
          certificateNameConfirm: certificateNameConfirm.value.toUpperCase(),
        },
      },
      refetchQueries: [{ query: GetMyProfileData }],
    })
    const success = result?.data?.updateCertificateName?.success
    const errors = result?.data?.updateCertificateName?.errors
    if (success) {
      resetFields()
      $q.notify({
        type: 'positive',
        multiLine: true,
        progress: true,
        message: 'Certificate Name was set successfully',
      })
      void auth.getMyProfileData()
      $q.notify({
        type: 'warning',
        multiLine: true,
        progress: true,
        message: 'يمكنك الذهاب إلى صفحة شهاداتي لتحميل شهادتك',
      })
    } else if (errors) {
      errorHandler(errors as Record<string, Array<{ message: string }>>)
    }
  } catch { /* apolloProvider surfaces error */ }
  finally { visible.value = false }
}
</script>

<style lang="scss" scoped>
.cert-name {
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-4);

  &__head h2 {
    font-family: var(--ds-font-heading);
    font-size: var(--ds-text-lg);
    font-weight: var(--ds-weight-bold);
    color: var(--ds-text);
    margin: 0;
  }

  &__banner {
    background: var(--ds-warning-bg);
    color: var(--ds-warning);
    border-radius: var(--ds-radius-md);
    font-size: var(--ds-text-sm);
    line-height: var(--ds-leading-arabic);
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-3);
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
