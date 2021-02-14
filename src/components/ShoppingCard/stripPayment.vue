<template>
    <div class="sele edit active" @click="buyTheCoursesUsingStripe">
        <img src="~assets/img/discover.png" alt="" />
        <img src="~assets/img/visa.png" alt="" />
    </div>
</template>

<script>
import { CreateNewOrderWithBulkOrderDetails } from "src/queries/order_management/mutation/CreateNewOrderWithBulkOrderDetails";
import { CreateStripeCheckout } from "src/queries/checkout_management/mutation/CreateStripeCheckout";
import { StripePublishableKey } from "src/queries/checkout_management/query/StripePublishableKey";
import { mapState } from "vuex";

export default {
    computed: {
        ...mapState("shoppingCart", ["shoppingCartDataList"])
    },
    methods: {
        async buyTheCoursesUsingStripe () {
            // TODO: Extract all courses ids
            const courseIds = this.getOrdersIds();
            // TODO: Make the order
            const orderResult = await this.getOrderResult(courseIds);
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
            });
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
                alert(dataObj.errors.nonFieldErrors);
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
                    successUrl: location.origin + "/cart/success",
                    cancelUrl: location.origin + "/cart/cancel"
                }
            });
            const stripDetails = stripPaymentresult.data.createStripeCheckout;
            if (this.$_.get(stripDetails,'[errors]')) {
                alert(details.errors.nonFieldErrors);
            }

            if (this.$_.get(stripDetails,'[success]')) {
                return stripDetails.paymentUrl;
            }
        }
    }
};
</script>

<style></style>
