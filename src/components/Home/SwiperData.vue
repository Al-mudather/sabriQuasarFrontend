<template>
    <section class="opinions">
        <div class="container">
            <div class="row">
                <div class="col-lg-12">
                    <div class="titel">
                        <span>{{$t('بعضا من')}}</span>
                        <h2>{{$t('آراء الطــلاب')}}</h2>
                    </div>
                </div>
            </div>
            <!--opini-->
            <div class="row">
                <div class="col-lg-12">
                    <div class="opini">
                        <div class="swiper-container">
                            <swiper
                                :slides-per-view="3"
                                :space-between="50"
                                ref="mySwiper"
                                :options="swiperOptions"
                                @swiper="onSwiper"
                                @slideChange="onSlideChange"
                            >
                                <swiper-slide v-for="i in 3" :key="i">
                                    <review-card
                                        courseName="تأثير الجهاز العصبي علي السلوك والانساني"
                                        reviewDetail="كورس قيم جدا لاول مره احب الطب بهذة الطريقة"
                                    />
                                </swiper-slide>
                            </swiper>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import 'swiper/swiper-bundle.css'
import 'swiper/swiper.min.css'

import reviewCard from 'components/utils/reviewCard'
export default {
  name: 'SwiperData',
  data () {
    return {
      swiperOptions: {
        effect: 'coverflow',
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: 'auto',
        coverflowEffect: {
          rotate: 500,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: false
        }
      }
    }
  },
  components: {
    Swiper,
    SwiperSlide,
    reviewCard
  },
  methods: {
    onSwiper (swiper) {
      console.log(swiper)
    },
    onSlideChange () {
      console.log('slide change')
    }
  }
}
</script>

<style lang="scss">
@import "src/css/helpers/_functions.scss";
@import "src/css/helpers/_mixins.scss";
@import "src/css/helpers/_variabels.scss";

/*--- Start opinions ---*/
.opinions {
    padding: 30px 0;
    margin-top: 30px;

    .titel {
        margin: 0 auto 100px;
        width: 250px;
        position: relative;

        span {
            font-size: 29px;
            font-family: 'cairoR';
            color: $textColor;
        }

        h2 {
            font-size: 39px;
            font-family: 'airR';
            color: $textColor;
        }
    }

    .opini {
        margin-top: 30px;
        .swiper-container{
            overflow: visible !important;
            width: 100% !important;
            .swiper-slide{
                width: 349.4px;
                .left{
                    position: relative;
                    top: 60px;
                }
                .right{
                    position: relative;
                    top: 60px;
                }
                .avtar {
                    position: relative;
                    margin-bottom: 30px;
                    .backhi{
                        position: relative;
                        svg{
                            position: absolute;
                            width: auto;
                            left: 33px;
                            top: -3px;
                        }
                        .hart {
                            position: relative;

                            svg {
                                position: absolute;
                                top: 11px;
                                right: 58px;
                                left: 0;
                                width: auto;
                            }

                            img {
                                width: auto;
                                position: absolute;
                                left: 0;
                                right: 67px;
                                top: 19px;
                            }
                        }

                        .stud {
                            position: relative;
                            text-align: center;
                            margin: 0 auto;
                            top: -57px;

                            img {
                                width: auto;
                            }

                            svg {
                                position: absolute;
                                top: 81px;
                                left: 0;
                                right: 92px;
                                width: auto;
                            }

                            h2 {
                                color: #fff;
                                font-size: 16px;
                                font-family: 'cairoR';
                                margin-top: 11px;
                            }
                        }
                    }

                    .content {
                        margin-top: -53px;
                        background: linear-gradient(449.36deg, #fd8c78 2%, #f76254 87%);
                        height: 108px;
                        padding: 20px;
                        width: 82.2%;
                        margin-right: 28.1px;
                        .hana {
                            position: relative;
                            padding: 0 10% 0 10%;

                            svg {
                                position: absolute;
                                top: -9px;
                                left: 14px;
                                width: auto;
                            }

                            p {
                                color: #F2F2F2;
                                font-size: 18px;
                                font-family: 'cairoR';
                            }
                        }
                    }
                    .more{
                        position: relative;
                        margin-bottom: 81px;
                        svg{
                            position: absolute;
                            width: auto;
                            left: 33px;
                            top: -3px;
                        }
                        a{
                            position: absolute;
                            left: 157px;
                            top: 19px;
                        }
                    }
                    .tit{
                        position: relative;
                        padding: 11px 23% 0 20%;
                        margin-top: 15px;
                        text-align: right;
                        svg{
                            position: absolute;
                            top: 2px;
                            left: 0;
                            width: 100%;
                        }
                        P{
                            font-size: 14px;
                            color: $textColor;
                        }
                        .gro{
                            img{
                                width: auto;
                                display: inline-block;
                                margin-left: 3px;
                            }
                            h3{
                                display: inline-block;
                                font-size: 15px;
                                font-family: 'cairoR';
                                color: $yalloColor;
                            }
                        }
                    }
                }
            }
        }
    }
}

/*--- End opinions ---*/
</style>
