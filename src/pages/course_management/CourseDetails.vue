<template>
    <section class="courceDetails">
        <div class="container">
            <div class="row">
                <div class="col-lg-12">
                    <div  class="titel">
                        <img src="~assets/img/tit.png" alt="">
                        <h3 v-if="courseData.title">{{courseData.title}}</h3>
                        <q-skeleton v-else type="text" />
                    </div>
                </div>
                <div class="col-lg-4">
                    <courseMainCard :courseData="courseData" />
                </div>
                <div class="col-lg-8">
                    <div class="detailes">
                        <aboutTheCourse :courseData="courseData" />

                        <whatIwillLearn :course_id="courseID"/>

                        <coursePreRequisites :course_id="coursePK"/>

                        <courseUnits :course_id="courseID"/>

                        <courseInstructors :course_id="courseID"/>
                    </div>
                </div>
                <div class="col-lg-12">
                    <div class="titel mix">
                        <img src="~assets/img/tit.png" alt="">
                        <h3>دورات ذات صلة</h3>
                    </div>
                </div>
                <div class="col-lg-12">
                    <relatedCoureses :courseData="courseData"/>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import relatedCoureses from 'src/components/courseDetails/relatedCoureses'
import courseMainCard from 'components/courseDetails/courseMainCard'
import aboutTheCourse from 'components/courseDetails/aboutTheCourse'
import whatIwillLearn from 'components/courseDetails/whatIwillLearn'
import coursePreRequisites from 'components/courseDetails/coursePreRequisites'
import courseUnits from 'components/courseDetails/courseUnits'
import courseInstructors from 'components/courseDetails/courseInstructors'
import { GetCourseByID } from 'src/queries/course_management/query/GetCourseByID'

export default {
  name: 'CourseDetails',
  data () {
    return {
      courseID: '',
      coursePK: '',
      courseData: ''
    }
  },
  components: {
    relatedCoureses,
    courseMainCard,
    aboutTheCourse,
    whatIwillLearn,
    coursePreRequisites,
    courseUnits,
    courseInstructors
  },
  computed: {},
  watch: {
    '$route.params': {
      handler: async function (params) {
        this.courseID = params.id
        this.coursePK = params.pk
        const res = await this.$apollo.query({
          query: GetCourseByID,
          variables: {
            coursePk: params.pk
          }
        })

        this.courseData = res.data.course
      },
      deep: true,
      immediate: true
    }
  }
}
</script>
<style lang="scss">
@import "src/css/helpers/_mixins.scss";
@import "src/css/helpers/_variabels.scss";
/*--- start navbar ---*/
// .top {
//     background-color: #fff;
//     .search {
//         form {
//             input {
//                 background-color: #fafafa;
//             }
//             button {
//             }
//         }
//     }
//     .lang {
//         background-color: #fff;
//         border: 2px solid #eceaea;
//         padding: 3px 1px 0 0;
//         h3 {
//             color: #474747;
//         }
//     }
// }
/*--- End navbar ---*/

