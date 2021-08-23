<template>
    <section class="web">
        <section class="cources">
            <div class="container">
                <div class="row">
                    <div class="col-lg-12">
                        <div class="titel">
                            <img src="~assets/img/tit.png" alt="">
                            <h3>{{$t('طلبـاتي')}}</h3>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="Orders">
            <div class="container">
                <div class="row">
                    <div v-for="myOrder in myTransactionsOrders.edges" :key="myOrder.node.pk" class="col-lg-3">
                        <Transaction-order-detail :myOrder="myOrder.node" />
                    </div>
                </div>
            </div>
        </section>
    </section>
</template>

<script>
import { mapActions } from "vuex"
import { MyAttachmentTransactions } from 'src/queries/attachment_transactions_management/query/TheUserAttachmentTransactionsQuery'
import { MarketerConfirmAttachmentTransaction } from 'src/queries/attachment_transactions_management/mutation/marketerConfirmAttachmentTransaction'
import { AllMarketerAttachmentTransaction } from 'src/queries/attachment_transactions_management/query/AllMarketerAttachmentTransactionQuery'
import TransactionOrderDetail from 'src/components/orders_management/transactionOrderDetail.vue'

export default {
    name: 'MyOrders',
    data () {
        return {
            lodash: this.$_,
            bill: false,
            loading: false,
            confirm: {
                marketerEndorse: true,
                retryPlease: false,
            },

            reject: {
                marketerEndorse: false,
                retryPlease: true,
            },

            myTransactionsOrders: [],
            allEnrollmentsForCurrentUser: {}
        }
    },
 
	components: {
        'Transaction-order-detail': TransactionOrderDetail
	},

    apollo: {
      myAttachmentTransactions: {
        query () {
            return MyAttachmentTransactions
        },
        result (result) {
            if (!result.loading) {
            this.myTransactionsOrders = result.data.myAttachmentTransactions
            }
        }
        }
    },

    mounted () {
        //TODO: Save the active link so when render it will be make active again
        this.setActiveNavAction('BORD')
    },

    methods: {
        ...mapActions('settings', ['setActiveNavAction']),
        FORMAT_IMAGE (imageUrl) {
            if (process.env.NODE_ENV == 'development') {
                return  `http://localhost:8000/media/${imageUrl}`
                
            } else {
                return location.origin  + `/media/${imageUrl}`
            }
        },

        async CONFIRM_OR_REJECT_TRANSACTION (data) {
            this.loading = true
            const confirm_res = await this.$apollo.mutate({
                mutation: MarketerConfirmAttachmentTransaction,
                variables: {
                    id: this.customerTrans.pk,
                    input: data
                }, 
                refetchQueries: [{ query: AllMarketerAttachmentTransaction }]
                })
                const errors = confirm_res.data.marketerAttachmentTransactionConfirmation.errors
                const success = confirm_res.data.marketerAttachmentTransactionConfirmation.success

                if (success) {
                    this.loading = false
                    this.bill = false
                    this.$q.notify({
                        type: 'positive',
                        position: 'top',
                        progress: true,
                        multiLine: true,
                        message: "The transaction has been confirmed by you"
                    })
                } else if (errors) {
                    this.loading = false
                    this.bill = false
                    this.errorHandler(errors)
                }
        },        

        async loadMoreData () {
            await this.$apollo.queries.allEnrollmentsForCurrentUser.fetchMore({
                variables: {
                    cursor: this.allEnrollmentsForCurrentUser.pageInfo.endCursor
                },
                updateQuery: (previousResult, { fetchMoreResult }) => {
                const newEdges = fetchMoreResult.allEnrollmentsForCurrentUser.edges
                const pageInfo = fetchMoreResult.allEnrollmentsForCurrentUser.pageInfo

                if (newEdges.length) {
                    this.allEnrollmentsForCurrentUser = {
                    __typename:
                        previousResult.allEnrollmentsForCurrentUser.__typename,
                    edges: [
                        ...previousResult.allEnrollmentsForCurrentUser.edges,
                        ...newEdges
                    ],
                    pageInfo
                    }

                    return { allEnrollmentsForCurrentUser: this.allEnrollmentsForCurrentUser }
                }
                return previousResult
                }
            })
        },

        GO_TO_COURSES_PAGE () {

            this.$router.push({ name: "courses" });
        }
    }
}
</script>

