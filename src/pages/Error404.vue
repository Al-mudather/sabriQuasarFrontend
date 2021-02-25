<template>
  <section class="web">

    <!--=============== START cart popup ===============-->
    <section class="error">
        <div class="container">
            <div class="row">
                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <div class="cont">
                        <span>Page not found</span>
                        <h2>!OOPS</h2>
                        <img src="~assets/img/404.png" alt="">
                        <div class="butt">
                           <a @click="goToHomePage" style="cursor: pointer">
                            <h3>إنتقال الي الواجهة الرئيسية</h3>
                            <img src="~assets/img/send.png" alt="">
                           </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
  </section>
</template>

<script>
export default {
  name: 'Error404',
  methods: {
    goToHomePage () {
      this.$router.push({ name: 'Home' })
    }
  }
}
</script>
<style lang="scss">
@import "src/css/helpers/_mixins.scss";
@import "src/css/helpers/_variabels.scss";
/*--============= start 404 page =============--*/
.error{
    .cont{
        text-align: center;
        margin: 30px 0 30px 0;
        span{
            font-size: 34px;
            color: #A8CBCF;
            font-family:Arial, Helvetica, sans-serif;
        }
        h2{
            color: #3271AA;
            font-size: 46px;
            font-family:'cairoB';
            font-weight: bold;
        }
        img{
            width: auto;
            margin-top: 20px;  
            //maxMobile
            @media(max-width:767px){
                width:100%;
            }
            //minSmall
            @media(min-width:768px){
                width: 100%;
            }
            //minLarg
            @media(min-width:1200px){
                width: auto;
            }
        }
        .butt{
            text-align: center;
            margin: 46px 0 0 0;
            h3{
                font-size: 16px;
                display: inline-block;
                color: $textColor;
                font-family: 'cairoR';
                margin-left: 10px;
            }
            img{
                width: auto;
                display: inline-block;
                margin: 0;
            }
        }
    }
}
/*--============= End 404 page =============--*/

</style>
