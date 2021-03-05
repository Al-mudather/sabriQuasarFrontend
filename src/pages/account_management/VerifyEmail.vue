<template>
    <div class="confirm">
        <div class="imaagg">
            <img src="~assets/img/success.png" alt="">
            <p>{{$t('تم تفعيل حسابك يرجى تسجيل الدخول للموقع')}}</p>
            <div class="login">
                <a @click="GotToLoginPage" style="cursor:pointer">
                    <h3>{{$t('دخول')}}</h3>
                </a>
            </div>
        </div>
    </div>
</template>

<script>
import { VerifyUserAccount } from 'src/queries/account_management/mutation/VerifyUserAccount'
export default {
  name: 'Home',
  data () {
    return {
      goToLogin: false
    }
  },
  components: {
  },
  methods: {
    GotToLoginPage () {
      this.$router.push({ name: 'login' })
    }
  },
  watch: {
    '$route.params': {
      handler: function (params) {
        this.$apollo.mutate({
          mutation: VerifyUserAccount,
          variables: {
            token: params.token
          }
        }).then((res) => {
          if (res.data.success) console.log(res.data.success)
        })
      },
      deep: true,
      immediate: true
    }
  }
}
</script>
<style lang="scss">
.confirm{
            display: block;
            margin: 121px 0 0 0;
            .imaagg{
                text-align: center;
                margin: -27px 0 22px 0;
                img{
                    width: 102px;
                    height: 85px;
                    margin: 0 0 26px 0;
                }
                p{
                    color: #949494;
                    font-size: 17px;
                    font-family: 'cairoR';
                }
             }
        }
</style>
