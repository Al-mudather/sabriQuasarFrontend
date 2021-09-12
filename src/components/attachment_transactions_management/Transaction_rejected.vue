<template>
  <div>
      <div class="box-pay box-unacceptable">
        <!--inv-->
        <div class="inv">
            <!--box-->
            <div class="box">
                <h2><span>{{customerTrans.order.invoiceNumber}}</span></h2>
                <img src="~assets/img/hash.png" alt="#">
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
            <div @click="detail = true" class="detaii">
              <a href="#">التفاصيل</a>
              <svg xmlns="http://www.w3.org/2000/svg" width="43.415" height="9.957" viewBox="0 0 43.415 9.957">
                  <g id="Group_65624" data-name="Group 65624" transform="translate(17.292)">
                    <path id="Path_151295" data-name="Path 151295" d="M203.919,96.419a5.619,5.619,0,0,1-7.946,0l-1.648-1.647a22.747,22.747,0,0,0-16.086-6.664h43.415a22.752,22.752,0,0,0-16.088,6.664Z" transform="translate(-195.531 -88.107)" fill="#7b86fa"/>
                  </g>
              </svg> 
          </div>
        </div>
        <!--data-->
        <div class="data">
            <img src="~assets/img/cansl.png" alt="">
            <h2>{{label}}</h2>
        </div>
    </div>

    <TransactionDetails v-if="detail" :customerTrans="customerTrans" v-on:close="detail = false"/>

  </div>
</template>

<script>

import TransactionDetails from 'src/components/attachment_transactions_management/Transaction_details.vue'

export default {
  name: 'TransactionRejected',
  data () {
    return {
        detail: false
    }
  },
  props:['customerTrans', 'label'],
  components: {
    TransactionDetails
  }
}
</script>

<style lang="scss">
@import 'src/assets/css/sass/helpers/_variabels.scss';
@import 'src/assets/css/sass/helpers/_mixins.scss';
@import 'src/assets/css/account.scss';

</style>
