<template>
    <div class="sele edit" @click="buyTheCoursesUsingSmartNode">
        <img src="~assets/img/credit-cards.png" alt="" />
        <h3>Sudanies Bank</h3>
        <q-inner-loading :showing="visible">
            <q-spinner-hourglass size="70px" />
        </q-inner-loading>
    </div>
</template>

<script>
import { CreateSmartNodeCheckout } from 'src/queries/checkout_management/mutation/CreateSmartNodeCheckout';
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
        async buyTheCoursesUsingSmartNode() {
            this.visible = true;
            // TODO: Extract all courses ids
            const courseIds = this.getOrdersIds();
            // TODO: Make the order
            const orderResult = await this.getOrderResult(courseIds);
            // TODO: get the syber pay key from the backend
            // { code for the key here }
            // TODO: Get the stripe url from the backend
            const syberPayPaymentUrl = await this.makeSmartNodePayment(
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

        async makeSmartNodePayment(orderResult) {
            const smartNoderesult = await this.$apollo.mutate({
                mutation: CreateSmartNodeCheckout,
                variables: {
                    card: '',
                    expDate: '',
                    ipin: '',
                    orderId: orderResult.order.pk,
                }
            });
            const smartNodeDetails = smartNoderesult.data.createSmartNodeCheckout;
            console.log('sssssssssssssssssssss')
            console.log(smartNodeDetails)
            console.log('sssssssssssssssssssss')
            if (this.$_.get(smartNodeDetails, "[errors]")) {
                this.visible = false;
                alert(details.errors.nonFieldErrors);
            }

            if (this.$_.get(smartNodeDetails, "[success]")) {
                return smartNodeDetails.paymentUrl;
            }
        }
    }
};
</script>

<style></style>
