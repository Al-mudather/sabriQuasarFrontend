<template>
    <div class="sele" @click="buyTheCoursesUsingPaypal">
        <img src="~assets/img/paypal.png" alt="" />
        <q-inner-loading :showing="visible">
            <q-spinner-hourglass size="70px" />
        </q-inner-loading>
    </div>
</template>

<script>
import { CreateNewOrderWithBulkOrderDetails } from "src/queries/order_management/mutation/CreateNewOrderWithBulkOrderDetails";
import { mapState } from "vuex";

export default {

    data () {
        return {
            visible: false
        };
    },

    computed: {
        ...mapState("shoppingCart", ["shoppingCartDataList"])
    },

    methods: {
        async buyTheCoursesUsingPaypal () {
            this.visible = true;
            // TODO: Extract all courses ids
            const courseIds = this.getOrdersIds();
            // TODO: Make the order
            const orderResult = await this.getOrderResult(courseIds);
            // TODO: get the paypal key from the backend
            // { code for the key here }
            // TODO: Get the paypal url from the backend
            const paypalPaymentUrl = await this.getpaypalPaymentUrlFromTheBackend(
                orderResult
            );
            // TODO: Make the payment
            openURL(paypalPaymentUrl);

            this.visible = false;
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

            if (this.$_.get(dataObj, "[errors]")) {
                this.visible = false;
                alert(dataObj.errors.nonFieldErrors);
            }

            if (this.$_.get(dataObj, "[success]")) {
                return dataObj;
            }
        },

        async getpaypalPaymentUrlFromTheBackend (orderResult) {
            // TODO: Get the paypal url
            const paypalPaymentresult = await this.$apollo.mutate({
                mutation: CreateSyberpayCheckout,
                variables: {
                    orderId: orderResult.order.pk
                }
            });
            const paypalDetails =
                paypalPaymentresult.data.createSyberpayCheckout;
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
