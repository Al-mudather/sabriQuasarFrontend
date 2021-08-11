<template>
  <div class="data">
    <img src="~assets/img/mgl.png" alt="">
    <h2>معلقه</h2>
    <!--money-->
    <div class="money">
        <h3>المدفوع</h3>
        <!--price-->
        <div class="price">
            <h4>1,588<span>USD</span></h4>
            <!-- <h4>{{customerTrans.invoiceNumber}}</h4> -->
        </div>
    </div>
    <!--viewpay-->
    <div class="viewpay">
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
            viewBox="0 0 313.02 71.79" style="enable-background:new 0 0 313.02 71.79;" xml:space="preserve">
            <!-- <style type="text/css">
                .Indicator0{opacity:0;fill:#FFFFFF;}
                .Indicator1{fill:#FAD25E;}
            </style> -->
            <g id="Bg">
                <rect x="-1094.81" y="-761.75" class="Indicator0" width="2511" height="1593.05"/>
                <g id="Group_65624" transform="translate(17.292)">
                    <path id="Path_151295" class="Indicator1" d="M167.86,11.86c-15.82-15.82-41.47-15.82-57.29,0L98.69,23.74
                        C67.93,54.5,26.21,71.79-17.29,71.79h313.02c-43.51,0-85.23-17.28-115.99-48.05L167.86,11.86z"/>
                </g>
            </g>
        </svg>
          <!--box-->
          <div class="box">
            <h2>إشعار الدفع</h2>
        </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'TransactionHanged',
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
