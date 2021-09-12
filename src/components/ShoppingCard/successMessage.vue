<template>
    <div class="succses">
        <h3 v-if="!$_.isEmpty(user.fullName)">{{$t('شكرا لك !')}}<span>{{user.fullName}}</span></h3>
        <h3 v-else-if="!$_.isEmpty(user.firstName) && !$_.isEmpty(user.lastName)">{{$t('شكرا لك !')}}<span>{{user.firstName}} {{user.lastName}}</span></h3>
        <h3 v-else>{{$t('شكرا لك !')}}<span>{{user.username.split('@')[0]}}</span></h3>
        <div class="imaagg">
            <img src="~assets/img/success.png" alt="">
            <h2>{{$t('تهانينا لك')}}</h2>
            <!-- <p @click="GO_TO_MY_COURSES_page">{{$t('الأن الكورسات التي قمت بإمتلاكها أصبحت متاحة يمكنك الإطلاع عليها من خلال')}} <span style="coursor: pointer">{{$t('لوحتك التعليمية')}}</span> </p> -->
            <p @click="GO_TO_MY_ORDERS_page">{{$t('يمكنك متابعة حالة طلباتك في حالة الدفع عن طريق الأشعار من')}} <span style="coursor: pointer">{{$t('صفحة طلباتي')}}</span> </p>
            <p @click="GO_TO_MY_COURSES_page">{{$t('او الذهاب الى لوحتك التعليميه في حالة الدفع المباشر لتبدأ التعلم فورا')}} <span style="coursor: pointer">{{$t('لوحتك التعليمية')}}</span> </p>
        </div>
    </div>
</template>

<script>
import { GetMyNotifications } from 'src/queries/notification_management/query/MyNotifications'
import { mapState, mapActions } from 'vuex'

export default {
    name:  "successCartpage",
    apollo: {
        myNotifications: {
            query () {
                return GetMyNotifications
            },

            variables () {
                return {
                    orderBy: ['-id'],
                    type: 'CHECKOUT_DONE',
                    extraData: `<Order ${this.checkoutOrderID}>` 
                }
            },

            result (result) {
                try {
                    if (result.data.myNotifications.edges[0].node.title === 'CHECKOUT_SUCCESS') {
                        this.deleteShoppinCartDataListAction()
                    }

                } catch {
                }

            }
        }
    },

    created () {
        const shoopingProccess = ['cartCourses', 'loginCart', 'paymentData', 'successMessage']
        shoopingProccess.map(process => {
            const name = `[data-cart="${process}"]`
            document.querySelector(name).classList.add('active')
            document.querySelector(name).nextSibling.classList.add('show')
        })
    },

    mounted () {
        const shoopingProccess = ['cartCourses', 'loginCart', 'paymentData', 'successMessage']
        shoopingProccess.map(process => {
            const name = `[data-cart="${process}"]`
            document.querySelector(name).classList.add('active')
            document.querySelector(name).nextSibling.classList.add('show')
        })
        // TODO: If the user pay for the courses , delete the shooping cart data
        // this.deleteShoppinCartDataListAction()
    },

    computed: {
        ...mapState("shoppingCart", ["checkoutOrderID"]),
        ...mapState("authentication", ["user"])
    },


    methods: {
        ...mapActions('shoppingCart', ['deleteShoppinCartDataListAction']),

        GO_TO_MY_COURSES_page () {
            this.$router.push({ name: 'my-courses' })
        },

        GO_TO_MY_ORDERS_page () {
            this.$router.push({ name: 'my-orders' })
        }
    }
}
</script>

<style>

</style>
