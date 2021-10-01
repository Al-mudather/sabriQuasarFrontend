<template>
    <div class="q-ma-lg">
        <div class="text-h4 text-center q-ma-sm" v-if="currency != 'SDG' ">{{$t('ارفق فاتورة الدفع')}}</div>
        <div v-else>
            <div class="text-h4 text-center q-ma-sm">إشعار بنكك</div>
            <div class="text-h6 text-center text-danger" style="font-family:'cairoR'">ملاحظه: يجب كتابة الاسم رباعيا في اشعار بنكك لكي يتم اعتماد الشعار</div>
        </div>
        <file-upload
            imgeSize="4000000"
            :accept="'.png,.jpg, image/*'"
            :label=" currency === 'SDG' ? bankakLabel : othersLabel"
            v-on:File_Handler='paymentImageHandler'
        ></file-upload>
        <q-btn color="red" @click="SEND_THE_PAYMENT" icon-right="send" label="إرسال" />
        <q-inner-loading :showing="visible">
            <q-spinner-hourglass color="primary" size="70px" />
        </q-inner-loading>
    </div>
</template>

<script>
import FileUpload from 'src/components/utils/FileUploader.vue'
import { CreateNewOrderWithBulkOrderDetails } from "src/queries/order_management/mutation/CreateNewOrderWithBulkOrderDetails";
import { UploadAttachmentTransaction } from 'src/queries/checkout_management/mutation/UploadAttachmentTransaction'
import { mapState, mapActions } from "vuex";

export default {
    data() {
        return {
            visible: false,
            bankakBill: '',
            bankakLabel:'إضغط للإرفاق إشعار بنكك',
            othersLabel: this.$t('اضغط للإرفاق فاتورة الدفع'),
        };
    },
    components: { FileUpload },
    computed: {
        ...mapState("shoppingCart", ["shoppingCartDataList"]),
        ...mapState('settings',['currency'])

    },

    methods: {
        ...mapActions('shoppingCart', ['deleteShoppinCartDataListAction']),

        paymentImageHandler (val) {
            this.bankakBill = val
        },

        errorHandler(errorsObj) {
            for (const key in errorsObj) {
                for (const val of errorsObj[key]) {
                    console.log(val)
                    this.$q.notify({
                        type: 'warning',
                        progress: true,
                        multiLine: true,
                        position: 'top',
                        message: val.message
                    })
                }
            }
        },

        getOrdersIds () {
            return this.$_.map(this.shoppingCartDataList, "[course][pk]");
        },

        async getOrderResult (courseIds) {
            try {
                const result = await this.$apollo.mutate({
                    mutation: CreateNewOrderWithBulkOrderDetails,
                    variables: {
                        courseIds: courseIds
                    }
                });
                const dataObj = result.data.createNewOrderWithBulkOrderDetails;
    
    
                if (this.$_.get(dataObj,'[errors]')) {
                    this.visible = false
                    this.errorHandler(dataObj.errors)
                }
    
                if (this.$_.get(dataObj,'[success]')) {
                    return dataObj;
                }
                
            } catch (error) {
                if ( error.message == 'GraphQL error: User already has valid enrollment in the course ...') {
                    this.$q.notify({
                        type: 'warning',
                        progress: true,
                        multiLine: true,
                        position: 'top',
                        // message: error.message,
                        message: "لديك اشتراك مسبق في هذا الكورس"
                    })
                }
            }
        },

        async SEND_THE_PAYMENT () {
            try {
                this.visible = true
                if (this.bankakBill) {
                    // TODO: Extract all courses ids
                    const courseIds = this.getOrdersIds();
                    // TODO: Make the order
                    const orderResult = await this.getOrderResult(courseIds);
                    // TODO: Make payment using bankak
                    const bankakPaymentResult = await this.$apollo.mutate({
                        mutation: UploadAttachmentTransaction,
                        variables: {
                            input: {
                                order: orderResult.order.pk,
                                attachment: this.bankakBill
                            }
                        }
                    });
                    const dataObj = bankakPaymentResult.data.uploadAttachmentTransaction;
                    if (this.$_.get(dataObj,'[errors]')) {
                        this.visible = false
                        this.errorHandler(dataObj.errors)
                    }
        
                    if (this.$_.get(dataObj,'[success]')) {
                        this.visible = false
                        //TODO: 
                        this.deleteShoppinCartDataListAction()
                        //TODO: Go to my orders page
                        this.$router.push({ name: 'cart-success' })
                    }
                } else {
                    this.$q.notify({
                        type: 'negative',
                        progress: true,
                        multiLine: true,
                        position: 'top',
                        message: "You are not allowed to upload an empty data"
                    })
                    this.visible = false
                }
                
            } catch (error) {
                this.visible = false
                if ( error.message == 'GraphQL error: User already has valid enrollment in the course ...') {
                    // console.log('llllllllllllllllllllll')
                    // console.log(error.message)
                    // console.log('llllllllllllllllllllll')
                    this.$q.notify({
                        type: 'warning',
                        progress: true,
                        multiLine: true,
                        position: 'top',
                        // message: error.message,
                        message: "لديك اشتراك مسبق في احد الكورسات اللتي قمت بشرائها, الرجاء قم بشراء كورس لم تمتلكه من قبل"
                    })
                }
                
            }

        }
    }
}
</script>

<style lang="scss">

.q-btn {
    &> span {
        margin-right: 0 !important;
        margin-left: 0 !important;
        &> span {
            margin-right: 0 !important;
            margin-left: 0 !important;
        }
    }
}

.q-icon {
    margin-left: 0 !important;
    margin-right: 0.3rem;

}
</style>
