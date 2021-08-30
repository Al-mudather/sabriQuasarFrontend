<template>
  <div class="move">
    <div class="container-fluid">
        <div class="row">
            <div class="col-lg-4 col-sm-12">
                <div class="bord">
                    <img class="money" src="~assets/img/money.png" alt="">
                    <div class="avvil" v-if="myPyramidAccountID || amIAMarketer">
                      <h3>{{$t('انت الان ضمن عائلة مسوقي المنصه التعليميه. الرجاء الذهاب الى صفحتك التسويقيه')}}</h3>
                      <button @click="GO_TO_MY_MARKETING_PAGE">{{$t('الذهاب')}}</button>
                    </div>
                    <div class="avvil" v-else>
                        <h3>{{$t('هيـا لنقم بإنشاء رابطك الخاص ومشاركتة مع الاصدقاء لتربح مع كل إنضمام مبلغ مالي ')}}</h3>
                        <button @click="JOIN_THE_PYRAMID_PROGRAM">{{$t('طلب إنضمام')}}</button>
                        <q-inner-loading :showing="visible">
                          <q-spinner-hourglass color="primary" size="70px" />
                      </q-inner-loading>
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
import { GetMyProfileData } from "src/queries/account_management/query/GetMyProfileData";
import { CheckTheUserPermissionToUsePlatforme } from 'src/queries/pyramid_marketing_management/query/CheckPyramidAffiliateQuery'
import { mapState, mapActions } from "vuex";
import { JoinPyramidProgram } from 'src/queries/pyramid_marketing_management/mutation/JoinPyramidProgram'
import { MyPyramidAccount } from 'src/queries/pyramid_marketing_management/query/MyPyramidAccount'

export default {
  name: "afilliateBord",

  data() {
    return {
      myPyramidAccountID: null,
      amIAMarketer: false,
      visible: false
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
    ...mapActions('authentication', ['SET_THE_USER_DATA_AFTER_JOIN_THE_PYRAMID_PROGRAME_ACTION']),

    async CHECK_IF_THE_USER_HASE_THE_REGISTERATION_CODE () {
      try {
        const join_permission_res = await this.$apollo.query({
          query: CheckTheUserPermissionToUsePlatforme,
            refetchQueries: [{ query: MyPyramidAccount }]
          })
      } catch (e) {
          //TODO: IF there is an error, then the user did not join the platform with a registeration code
          if ( e.message == 'GraphQL error: PyramidAffiliate matching query does not exist.') {
              this.$q.notify({
                  type: 'negative',
                  progress: true,
                  multiLine: true,
                  position: 'top',
                  message: 'You must inter the registeration code'
              })
              // TODO: Go to registeration code page
              this.$router.push({ name: 'registeration-code' })
          }

      }
  },

    GO_TO_MY_MARKETING_PAGE () {
      this.$router.push({ name: 'my-marketing-page' })
    },

    JOIN_THE_PYRAMID_PROGRAM () {
      //TODO: Waiting process
      this.visible = true
      //TODO: Check if the user has the activation code
      this.CHECK_IF_THE_USER_HASE_THE_REGISTERATION_CODE()

      this.$apollo.mutate({
        mutation: JoinPyramidProgram,
        variables: {
          input: {}
        }
      }).then((res) => {
        const success = res.data.joinPyramidProgram.success
        const errors = res.data.joinPyramidProgram.errors
        if (success) {
          this.$q.notify({
              type: 'positive',
              progress: true,
              multiLine: true,
              position: 'top',
              message: 'You are now a marketer'
          })
          //TODO: Make me marketer
          this.amIAMarketer = true
          //TODO: Update the user information
          this.$apollo.query({
            query: GetMyProfileData
          }).then((res) => {
            this.SET_THE_USER_DATA_AFTER_JOIN_THE_PYRAMID_PROGRAME_ACTION(res.data.me)
          })
          //TODO: CLose the waiting
          this.visible = false
        } 
        if (errors) {
          //TODO: CLose the waiting
          this.visible = false
        }
      })
    }
  },
};
</script>
<style lang="scss"></style>
