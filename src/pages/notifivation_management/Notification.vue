<template>
  <section class="web">
    <!--=============== START navbar ===============-->
    <user-nav-bar />
    <!--=============== End navbar ===============-->
    <!--=============== START My Courses ===============-->
    <section class="Notific">
      <div class="container-fluid">
        <div class="row">
          <div class="col-lg-12">
            <div class="titel">
              <img src="~assets/img/tit.png" alt="" />
              <h3>الإشعارات</h3>
            </div>
          </div>
          <div class="notifi">
            <div class="notf">
              <div class="row">
                <div class="col-lg-2">
                  <div class="user">
                    <img src="~assets/img/hassbo.png" alt="" />
                  </div>
                </div>
                <div class="col-lg-10 noPadding">
                  <div class="content">
                    <h3>
                      مبروك تم إشتراكك في كورس
                      <span>تغذية أمراض الجهاز الهضمي السفلي (القولون)</span>
                    </h3>
                  </div>
                </div>
              </div>
            </div>
            <div class="notf">
              <div class="row">
                <div class="col-lg-2">
                  <div class="user">
                    <img src="~assets/img/hassbo.png" alt="" />
                  </div>
                </div>
                <div class="col-lg-10 noPadding">
                  <div class="content">
                    <h3>
                      رد أستاذ صبري على سؤال لك في
                      <span>مقدمه في تغذية أمراض الجهاز الهضمي</span>
                    </h3>
                  </div>
                </div>
              </div>
            </div>
            <div class="notf">
              <div class="row">
                <div class="col-lg-2">
                  <div class="user">
                    <img src="~assets/img/Brand.png" alt="" />
                  </div>
                </div>
                <div class="col-lg-10 noPadding">
                  <div class="content">
                    <h3>الإدارة - تحديث جديد قادم في هذا الشهر</h3>
                  </div>
                </div>
              </div>
            </div>
            <div class="notf">
              <div class="row">
                <div class="col-lg-2">
                  <div class="user">
                    <img src="~assets/img/hassbo.png" alt="" />
                  </div>
                </div>
                <div class="col-lg-10 noPadding">
                  <div class="content">
                    <h3>
                      مبروك تم إشتراكك في كورس
                      <span>تغذية أمراض الجهاز الهضمي السفلي (القولون)</span>
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </section>
</template>

<script>
import UserNavBar from "src/components/utils/UserNavBar"

export default {
  name: "Notification",
  components: {
    UserNavBar
  },
  methods: {}
};
</script>
<style lang="scss">
@import "src/css/helpers/_mixins.scss";
@import "src/css/helpers/_variabels.scss";
/*--============= Start Notification page =============--*/
.Notific{
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
    .notifi{
        margin: 10px auto;
        max-width: 600px;
        .notf{
            background-color: #fff;
            padding: 18px;
            border-radius: 15px;
            margin: 20px 0 20px 0;
            box-shadow: 0px 3px 20px #eae8e878;
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
                    border-radius: 50px;
                    width: 50px;
                    height: 50px;
                    display: inline-block;
                }
            }
            .content{
                h3{
                    font-size: 18px;
                    display: inline-block;
                    font-family: 'cairoR';
                    color: $textColor;
                    width: 398px;
                    margin: 0;
                    line-height: 1.8;
                    //maxMobile
                    @media(max-width:767px){
                        text-align: center;
                        width: 100%;
                        font-size: 17px;
                        padding: 5px;
                    }
                    span{
                        color: #C9C9C9;
                    }
                }
            }
        }
    }
}
/*--============= End Notification page =============--*/
</style>
