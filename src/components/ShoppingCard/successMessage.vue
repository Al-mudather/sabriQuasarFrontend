<template>
    <div class="succses">
        <h3>شكرا لك !<span>هنـاء عثمان</span></h3>
        <div class="imaagg">
            <img src="~assets/img/success.png" alt="">
            <h2>تهانينا لك</h2>
            <p>الأن الكورسات التي قمت بإمتلاكها أصبحت متاحة يمكنك الإطلاع عليها من خلال <span>لوحتك التعليمية</span> </p>
        </div>
    </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
    methods: {
        ...mapActions('shoppingCart', ['deleteShoppinCartDataListAction'])
    },

    mounted () {
        // TODO: If the user pay for the courses , delete the shooping cart data
        this.deleteShoppinCartDataListAction()
    }
}
</script>

<style>

</style>
