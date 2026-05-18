<template>
  <main class="profile-page">
    <header class="profile-page__header">
      <h1 class="profile-page__title">{{ $t('الملف الشخصي') }}</h1>
      <p class="profile-page__subtitle">
        {{ $t('إدارة بياناتك الشخصية وتفضيلاتك وأمان حسابك') }}
      </p>
    </header>

    <div class="profile-page__stack">
      <!-- Identity section (full-width) -->
      <section class="profile-section profile-identity" aria-labelledby="identity-heading">
        <div class="profile-identity__avatar" aria-hidden="true">
          <span class="profile-identity__initials">{{ initials }}</span>
        </div>
        <div class="profile-identity__body">
          <h2 id="identity-heading" class="profile-identity__name">
            {{ fullName || $t('بدون اسم') }}
          </h2>
          <p class="profile-identity__email" dir="ltr">{{ email || '—' }}</p>
          <dl class="profile-identity__meta">
            <div class="profile-identity__meta-row">
              <dt>{{ $t('الجنس') }}</dt>
              <dd>{{ genderLabel }}</dd>
            </div>
            <div class="profile-identity__meta-row">
              <dt>{{ $t('الهاتف') }}</dt>
              <dd class="profile-identity__num" dir="ltr">{{ phoneNumber || '—' }}</dd>
            </div>
          </dl>
        </div>
      </section>

      <!-- Personal info section (full-width) -->
      <section class="profile-section" aria-labelledby="personal-heading">
        <header class="profile-section__head">
          <div class="profile-section__head-text">
            <h2 id="personal-heading">{{ $t('البيانات الشخصية') }}</h2>
            <p>{{ $t('حافظ على بياناتك محدّثة.') }}</p>
          </div>
          <div v-if="!editingInfo" class="profile-section__head-action">
            <button
              type="button"
              class="edit-btn"
              @click="startEditInfo"
            >
              <svg class="edit-btn__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M4 20h4l10.5-10.5a2.121 2.121 0 0 0-3-3L5 17v3Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                <path d="m13.5 6.5 4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              <span>{{ $t('تعديل') }}</span>
            </button>
          </div>
        </header>

        <form class="profile-form" @submit.prevent="UpdateUserProfileData">
          <div class="profile-form__grid">
            <ds-input
              v-model="fullName"
              class="profile-form__field profile-form__field--full"
              :label="$t('الاسم الكامل')"
              :disabled="!editingInfo"
              :readonly="!editingInfo"
            />
            <ds-input
              v-model="email"
              class="profile-form__field profile-form__field--full"
              type="email"
              :label="$t('البريد الإلكتروني')"
              readonly
              disabled
              dir="ltr"
            />
            <ds-input
              v-model="phoneNumber"
              class="profile-form__field"
              :label="$t('رقم الهاتف')"
              :disabled="!editingInfo"
              :readonly="!editingInfo"
              placeholder="+249XXXXXXXXX"
              dir="ltr"
              inputmode="tel"
            />
            <ds-input
              v-model="whatsAppNumber"
              class="profile-form__field"
              :label="$t('رقم الواتساب')"
              :disabled="!editingInfo"
              :readonly="!editingInfo"
              placeholder="+249XXXXXXXXX"
              dir="ltr"
              inputmode="tel"
            />
            <ds-input
              v-model="telegramNumber"
              class="profile-form__field profile-form__field--full"
              :label="$t('رقم التلجرام')"
              :disabled="!editingInfo"
              :readonly="!editingInfo"
              placeholder="+249XXXXXXXXX"
              dir="ltr"
              inputmode="tel"
            />
          </div>

          <fieldset class="profile-form__gender" :disabled="!editingInfo">
            <legend>{{ $t('الجنس') }}</legend>
            <div class="profile-form__chips">
              <button
                v-for="g in genders"
                :key="g.value"
                type="button"
                class="gender-chip"
                :class="{
                  'gender-chip--active': gender === g.value,
                  'gender-chip--disabled': !editingInfo,
                }"
                :disabled="!editingInfo"
                @click="gender = g.value"
              >
                <span>{{ g.label }}</span>
              </button>
            </div>
          </fieldset>

          <div v-if="editingInfo" class="profile-form__actions">
            <ds-button
              type="button"
              variant="ghost"
              size="md"
              :disabled="saving"
              @click="cancelEditInfo"
            >
              {{ $t('إلغاء') }}
            </ds-button>
            <ds-button
              type="submit"
              variant="primary"
              size="md"
              :loading="saving"
            >
              {{ $t('حفظ التغييرات') }}
            </ds-button>
          </div>
        </form>
      </section>

      <!-- Preferences section (full-width) -->
      <section class="profile-section" aria-labelledby="prefs-heading">
        <header class="profile-section__head">
          <div class="profile-section__head-text">
            <h2 id="prefs-heading">{{ $t('التفضيلات') }}</h2>
            <p>{{ $t('اختر لغة الواجهة.') }}</p>
          </div>
        </header>

        <div class="profile-prefs__row">
          <div class="profile-prefs__label">
            <span>{{ $t('اللغة') }}</span>
            <small>{{ $t('تُطبَّق على الواجهة فورًا.') }}</small>
          </div>
          <div
            class="profile-prefs__control"
            role="radiogroup"
            :aria-label="$t('اللغة')"
          >
            <button
              class="lang-chip"
              :class="{ 'lang-chip--active': !isEnglish }"
              type="button"
              role="radio"
              :aria-checked="!isEnglish"
              @click="setLang(false)"
            >
              {{ $t('العربية') }}
            </button>
            <button
              class="lang-chip"
              :class="{ 'lang-chip--active': isEnglish }"
              type="button"
              role="radio"
              :aria-checked="isEnglish"
              @click="setLang(true)"
            >
              English
            </button>
          </div>
        </div>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useQuasar } from 'quasar'
