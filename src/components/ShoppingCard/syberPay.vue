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
/**
 * Cart/checkout feature types for the Syberpay component. The 'syberpay'
 * PaymentProvider variant is kept in the union for UI parity; no
 * CreateSyberpayCheckout / CaptureSyberpayCheckout Result/Vars aliases are
 * exported from src/features/cart/types.ts yet (see TODO there).
 *
 * @typedef {import('src/features/cart/types').CartEntry} CartEntry
 * @typedef {import('src/features/cart/types').PaymentProvider} PaymentProvider
 */
import { CreateNewOrderWithBulkOrderDetails } from "src/queries/order_management/mutation/CreateNewOrderWithBulkOrderDetails";
import { CreateSyberpayCheckout } from 'src/queries/checkout_management/mutation/CreateSyberpayCheckout';
import { storeToRefs } from "pinia";
import { useCartStore } from "src/stores/cart";
import { apolloClient } from "src/apollo/client";
import { openURL } from "quasar";

export default {
    setup () {
        const cart = useCartStore();
        const { shoppingCartDataList } = storeToRefs(cart);
        return { cart, shoppingCartDataList };
    },
    data() {
        return {
            visible: false
        };
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
            const result = await apolloClient.mutate({
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
            const syberpayPaymentresult = await apolloClient.mutate({
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
