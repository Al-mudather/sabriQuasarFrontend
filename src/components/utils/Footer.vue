<template>
    <footer>
        <div class="container-fluid">
            <div class="row">
                <div class="col-lg-1" style="display: none">
                    <div class="support">
                        <img src="~assets/img/support.png" alt="" />
                    </div>
                </div>
                <div class="col-lg-11 noPadding">
                    <div class="foo">
                        <div class="copright">
                            <h3>
                                جميع الحقوق محفوظة لمنصة
                                <span> 2021&copy; </span>
                            </h3>
                            <div class="logos">
                                <img src="~assets/img/suppo.png" alt="" />
                            </div>
                        </div>
                        <div class="method">
                            <ul>
                                <h3>طرق الدفع المعتمدة</h3>
                                <li>
                                    <img src="~assets/img/paypal.png" alt="" />
                                </li>
                                <li>
                                    <img
                                        src="~assets/img/discover.png"
                                        alt=""
                                    />
                                </li>
                                <li>
                                    <img src="~assets/img/visa.png" alt="" />
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </footer>
</template>

<script>
export default {
  name: 'Footer'
}
</script>
<style lang="scss">
/*--- Start Footer ---*/
footer{
    padding: 10px 0;
    margin: 150PX  0 0 0;
    .support{
        cursor: pointer;
        text-align: center;
        position: fixed;
        bottom: 64px;
        right: 17px;
        z-index: 5;
        img{
            width: auto;
        }
    }
    .foo{
        background-color: #f9f9f9;
        .copright{
            text-align: center;
            background-color: #f9f9f9;
            width: 173px;
            margin: 0 auto;
            padding: 10px;
            border-radius: 55px;
            position: relative;
            top: -41px;
            h3{
                font-size: 16px;
                color: #5666B9;
                font-family: 'cairoB';
                margin: 0 auto;
                line-height: 1.5;
                position: relative;
                width: 161px;
                top: -35px;
                text-align: center;
                span{
                color:#5666B9 ;
                font-family: 'cairoB';
                }
            }
            .logos{
                position: relative;
                margin: -42px 0 0 0;
                text-align: center;
                img{
                    width: auto;
                }
            }
        }
        .method{
            text-align: center;
            margin: -54px 0 0 0;
            ul{
                list-style: none;
                margin: 0;
                h3{
                    color: $textColor;
                    font-size: 18px;
                    font-family: 'cairoR';
                    display: inline-block;
                    margin-left: 10px;
                }
                li{
                    margin-left: 20px;
                    display: inline-block;
                }
            }
        }
    }
}
/*--- End Footer ---*/
</style>
