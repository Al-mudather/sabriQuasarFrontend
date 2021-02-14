<template>
    <div class="sele edit" @click="buyTheCoursesUsingSyberPay">
        <img src="~assets/img/credit-cards.png" alt="" />
        <h3>SyberPay</h3>
        <q-inner-loading :showing="visible">
            <q-spinner-hourglass size="70px" />
        </q-inner-loading>
    </div>
</template>

<script>
import { CreateNewOrderWithBulkOrderDetails } from "src/queries/order_management/mutation/CreateNewOrderWithBulkOrderDetails";
import { CreateSyberpayCheckout } from 'src/queries/checkout_management/mutation/CreateSyberpayCheckout';
import { StripePublishableKey } from "src/queries/checkout_management/query/StripePublishableKey";
import { mapState } from "vuex";

export default {
    data() {
        return {
            visible: false
        };
    },
    computed: {
        ...mapState("shoppingCart", ["shoppingCartDataList"])
    },
    methods: {
        async buyTheCoursesUsingSyberPay() {
            this.visible = true;
            // TODO: Extract all courses ids
            const courseIds = this.getOrdersIds();
            // TODO: Make the order
            const orderResult = await this.getOrderResult(courseIds);
            // TODO: get the syber pay key from the backend
            // { code for the key here }
            // TODO: Get the stripe url from the backend
            const syberPayPaymentUrl = await this.getSyberPayPaymentUrlFromTheBackend(
                orderResult
            );
            // TODO: Make the payment
            openURL(syberPayPaymentUrl)
            // stripe.redirectToCheckout({
            //     sessionId: syberPayPaymentUrl
            // });
            this.visible = false;
        },

        getOrdersIds() {
            return this.$_.map(this.shoppingCartDataList, "[course][pk]");
        },

        async getOrderResult(courseIds) {
            const result = await this.$apollo.mutate({
                mutation: CreateNewOrderWithBulkOrderDetails,
                variables: {
                    courseIds: courseIds
                }
            });

            const dataObj = result.data.createNewOrderWithBulkOrderDetails;

            if (this.$_.get(dataObj, "[errors]")) {
                this.visible = false;
                alert(dataObj.errors.nonFieldErrors);
            }

            if (this.$_.get(dataObj, "[success]")) {
                return dataObj;
            }
        },

        async getSyberPayPaymentUrlFromTheBackend(orderResult) {
            const syberpayPaymentresult = await this.$apollo.mutate({
                mutation: CreateSyberpayCheckout,
                variables: {
                    orderId: orderResult.order.pk,
                }
            });
            const syberPayDetails = syberpayPaymentresult.data.createSyberpayCheckout;
            if (this.$_.get(syberPayDetails, "[errors]")) {
                this.visible = false;
                alert(details.errors.nonFieldErrors);
            }

            if (this.$_.get(syberPayDetails, "[success]")) {
                return syberPayDetails.paymentUrl;
            }
        }
    }
};
</script>

<style></style>
