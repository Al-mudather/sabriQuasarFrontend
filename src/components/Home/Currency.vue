<template>
  <section class="currency">
    <div class="container-fluid">
        <div class="row">
            <div class="col-lg-12">
                <div class="switch">
                    <div class="point">
                        <svg xmlns="http://www.w3.org/2000/svg" width="50.46" height="49.977" viewBox="0 0 50.46 49.977">
                            <g id="Group_675" data-name="Group 675" transform="translate(0 0)">
                              <circle id="Ellipse_17" data-name="Ellipse 17" cx="14.5" cy="14.5" r="14.5" transform="translate(11.403 11.186)" fill="#5666b9"/>
                              <path id="Path_953" data-name="Path 953" d="M19.326.623A1.169,1.169,0,0,1,19.254,0c.025-.1-.385,2.334,2.872,2.425,0,0,8.82,2.8,11.783,6.132A18.587,18.587,0,0,1,6.951,34.125a18.7,18.7,0,0,1-5.615-13.2.667.667,0,1,0-1.334,0A20.265,20.265,0,0,0,20.147,41.344,20.38,20.38,0,0,0,22.31.688Z" transform="matrix(0.259, -0.966, 0.966, 0.259, 0, 39.276)" fill="#e5e5e6" fill-rule="evenodd"/>
                            </g>
                          </svg>                                   
                        <img src="~assets/img/exchange.png" alt="">                                         
                    </div>
                    <div class="dropdown hvr-shadow-radial" @click=" showCurrency = !showCurrency ">
                        <h3>{{$t('حدد عملة الشراء')}} </h3>
                        <div class="listt" v-if="showCurrency">
                            <img class="arrow" src="~assets/img/arrow.png" alt="">
                            <ul>
                                <li @click="currencySelectionHandler('SDG')"><img src="~assets/img/sudan.png" data-currency="SDG"  alt="">{{$t('الجنيه السوداني')}}</li>
                                <li @click="currencySelectionHandler('USD')"><img src="~assets/img/united-states .png" data-currency="USD"  alt="">{{$t('الدولار الامريكي')}}</li>
                                <!-- <li @click="currencySelectionHandler('SAR')"><img src="~assets/img/saudi-arabia.png" data-currency="SAR"  alt="">{{$t('الريال السعودي')}}</li> -->
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  </section>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'Currency',
  data () {
    return {
      showCurrency: false,
      options: [
        'USD', 'SDG', 'EUR', 'GBP', 'SAR'
      ]
    }
  },
  methods: {
    ...mapActions('settings', ['setCurrencyAction']),

    currencySelectionHandler (currency) {
      // const name = `[data-cart="${currency}"]`
      this.setCurrencyAction(currency)
      this.$q.notify({
        type: 'positive',
        progress: true,
        multiLine: true,
        position: 'top',
        message: this.$t('تم تغيير العمله الى:') + currency
    })
    }
  }
}
</script>
<style lang="scss">

</style>