import { useQuery, useMutation } from '@vue/apollo-composable'
import { storeToRefs } from 'pinia'
import { useSettingsStore } from 'src/stores/settings'
import { GetMyProfileData } from 'src/graphql/account_management/query/GetMyProfileData'
import { UpdateUserProfile } from 'src/graphql/account_management/mutation/UpdateUserProfile'
import DsInput from 'src/design-system/components/DsInput.vue'
import type {
  GetMyProfileResult,
  GetMyProfileVariables,
  UpdateProfileMutationResult,
  UpdateProfileVariables,
} from 'src/types/auth/types'

const { t } = useI18n()
const $q = useQuasar()
const settings = useSettingsStore()
const { isEnglish } = storeToRefs(settings)

// ---------------------------------------------------------------------------
// Query
// ---------------------------------------------------------------------------
const profileQuery = useQuery<GetMyProfileResult, GetMyProfileVariables>(GetMyProfileData)
const me = computed(() => profileQuery.result.value?.me ?? null)

// ---------------------------------------------------------------------------
// Mutation
// ---------------------------------------------------------------------------
const { mutate: updateProfileMutate } = useMutation<
  UpdateProfileMutationResult,
  UpdateProfileVariables
>(UpdateUserProfile, { refetchQueries: [{ query: GetMyProfileData }] })

// ---------------------------------------------------------------------------
// Local form state
// ---------------------------------------------------------------------------
const saving = ref(false)
const editingInfo = ref(false)
const fullName = ref('')
const email = ref('')
const phoneNumber = ref('')
const whatsAppNumber = ref('')
const telegramNumber = ref('')
const gender = ref('')

interface Snapshot {
  fullName: string
  phoneNumber: string
  whatsAppNumber: string
  telegramNumber: string
  gender: string
}
const snapshot = ref<Snapshot | null>(null)

// ---------------------------------------------------------------------------
// Computed
// ---------------------------------------------------------------------------
const genders = computed(() => [
  { value: 'male',   label: t('ذكر') },
  { value: 'female', label: t('أنثى') },
])

const genderLabel = computed(() => {
  if (gender.value === 'male')   return t('ذكر')
  if (gender.value === 'female') return t('أنثى')
  return '—'
})

const initials = computed(() => {
  const n = (fullName.value || email.value || '').trim()
  if (!n) return '؟'
  const parts = n.split(/\s+/).filter(Boolean)
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
})