/*--- START cources ---*/
.courceDetails{
    padding: 50px 0;
    margin: 25px 0 50px 0;
    .titel{
        margin: 0 0 39px 0;
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
    .mix{
        margin: 57px 0 39px 0;
    }
    .asid{
        margin: -31px 0 50px 0 n;
        .rate{
            position: relative;
            z-index: 2;
            top: 50px;
            right: 19px;
            img{
                width: auto;
                display: inline-block;
                position: relative;
                top: -14px;
            }
            h3{
                font-size: 13px;
                font-family: 'cairoR';
                color: #fff;
                display: inline-block;
                margin: 0;
                position: relative;
                line-height: 0;
                top: -13px;
            }
        }
        .vidd{
            position: relative;
            right: 11px;
            z-index: 1;
            .mag{
                width: 330px;
                height: 243px;
                border-radius: 47px;
                img{
                    width: 330px;
                }
            }
            .playy{
                position: absolute;
                width: auto;
                top: 71px;
                left: 48%;
                cursor: pointer;
            }
        }
        .content{
            color: #fff;
            padding: 118px 8px 0 8px;
            top: -104px;
            text-align: center;
            position: relative;
            margin: 22px 0 0 0;
            border-radius: 43px;
            background-color: #fff;
            @include prefixer(box-shadow, 2px 9px 18.79px 2.21px rgba(147, 147, 147, 0.14), webkit moz o ms);
            .uper{
                position: relative;
                margin: -106px 0 18px 0;
                z-index: 1;
                .ordO{
                    border-top-right-radius: 34px;
                    border-bottom-right-radius: 34px;
                }
                .ordT{
                    border-top-left-radius: 34px;
                    border-bottom-left-radius: 34px;
                    top: 9px;
                    height: 61px;
                    padding: 5px 14px 0 9px !important;
                    p{
                        position: relative;
                        top: -6px;
                        left: 2px;
                    }
                }
                .tow{
                    text-align: center;
                    display: inline-block;
                    margin: 0 0 20px 0;
                    position: relative;
                    background: #fff;
                    line-height: 1.9;
                    padding: 6px 10px 6px 10px;
                    h3{
                        font-size: 18px;
                        font-family: 'cairoR';
                        color: $textColor;
                        margin: 0;
                        span{
                            color: $yalloColor;
                        }
                    }
                    p{
                        font-size: 15px;
                        margin: 0;
                        color: $textColor;
                        font-family: 'cairoR';
                    }
                    img{
                        width: auto;
                        margin: -6px 0 0 0 ;
                    }
                }
            }
            .more{
                position: relative;
                width: 100%;
                height: 179px;
                svg{
                    position: absolute;
                    top: 0;
                    width: 100%;
                    left: 0;
                    text-align: center;
                }
                .pric{
                    position: relative;
                    top: 36px;
                    text-align: center;
                    h3{
                        color: #F3ECAA;
                        font-size: 24px;
                        font-family: 'cairoR';
                        margin: 0 0 7px 0;
                        span{
                            font-size: 13px;
                            color: #F2F2F2;
                            margin-left: 10px;
                        }
                    }
                    button{
                        background-color: $yalloColor;
                        color: $textColor;
                        outline: 0;
                        height: 40px;
                        width: 113px;
                    }
                }
                .share{
                    position: absolute;
                    top: 102px;
                    right: 59px;
                    width: auto;
                    cursor: pointer;
                }
                .addCou{
                    position: absolute;
                    top: 100px;
                    left: 61px;
                    width: auto;
                    cursor: pointer;
                }
            }
        }
    }

    /*-- detailes --*/
    .detailes{
        padding: 10px;
        border-right: 7px solid #F6F6F6;
        .all{
            margin: 0;
            .hedd{
                position: relative;
                margin: -13px 0 23px 0;
                .point{
                    display: inline-block;
                    svg{
                        position: absolute;
                        top: 0;
                        right: -15px;
                    }
                    img{
                        position: absolute;
                        top: 10px;
                        right: 24px;
                    }
                }
                h3{
                    color: $textColor;
                    font-size: 18px;
                    font-family: 'cairoR';
                    display: inline-block;
                    margin: 17px 55px 0 0;
                }
            }
            p{
               color: #9C9C9C;
               font-size: 16px;
               font-family: 'cairoR';
               line-height: 1.7;
               width: 90%;
               margin-right: 39px;
            }
            .pluse{
                margin: 0 50px 17px 0;
                img{
                    width: auto;
                    display: inline-block;
                }
                h3{
                    display: inline-block;
                    color: #9C9C9C;
                    font-size: 16px;
                    font-family: 'cairoR';
                }
            }
            /*colaps*/
            .card{
                margin: 0 0 10px 0;
                border: 0;
                .card-header{
                    background-color: #fff;
                    border: 0;
                    @include prefixer(box-shadow, 2px 9px 18.79px 2.21px rgba(147, 147, 147, 0.14), webkit moz o ms);
                    a{
                        color: #9C9C9C;
                        font-size: 16px;
                        font-family: 'cairoR';
                        cursor: pointer;
                        .linke{
                            background-color: #0C7AD8;
                            width: 35px;
                            height: 31px;
                            display: inline-block;
                            text-align: center;
                            margin-left: 12px;
                            line-height: 1.7;
                        }
                    }
                }
                .info{
                    padding: 7px;
                    border: 1px solid #F2F2F2;
                    .mage{
                        background-color: #E8EDFE;
                        width: 30px;
                        height: 27px;
                        text-align: center;
                        line-height: 1.5;
                        margin-left: 10px;
                        display: inline-block;
                        img{
                            width: auto;
                        }
                    }
                    h3{
                        display: inline-block;
                        color: #9C9C9C;
                        font-size: 15px;
                        font-family: 'cairoR';
                    }
                    .unlock{
                        background-color: #FFF067;
                    }
                }
            }
            /* Tetcher */
            .tetch{
                margin: 30px 0 0 0;
                .tech{
                    text-align: center;
                    margin: 0 0 25px 0;
                    position: relative;
                    background: #fff;
                    padding: 25px 0 25px 0;
                    border-radius: 30px;
                    svg{
                        position: absolute;
                        top: 25px;
                        left: 98px;
                    }
                    img{
                        border-radius: 50%;
                        width: 69px;
                        position: relative;
                        height: 69px;
                        margin: 5px 0 14px 0;
                    }
                    h3{
                        font-size: 18px;
                        font-family: 'cairoR';
                        color: $textColor;
                        margin: 8px 0 14px 0;
                    }
                    p{
                        margin:0 auto 34px auto;
                        width: 82%;
                    }
                }
            }
        }
        .butDown{
            position: relative;
            margin: 64px auto 69px auto;
            width: 205px;
            text-align: center;
            button{
                outline: 0;
                position: relative;
            }
            .right{
                position: absolute;
                top: -19px;
                right: -19px;
                width: auto;
            }
            .left{
                position: absolute;
                top: 11px;
                left: -19px;
                width: auto;
            }
        }
    }
    .rate {
        margin-top: 30px;

        .parent {
            .imag {
                position: relative;
                border-radius: 50px;
                overflow: hidden;
                height: 327px;
                @media (min-width: 320px) and (max-width: 700px){
                    left: 0;
                }
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
                background-color: #7B86FA;
                padding: 20px;
                border-radius: 107px 107px 27px 27px;
                height: 138px;
                width: 210px;
                margin: -59px auto;
                position: relative;
                z-index: 2;

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
                background-color: #0C79D6;
                width: 272px;
                left: 7px;
                padding-top: 195px;
                height: 242px;
                position: relative;
                top: -116px;
                z-index: -1;
                @include prefixer(box-shadow, 8px 12px 8px #eceaea, webkit moz ms);
                @media (min-width: 320px) and (max-width: 700px){
                    width: 255px;
                }
                .user {
                    margin-right: 23px;

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
            .color{
                background-color: #5666B9;
            }
        }
    }
}
/*---   End cources ---*/
</style>
