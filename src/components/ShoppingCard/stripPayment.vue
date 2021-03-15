<template>
    <div class="sele edit" @click="buyTheCoursesUsingStripe">
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
        <img src="~assets/img/discover.png" alt="" />
        <img src="~assets/img/visa.png" alt="" />
        <q-inner-loading :showing="visible">
            <q-spinner-hourglass size="70px" />
        </q-inner-loading>
    </div>
</template>

<script>
import { CreateNewOrderWithBulkOrderDetails } from "src/queries/order_management/mutation/CreateNewOrderWithBulkOrderDetails";
import { CreateStripeCheckout } from "src/queries/checkout_management/mutation/CreateStripeCheckout";
import { StripePublishableKey } from "src/queries/checkout_management/query/StripePublishableKey";
import { mapState, mapActions } from "vuex";

export default {
    data () {
        return {
            errorMessages: [],
            visible: false
        }
    },
    computed: {
        ...mapState("shoppingCart", ["shoppingCartDataList"])
    },
    methods: {
        ...mapActions('shoppingCart', ['setSaveCheckoutOrderIDAction']),
        errorHandler(errorsObj) {
            console.log(errorsObj);
            for (const key in errorsObj) {
                for (const val of errorsObj[key]) {
                    this.errorMessages.push(val.message);
                }
            }
        },
        async buyTheCoursesUsingStripe () {
            this.visible = true
            // TODO: Extract all courses ids
            const courseIds = this.getOrdersIds();
            // TODO: Make the order
            const orderResult = await this.getOrderResult(courseIds);
            // TODO: Save the order result to the store for the success checkout
            this.setSaveCheckoutOrderIDAction(orderResult.order.pk)
            // TODO: Get the stripe key from the backend
            const stripKey = await this.getStripeKeyFromTheBackend();
            // TODO: Intialize the stripe objct with strip key to make the payment
            const stripe = this.$Stripe(stripKey);
            // TODO: Get the stripe url from the backend
            const stripPaymentUrl = await this.getStripPaymentUrlFromTheBackend(
                orderResult
            );
            // TODO: Make the payment
            stripe.redirectToCheckout({
                sessionId: stripPaymentUrl
            })
            this.visible = false
        },

        getOrdersIds () {
            return this.$_.map(this.shoppingCartDataList, "[course][pk]");
        },

        async getOrderResult (courseIds) {
            const result = await this.$apollo.mutate({
                mutation: CreateNewOrderWithBulkOrderDetails,
                variables: {
                    courseIds: courseIds
                }
            });

            const dataObj = result.data.createNewOrderWithBulkOrderDetails;

            if (this.$_.get(dataObj,'[errors]')) {
                this.visible = false
                console.log('kkkkkkkkkkkkkkk')
                console.log(dataObj.errors)
                console.log('kkkkkkkkkkkkkkk')
                this.errorHandler(dataObj.errors)
                // alert(dataObj.errors.nonFieldErrors);
            }

            if (this.$_.get(dataObj,'[success]')) {
                return dataObj;
            }
        },

        async getStripeKeyFromTheBackend () {
            const stripeKeyResult = await this.$apollo.query({
                query: StripePublishableKey
            });

            return JSON.parse(
                this.$_.get(stripeKeyResult, "[data][stripePublishableKey]")
            ).publisableKey;
        },

        async getStripPaymentUrlFromTheBackend (orderResult) {
            const stripPaymentresult = await this.$apollo.mutate({
                mutation: CreateStripeCheckout,
                variables: {
                    orderId: orderResult.order.pk,
                    currency: 'SAR',
                    successUrl: location.origin + "/#/cart/success",
                    cancelUrl: location.origin + "/#/cart/cancel"
                }
            });
            const stripDetails = stripPaymentresult.data.createStripeCheckout;
            if (this.$_.get(stripDetails,'[errors]')) {
                this.visible = false
                this.errorHandler(dataObj.errors)
            }

            if (this.$_.get(stripDetails,'[success]')) {
                return stripDetails.paymentUrl;
            }
        }
    }
};
</script>

<style></style>
