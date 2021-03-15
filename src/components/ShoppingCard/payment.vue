<template>
    <div class="msPayment">
        <div class="options">
            <paypal-payment />
            <strip-payment />
            <div class="sele edit" @click="enableSudaniesBank = true">
                <img src="~assets/img/credit-cards.png" alt="" />
                <h3>Sudanies Bank</h3>
            </div>
        </div>
        <!--details Payment-->
        <div class="details" v-if="enableSudaniesBank">
            <!-- <div class="error">
                <h3>
                    <img src="~assets/img/error.png" alt="" />رقم البطاقة غير
                    صحيح أعد المحاولة
                </h3>
            </div>
            <div class="logoPay">
                <img src="~assets/img/discover.png" alt="" />
            </div> -->
            <form>
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
                <div class="row">
                    <div class="col-lg-12 col-xs-12">
                        <div class="inp">
                            <input v-model="card" placeholder="رقم البطاقة">
                        </div>
                    </div>
                    <div class="col-lg-12 col-xs-12 ">
                        <div class="inp">
                            <input v-model="expDate" placeholder="تاريخ الإنتهاء">
                        </div>
                    </div>
                    <div class="col-lg-12 col-xs-12 ">
                        <div class="inp">
                            <input v-model="ipin" placeholder="CCV">
                            <img src="~assets/img/question.png" alt="">
                        </div>
                    </div>
                </div>
                <div class="but" @click="buyTheCoursesUsingSmartNode">
                    <h3><img src="~assets/img/payment.png" alt="">دفـــع</h3>
                </div>
                <q-inner-loading :showing="visible">
                    <q-spinner-hourglass size="70px" />
                </q-inner-loading>
            </form>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import { CreateNewOrderWithBulkOrderDetails } from "src/queries/order_management/mutation/CreateNewOrderWithBulkOrderDetails";
import { CreateSmartNodeCheckout } from 'src/queries/checkout_management/mutation/CreateSmartNodeCheckout';
import stripPayment from 'src/components/ShoppingCard/stripPayment'
import paypalPayment from 'src/components/ShoppingCard/paypalPayment'
// import { openURL } from 'quasar'

export default {
  name:  "paymentCartpage",
  data () {
    return {
        enableSudaniesBank: false,
        visible: false,
        errorMessages: [],
        card: '',
        expDate: '',
        ipin: ''
    }
  },
  components: {
    'strip-payment': stripPayment,
    'paypal-payment': paypalPayment
  },

  mounted () {
    this.$root.$emit('activateShoppingProgress', 'paymentData')
    
    const shoopingProccess = ['cartCourses', 'loginCart', 'paymentData']
    shoopingProccess.map(process => {
        const name = `[data-cart="${process}"]`

        try {
            document.querySelector(name).classList.add('active')
            document.querySelector(name).nextSibling.classList.add('show')
        } catch (error) {
            document.querySelector(name).classList.add('active')
            document.querySelector(name).nextSibling.classList.add('show')
            
        }
    })
  },

  computed: {
    ...mapState('shoppingCart', ['shoppingCartDataList'])
  },

  methods: {
        errorHandler(errorsObj) {
            console.log(errorsObj);
            for (const key in errorsObj) {
                for (const val of errorsObj[key]) {
                    this.errorMessages.push(val.message);
                }
            }
        },

        async buyTheCoursesUsingSmartNode() {
            this.visible = true;
            // TODO: Extract all courses ids
            const courseIds = this.getOrdersIds();
            // TODO: Make the order
            const orderResult = await this.getOrderResult(courseIds);
            // TODO: make the smart node payment
            const smartNodePayment = await this.makeSmartNodePayment(
                orderResult
            );
            console.log('kkkkkkkkkkkkkkkkkkkkkk')
            console.log(smartNodePayment)
            console.log('kkkkkkkkkkkkkkkkkkkkkk')
            if (smartNodePayment) {
                this.enableSudaniesBank = false
                this.$router.push({ name: 'cart-success' })
            }
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

            const dataObj = await result.data.createNewOrderWithBulkOrderDetails;

            if (this.$_.get(dataObj, "[errors]")) {
                this.visible = false;
                this.errorHandler(dataObj.errors)
            }

            if (this.$_.get(dataObj, "[success]")) {
                return dataObj;
            }
        },

        async makeSmartNodePayment(orderResult) {
            const smartNoderesult = await this.$apollo.mutate({
                mutation: CreateSmartNodeCheckout,
                variables: {
                    card: this.card,
                    expDate: this.expDate,
                    ipin: this.ipin,
                    orderId: orderResult.order.pk,
                }
            });
            const smartNodeDetails = await smartNoderesult.data.createSmartNodeCheckout;
            console.log('sssssssssssssssssssss')
            console.log(smartNodeDetails)
            console.log('sssssssssssssssssssss')
            if (this.$_.get(smartNodeDetails, "[errors]")) {
                this.visible = false;
                this.errorHandler(smartNodeDetails.errors)
            }

            if (this.$_.get(smartNodeDetails, "[success]")) {
                return smartNodeDetails;
            }
        }
    }
}
</script>

<style></style>
