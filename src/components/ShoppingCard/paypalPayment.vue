<template>
    <div>
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
            btnVisible: true
        };
    },

    computed: {
        ...mapState("shoppingCart", ["shoppingCartDataList"])
    },

    methods: {
        async buyTheCoursesUsingPaypal () {
            this.visible = true
            this.btnVisible = false
            // console.log('lllllllllllllllllllllll')          
            // console.log('chart')          
            // console.log('lllllllllllllllllllllll')
            try {
                const courseIds = this.getOrdersIds();
                const orderResult = await this.getOrderResult(courseIds);
                const paypalPaymentUrl = await this.getpaypalPaymentUrlFromTheBackend(
                    orderResult
                );
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
                        console.log('kkkkkkkkkkkkkkkkkkkkk')
                        console.log(data)
                        console.log('kkkkkkkkkkkkkkkkkkkkk')
                        const paypalResult = await this.$apollo.mutate({
                            mutation: CapturePaypalCheckout,
                            variables: {
                                orderId: data.orderID
                            }
                        });
                        console.log('kkkkkkkkkkkkkkkkkkkkk')
                        console.log(paypalResult)
                        console.log('kkkkkkkkkkkkkkkkkkkkk')
                        // return fetch('/demo/checkout/api/paypal/order/' + data.orderID + '/capture/', {
                        //     method: 'post'
                        // }).then(function(res) {
                        //     return res.json();
                        // }).then(function(orderData) {
                        //     // Three cases to handle:
                        //     //   (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
                        //     //   (2) Other non-recoverable errors -> Show a failure message
                        //     //   (3) Successful transaction -> Show confirmation or thank you

                        //     // This example reads a v2/checkout/orders capture response, propagated from the server
                        //     // You could use a different API or structure for your 'orderData'
                        //     var errorDetail = Array.isArray(orderData.details) && orderData.details[0];

                        //     if (errorDetail && errorDetail.issue === 'INSTRUMENT_DECLINED') {
                        //         return actions.restart(); // Recoverable state, per:
                        //         // https://developer.paypal.com/docs/checkout/integration-features/funding-failure/
                        //     }

                        //     if (errorDetail) {
                        //         var msg = 'Sorry, your transaction could not be processed.';
                        //         if (errorDetail.description) msg += '\n\n' + errorDetail.description;
                        //         if (orderData.debug_id) msg += ' (' + orderData.debug_id + ')';
                        //         return alert(msg); // Show a failure message
                        //     }

                        //     // Show a success message
                        //     alert('Transaction completed by ' + orderData.payer.name.given_name);
                        // });
                    }

                }).render('#paypal-button-container');

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
                console.log('lllllllllllllllllll')
                console.log(error)
                console.log('lllllllllllllllllll')
                this.visible = false
                this.btnVisible = true
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
                console.log('gggggggggggggggggggg')
                console.log(dataObj)
                console.log('gggggggggggggggggggg')
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
                alert(details.errors.nonFieldErrors);
            }

            if (this.$_.get(paypalDetails, "[success]")) {
                return paypalDetails.paymentUrl;
            }
        }
    }
};
</script>

<style></style>
