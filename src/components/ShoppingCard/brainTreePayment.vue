<template>
    <div>
        <!-- <div id="paypal-button-container"></div>
        <div class="sele" v-show="btnVisible" @click="buyTheCoursesUsingBraintree">
            <img src="~assets/img/paypal.png"  alt="" />
        </div> -->
        <v-braintree
        class="q-ma-md"
            :authorization="braintreeClientToken"
            @success="START_THE_PAYMENT_AFTER_GETING_THE_CLIENT_TOKEN"
            @error="onError"
        >
            <template v-slot:button="slotProps">
                <div>
                    <q-btn @click="slotProps.submit" label="Pay" color="success" />
                </div>
            </template>
        </v-braintree>
        <q-inner-loading :showing="visible">
            <q-spinner-hourglass color="primary" size="70px" />
        </q-inner-loading>
    </div>
</template>

<script>
import { CaptureBraintreeCheckout } from 'src/queries/checkout_management/mutation/CaptureBraintreeCheckout.js'



import { mapState, mapActions } from "vuex";

export default {

    data () {
        return {
            visible: false,
            btnVisible: true
        };
    },

    computed: {
        ...mapState("shoppingCart", ["shoppingCartDataList", "braintreeClientToken", "orderData"])
    },

    methods: {
        ...mapActions('shoppingCart', [
            "SET_ORDER_DATA_Action"
        ]),
        errorHandler(errorsObj) {
            for (const key in errorsObj) {
                for (const val of errorsObj[key]) {
                    this.$q.notify({
                        type: 'warning',
                        progress: true,
                        multiLine: true,
                        position: 'top',
                        message: val.PaymentUrl
                    })
                }
            }
        },
        

        async START_THE_PAYMENT_AFTER_GETING_THE_CLIENT_TOKEN (payload) {
            const braintreePaymentresult = await this.$apollo.mutate({
                mutation: CaptureBraintreeCheckout,
                variables: {
                    orderId: this.orderData.order.pk,
                    nonce: payload.nonce
                }
            });

            let success = braintreePaymentresult.data.captureBraintreeCheckout.success;
            let errors = braintreePaymentresult.data.captureBraintreeCheckout.errors;

            if (success) {
                //TODO: Delete the order
                this.SET_ORDER_DATA_Action(null)
                //TODO: Go to the Success page
                this.$router.push({ name: 'cart-success' })
            }

            if (errors) {
                //TODO:Show the errors
                this.errorHandler(errors)
            }
        },
        onError () {},

        
    }
};
</script>

<style></style>
