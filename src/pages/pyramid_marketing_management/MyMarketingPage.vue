<template>
  <section class="profile">
    <div class="container-fluid">
        <div class="row">
            <div class="col-lg-12">
                <div class="titel">
                    <img src="~assets/img/tit.png" alt="">
                    <h3>حسابي التسويقي</h3>
                </div>
            </div>
        </div>
    </div>
    <div class="container">
      <div class="marketing">
          <div class="row">
              <div class="col-lg-4 col-md-12 col-sm-12 col-xs-12">
                <my-balance />
              </div>
              <div class="col-lg-8 col-md-12 col-sm-12">
                <div class="pyramid">
                  <my-pyramid />
                </div>
              </div> 
          </div>
      </div>
    </div>
    <div class="container-fluid">
        <div class="row">
            <div class="col-lg-12">
                <div class="titel">
                    <img src="~assets/img/tit.png" alt="">
                    <h3>سجل السحب</h3>
                </div>
            </div>
        </div>
    </div>
    <!-- Withdrawal requests -->
    <div class="container">
      <my-withdraws-list />
    </div>
  </section>
</template>

<script>
// import { mapActions } from 'vuex'
import MyBalance from 'src/components/pyramid_marketing_management/MyBalance'
import MyPyramid from 'src/components/pyramid_marketing_management/MyPyramid'
import MyWithdrawsList from 'src/components/pyramid_marketing_management/MyWithdrawsList'

