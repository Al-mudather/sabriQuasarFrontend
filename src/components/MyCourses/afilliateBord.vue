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
import { GetMyProfileData } from 'src/queries/account_management/query/GetMyProfileData'
import { CheckTheUserPermissionToUsePlatforme } from 'src/queries/pyramid_marketing_management/query/CheckPyramidAffiliateQuery'
import { mapState, mapActions } from 'vuex'
import { JoinPyramidProgram } from 'src/queries/pyramid_marketing_management/mutation/JoinPyramidProgram'
import { MyPyramidAccount } from 'src/queries/pyramid_marketing_management/query/MyPyramidAccount'

export default {
  name: 'afilliateBord',

  data () {
    return { myPyramidAccountID: null, amIAMarketer: false, visible: false }
  },

  computed: { ...mapState('authentication', ['user']) },

  apollo: {
    myPyramidAccount: {
      query () { return MyPyramidAccount },
      result (result) {
        this.visible = true
        if (!result.loading) {
          this.visible = false
          this.myPyramidAccountID = result.data.myPyramidAccount.pyramidId
        }
      }
    }
  },

  methods: {
    ...mapActions('authentication', ['SET_THE_USER_DATA_AFTER_JOIN_THE_PYRAMID_PROGRAME_ACTION']),

    async CHECK_IF_THE_USER_HASE_THE_REGISTERATION_CODE () {
      try {
        await this.$apollo.query({
          query: CheckTheUserPermissionToUsePlatforme,
          refetchQueries: [{ query: MyPyramidAccount }]
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
        const res = await this.$apollo.mutate({ mutation: JoinPyramidProgram, variables: { input: {} } })
        if (res.data.joinPyramidProgram.success) {
          this.$q.notify({
            type: 'positive',
            progress: true,
            multiLine: true,
            position: 'top',
            message: 'You are now a marketer'
          })
          this.amIAMarketer = true
          const profile = await this.$apollo.query({ query: GetMyProfileData })
          this.SET_THE_USER_DATA_AFTER_JOIN_THE_PYRAMID_PROGRAME_ACTION(profile.data.me)
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
