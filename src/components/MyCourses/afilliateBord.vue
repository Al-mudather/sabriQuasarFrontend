<template>
  <div class="affiliate-board">
    <div class="affiliate-board__prompt">
      <img class="affiliate-board__icon" src="~assets/img/money.png" alt="" aria-hidden="true" />
      <div class="affiliate-board__text">
        <p v-if="myPyramidAccountID || amIAMarketer">
          {{ $t('انت الان ضمن عائلة مسوقي المنصه التعليميه. الرجاء الذهاب الى صفحتك التسويقيه') }}
        </p>
        <p v-else>
          {{ $t('هل تريد ان تكون ضمن عائلة مسوقي المنصه التعليميه, اذا نعم قم بالضغط على طلب الإنضمام الان') }}
        </p>
      </div>
      <div class="affiliate-board__cta">
        <ds-button
          v-if="myPyramidAccountID || amIAMarketer"
          variant="secondary"
          :loading="visible"
          @click="GO_TO_MY_MARKETING_PAGE"
        >
          {{ $t('الذهاب') }}
        </ds-button>
        <ds-button
          v-else
          variant="accent"
          :loading="visible"
          @click="JOIN_THE_PYRAMID_PROGRAM"
        >
          {{ $t('طلب إنضمام') }}
        </ds-button>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useQuery } from '@vue/apollo-composable'
import { useAuthStore } from 'src/stores/auth'
import { apolloClient } from 'src/apollo/client'
import { GetMyProfileData } from 'src/graphql/account_management/query/GetMyProfileData'
import { CheckTheUserPermissionToUsePlatforme } from 'src/graphql/pyramid_marketing_management/query/CheckPyramidAffiliateQuery'
import { JoinPyramidProgram } from 'src/graphql/pyramid_marketing_management/mutation/JoinPyramidProgram'
import { MyPyramidAccount } from 'src/graphql/pyramid_marketing_management/query/MyPyramidAccount'

export default {
  name: 'afilliateBord',

  setup () {
    const auth = useAuthStore()
    const { user } = storeToRefs(auth)
    const { result, onResult } = useQuery(MyPyramidAccount, null, { errorPolicy: 'all' })
    const myPyramidAccount = computed(() => result.value?.myPyramidAccount || null)
    return { auth, user, myPyramidAccount, onPyramidResult: onResult }
  },

  data () {
    return { myPyramidAccountID: null, amIAMarketer: false, visible: false }
  },

  mounted () {
    this.onPyramidResult((r) => {
      this.visible = false
      if (r.data?.myPyramidAccount) {
        this.myPyramidAccountID = r.data.myPyramidAccount.pyramidId
      }
    })
  },

  methods: {
    async CHECK_IF_THE_USER_HASE_THE_REGISTERATION_CODE () {
      try {
        await apolloClient.query({
          query: CheckTheUserPermissionToUsePlatforme
        })
      } catch (e) {
        if (e.message === 'GraphQL error: PyramidAffiliate matching query does not exist.') {
          this.$q.notify({
            type: 'negative',
            progress: true,
            multiLine: true,
            position: 'top',
            message: 'You must inter the registeration code'
          })
          this.$router.push({ name: 'registeration-code' })
        }
      }
    },

    GO_TO_MY_MARKETING_PAGE () { this.$router.push({ name: 'my-marketing-page' }) },

    async JOIN_THE_PYRAMID_PROGRAM () {
      this.visible = true
      this.CHECK_IF_THE_USER_HASE_THE_REGISTERATION_CODE()
      try {
        const res = await apolloClient.mutate({ mutation: JoinPyramidProgram, variables: { input: {} } })
        if (res.data.joinPyramidProgram.success) {
          this.$q.notify({
            type: 'positive',
            progress: true,
            multiLine: true,
            position: 'top',
            message: 'You are now a marketer'
          })
          this.amIAMarketer = true
          const profile = await apolloClient.query({ query: GetMyProfileData })
          this.auth.setUserAfterJoinPyramid(profile.data.me)
        }
      } catch (e) { /* apolloProvider surfaces error */ }
      finally { this.visible = false }
    }
  }
}
</script>

<style lang="scss" scoped>
.affiliate-board {
  margin-block-end: var(--ds-space-5);

  &__prompt {
    display: flex;
    align-items: center;
    gap: var(--ds-space-4);
    background: linear-gradient(135deg, var(--ds-brand-600), var(--ds-brand-700));
    color: var(--ds-text-onBrand);
    border-radius: var(--ds-radius-xl);
    padding: var(--ds-space-5);
    box-shadow: var(--ds-shadow-md);
    flex-wrap: wrap;
  }

  &__icon {
    inline-size: 4rem;
    block-size: 4rem;
    flex-shrink: 0;
  }

  &__text {
    flex: 1;
    min-inline-size: 12rem;
    p {
      margin: 0;
      font-size: var(--ds-text-md);
      line-height: var(--ds-leading-arabic);
    }
  }

  &__cta { flex-shrink: 0; }
}
</style>
