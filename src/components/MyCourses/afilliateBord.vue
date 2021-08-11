<template>
  <div class="move">
    <div class="container-fluid">
        <div class="row">
            <div class="col-lg-4 col-sm-12">
                <div class="bord">
                    <img class="money" src="~assets/img/money.png" alt="">
                    <div class="avvil" v-if="myPyramidAccountID">
                      <h3>{{$t('انت الان ضمن عائلة مسوقي المنصه التعليميه. الرجاء الذهاب الى صفحتك التسويقيه')}}</h3>
                      <button @click="GO_TO_MY_MARKETING_PAGE">{{$t('الذهاب')}}</button>
                    </div>
                    <div class="avvil" v-else>
                        <h3>{{$t('هيـا لنقم بإنشاء رابطك الخاص ومشاركتة مع الاصدقاء لتربح مع كل إنضمام مبلغ مالي ')}}</h3>
                        <button @click="JOIN_THE_PYRAMID_PROGRAM">{{$t('طلب إنضمام')}}</button>
                    </div>
                </div>
            </div>
            <div class="col-lg-8 col-sm-12">
                <div class="load">
                    <img src="~assets/img/load.png" alt="">
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script>

import { mapState, mapActions } from "vuex";
import { JoinPyramidProgram } from 'src/queries/pyramid_marketing_management/mutation/JoinPyramidProgram'
import { MyPyramidAccount } from 'src/queries/pyramid_marketing_management/query/MyPyramidAccount'

export default {
  name: "afilliateBord",

  data() {
    return {
      myPyramidAccountID: null
    };
  },

  computed: {
    ...mapState('authentication', ['user']),
  },

  apollo: {
    myPyramidAccount: {
      query () {
        return MyPyramidAccount
      },
      result (result) {
        if (!result.loading) {
          this.myPyramidAccountID = result.data.myPyramidAccount.pyramidId 
        }
      }
    }
  },
  

  methods: {
    ...mapActions('authentication', ['setUserAffiliateLinkAction']),

    GO_TO_MY_MARKETING_PAGE () {
      this.$router.push({ name: 'my-marketing-page' })
    },

    JOIN_THE_PYRAMID_PROGRAM () {
      this.$apollo.mutate({
        mutation: JoinPyramidProgram,
        variables: {
          input: {}
        }
      }).then((res) => {
        if (res.data.joinPyramidProgram.success) {
          this.setUserAffiliateLinkAction(res.data.joinAffiliateProgram.affiliate)
        }
      })
    }
  },
};
</script>
<style lang="scss"></style>
