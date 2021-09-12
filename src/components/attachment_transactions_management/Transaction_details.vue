<template>
    <section class="popupDet" style="z-index: 999;">
        <div @click="CLOSE_THE_ATTACHEMENTS_DETAILS" class="clos" >
            <svg xmlns="http://www.w3.org/2000/svg" width="37.333" height="51.431" viewBox="0 0 37.333 51.431">
                <path id="Path_733" data-name="Path 733" d="M2.042-41.265a13.881,13.881,0,0,0-.686-8.254A18.792,18.792,0,0,1,0-56.529v-9.138H7.851c-.129,5.6,2.188,8.745,5.436,10.486a11.388,11.388,0,0,0,10.758,0c3.248-1.741,5.566-4.884,5.436-10.487h7.851v9.138a18.792,18.792,0,0,1-1.356,7.01,13.881,13.881,0,0,0-.686,8.254c.38.83.681,1.5.842,1.925a18.474,18.474,0,0,1,1.2,6.569A18.545,18.545,0,0,1,18.8-14.236h-.261A18.545,18.545,0,0,1,0-32.772a18.474,18.474,0,0,1,1.2-6.569C1.361-39.762,1.662-40.435,2.042-41.265Z" transform="translate(0 65.667)" fill="#fc9685" fill-rule="evenodd"/>
            </svg>
            <img src="~assets/img/closee.png" alt="">
        </div>
            <div class="container">
                <div class="row">
                    <div class="col-lg-12">
                        <div class="cn">
                            <table class="table table-hover">
                                <thead>
                                    <tr>
                                        <th scope="col">إسم الكورس</th>
                                        <th scope="col">مقدم الطلب</th>
                                        <th scope="col">رقم الواتساب</th>
                                        <th scope="col">رقم التلجرام</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="detail in customerTrans.order.orderdetailsSet.edges" :key="detail.node.pk">
                                        <th scope="row">{{detail.node.course.title}}</th>
                                        <td>{{customerTrans.order.user.fullName}}</td>
                                        <td>{{customerTrans.order.user.phoneNumber2}}</td>
                                        <td>{{customerTrans.order.user.phoneNumber3}}</td>
                                    </tr>
                                </tbody>
                                </table>
                        </div>
                    </div>
                </div>
            </div>
    </section>
</template>

<script>

export default {
  name: 'TransactionCompleted',
  data () {
    return {
        detail: false
    }
  },
  props:['customerTrans'],
  methods: {
    CLOSE_THE_ATTACHEMENTS_DETAILS () {
        this.$emit('close')   
    }
  }
}
</script>

<style lang="scss">
@import 'src/assets/css/sass/helpers/_variabels.scss';
@import 'src/assets/css/sass/helpers/_mixins.scss';
@import 'src/assets/css/account.scss';

</style>