// ---------------------------------------------------------------------------
// Sync me -> local fields
// ---------------------------------------------------------------------------
watch(me, (value) => {
  if (!value) return
  email.value          = value.email ?? ''
  fullName.value       = value.fullName ?? ''
  phoneNumber.value    = value.phoneNumber ?? ''
  whatsAppNumber.value = value.phoneNumber2 ?? ''
  telegramNumber.value = value.phoneNumber3 ?? ''
  if (value.gender === 'MALE')   gender.value = 'male'
  if (value.gender === 'FEMALE') gender.value = 'female'
})

// ---------------------------------------------------------------------------
// Lifecycle
// ---------------------------------------------------------------------------
onMounted(() => {
  settings.setActiveNav('PROFILE')
})

// ---------------------------------------------------------------------------
// Methods
// ---------------------------------------------------------------------------
function startEditInfo (): void {
  snapshot.value = {
    fullName: fullName.value,
    phoneNumber: phoneNumber.value,
    whatsAppNumber: whatsAppNumber.value,
    telegramNumber: telegramNumber.value,
    gender: gender.value,
  }
  editingInfo.value = true
}

function cancelEditInfo (): void {
  if (snapshot.value) {
    fullName.value       = snapshot.value.fullName
    phoneNumber.value    = snapshot.value.phoneNumber
    whatsAppNumber.value = snapshot.value.whatsAppNumber
    telegramNumber.value = snapshot.value.telegramNumber
    gender.value         = snapshot.value.gender
  }
  editingInfo.value = false
}

function setLang (flag: boolean): void {
  if (isEnglish.value === flag) return
  settings.setIsEnglish(flag)
  $q.notify({
    type: 'positive',
    position: 'top',
    progress: true,
    message: flag ? 'Language updated' : t('تم تحديث اللغة'),
  })
}

function errorHandler (errorsObj: Record<string, Array<{ message: string }>>): void {
  for (const key in errorsObj) {
    for (const val of errorsObj[key]) {
      $q.notify({
        type: 'warning',
        progress: true,
        multiLine: true,
        position: 'top',
        message: val.message,
      })
    }
  }
}

async function UpdateUserProfileData (): Promise<void> {
  saving.value = true
  try {
    const result = await updateProfileMutate({
      input: {
        fullName: fullName.value,
        phoneNumber: phoneNumber.value,
        phoneNumber2: whatsAppNumber.value,
        phoneNumber3: telegramNumber.value,
        gender: gender.value,
      },
    })
    const payload = result?.data?.updateUserProfile
    if (payload?.success) {
      $q.notify({
        type: 'positive',
        position: 'top',
        progress: true,
        multiLine: true,
        message: t('تم تحديث بياناتك بنجاح'),
      })
      editingInfo.value = false
    } else if (payload?.errors) {
      errorHandler(payload.errors as Record<string, Array<{ message: string }>>)
    }
  } catch { /* apolloProvider surfaces the error toast */ }
  finally { saving.value = false }
}
</script>

<style lang="scss" scoped>
.profile-page {
  background: var(--ds-cream, var(--ds-surface-muted));
  min-block-size: 100vh;
  padding: var(--ds-space-6) var(--ds-space-3) var(--ds-space-12);

  @media (min-width: 600px) {
    padding: var(--ds-space-8) var(--ds-space-4) var(--ds-space-16);
  }

  &__header {
    max-inline-size: 1200px;
    margin-inline: auto;
    margin-block-end: var(--ds-space-7);
  }

  &__title {
    font-family: var(--ds-font-heading);
    font-size: clamp(1.75rem, 2.5vw + 1rem, var(--ds-text-3xl));
    font-weight: var(--ds-weight-bold);
    color: var(--ds-ink, var(--ds-text));
    margin: 0 0 var(--ds-space-2);
    letter-spacing: -0.01em;
  }

  &__subtitle {
    font-family: var(--ds-font-body);
    color: var(--ds-taupe, var(--ds-text-muted));
    margin: 0;
    font-size: var(--ds-text-md);
    max-inline-size: 56ch;
  }

  &__stack {
    max-inline-size: 1200px;
    margin-inline: auto;
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-8);
    inline-size: 100%;
  }
}

