<template>
  <section class="evaluation">
        <div class="container-fluid">
            <div class="row">
                <div class="col-lg-12">
                    <div class="txt">
                        <svg class="tree" xmlns="http://www.w3.org/2000/svg" width="124.768" height="182.368"
                            viewBox="0 0 124.768 182.368">
                            <g id="Group_173" data-name="Group 173" transform="translate(-1368.988 363.651) rotate(-90)"
                                opacity="0.4">
                                <g id="Group_172" data-name="Group 172" transform="translate(181.283 1368.988)"
                                    opacity="0.46">
                                    <path id="path142"
                                        d="M802.616-618.732s-11.358-13.251-.7-21.669c0,0,7.784-4.71,14.132-4.327,0,0-8.994,15.082-6.084,16.58s8.81-17.528,8.81-17.528,17.715-1.717,23.413,1.024c0,0-15.143,12.391-11.954,13.128s19.547-11.425,19.547-11.425,16.487,2.807,15.608,12.865-6.56,13.16-9.057,12.894-17.1-5.844-17.421-3.795,8.474,8.731,14.63,9.045c0,0-11.624,12.818-19.349,9.117s-8.385-9.562-13.2-11.764-8.926-2.195-6.939.051,10.7,4.422,13.458,9.292,5.225,8.159-2.768,6.956-20.985-7.05-21.555-13.747l-.57-6.7"
                                        transform="translate(-696.637 711.022)" fill="#aec3ff" />
                                    <path id="path144"
                                        d="M844.785-586.458s-44.781-1.724-54.67,11.082a32.379,32.379,0,0,1-8.917,12.515L780.149-560s7.76-8.181,10.537-8.676c0,0-4.343-15.865,54.1-17.779"
                                        transform="translate(-684.136 667.666)" fill="#aec3ff" />
                                    <path id="path146"
                                        d="M756.668-502.944s-9.611,7.109-10.279,19.81l1.744.153s3.07-13.131,8.619-18.268-.084-1.7-.084-1.7"
                                        transform="translate(-659.606 607.75)" fill="#aec3ff" />
                                    <path id="path148"
                                        d="M495.256-730.994s18.067-10.116,9.635-23.849c0,0-6.745-8.432-13.971-10.6,0,0,3.854,20.473,0,20.954s-2.65-23.124-2.65-23.124-19.03-9.154-26.5-8.432c0,0,11.8,20,7.949,19.514s-17.1-20.718-17.1-20.718-19.512-3.613-22.643,7.947,1.927,17.345,4.818,18.067,21.439.481,20.957,2.891-13.008,6.263-19.994,4.1c0,0,7.708,19.03,17.826,18.064s13.249-7.225,19.512-7.707,10.84,1.2,7.708,2.891-13.73.55-18.789,4.852-9.153,6.952.241,8.877,26.257.726,29.63-6.5l3.372-7.225"
                                        transform="translate(-428.986 806.621)" fill="#d4e4f8" />
                                    <path id="path150"
                                        d="M465.2-733.545s50.587,16.383,56.368,34.691a38.439,38.439,0,0,0,4.818,17.586v3.613s-5.3-12.285-8.19-13.973c0,0,11.322-15.9-53-41.916"
                                        transform="translate(-455.298 774.48)" fill="#d4e4f8" />
                                    <path id="path152"
                                        d="M682.562-548.325s7.8,11.844,3.354,26.266l-2.007-.54s1.948-15.883-2.133-23.871.787-1.856.787-1.856"
                                        transform="translate(-611.475 641.538)" fill="#d4e4f8" />
                                    <path id="path154"
                                        d="M734.882-821.594s-23.815-13.335-12.7-31.435c0,0,8.891-11.115,18.417-13.973,0,0-5.081,26.991,0,27.629s3.493-30.484,3.493-30.484,25.086-12.067,34.93-11.115c0,0-15.559,26.353-10.479,25.719s22.545-27.309,22.545-27.309,25.721-4.761,29.849,10.481-2.54,22.861-6.351,23.816-28.261.634-27.626,3.809,17.147,8.257,26.356,5.4c0,0-10.161,25.085-23.5,23.813s-17.465-9.526-25.721-10.16-14.289,1.59-10.161,3.81,18.1.729,24.768,6.4,12.066,9.161-.318,11.7-34.612.955-39.057-8.574l-4.446-9.526"
                                        transform="translate(-639.87 883.266)" fill="#d2e0ff" />
                                    <path id="path156"
                                        d="M833.916-824.945s-66.683,21.592-74.3,45.726c0,0,.318,10.8-6.351,23.182v4.765s6.986-16.2,10.8-18.421c0,0-14.924-20.954,69.858-55.251"
                                        transform="translate(-664.599 840.891)" fill="#d4e4f8" />
                                    <path id="path158"
                                        d="M736.712-580.8s-10.284,15.617-4.421,34.625l2.646-.711s-2.568-20.936,2.812-31.468-1.037-2.446-1.037-2.446"
                                        transform="translate(-648.05 665.652)" fill="#d4e4f8" />
                                </g>
                            </g>
                        </svg>
                        <img src="~assets/img/rate.png" alt="">
                        <h3>{{$t('الأعلي تقيما')}}</h3>
                    </div>
                    <!-- start rate -->
                    <div class="rate">
                        <div class="container">
                            <div class="row">
                                <div v-for="i in 4" :key="i" class="col-lg-3 col-md-3 col-sm-6 col-xs-12">
                                    <course-card
                                        name="تغذية امراض الجهاز الهضمي السفلي (القولون)"
                                        instructor="د.صبري أبوقرون"
                                        price="1588"
                                        unit="SDG"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import courseCard from 'components/utils/courseCard'
