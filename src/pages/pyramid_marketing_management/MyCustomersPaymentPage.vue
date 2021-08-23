<template>
  <section class="profile">
            <div class="container-fluid">
                <div class="row">
                    <div class="col-lg-12">
                        <div class="titel">
                            <img src="~assets/img/tit.png" alt="">
                            <h3>{{$t('عمـليات الدفع')}}</h3>
                        </div>
                    </div>
                    <!--cn-pay-->
                    <div class="col-lg-12">
                        <div v-if="customersTransactionsList.edges.length > 0" class="cn-pay">
                            <div class="row">
                                <!--box-pay--><!--box-done-->
                                <div v-for="customerTrans in customersTransactionsList.edges" :key="customerTrans.node.pk" class="col-lg-3 col-md-6 col-sm-6">
                                    <Transaction-completed v-if="customerTrans.node.doneVerification " :customerTrans="customerTrans.node" />
                                    <Transaction-under-processing v-else-if="customerTrans.node.marketerEndorse && !customerTrans.node.pyramidManagerEndorse" :customerTrans="customerTrans.node" />
                                    <Transaction-rejected :label="rejectedByTheManager"  v-else-if="customerTrans.node.pyramidRetryPlease" :customerTrans="customerTrans.node" />
                                    <Transaction-rejected :label="rejectedByTheMe" v-else-if="customerTrans.node.retryPlease || customerTrans.node.pyramidRetryPlease" :customerTrans="customerTrans.node" />
                                    <Transaction-hanged v-else :customerTrans="customerTrans.node" />
                                </div>
                            </div>
                        </div>
                        <div v-else class="msPay">
                            <img src="~assets/img/Cash Payment-bro.png" alt="">
                            <h3>{{$t('ليس لديك عمليات دفع في الوقت الحالي')}}</h3>
                        </div>
                    </div>
                </div>
            </div>
            <div class="container">
                <div class="record">
                    <div class="row">
                    </div>
                </div>
            </div>
        </section>
</template>

<script>
// import { mapActions } from 'vuex'

import { AllMarketerAttachmentTransaction } from 'src/queries/attachment_transactions_management/query/AllMarketerAttachmentTransactionQuery'
import Transaction_completed from 'src/components/attachment_transactions_management/Transaction_completed'
import Transaction_under_processing from 'src/components/attachment_transactions_management/Transaction_under_processing'
import Transaction_rejected from 'src/components/attachment_transactions_management/Transaction_rejected'
import Transaction_hanged from 'src/components/attachment_transactions_management/Transaction_hanged.vue'

