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
              <input id="shar-link" type="text" :value="myPyramidAccount.pyramidCode">
              <button style="cursor: pointer;" type="submit"><q-tooltip>{{message}}</q-tooltip><img src="~assets/img/copyed.png"></button>
            </form>
        </div>
    </div>
  </div>
</template>

<script>
import { MyPyramidAccount } from 'src/queries/pyramid_marketing_management/query/MyPyramidAccount'
import { MyPyramidMarketers } from 'src/queries/pyramid_marketing_management/query/MyPyramidMarketers'
import { copyToClipboard } from 'quasar'

export default {
  name: "MyPyramidParticipants",
  data() {
    return {
      message: this.$t('انسخ الرابط'),
      myPyramidAccount: '',
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
    },
 
    myPyramidAccount: {
      query () {
        return MyPyramidAccount
      },
      result (result) {
        if (!result.loading) {
          this.myPyramidAccount = result.data.myPyramidAccount
        }
      }
    }
  },

  methods: {

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