export default {
  name: 'Evaluation',
  components: {
    courseCard
  },
  props: {
  }
}
</script>
<style lang="scss" scope>
@import "src/css/helpers/_functions.scss";
@import "src/css/helpers/_mixins.scss";
@import "src/css/helpers/_variabels.scss";
/*--- Start Evaluation ---*/
.evaluation {
    padding: 20px 0;
    margin-top: 30px;

    .txt {
        position: relative;
        margin-bottom: 40px;
        text-align: right; // Addedd by almudather

        .tree {
            position: absolute;
            left: 0;
            top: -17px;
            right: -63px;
            width: auto;
        }

        img {
            width: auto;
            display: inline-block;
        }

        h3 {
            font-size: 25px;
            font-family: 'cairoR';
            display: inline-block;
            color: $textColor;
            margin-right: 7px;
        }
    }

    .rate {
        margin-top: 30px;

        .parent {
            text-align: right; // Addedd by almudather
            .imag {
                position: relative;
                border-radius: 50px;
                overflow: hidden;
                height: 327px;

                .overlay {
                    @include overlay;
                    background-color: rgba(#fbfbff, .6);
                }

                img {
                    width: 100%;
                }

                .magtxt {
                    h4 {
                        position: absolute;
                        top: 50px;
                        left: 77px;
                        color: #7B7B7B;
                        font-size: 18px;
                        font-family: 'cairoR';
                        width: 59%;
                    }

                    img {
                        position: absolute;
                        width: auto;
                        top: 50%;
                        left: 44%;
                    }
                }
            }

            .pric {
                background-color: #FC9685;
                padding: 20px;
                border-radius: 107px 107px 27px 27px;
                height: 138px;
                width: 210px;
                margin: -59px auto;
                position: relative;
                z-index: 2;
                text-align: right; // Addedd by almudather

                .detai {
                    text-align: center;

                    span {
                        display: inline-block;
                        font-size: 13px;
                        font-family: 'cairoR';
                        color: #fff;
                        margin: 0 0 0 6px;
                    }

                    h3 {
                        display: inline-block;
                        color: #FFF067;
                        font-size: 31px;
                        font-family: 'cairoR';
                    }
                }

                button {
                    width: 106px;
                    height: 33px;
                    background-color: #FFF067;
                    color: $textColor;
                    font-size: 14px;
                    outline: 0;
                    // margin-left: 300px; // Addedd by almudather
                    margin-top: 26px;
                    @include prefixer(box-shadow, 8px 3px 7px #9e9e9e36, webkit moz ms);
                }

                .cart {
                    position: relative;
                    cursor: pointer;

                    .sala {
                        position: absolute;
                        left: 4px;
                        top: -31px;
                        width: auto;
                    }

                    img {
                        width: auto;
                        position: absolute;
                        left: 19px;
                        top: -21px;
                    }
                }
            }

            .name {
                border-radius: 57px;
                background-color: #F67A66;
                width: 272px;
                left: 7px;
                padding-top: 195px;
                height: 242px;
                position: relative;
                top: -116px;
                z-index: -1;
                @include prefixer(box-shadow, 8px 12px 8px #eceaea, webkit moz ms);

                .user {
                    margin-right: 23px;
                    text-align: right; // Addedd by almudather

                    img {
                        display: inline-block;
                        width: auto;
                    }

                    h3 {
                        display: inline-block;
                        font-size: 13px;
                        color: #fff;
                    }
                }
            }
        }
    }
}

/*--- End Evaluation ---*/
</style>