export default {
  name: "MyMarketingPage",
  data () {
    return {
      notificationData: []
    }
  },
  components: {
    'my-balance': MyBalance,
    'my-pyramid': MyPyramid,
    'my-withdraws-list': MyWithdrawsList
  },
 
  mounted () {
    //TODO: Save the active link so when render it will be make active again
    // this.setActiveNavAction('NOTIFICATION')
    // // TODO: Get the notification from the [ UserNavBar ] component
    // // this.$root.$on('NotificationData', this.GET_NOTIFICATION_DATA)
    // // TODO: Get the notification
    // this.$apollo.query({
    //   query: GetAllMyNotifications,
    //   variables: {
    //     orderBy: ['-id']
    //   }
    // }).then( res => {
    //   this.notificationData = res.data.myNotifications
    // } )
  },

  methods: {
  }

};
</script>
<style lang="scss">
@import "src/css/helpers/_mixins.scss";
@import "src/css/helpers/_variabels.scss";
/*--============= Start my marketing page =============--*/
.profile{
    padding: 10px;
    margin: 20px 0 45px 0;
    position: relative;
    .titel{
        display: inline-block;
        width: 100%;
        padding: 12px;
        background: #fff;
        margin: 18px 0 16px 0;
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
    .details{
        margin: 30px 0 30px 0;
        .user{
            //maxMobile
            @media(max-width:767px){
                text-align: center;
                margin-bottom: 20px;
            }
            //minSmall
            @media(min-width:768px){
                text-align: center;
                margin-bottom: 20px;
            }
            img{
                width: 129px;
                height: 129px;
                border-radius: 50%;
                border: 3px solid #fcd462;
            }
        }
        .all{
            background: #fff;
            padding: 14px;
            border-radius: 28px;
            box-shadow: 2px 6px 30px #5656560f;
            .password{
                margin: 30px 0 0 0;
            }
            .titel{
                background-color: unset;
                h3{
                    font-size: 18px;
                }
            }
            form{
                .inp{
                    position: relative;
                    margin-bottom: 15px;
                    img{
                        position: absolute;
                        top: 22px;
                        right: 12px;
                    }
                }
                .type{
                    margin:15px  auto 15px auto;
                    .active{
                        border: 1px solid #FCC74C;
                    }
                    .male{
                        cursor: pointer;
                        background-color: #fff;
                        padding: 12px;
                        display: inline-block;
                        width: 91px;
                        height: 94px;
                        text-align: center;
                        border-radius: 10px;
                        margin: 0 0 0 20px;
                        box-shadow: 0px 3px 20px #eae8e878;
                        h3{
                            font-size: 13px;
                            color: $textColor;
                            font-family: 'cairoR';
                            text-align: center;
                            margin: 8px 0 5px 0;
                        }
                    }
                }
                .but{
                    margin: 30px auto 24px auto;
                    background: #FCD462;
                    padding: 5px;
                    width: 130px;
                    border-radius: 50px;
                    text-align: center;
                    cursor: pointer;
                    h3{
                        display: inline-block;
                        color: $textColor;
                        font-size: 16px;
                        font-family: 'cairoR';
                        margin: 0;
                    }
                    img{
                        display: inline-block;
                        position: relative;
                        left: 0;
                        right: 21px;
                    }
                }
            }
        }
    }
}

.marketing{
    margin-top: 20px;
    .account{
        background-color: #FCD462;
        padding: 10px;
        background-image: url(~assets/img/stc.png);
        height: 231px;
        border-radius: 14px;
        background-repeat: no-repeat;
        background-position: 50% 50%;
        position: relative;
        margin: 0 0 20px 0;
        img{
            position: absolute;
            left: 21px;
            top: 20px;
        }
        .taxt{
            width: 100%;
            text-align: center;
            margin: 0 auto;
            position: absolute;
            top: 29%;
            h4{
                font-size: 18px;
                font-family:'cairoR';
                color: #3A3847;
            }
            h3{
                font-family: 'cairoR';
                font-size: 17px;
                span{
                    font-size: 43px;
                    font-family:'cairoB';
                    color: #3A3847;
                }
            }
        }
        .taslsl{
            background-color: #F7CC61;
            width: 100%;
            height: 26px;
            position: absolute;
            left: 0;
            bottom: 0px;
            right: 0;
            border-bottom-left-radius: 14px;
            border-bottom-right-radius: 14px;
            img{
                position: absolute;
                left: 0;
                right: 0;
                margin: 0 auto;
                top: 9px;
            } 
        }
        a{
            text-decoration: none;
            h3{
                font-size: 16px;
                color: #353535;
                font-family: 'cairoR';
                margin: 0;
                position: absolute;
                bottom: 12px;
                left: 18px;
                img{
                    position: unset;
                }
            }
        }
    }
    .pyramid{
        background-color: #D97A22;
        padding: 10px;
        background-image: url(~assets/img/pattern.png);
        height: 231px;
        border-radius: 14px;
        background-repeat: no-repeat;
        background-position: 50% 50%;
        position: relative;
        //maxMobile
        @media(max-width:767px){
            height: auto;
        }
        
        .harm{
            position: relative;
            img{
                position: absolute;
                right: -10px;
                left: 0;
                top: -11px;
            }
        }
        .conten{
            position: absolute;
            width: 100%;
            text-align: center;    
            top: 14px;
            margin: 0 0 15px 0;
            //minMedium
            @media(min-width:768px){
                width: 50%;
            }
            //minLarg
            @media(min-width:1200px){
                width: 100%;
            }
            h3{
                font-size: 18px;
                color: #FCFCFC;
                font-family: 'cairoR';
            }
            span{
                font-size: 40px;
                color: #FCFCFC;
                font-family: 'cairoB';
                margin: 26px 0 24px 0;
                display: block;
            }
            .share{
                text-align: center;
                margin: 0 0 7px 0;
                form{
                    position: relative;
                    text-align: center;
                    width: 80%;
                    margin: 0 auto;
                    top: 0;
                    input{
                        background-color: #FFCF57;
                        border: none;
                        width: 100%;
                        height: 49px;
                        outline: 0;
                        padding: 0px 29px 0 0;
                        overflow: hidden;
                        border-radius: 100px;
                        font-family: 'cairoR';
                        color: #3A3847;
                        &::placeholder{
                            color: #3A3847;
                        }
                    }
                    button{
                        width: 58px;
                        height: 41px;
                        background-color: #D97A22;
                        position: absolute;
                        left: 5px;
                        top: 4px;
                        font-size: 16px;
                        outline: 0;
                        img{
                            width: 20px;
                        }
                    }
                }
            }
        }
        .profit{
            margin: 0 0 15px 0;
            background-color: #FFCF57;
            background-image: url(~assets/img/prid.png);
            padding: 10px;
            position: relative;
            border-radius: 18px;
            width: 293px;
            margin: 12px 0 0 0;
            @include prefixer(box-shadow, 2px 7px 9px #23232336, webkit moz ms);
            //maxMobile
            @media(max-width:767px){
                width: 100%;
                margin-top: 210px;
                margin-bottom: 10px;
            }
            //maxSmall
            @media(max-width:991px){
                width: 100%;
            }
            //minMedium
            @media(min-width:768px){
                width: 50%;
                float: left;
            }
            //minLarg
            @media(min-width:1200px){
                width: 293px;
                float: unset;
            }
            .taxt{
                width: 100%;
                text-align: center;
                margin: 12px auto 0 auto;
                h4{
                    font-size: 18px;
                    font-family:'cairoR';
                    color: #3A3847;
                }
                h3{
                    font-family: 'cairoR';
                    font-size: 17px;
                    span{
                        font-size: 43px;
                        font-family:'cairoB';
                        color: #3A3847;
                    }
                }
                button{
                    outline: 0;
                    position: relative;
                    width: 164px;
                    height: 45px;
                    background-color: #D97A22;
                    color: #fff;
                    font-size: 16px;
                    font-family: 'cairoR';
                    padding: 0 20px 0 0;
                    margin: 8px 0 13px 0;
                    img{
                        position: absolute;
                        right: -9px;
                        top: -4px;
                    }
                }
            }
        }
    }
}
.record{
    margin: 60px 0 0 0;
    .oper{
        display: none;
        .all{
            text-align: center;
            background-color: #fff;
            border-radius: 23px;
            box-shadow: 2px 7px 9px #23232336;
            padding: 10px;
            position: relative;
            margin: 0 0 20px 0;
            //maxMobile
            @media(max-width:767px){
                margin: 0 0 80px 0;
            }
            //minLarg
            @media(min-width:1200px){
                margin: 0 0 20px 0;
            }
            .ground{
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                margin: 0 auto;
            }
            .clock{
                width: 122px;
                height: 35px;
                border-radius: 50px;
                border: 2px solid #78787885;
                margin: 0 auto;
                position: relative;
                top: -58px;
                h3{
                    color: #787878;
                    font-size: 14px;
                    font-family: 'cairoB';
                    margin: 7px 0 0 0;
    
                }
                svg{
                    position: absolute;
                    top: 31px;
                    margin: 0 auto;
                    left: 0;
                    right: 0;
                }
            }
            h3{
                font-size: 17px;
                font-family: 'cairoB';
                color: #787878;
                margin: -21px 0 10px 0;
                img{
                    margin-left: 6px;
                }
            }
            .amount{
                background-color: #F4F4F4;
                width: 178px;
                height: 53px;
                border-radius: 58px;
                margin: 44px auto 13px auto;
            
                h3{
                    font-family: 'cairoR';
                    font-size: 17px;
                    color: #707070;
                    span{
                        font-size: 40px;
                        font-family: 'cairoB';
                        color: #707070;
                        display: inline-block;
                    }
                }
            }
            span{
                color: #3A3847;
                font-size: 18px;
                font-family: 'cairoR';
                display: block;
            }
        }
    }
    .request{
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
/*--============= End my marketing page =============--*/
</style>
