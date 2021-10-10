<template>
  <div> 
    <div class="harm">
      <img src="~assets/img/harm.png" alt="">
    </div>
    <div class="conten" style="z-index: 2;">
        <h3>{{$t('عدد المسوقين في شبكتي التسويقيه')}}</h3>
        <span>{{myPyramidMarketersCount}}</span>
        <div class="share">
            <form @submit="CopyTheLinkHandler($event)">
              <input id="shar-link" type="text" :value="myMarketingCode">
              <button style="cursor: pointer;" type="submit"><q-tooltip>{{message}}</q-tooltip><img src="~assets/img/copyed.png"></button>
            </form>
        </div>
    </div>
  </div>
</template>

<script>
import { MyPyramidMarketers } from 'src/queries/pyramid_marketing_management/query/MyPyramidMarketers'
import { copyToClipboard } from 'quasar'
import { mapActions, mapState } from "vuex";
export default {
  name: "MyPyramidParticipants",
  data() {
    return {
      message: this.$t('انسخ الرابط'),
      // myMarketingCode: '',
      myPyramidMarketersCount: 0.0
    };
  },
  apollo: {
    myPyramidMarketers: {
      query () {
        return MyPyramidMarketers
      },
      result (result) {
        if (!result.loading) {
          this.myPyramidMarketersCount = result.data.myPyramidMarketers
        }
      }
    }
  },

  computed: {
    ...mapState('pyramidManagement', ['myMarketingCode']),
  },

  // async mounted () {
  //   //TODO: Get my marketing code
  //   const res = await this.GET_MY_MARKETING_CODE_ACCOUNT_ACTION()
  //   this.myMarketingCode = res
  // },

  methods: {
    // ...mapActions('pyramidManagement', ['GET_MY_MARKETING_CODE_ACCOUNT_ACTION']),

    CopyTheLinkHandler(e) {
      e.preventDefault();

      let copyText = document.getElementById("shar-link");

      /* Select the text field */
      copyText.focus();
      copyText.select();

      copyToClipboard(copyText.value)
        .then(() => {
          // success!
          this.message = this.$t('تم النسخ')
          this.$q.notify({
              type: 'positive',
              progress: true,
              multiLine: true,
              position: 'top',
              message: this.$t('تم النسخ')
          })

        })
        .catch((e) => {
          // fail
        })
    },
  }
};
</script>

<style lang="scss">
</style>
