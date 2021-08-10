<template>
    <div class="msPayment">
        <div class="text-h5">
            إختر وسيلة الدفع اللتي تناسبك
        </div>
        <div class="options">
            <paypal-payment v-if=" currency != 'SDG' "/>
            <div v-if=" currency != 'SDG'" class="sele edit" @click="enableBankakPayment = true">
                <img src="~assets/img/bankk.png" alt="" />
                <h3>الدفع عن طريق بنكك</h3>
            </div>
            <div v-if=" currency != 'SDG'" class="sele edit" @click="enableSudaniesBank = true">
                <img src="~assets/img/credit-cards.png" alt="" />
                <h3>Sudanies Bank</h3>
            </div>
        </div>
        <bankak-payment v-if="enableBankakPayment"/>
        <!--details Payment-->
        <div class="details q-mt-md" v-if="enableSudaniesBank || currency == 'SDG' ">
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
                        <div class="">
                            <q-input
                                rounded
                                outlined
                                v-model="card"
                                mask="#### #### #### ####"
                                fill-mask="#"
                                hint="card number: #### #### #### ####"
                                label="card number"
                                :rules="[
                                    val => !!val || '* Required',
                                    val => val.length >= 14 || 'You must inter 14 numbers at least',
                                ]"
                            />
                        </div>
                    </div>
                    <div class="col-lg-12 col-xs-12 ">
                        <div class="">
                            <q-input
                                rounded
                                outlined
                                mask="##/####"
                                hint="expiration date: 03/2021"
                                v-model="expDate"
                                label="تاريخ الإنتهاء"
                            />
                        </div>
                    </div>
                    <div class="col-lg-12 col-xs-12 ">
                        <div class="">
                            <q-input
                                rounded 
                                outlined 
                                v-model="ipin" 
                                label="ipin"
                                mask="####"
                                fill-mask
                                hint="ipin: ####"
                            />
                            <!-- <img src="~assets/img/question.png" alt=""> -->
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
        <div class="total">
            <div class="price">
                <h2>{{$t('المجمــوع')}}</h2>
                <h3>{{ totalPaymentFees }}<span>{{currency}}</span></h3>
                <!-- <h3><span>{{currency}}</span></h3> -->
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import { CreateNewOrderWithBulkOrderDetails } from "src/queries/order_management/mutation/CreateNewOrderWithBulkOrderDetails";
import { CreateSmartNodeCheckout } from 'src/queries/checkout_management/mutation/CreateSmartNodeCheckout';
import paypalPayment from 'src/components/ShoppingCard/paypalPayment'
import bankakPayment from 'src/components/ShoppingCard/bankakPay'

export default {
  name:  "paymentCartpage",
  data () {
    return {
        enableSudaniesBank: false,
        enableBankakPayment: false,
        visible: false,
        errorMessages: [],
        card: '',
        expDate: '',
        ipin: ''
    }
  },
  components: {    
    'paypal-payment': paypalPayment,
    'bankak-payment': bankakPayment
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
    ...mapState('shoppingCart', ['shoppingCartDataList', 'totalPaymentFees']),
    ...mapState('settings',['currency'])
  },

  methods: {
        errorHandler(errorsObj) {
            console.log(errorsObj);
            for (const key in errorsObj) {
                for (const val of errorsObj[key]) {
                    if (typeof val.message == 'object') {
                        this.$q.notify({
                            type: 'warning',
                            progress: true,
                            multiLine: true,
                            position: 'top',
                            message: val.message.msg
                        })
                    } else {
                        this.$q.notify({
                            type: 'warning',
                            progress: true,
                            multiLine: true,
                            position: 'top',
                            message: val.message
                        })
                    }
                    // this.errorMessages.push(val.message);
                }
            }
        },

        async buyTheCoursesUsingSmartNode() {
            this.visible = true;
            if (this.expDate < 7) {
                this.visible = false;
                this.$q.notify({
                        type: 'negative',
                        progress: true,
                        multiLine: true,
                        position: 'top',
                        message: 'Please add the expiration data'
                    })
            } else {
                // TODO: Extract all courses ids
                const courseIds = this.getOrdersIds();
                // TODO: Make the order
                const orderResult = await this.getOrderResult(courseIds);
                // TODO: make the smart node payment
                const smartNodePayment = await this.makeSmartNodePayment(
                    orderResult
                );
                if (smartNodePayment) {
                    this.enableSudaniesBank = false
                    this.$router.push({ name: 'cart-success' })
                }
                this.visible = false;
            }
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

        FORMAT_EXPIRATION_DATE () {
            try {
                let day= this.expDate.split('/')[0]
                let year= this.expDate.split('/')[1]
                let last2digits;

                last2digits = year.substr(2,2)
    
                return String(day) + String(last2digits)

            } catch {
                return ''
            }
        },

        async makeSmartNodePayment(orderResult) {
            const smartNoderesult = await this.$apollo.mutate({
                mutation: CreateSmartNodeCheckout,
                variables: {
                    card: this.card,
                    expDate: this.FORMAT_EXPIRATION_DATE(),
                    ipin: this.ipin,
                    orderId: orderResult.order.pk,
                }
            });
            const smartNodeDetails = await smartNoderesult.data.createSmartNodeCheckout;
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

<style lang="scss">
.q-field__label {
    margin-left: 1rem;
}

.q-field {
    margin-right: 0rem;
    direction: initial;
}

.q-field__native {
    margin-right: 2rem;
}
</style>
