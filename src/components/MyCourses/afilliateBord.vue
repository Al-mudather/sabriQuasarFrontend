<template>
  <section class="affiliate-board">
    <span class="affiliate-board__badge" aria-hidden="true">
      <!-- Megaphone: the "marketer / promote & earn" mark (replaces the old
           money.png raster image with a crisp, theme-coloured line icon). -->
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 10v4a1 1 0 0 0 1 1h3l8 4V5L7 9H4a1 1 0 0 0-1 1Z" />
        <path d="M7 15v3a1.5 1.5 0 0 0 3 0v-2" />
        <path d="M18.4 9.6a4 4 0 0 1 0 4.8" />
      </svg>
    </span>

    <p class="affiliate-board__text">
      {{ isMarketer
        ? $t('انت الان ضمن عائلة مسوقي المنصه التعليميه. الرجاء الذهاب الى صفحتك التسويقيه')
        : $t('هل تريد ان تكون ضمن عائلة مسوقي المنصه التعليميه, اذا نعم قم بالضغط على طلب الإنضمام الان') }}
    </p>

    <div class="affiliate-board__cta">
      <ds-button
        v-if="isMarketer"
        variant="secondary"
        :loading="visible"
        @click="GO_TO_MY_MARKETING_PAGE"
      >
        {{ $t('الذهاب') }}
      </ds-button>
      <ds-button
        v-else-if="!loading"
        variant="accent"
        :loading="visible"
        @click="JOIN_THE_PYRAMID_PROGRAM"
      >
        {{ $t('طلب إنضمام') }}
      </ds-button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { useQuery } from '@vue/apollo-composable'
import { useAuthStore } from 'src/stores/auth'
import { usePyramidStore } from 'src/stores/pyramid'
import { payloadErrorMessages, resultErrorMessages, matchesError } from 'src/utils/graphqlErrors'
import { apolloClient } from 'src/apollo/client'
import { GetMyProfileData } from 'src/graphql/account_management/query/GetMyProfileData'
import { JoinPyramidProgram } from 'src/graphql/pyramid_marketing_management/mutation/JoinPyramidProgram'
import { MyPyramidAccount } from 'src/graphql/pyramid_marketing_management/query/MyPyramidAccount'
import type {
  MyPyramidAccountResult,
  MyPyramidAccountVars,
  JoinPyramidProgramResult,
  JoinPyramidProgramVars,
} from 'src/types/pyramid/types'
import type { GetMyProfileResult } from 'src/types/auth/types'

const router = useRouter()
const $q = useQuasar()
const { t } = useI18n()
const auth = useAuthStore()
const pyramid = usePyramidStore()

const myPyramidAccountID = ref<string | null>(null)
const amIAMarketer = ref(false)
const visible = ref(false)

// Already part of the marketers program → show "go to marketing page"; otherwise
// show the "request to join" CTA.
const isMarketer = computed(
  () => !!myPyramidAccountID.value || amIAMarketer.value || !!auth.user?.isPyramidMarketer
)

const { result, loading, onResult } = useQuery<MyPyramidAccountResult, MyPyramidAccountVars>(
  MyPyramidAccount,
  {},
  { errorPolicy: 'all' }
)

const myPyramidAccount = computed(() => result.value?.myPyramidAccount ?? null)

onResult((r) => {
  if (r.data?.myPyramidAccount) {
    myPyramidAccountID.value = r.data.myPyramidAccount.pyramidId ?? null
  }
})

function GO_TO_MY_MARKETING_PAGE (): void {
  router.push({ name: 'my-marketing-page' })
}

function notifyError (message: string): void {
  $q.notify({ type: 'negative', progress: true, multiLine: true, position: 'bottom', message })
}

async function JOIN_THE_PYRAMID_PROGRAM (): Promise<void> {
  if (visible.value) return
  visible.value = true
  try {
    // A user without a registration code cannot become a marketer.
    const ok = await pyramid.verifyPlatformAccess(true)
    if (!ok) {
      notifyError(t('يجب إدخال كود التسجيل أولاً'))
      router.push({ name: 'registeration-code' })
      return
    }
    const res = await apolloClient.mutate<JoinPyramidProgramResult, JoinPyramidProgramVars>({
      mutation: JoinPyramidProgram,
      variables: { input: {} },
      errorPolicy: 'all'
    })
    const payload = res.data?.joinPyramidProgram
    if (!payload) {
      notifyError(resultErrorMessages(res)[0] ?? t('تعذّر الانضمام، حاول مجدداً'))
      return
    }
    if (payload.success) {
      // Success covers both a newly created and an already existing account.
      $q.notify({
        type: 'positive',
        progress: true,
        multiLine: true,
        position: 'bottom',
        message: t('أنت الآن مسوّق')
      })
      amIAMarketer.value = true
      pyramid.setMyMarketingCode(payload.instance?.pyramidCode ?? '')
      const profile = await apolloClient.query<GetMyProfileResult>({ query: GetMyProfileData })
      if (profile.data.me) {
        auth.setUserAfterJoinPyramid(profile.data.me)
      }
      return
    }
    if (matchesError(payload.errors, /Pyramid Affiliate Does Not Exist/i)) {
      notifyError(t('يجب إدخال كود التسجيل أولاً'))
      router.push({ name: 'registeration-code' })
      return
    }
    notifyError(payloadErrorMessages(payload.errors)[0] ?? t('تعذّر الانضمام، حاول مجدداً'))
  } catch (e: unknown) {
    notifyError(resultErrorMessages(e)[0] ?? t('تعذّر الانضمام، حاول مجدداً'))
  } finally {
    visible.value = false
  }
}

</script>

<style lang="scss" scoped>
.affiliate-board {
  display: flex;
  align-items: center;
  gap: var(--ds-space-4);
  margin-block-end: var(--ds-space-5);
  padding: var(--ds-space-5);
  background: linear-gradient(135deg, var(--ds-brand-600), var(--ds-brand-800));
  color: var(--ds-text-onBrand);
  border-radius: var(--ds-radius-xl);
  box-shadow: var(--ds-shadow-md);

  &__badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    inline-size: 3rem;
    block-size: 3rem;
    flex-shrink: 0;
    border-radius: var(--ds-radius-lg);
    background: rgba(255, 255, 255, 0.14);
    border: 1px solid rgba(255, 255, 255, 0.22);
    color: var(--ds-accent-300);

    svg {
      inline-size: 1.6rem;
      block-size: 1.6rem;
    }
  }

  &__text {
    flex: 1;
    min-inline-size: 0;
    margin: 0;
    font-size: var(--ds-text-md);
    line-height: var(--ds-leading-arabic);
  }

  &__cta { flex-shrink: 0; }

  /* Small screens: stack into one column — icon on top, then the message and
     the button each spanning the full width. Far cleaner than the cramped
     three-across row on a phone. */
  @media (max-width: 599px) {
    flex-direction: column;
    align-items: stretch;
    gap: var(--ds-space-4);
    padding: var(--ds-space-4);

    .affiliate-board__text {
      flex: none;
    }

    .affiliate-board__cta {
      inline-size: 100%;

      :deep(.ds-btn) {
        inline-size: 100%;
      }
    }
  }
}
</style>
