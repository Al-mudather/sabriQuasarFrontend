<template>
    <div class="box-pay box-wait">
        <div class="ide" id="#model">
        <div class="tite">
            <h3>ID - <span>{{myOrder.order.pk}}</span></h3>
            <img src="~assets/img/hash.png" alt="">
        </div>
        <div class="chec">
            <h3>شراء</h3>
            <img src="~assets/img/true.png" alt="">
        </div>
        <div class="chec">
            <h3 class="colorr">معالجة</h3>
            <img v-if="myOrder.marketerEndorse" src="~assets/img/true.png" alt="">
            <img v-else src="~assets/img/fulse.png" alt="">
        </div>
        <div class="chec">
            <h3>مكتمل</h3>
            <img v-if="myOrder.doneVerification" src="~assets/img/true.png" alt="">
            <img v-else src="~assets/img/fulse.png" alt="">
        </div>
    </div>
    <div class="viwe">
        <div class="money">
            <h3>المدفوع</h3>
            <!--price-->
            <div class="price">
                <h4>{{myOrder.order.totalAmount}}<span>{{myOrder.order.currency}}</span></h4>
            </div>
        </div>
        <div class="viewpay" v-if="!myOrder.doneVerification">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 313.02 71.79" style="enable-background:new 0 0 313.02 71.79;" xml:space="preserve">
                <g id="Bg">
                    <rect x="-1094.81" y="-761.75" class="Indicator0" style="opacity:0;fill:#FFFFFF;" width="2511" height="1593.05"></rect>
                    <g id="Group_65624" transform="translate(17.292)">
                        <path id="Path_151295" class="Indicator1" style="fill:#FAD25E;" d="M167.86,11.86c-15.82-15.82-41.47-15.82-57.29,0L98.69,23.74
                            C67.93,54.5,26.21,71.79-17.29,71.79h313.02c-43.51,0-85.23-17.28-115.99-48.05L167.86,11.86z"></path>
                    </g>
                </g>
            </svg>
                <!--box-->
                <div class="box">
                <!--<img src="~assets/img/hash.png" alt="#">-->
                <button @click="bill = true"> <img src="~assets/img/eyes.png" alt=""> رؤية اشعار الدفع</button>
            </div>
            
        </div>
    </div>

    <section v-if="bill" class="popay" style="overflow: none; z-index: 9;">
        <div class="clos" style="cursor: pointer;" @click="bill = false">
            <svg xmlns="http://www.w3.org/2000/svg" width="37.333" height="51.431" viewBox="0 0 37.333 51.431">
                <path id="Path_733" data-name="Path 733" d="M2.042-41.265a13.881,13.881,0,0,0-.686-8.254A18.792,18.792,0,0,1,0-56.529v-9.138H7.851c-.129,5.6,2.188,8.745,5.436,10.486a11.388,11.388,0,0,0,10.758,0c3.248-1.741,5.566-4.884,5.436-10.487h7.851v9.138a18.792,18.792,0,0,1-1.356,7.01,13.881,13.881,0,0,0-.686,8.254c.38.83.681,1.5.842,1.925a18.474,18.474,0,0,1,1.2,6.569A18.545,18.545,0,0,1,18.8-14.236h-.261A18.545,18.545,0,0,1,0-32.772a18.474,18.474,0,0,1,1.2-6.569C1.361-39.762,1.662-40.435,2.042-41.265Z" transform="translate(0 65.667)" fill="#fc9685" fill-rule="evenodd"/>
            </svg>
            <img src="~assets/img/closee.png" alt="">
        </div>
        <!--cn-->
        <div class="cn" style="3px 0 0 0">
            <div class="bmg">
            <img class="bank" :src="FORMAT_IMAGE(myOrder.attachment)" alt="">
            </div>
            <!--control-->
            <div class="control">
                <!--bu-->
                <div class="bu" style="cursor: pointer;" @click="CONFIRM_OR_REJECT_TRANSACTION(confirm)">
                <img src="~assets/img/done.png" alt="">
                <h2>تأكيد الدفع</h2>
                </div>
                <!--bu-->
                <div class="bu" style="cursor: pointer;" @click="CONFIRM_OR_REJECT_TRANSACTION(reject)">
                    <img src="~assets/img/cansl.png" alt="">
                    <h2>غير معتمد</h2>
                </div>
                <q-inner-loading :showing="loading">
                    <q-spinner-hourglass color="primary" size="70px" />
                </q-inner-loading>
            </div>
        </div>
    </section>
  </div>
</template>

<script>

export default {
    name: 'transactionOrderDetail',
    data () {
        return {
            bill: false,
            loading: false,
            confirm: {
                marketerEndorse: true,
                retryPlease: false,
            },

            reject: {
                marketerEndorse: false,
                retryPlease: true,
            }
        }
    },
    props:['myOrder'],
    methods: {
        FORMAT_IMAGE (imageUrl) {
            if (process.env.NODE_ENV == 'development') {
                return  `http://localhost:8000/media/${imageUrl}`
                
            } else {
                return location.origin  + `/media/${imageUrl}`
            }
        },

        async CONFIRM_OR_REJECT_TRANSACTION (data) {
            this.loading = true
            const confirm_res = await this.$apollo.mutate({
                mutation: MarketerConfirmAttachmentTransaction,
                variables: {
                    id: this.customerTrans.pk,
                    input: data
                }, 
                refetchQueries: [{ query: AllMarketerAttachmentTransaction }]
                })
            const errors = confirm_res.data.marketerAttachmentTransactionConfirmation.errors
            const success = confirm_res.data.marketerAttachmentTransactionConfirmation.success

            if (success) {
                this.loading = false
                this.bill = false
                this.$q.notify({
                    type: 'positive',
                    position: 'top',
                    progress: true,
                    multiLine: true,
                    message: "The transaction has been confirmed by you"
                })
            } else if (errors) {
                this.loading = false
                this.bill = false
                this.errorHandler(errors)
            }
        },        

    }
}
</script>

<style lang="scss">
@import 'src/assets/css/sass/helpers/_variabels.scss';
@import 'src/assets/css/sass/helpers/_mixins.scss';
@import 'src/assets/css/account.scss';



</style>
