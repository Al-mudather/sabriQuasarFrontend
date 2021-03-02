<template>
    <div class="succses">
        <h3>شكرا لك !<span>هنـاء عثمان</span></h3>
        <div class="imaagg">
            <img src="~assets/img/success.png" alt="">
            <h2>تهانينا لك</h2>
            <p @click="goToMyCourses">الأن الكورسات التي قمت بإمتلاكها أصبحت متاحة يمكنك الإطلاع عليها من خلال <span style="coursor: pointer">لوحتك التعليمية</span> </p>
        </div>
    </div>
</template>

<script>
import { GetMyNotifications } from 'src/queries/notification_management/query/MyNotifications'
import { mapState, mapActions } from 'vuex'

export default {

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

    computed: {
        ...mapState("shoppingCart", ["checkoutOrderID"])
    },


    methods: {
        ...mapActions('shoppingCart', ['deleteShoppinCartDataListAction']),

        goToMyCourses () {
            this.$router.push({ name: 'my-courses' })
        }
    },

    mounted () {
        // TODO: If the user pay for the courses , delete the shooping cart data
        // this.deleteShoppinCartDataListAction()
    }
}
</script>

<style>

</style>
