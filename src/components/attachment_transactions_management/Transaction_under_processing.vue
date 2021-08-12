<template>
  <div class="box-pay box-wait">
      <!--inv-->
      <div class="inv">
          <!--box-->
          <div class="box">
              <h2><span>{{customerTrans.order.invoiceNumber}}</span></h2>
              <img src="~assets/img/hash.png" alt="#">
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
              viewBox="0 0 313.02 71.79" style="enable-background:new 0 0 313.02 71.79;" xml:space="preserve">
              <g id="Bg">
                  <rect x="-1094.81" y="-761.75" class="Indicator0" style="opacity:0;fill:#FFFFFF;" width="2511" height="1593.05"/>
                  <g id="Group_65624" transform="translate(17.292)">
                      <path id="Path_151295" class="Indicator1" style="fill:#FAD25E;" d="M167.86,59.92c-15.82,15.82-41.47,15.82-57.29,0L98.69,48.05C67.93,17.28,26.21,0-17.29,0
                          h313.02c-43.51,0-85.23,17.28-115.99,48.05L167.86,59.92z"/>
                  </g>
              </g>
          </svg>
      </div>
      <!--data-->
      <div class="data">
          <img src="~assets/img/wait.png" alt="">
          <h2>في إنتظار المعالجة</h2>
      </div>
  </div>
</template>

<script>

export default {
  name: 'TransactionUnderProcessing',
  data () {
    return {
    }
  },
  props:['customerTrans']
}
</script>

<style lang="scss">
@import 'src/assets/css/sass/helpers/_variabels.scss';
@import 'src/assets/css/sass/helpers/_mixins.scss';
@import 'src/assets/css/account.scss';

</style>