// ---------------------------------------------------------------------------
// Shared section shell — full-width, editorial, no nested cards
// ---------------------------------------------------------------------------
.profile-section {
  inline-size: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-5);
  background: var(--ds-ivory, var(--ds-surface));
  border-radius: var(--ds-radius-lg);
  padding: var(--ds-space-5) var(--ds-space-5);
  box-shadow: var(--ds-shadow-sm);

  @media (min-width: 900px) {
    padding: var(--ds-space-6) var(--ds-space-7);
  }

  &__head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--ds-space-4);
    padding-block-end: var(--ds-space-3);
    border-block-end: 1px solid var(--ds-border);
    flex-wrap: wrap;

    h2 {
      font-family: var(--ds-font-heading);
      font-size: var(--ds-text-xl);
      font-weight: var(--ds-weight-bold);
      color: var(--ds-ink, var(--ds-text));
      margin: 0 0 var(--ds-space-1);
    }
    p {
      margin: 0;
      color: var(--ds-taupe, var(--ds-text-muted));
      font-size: var(--ds-text-sm);
    }
  }

  &__head-text { min-inline-size: 0; }
  &__head-action { flex-shrink: 0; }
}

// ---------------------------------------------------------------------------
// Identity section (horizontal avatar + body, full-width)
// ---------------------------------------------------------------------------
.profile-identity {
  flex-direction: row;
  align-items: center;
  gap: var(--ds-space-5);
  flex-wrap: wrap;

  &__avatar {
    inline-size: 84px;
    block-size: 84px;
    border-radius: 50%;
    background: var(--ds-brand-600);
    color: var(--ds-text-onBrand, #fff);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  &__initials {
    font-family: var(--ds-font-heading);
    font-weight: var(--ds-weight-bold);
    font-size: 28px;
    letter-spacing: 0.04em;
  }

  &__body {
    flex: 1 1 260px;
    min-inline-size: 0;
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-2);
  }

  &__name {
    font-family: var(--ds-font-heading);
    font-size: var(--ds-text-xl);
    font-weight: var(--ds-weight-bold);
    color: var(--ds-ink, var(--ds-text));
    margin: 0;
    line-height: 1.25;
    word-break: break-word;
  }

  &__email {
    margin: 0;
    font-family: var(--ds-font-mono, var(--ds-font-body));
    font-size: var(--ds-text-sm);
    color: var(--ds-taupe, var(--ds-text-muted));
    overflow-wrap: anywhere;
    font-variant-numeric: tabular-nums;
  }

  &__meta {
    margin: var(--ds-space-2) 0 0;
    padding: 0;
    inline-size: 100%;
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--ds-space-2);

    @media (min-width: 700px) {
      grid-template-columns: 1fr 1fr;
      gap: var(--ds-space-4);
    }
  }

  &__meta-row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: var(--ds-space-3);
    padding-block: var(--ds-space-2);
    border-block-start: 1px solid var(--ds-border);

    dt {
      font-family: var(--ds-font-heading);
      font-size: var(--ds-text-xs);
      color: var(--ds-taupe, var(--ds-text-muted));
      font-weight: var(--ds-weight-medium);
      margin: 0;
    }
    dd {
      margin: 0;
      font-family: var(--ds-font-body);
      font-size: var(--ds-text-sm);
      color: var(--ds-ink, var(--ds-text));
    }
  }

  &__num { font-variant-numeric: tabular-nums; }
}

// ---------------------------------------------------------------------------
// Prominent Edit button (primary, filled indigo, leading icon)
// ---------------------------------------------------------------------------
.edit-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--ds-space-2);
  padding-inline: var(--ds-space-5);
  padding-block: var(--ds-space-3);
  background: var(--ds-brand-600);
  color: var(--ds-ivory, #fff);
  border: 0;
  border-radius: var(--ds-radius-md, 10px);
  font-family: var(--ds-font-heading);
  font-size: var(--ds-text-sm);
  font-weight: var(--ds-weight-bold);
  line-height: 1;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(50, 40, 115, 0.22);
  transition:
    background var(--ds-duration-fast) var(--ds-ease-out),
    box-shadow var(--ds-duration-fast) var(--ds-ease-out),
    transform var(--ds-duration-fast) var(--ds-ease-out);

  &:hover {
    background: #271e5c; // darker brand-600
    box-shadow: 0 4px 10px rgba(50, 40, 115, 0.32);
  }
  &:active { transform: translateY(1px); }
  &:focus-visible {
    outline: 2px solid transparent;
    box-shadow: var(--ds-shadow-focus, 0 0 0 3px rgba(193, 98, 60, 0.45));
  }

  &__icon {
    inline-size: 18px;
    block-size: 18px;
    flex-shrink: 0;
  }
}

