<template>
  <div>
    <div class="box-pay box-wait">
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
            <img src="~assets/img/wait.png" alt="">
            <h2>في إنتظار المعالجة</h2>
        </div>
    </div>

    <section v-if="detail" class="popupDet" style="z-index: 999;">
        <div @click="detail = false" class="clos" >
            <svg xmlns="http://www.w3.org/2000/svg" width="37.333" height="51.431" viewBox="0 0 37.333 51.431">
                <path id="Path_733" data-name="Path 733" d="M2.042-41.265a13.881,13.881,0,0,0-.686-8.254A18.792,18.792,0,0,1,0-56.529v-9.138H7.851c-.129,5.6,2.188,8.745,5.436,10.486a11.388,11.388,0,0,0,10.758,0c3.248-1.741,5.566-4.884,5.436-10.487h7.851v9.138a18.792,18.792,0,0,1-1.356,7.01,13.881,13.881,0,0,0-.686,8.254c.38.83.681,1.5.842,1.925a18.474,18.474,0,0,1,1.2,6.569A18.545,18.545,0,0,1,18.8-14.236h-.261A18.545,18.545,0,0,1,0-32.772a18.474,18.474,0,0,1,1.2-6.569C1.361-39.762,1.662-40.435,2.042-41.265Z" transform="translate(0 65.667)" fill="#fc9685" fill-rule="evenodd"/>
            </svg>
            <img src="~assets/img/closee.png" alt="">
        </div>
        <!--cn-->
            <div class="container">
                <div class="row">
                    <div class="col-lg-12">
                        <div class="cn">
                            <table class="table table-hover">
                                <thead>
                                    <tr>
                                        <th scope="col">إسم الكورس</th>
                                        <th scope="col">مقدم الطلب</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="detail in customerTrans.order.orderdetailsSet.edges" :key="detail.node.pk">
                                        <th scope="row">{{detail.node.course.title}}</th>
                                        <td>{{customerTrans.order.user.email}}</td>
                                    </tr>
                                </tbody>
                                </table>
                        </div>
                    </div>
                </div>
            </div>
    </section>
  </div>
</template>

<script>

export default {
  name: 'TransactionUnderProcessing',
  data () {
    return {
        detail: false
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