<style lang="scss">
@import "src/css/helpers/_mixins.scss";
@import "src/css/helpers/_variabels.scss";
.cources{
    margin: 25px 0 0 0;
    .titel{
        margin: 0 0 55px 0;
        img{
            display: inline-block;
            margin: -9px 0 0 0;
        }
        h3{
            color: $textColor;
            font-size: 22px;
            font-family: 'cairoB';
            line-height: 1.7;
            margin: 0 11px 0 0;
            display: inline-block;
        }
    }
    .search {
        padding: 0 18% 0 0;
        width: 74%;
        margin: -9px auto;
        //maxMobile
        @media(max-width:767px){
            width: 100%;
            margin-bottom: 50px;
            padding: 0;
        }
        //maxSmall
        @media(max-width:991px){
            width: 100%;
            padding: 0;
        }
        form {
            position: relative;
            text-align: center;
            input {
                width: 100%;
                height: 54px;
                padding: 15px;
                font-size: 17px;
                font-family: 'cairoR';
                border-radius: 50px;
                border: 0;
                background-color: #fff;
                color: #7B7B7B;
                outline: 0;
                @include prefixer(box-shadow, 2px 9px 18.79px 2.21px rgba(147, 147, 147, 0.14), webkit moz o ms);
            }
            input::placeholder {
                color: #BBBBBB !important;
                font-size: 14px;
                font-family: 'cairoR';
            }

            button {
                width: 47px;
                height: 40px;
                background-color: #F8F8F8;
                position: absolute;
                left: 8px;
                top: 5px;
                font-size: 16px;
                outline: 0;
                img {
                    margin-left: 0px;
                }
            }
        }
    }
}
/*--- START Account popup ---*/
.backAccount{
    display: none;
    background-color: #7b86facc;
    position: fixed;
    width: 100%;
    z-index: 99;
    top: 0;
    height: 100%;
    .clos{
        position: relative;
        margin: 0 auto;
        height: 52px;
        width: 38px;
        cursor: pointer;
        svg{
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
        }
        img{
            position: absolute;
            width: auto;
            top: 24px;
            right: 11px;
        }
    }
    .content{
        background-color: #fff;
        margin: 42px auto;
        max-width: 557px;
        border-radius: 35px;
        height: auto;
        padding: 20px;
        position: relative;
        box-shadow: 7px 7px 10px #b7b7b747;
        .titell{
            padding: 10px;
            h3{
                font-size: 18px;
                font-family: 'cairoR';
                color: #7B7B7B;
                text-align: right;
            }
            hr{
                margin: 21px auto 29px auto;
                border: 0;
                border-top: 2px solid #F2F2F2;
                max-width: 666px;
            }
        }
        //maxMobile
        @media(max-width:767px){
            width: 100%;
            padding: 10px;
        }
        /*-- login form --*/
        .courses{
            .groupp{
                position: relative;
                display: block;
                .man{
                    //maxMobile
                    @media(max-width:767px){
                        padding: 20px 8px 10px 15px;
                    }
                    text-align: initial;
                    z-index: 1;
                    position: relative;
                    background-color: #fff;
                    padding: 9px 8px 10px 15px;
                    border-radius: 31px;
                    margin: 0px 0 27px 0;
                    @include prefixer(box-shadow, 2px 7px 9px #9e9e9e36, webkit moz ms);
                    .compon{
                        display: flex;
                        position: relative;
                        .mag{
                            margin-left: 5px;
                            display: inline-block;
                            //maxMobile
                            @media(max-width:767px){
                                display: none;
                                text-align: center;
                                margin: 0 0 26px 0;
                            }

                            img{
                                width: 88px;
                                height: 84px;
                                border-radius: 20px;
                            }
                        }
                        h2{
                            font-size: 18px;
                            font-family: 'cairoR';
                            color: $textColor;
                            margin: 0 5px 10px 0;
                            line-height: 1.7;
                            @media(max-width:767px){
                                font-size: 15px;
                                text-align: center;
                                display: block;
                                margin: 10px 0 30px 0;
                            }
                        }
                    }
                }
            }
        }
    }
}
/*--- End Account popup ---*/
.Orders{
    padding: 50px 0;
    margin: 0 0 0 0;
    .ide{
        background-color: #fff;
        padding: 10px;
        cursor: pointer;
        margin: 0 0 30px 0;
        @include prefixer(box-shadow, 2px 9px 18.79px 2.21px rgba(147, 147, 147, 0.14), webkit moz o ms);
        .tite{
            position: relative;
            text-align: center;
            margin: 0 0 7px 0;
            img{
                display: inline-block;
                position: absolute;
                left: 14px;
                top: 0;
            }
            h3{
                display: inline-block;
                font-family: 'cairoR';
                color: #7B86FA;
                font-size: 22px;
                position: relative;
                top: 11px;
                span{
                    font-family: 'cairoB';
                    color:#FCD462;
                    font-size: 22px;
                }
            }
        }
        .chec{
            width: 34%;
            text-align: center;
            display: inline-block;
            margin: 0 -2% -19px 0;
            overflow: hidden;
            border: none;
            padding: 0px 0 38px 0;
            position: relative;
            right: 1.5%;
            h3{
                background-color: #757FEB;
                font-size: 14px;
                font-family: 'cairoR';
                text-align: center;
                padding: 13px;
                color: #fff;
                margin: 0;
            }
            .colorr{
                background-color: #7B86FA;
            }
            .coloo{
                background-color: #F9F8F8;
            }
            img{
                margin: 0 0 0 0;
                position: relative;
                top: 13px;
            }
        }
    }
    .viwe{
        background-color: #fff;
        padding: 10px;
        margin: -17px 0 21px 0;
        @include prefixer(box-shadow, 2px 9px 18.79px 2.21px rgba(147, 147, 147, 0.14), webkit moz o ms);
        .money{
            background: #D97A22;
            max-width: 212px;
            margin: 8px auto 8px auto;
            border-radius: 30px;
            padding: 10px 0 10px 0;
            //maxMobile
            @media(max-width:767px){
                max-width: 477px;
            }
            h3{
                display: inline-block;
                font-family: "cairoB";
                font-size: 15px;
                color: #fff;
                margin: 0 17px 10px 0;
            }
            .price{
                display: inline-block;
                background: #FCD462;
                border-radius: 37px;
                float: left;
                position: relative;
                left: 6px;
                top: -2px;
                h4{
                    font-size: 15px;
                    font-family: "cairoB";
                    padding: 8px 15px 0 15px;
                    color: #787878;
                    span{
                        color: #fff;
                        margin: 0 0 0 6px;
                    }
                }
            }
        }
        .viewpay{
            opacity: 1;
            position: relative;
            margin: 25px 0 4px 0;
            svg{
                width: 80px;
                position: absolute;
                top: -18px;
                margin: 0 auto;
                text-align: center;
                left: 0;
                right: 0;
            }
            .box{
                text-align: center;
                margin: 0 auto;
                button{
                    width: 180px;
                    background-color: #fad25e;
                    padding: 9px 0 9px 0;
                    border-radius: 34px;
                    cursor: pointer;
                    //maxMobile
                    @media(max-width:767px){
                        width: 309px;
                    }
                }
            }
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
/*--- End My Courses ---*/
</style>