// ---------------------------------------------------------------------------
// Form — full-width fields, one per row; optional 2-col for phone+whatsapp
// ---------------------------------------------------------------------------
.profile-form {
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-5);

  &__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--ds-space-4);

    @media (min-width: 900px) {
      grid-template-columns: 1fr 1fr;
    }
  }

  &__field {
    inline-size: 100%;

    // DsInput renders an inner wrapper; enforce full-width on its root too.
    &:deep(.ds-input),
    &:deep(.q-field) {
      inline-size: 100%;
    }

    // Latin numerals for phone inputs
    &:deep(input[inputmode='tel']),
    &:deep(input[type='email']) {
      font-variant-numeric: tabular-nums;
    }

    &--full {
      @media (min-width: 900px) {
        grid-column: 1 / -1;
      }
    }
  }

  &__gender {
    margin: 0;
    padding: 0;
    border: 0;

    legend {
      padding: 0;
      margin-block-end: var(--ds-space-2);
      font-family: var(--ds-font-heading);
      font-size: var(--ds-text-sm);
      font-weight: var(--ds-weight-medium);
      color: var(--ds-ink, var(--ds-text));
    }
  }

  &__chips {
    display: flex;
    gap: var(--ds-space-2);
    flex-wrap: wrap;
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--ds-space-2);
    padding-block-start: var(--ds-space-2);
    flex-wrap: wrap;
  }
}

.gender-chip {
  background: var(--ds-surface);
  border: 1px solid var(--ds-border);
  border-radius: var(--ds-radius-pill);
  padding: 0.55rem 1.25rem;
  font-family: var(--ds-font-heading);
  font-size: var(--ds-text-sm);
  color: var(--ds-text);
  cursor: pointer;
  transition: all var(--ds-duration-fast) var(--ds-ease-out);

  &:hover:not(:disabled) { background: var(--ds-surface-sunken); }
  &--active {
    background: var(--ds-brand-600);
    color: var(--ds-text-onBrand);
    border-color: var(--ds-brand-600);
  }
  &--disabled, &:disabled { opacity: 0.6; cursor: not-allowed; }
  &:focus-visible { outline: 2px solid transparent; box-shadow: var(--ds-shadow-focus); }
}

// ---------------------------------------------------------------------------
// Preferences
// ---------------------------------------------------------------------------
.profile-prefs__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ds-space-4);
  flex-wrap: wrap;
}

.profile-prefs__label {
  display: flex;
  flex-direction: column;
  gap: 2px;

  span {
    font-family: var(--ds-font-heading);
    font-weight: var(--ds-weight-medium);
    color: var(--ds-ink, var(--ds-text));
    font-size: var(--ds-text-sm);
  }
  small {
    color: var(--ds-taupe, var(--ds-text-muted));
    font-size: var(--ds-text-xs);
  }
}

.profile-prefs__control {
  display: inline-flex;
  align-items: center;
  gap: var(--ds-space-1);
  padding: 4px;
  background: var(--ds-surface-sunken, var(--ds-surface));
  border: 1px solid var(--ds-border);
  border-radius: var(--ds-radius-pill);
}

.lang-chip {
  background: transparent;
  border: 0;
  border-radius: var(--ds-radius-pill);
  padding: 0.4rem 1rem;
  font-family: var(--ds-font-heading);
  font-size: var(--ds-text-sm);
  cursor: pointer;
  color: var(--ds-text);
  transition: all var(--ds-duration-fast) var(--ds-ease-out);

  &--active {
    background: var(--ds-brand-600);
    color: var(--ds-text-onBrand, #fff);
  }
  &:focus-visible {
    outline: 2px solid transparent;
    box-shadow: var(--ds-shadow-focus);
  }
}
</style>
