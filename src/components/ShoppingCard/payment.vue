<template>
    <div class="msPayment">
        <div class="options">
            <div class="sele">
                <img src="~assets/img/paypal.png" alt="">
            </div>
            <div class="sele edit active">
                <img src="~assets/img/discover.png" alt="">
                <img src="~assets/img/visa.png" alt="">
            </div>
            <div class="sele edit">
                <img src="~assets/img/credit-cards.png" alt="">
                <h3>بطاقة بنكيــة</h3>
            </div>
            <div class="sele edit">
                <img src="~assets/img/STCPAY.png" alt="">
            </div>
        </div>
        <!--details Payment-->
        <div class="details">
            <div class="error">
                <h3><img src="~assets/img/error.png" alt="">رقم البطاقة غير صحيح أعد المحاولة</h3>
            </div>
            <div class="logoPay">
                <img src="~assets/img/discover.png" alt="">
            </div>
            <form>
                <div class="row">
                    <div class="col-lg-12 col-xs-12">
                        <div class="inp">
                            <input type="number" placeholder="رقم البطاقة">
                        </div>
                    </div>
                    <div class="col-lg-7 col-xs-12 noPadding">
                        <div class="inp">
                            <input type="number" placeholder="تاريخ الإنتهاء">
                        </div>
                    </div>
                    <div class="col-lg-5 col-xs-12 noPadding">
                        <div class="inp">
                            <input type="number" placeholder="CCV">
                            <img src="~assets/img/question.png" alt="">
                        </div>
                    </div>
                </div>
                <div class="but">
                    <h3><img src="~assets/img/payment.png" alt="">دفـــع</h3>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
export default {

}
</script>

<style>

</style>
