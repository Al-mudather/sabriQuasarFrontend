<template>
    <div>
        <div
            class=""
            style="text-align:left"
            v-if="errorMessages.length > 0"
        >
            Please fix these <strong>error first</strong>
            <ul>
                <li
                    v-for="(message, index) in errorMessages"
                    :key="index"
                >
                    {{ message }}<br />
                </li>
            </ul>
        </div>
        <div id="paypal-button-container"></div>
        <div class="sele" v-show="btnVisible" @click="buyTheCoursesUsingPaypal">
            <img src="~assets/img/paypal.png"  alt="" />
        </div>
        <q-inner-loading :showing="visible">
            <q-spinner-hourglass color="primary" size="70px" />
        </q-inner-loading>
    </div>
</template>

<script>
import { CreateNewOrderWithBulkOrderDetails } from "src/queries/order_management/mutation/CreateNewOrderWithBulkOrderDetails";
import { PaypalPublishableKey } from 'src/queries/checkout_management/query/PaypalPublishableKey'
import { CreatePaypalCheckout } from 'src/queries/checkout_management/mutation/CreatePaypalCheckout'
import { CapturePaypalCheckout } from 'src/queries/checkout_management/mutation/CapturePaypalCheckout'


import { mapState } from "vuex";

export default {

    data () {
        return {
            visible: false,
            errorMessages: [],
            btnVisible: true
        };
    },

    computed: {
        ...mapState("shoppingCart", ["shoppingCartDataList"])
    },

    methods: {
        errorHandler(errorsObj) {
            console.log(errorsObj);
            for (const key in errorsObj) {
                for (const val of errorsObj[key]) {
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

        async buyTheCoursesUsingPaypal () {
            this.visible = true
            this.btnVisible = false
            this.errorMessages = []

            try {
                const courseIds = this.getOrdersIds();

                const orderResult = await this.getOrderResult(courseIds);

                const paypalPaymentUrl = await this.getpaypalPaymentUrlFromTheBackend(
                    orderResult
                );

                // window.setTimeout( () =>{
                    paypal.Buttons({

                    // Call your server to set up the transaction
                    createOrder: async (data, actions) => {
                        
                        return paypalPaymentUrl

                        // return fetch('/demo/checkout/api/paypal/order/create/', {
                        //     method: 'post'
                        // }).then(function(res) {
                        //     return res.json();
                        // }).then(function(orderData) {
                        //     return orderData.id;
                        // });
                    },

                    // Call your server to finalize the transaction
                    onApprove: async (data, actions) => {

                        const paypalResult = await this.$apollo.mutate({
                            mutation: CapturePaypalCheckout,
                            variables: {
                                orderId: data.orderID
                            }
                        });

                        if (paypalResult.data.capturePaypalCheckout.success) {
                            this.$router.push({ name: 'cart-success' })
                        }
                        
                    }

                }).render('#paypal-button-container');
                // }, 5000);
               

                // this.visible = true;
                // TODO: Extract all courses ids
                // const courseIds = this.getOrdersIds();
                // // TODO: Make the order
                // const orderResult = await this.getOrderResult(courseIds);
                // // TODO: get the paypal key from the backend
                // const paypalKey = await this.getPaypalKeyFromTheBackend();
                // // TODO: Get the paypal url from the backend
                // const paypalPaymentUrl = await this.getpaypalPaymentUrlFromTheBackend(
                //     orderResult
                // );
                // // TODO: Make the payment
                // openURL(paypalPaymentUrl);

                this.visible = false;
            } catch (error) {
                this.visible = false
                this.btnVisible = true
                if ( (error.message === 'Network error: Network Error') || (error.message === 'paypal is not defined')) {
                    this.$q.notify({
                        type: 'warning',
                        progress: true,
                        multiLine: true,
                        position: 'top',
                        message: 'انت غير متصل بالانترنت, قم بالاتصال و اعد تحميل الصفحه'
                    })
                }
            }         
            
        },

        getOrdersIds () {
            return this.$_.map(this.shoppingCartDataList, "[course][pk]");
        },

        async getPaypalKeyFromTheBackend () {
            const paypalKeyResult = await this.$apollo.query({
                query: PaypalPublishableKey
            });

            return JSON.parse(
                this.$_.get(paypalKeyResult, "[data][paypalPublishableKey]")
            ).publisableKey;
        },

        async getOrderResult (courseIds) {
            const result = await this.$apollo.mutate({
                mutation: CreateNewOrderWithBulkOrderDetails,
                variables: {
                    courseIds: courseIds
                }
            });

            const dataObj = result.data.createNewOrderWithBulkOrderDetails;

            if (this.$_.get(dataObj, "[errors]")) {
                this.visible = false;
                this.errorHandler(dataObj.errors)
                // alert(dataObj.errors.nonFieldErrors);
            }

            if (this.$_.get(dataObj, "[success]")) {
                return dataObj;
            }
        },

        async getpaypalPaymentUrlFromTheBackend (orderResult) {
            // TODO: Get the paypal url
            const paypalPaymentresult = await this.$apollo.mutate({
                mutation: CreatePaypalCheckout,
                variables: {
                    orderId: orderResult.order.pk
                }
            });
            const paypalDetails =
                paypalPaymentresult.data.createPaypalCheckout;
            if (this.$_.get(paypalDetails, "[errors]")) {
                this.visible = false;
            }

            if (this.$_.get(paypalDetails, "[success]")) {
                return paypalDetails.paymentUrl;
            }
        }
    }
};
</script>

<style></style>
