<template>
  <section class="pwd-reset">
    <header class="pwd-reset__head">
      <h2>{{ $t('تعيين كلمة مرور جديدة') }}</h2>
    </header>

    <ul v-if="errorMessages.length > 0" class="pwd-reset__errors" role="alert">
      <li v-for="(m, i) in errorMessages" :key="i">{{ m }}</li>
    </ul>

    <form @submit.prevent="updateUserPassword" class="pwd-reset__form">
      <div class="pwd-reset__grid">
        <q-input
          rounded outlined
          v-model="oldPassword"
          type="password"
          :label="$t('كلمة المرور القديمة')"
        />
        <q-input
          rounded outlined
          v-model="newPassword1"
          type="password"
          :label="$t('كلمة المرور الجديدة')"
        />
      </div>
      <q-input
        rounded outlined
        v-model="newPassword2"
        type="password"
        :label="$t('تأكيد كلمة المرور الجديدة')"
      />
      <div class="pwd-reset__actions">
        <ds-button type="submit" variant="primary" :loading="visible">
          {{ $t('تعيين') }}
        </ds-button>
      </div>
    </form>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useMutation } from '@vue/apollo-composable'
import { useQuasar } from 'quasar'
import { ChangeUserPassword } from 'src/graphql/account_management/mutation/ChangeUserPassword'
import { tokenStorage } from 'src/localStorageService'
import type {
  ChangePasswordMutationResult,
  ChangePasswordVariables,
} from 'src/types/auth/types'

const $q = useQuasar()

const visible = ref(false)
const oldPassword = ref('')
const newPassword1 = ref('')
const newPassword2 = ref('')
const errorMessages = ref<string[]>([])

const { mutate: changePassword } = useMutation<ChangePasswordMutationResult, ChangePasswordVariables>(
  ChangeUserPassword,
)

function errorHandler (errorsObj: Record<string, Array<{ message: string }>>): void {
  for (const key in errorsObj) {
    for (const val of errorsObj[key]) errorMessages.value.push(val.message)
  }
}

function resetFields (): void {
  oldPassword.value = ''
  newPassword1.value = ''
  newPassword2.value = ''
}

async function updateUserPassword (): Promise<void> {
  if (!oldPassword.value) return
  if (newPassword1.value !== newPassword2.value) {
    errorMessages.value = ['passwords are not the same']
    return
  }
  errorMessages.value = []
  visible.value = true
  try {
    const result = await changePassword({
      oldPassword: oldPassword.value,
      newPassword1: newPassword1.value,
      newPassword2: newPassword2.value,
    })
    const passwordChange = result?.data?.passwordChange
    if (passwordChange?.success) {
      resetFields()
      tokenStorage.setToken({
        token: passwordChange.token,
        refresh: passwordChange.refreshToken,
      })
      $q.notify({
        type: 'positive',
        multiLine: true,
        progress: true,
        message: 'Password was changed successfully',
      })
    } else if (passwordChange?.errors) {
      errorHandler(passwordChange.errors as Record<string, Array<{ message: string }>>)
    }
  } catch { /* apolloProvider surfaces */ }
  finally { visible.value = false }
}
</script>

<style lang="scss" scoped>
.pwd-reset {
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

  &__errors {
    list-style: none;
    margin: 0;
    padding: var(--ds-space-3) var(--ds-space-4);
    background: var(--ds-danger-bg);
    color: var(--ds-danger);
    border-radius: var(--ds-radius-md);
    font-size: var(--ds-text-sm);
    li + li { margin-block-start: var(--ds-space-1); }
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-3);
  }

  &__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--ds-space-3);
    @media (min-width: 600px) { grid-template-columns: 1fr 1fr; }
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
