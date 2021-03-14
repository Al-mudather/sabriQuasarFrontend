<template>
  <div class="move">
    <div class="container-fluid">
        <div class="row">
            <div class="col-lg-4 col-sm-12">
                <div class="bord">
                    <img class="money" src="~assets/img/money.png" alt="">
                    <div class="all" v-if="!$_.isEmpty(user.affiliateSet.edges)">
                        <div class="row">
                            <div class="col-lg-7">
                                <div class="price">
                                    <img class="hrcooo" src="~assets/img/titleft.png" alt="">
                                    <h2>{{$t('الأرباح المستحقة')}}</h2>
                                    <h3><span>SDG</span>1588</h3>
                                    <div class="linke">
                                        <h3>{{$t('طلب سحب')}} <img class="mage" src="~assets/img/Group 734.png" alt=""></h3>
                                    </div>
                                    <img class="hrColor" src="~assets/img/titleft.png" alt="">
                                </div>
                            </div>
                            <div class="col-lg-5">
                                <div class="price right">
                                    <h2>{{$t('منضم من خلالي')}}</h2>
                                    <div class="box">
                                        <h3>480</h3>
                                        <span>{{$t('شخص')}}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    <!--share linke-->
                    </div>
                    <div class="avvil" v-else>
                        <h3>{{$t('هيـا لنقم بإنشاء رابطك الخاص ومشاركتة مع الاصدقاء لتربح مع كل إنضمام مبلغ مالي ')}}</h3>
                        <button @click="JoinAffiliateProgramMutation">{{$t('طلب إنضمام')}}</button>
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
import { JoinAffiliateProgram } from 'src/queries/afilliate_management/mutation/JoinAffiliateProgram'
export default {
  name: "afilliateBord",

  data() {
    return {};
  },

  computed: {
    ...mapState('authentication', ['user']),
  },

  methods: {
    ...mapActions('authentication', ['setUserAffiliateLinkAction']),

    JoinAffiliateProgramMutation () {
      this.$apollo.mutate({
        mutation: JoinAffiliateProgram
      }).then((res) => {
        if (res.data.joinAffiliateProgram.success) {

          this.setUserAffiliateLinkAction(res.data.joinAffiliateProgram.affiliate)
        }
      })
    }
  },
};
</script>
<style lang="scss"></style>