export default {
  name: "MyMarketingPage",
  data () {
    return {
        rejectedByTheManager: this.$t('الطلب مرفوض من الإداره'),
        rejectedByTheMe: this.$t('الطلب مرفوض بواسطتي'),
        customersTransactionsList: []
    }
  },
  apollo: {
    allMarketerAttachmentTransaction: {
      query () {
        return AllMarketerAttachmentTransaction
      },
      result (result) {
        if (!result.loading) {
          this.customersTransactionsList = result.data.allMarketerAttachmentTransaction
        }
      }
    }
  },
  components: {
    'Transaction-completed': Transaction_completed,
    'Transaction-under-processing': Transaction_under_processing,
    'Transaction-rejected': Transaction_rejected,
    'Transaction-hanged': Transaction_hanged,
  },
 
  methods: {
  }

};
</script>
<style lang="scss">
@import "src/css/helpers/_mixins.scss";
@import "src/css/helpers/_variabels.scss";
.profile {
    .titel {
        img {
            opacity: 1;
        }
        h3 {
            font-family: "cairoB";
            font-size: 18px;
            color: #787878;
            margin: -29px 18px 39px 0;
        }
    }
    .cn-pay {
        padding: 0 10.1%;
        display: block;
        /*--box-pay--*/
        .box-pay {
            margin: 0 0 30px 0;
            .inv {
                text-align: center;
                .box {
                    border: 1px solid #ddd;
                    border-radius: 62px;
                    max-width: 135px;
                    margin: 0 auto;
                    height: 40px;
                    padding: 5px 0 0 0;
                    h2 {
                        display: inline-block;
                        font-family: "cairoR";
                        font-size: 15px;
                        color: #7b86fa;
                        span {
                            color: #fcd462;
                        }
                    }
                    img {
                        display: inline-block;
                        width: 30px;
                        margin: -9px 0 0 0;
                    }
                }
                svg {  
                    width: 46px;
                    margin: -20px 0 0 0;
                }
            }
            .data {
                text-align: center;
                background: #fff;
                box-shadow: 4px 8px 9px #e5e4e4;
                padding: 53px 0;
                height: 237px;
                border-radius: 32px;
                img {
                    width: 70px;
                    text-align: center;
                    margin: 0 0 12px 0;
                }
                h2 {
                    font-family: "cairoR";
                    font-size: 19px;
                    color: #32ba7c;
                    margin: 0 0 10px 0;
                }
                p {
                    font-family: "cairoR";
                    font-size: 16px;
                    color: #313131;
                }
            }
        }
        /*--box-done--*/
        .box-done {
            .inv {
                opacity: 1;
                .box {
                    opacity: 1;
                    h2 {
                        opacity: 1;
                        span {
                            opacity: 1;
                        }
                    }
                    img {
                        opacity: 1;
                    }
                }
                svg {  
                   opacity: 1;
                }
            }
            .data {
                opacity: 1;
                img {
                    opacity: 1;
                }
                h2 {
                    opacity: 1;
                }
                p {
  opacity: 1;
                }
            }
        }
        /*--box-wait--*/
        .box-wait {
            .inv {
                opacity: 1;
                .box {
                    opacity: 1;
                    h2 {
                        opacity: 1;
                        span {
                            opacity: 1;
                        }
                    }
                    img {
                        opacity: 1;
                    }
                }
                svg {  
                   opacity: 1;
                }
            }
            .data {
                opacity: 1;
                img {
                    opacity: 1;
                }
                h2 {
                    color: #7b86fa;
                }
                p {
                    opacity: 1;
                }
            }
        }
        /*--box-unacceptable--*/
        .box-unacceptable {
            .inv {
                opacity: 1;
                .box {
                    opacity: 1;
                    h2 {
                        opacity: 1;
                        span {
                            opacity: 1;
                        }
                    }
                    img {
                        opacity: 1;
                    }
                }
                svg {  
                   opacity: 1;
                }
            }
            .data {
                opacity: 1;
                img {
                    opacity: 1;
                }
                h2 {
                    color: #ff5f5a;
                }
                p {
                    opacity: 1;
                }
            }
        }
        /*--pending-request--*/
        .pending-request {
            opacity: 1;
            .inv {
                opacity: 1;
                .box {
                    opacity: 1;
                    h2 {
                        opacity: 1;
                        span {
                            opacity: 1;
                        }
                    }
                    img {
                        opacity: 1;
                    }
                }
                svg {  
                   opacity: 1;
                }
            }
            .data {
                padding: 24px 0 0 0;
                img {
                    width: 35px;
                }
                h2 {
                    color: #dc8638;
                    display: inline-block;
                    margin: 0 5px 0 0
                }
                .money {
                    background: #D97A22;
                    max-width: 201px;
                    margin: 27px auto 0 auto;
                    border-radius: 30px;
                    padding: 10px 0 10px 0;
                    h3 {
                        display: inline-block;
                        font-family: "cairoB";
                        font-size: 15px;
                        color: #fff;
                        margin: 0 -17px 10px 0;
                    }
                    .price {
                        display: inline-block;
                        background: #FCD462;
                        border-radius: 37px;
                        float: left;
                        position: relative;
                        left: 6px;
                        top: -2px;
                        h4 {
                            font-size: 15px;
                            font-family: "cairoB";
                            padding: 8px 15px 0 15px;
                            color: #787878;
                            span {
                                color: #fff;
                                margin: 0 0 0 6px;
                            }
                        }
                    }
                }
                .viewpay {
                    opacity: 1;
                    .box {
                        max-width: 180px;
                        margin: 0 auto;
                        background: #fad25e;
                        padding: 9px 0 9px 0;
                        border-radius: 34px;
                        cursor: pointer;
                        img {
                            opacity: 1;
                        }
                        h2 {
                            color: #787878;
                            display: inline-block;
                            margin: 0 5px 0 0;
                            font-size: 18px;
                        }
                    }
                    svg {
                        width: 80px;
                        position: relative;
                        top: 1px;
                    }
                }
            }
        }
    }
    .msPay{
        display: block;
        margin: 0 auto;
        text-align: center;
        h3{
            font-size: 19px;
            font-family: 'cairoR';
            color: #7B7B7B;
            margin: 35px 0 0 0;
        }
    }
}
.popay {
    .clos {
        position: relative;
        margin: 0 auto;
        height: 52px;
        width: 38px;
        cursor: pointer;
        svg {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
        }
        img {
            position: absolute;
            width: auto;
            top: 24px;
            right: 11px;
        }
    }
    position: fixed;
    width: 100%;
    height: 100%;
    background: #fcd462ab;
    top: 0;
    right: 0;
    text-align: center;
    overflow: scroll;
    .cn {
        max-width: 384px;
        margin: 0 auto 50px auto;
        padding: 38px 0 0 0;
        opacity: 1;
        .bmg {
            max-width: 283px;
            margin: 0 auto 29px auto;
            height: auto;
            overflow: hidden;
            border-radius: 21px;
            .bank { 
                width: 100%;
            }
        }
        .control {
            background: #fff;
            border-radius: 64px;
            margin: -48px 0 0 0;
            padding: 34px 23px 25px 0;
            text-align: center;
            .bu {
                display: inline-block;
                margin: 0 auto 0 37px;
                cursor: pointer;
                img {
                    display: inline-block;
                    width: 37px;
                }
                h2 {
                    display: inline-block;
                    font-family: "cairoB";
                    font-size: 18px;
                    color: #787878;
                }
            }
        }
    }
}
</style>
