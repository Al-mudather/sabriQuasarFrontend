<template>
	<section class="web">
        <!--=============== START navbar ===============-->
        <user-nav-bar /> 
        <!--=============== End navbar ===============-->

        <!--=============== START My Courses ===============-->
        <section class="myCourses">
            <div class="container-fluid">
                <div class="row">
                    <div class="col-lg-12">
                        <div class="titel titel2">
                            <img src="~assets/img/tit.png" alt="">
                            <h3>لوحتي التعليمية</h3>
                        </div>
                        <!-- start afilliate bord -->
                        <afilliateBord />
                        <!-- end afilliate bord -->
                        <div class="titel">
                            <img src="~assets/img/tit.png" alt="">
                            <h3>كورساتـي</h3>
                        </div>
                    </div>
                </div>
                <!-- start card -->
                <div class="cards">
                    <div class="container">
                        <div class="row">
                            <div class="col-lg-12">
                                <div class="group">
                                    <div class="row justify-center">
                                        <div class="col-12 row justify-center">
                                            <div v-for="enrollment in lodash.get(allEnrollmentsForCurrentUser, '[edges]')" :key="enrollment.node.id" class="col-lg-3 col-md-6 col-sm-6 col-xs-12">
                                                <course-card
                                                    :course="enrollment.node.course"
                                                    :totalFinishedCourseContents="enrollment.node.learningprogressSet.totalCount"
                                                />
                                            </div>
                                        </div>
                                        <!-- more card-->
                                        <div class="more" style="display: none">
                                            <svg class="right" xmlns="http://www.w3.org/2000/svg" width="79.943" height="79.63" viewBox="0 0 79.943 79.63">
                                                <g id="Group_174" data-name="Group 174" transform="translate(30.308 -7.85) rotate(51)" opacity="0.5">
                                                <g id="Group_172" data-name="Group 172" transform="translate(0 0)">
                                                    <path id="path142" d="M2.276,11.882s-4.912-5.731-.3-9.371c0,0,3.367-2.037,6.112-1.871,0,0-3.89,6.522-2.631,7.17S9.263.23,9.263.23s7.661-.743,10.126.443c0,0-6.549,5.359-5.17,5.677s8.454-4.941,8.454-4.941,7.13,1.214,6.75,5.564-2.837,5.691-3.917,5.576-7.4-2.527-7.534-1.641,3.665,3.776,6.327,3.911c0,0-5.027,5.543-8.368,3.943s-3.626-4.135-5.709-5.088-3.861-.949-3,.022,4.629,1.912,5.82,4.019,2.26,3.528-1.2,3.008-9.076-3.049-9.322-5.945l-.247-2.9" transform="translate(43.558 28.031)" fill="#aec3ff"/>
                                                    <path id="path144" d="M27.954.034S8.587-.712,4.31,4.826A14,14,0,0,1,.453,10.239L0,11.475S3.356,7.937,4.557,7.723c0,0-1.878-6.861,23.4-7.689" transform="translate(41.524 35.087)" fill="#aec3ff"/>
                                                    <path id="path146" d="M4.446.488A12.162,12.162,0,0,0,0,9.055l.754.066s1.328-5.679,3.727-7.9S4.446.488,4.446.488" transform="translate(37.532 44.838)" fill="#aec3ff"/>
                                                    <path id="path148" d="M28.66,20.234s7.814-4.375,4.167-10.314c0,0-2.917-3.647-6.042-4.583,0,0,1.667,8.854,0,9.062s-1.146-10-1.146-10S17.409.439,14.179.751c0,0,5.1,8.648,3.438,8.44s-7.4-8.96-7.4-8.96S1.782-1.331.427,3.668s.833,7.5,2.084,7.814,9.272.208,9.064,1.25S5.949,15.441,2.928,14.5c0,0,3.334,8.23,7.709,7.812s5.73-3.125,8.439-3.333,4.688.52,3.334,1.25-5.938.238-8.126,2.1-3.959,3.007.1,3.839,11.356.314,12.814-2.813l1.459-3.125" transform="translate(0 12.473)" fill="#d4e4f8"/>
                                                    <path id="path150" d="M0,0S21.878,7.085,24.378,15a16.624,16.624,0,0,0,2.084,7.606v1.562s-2.292-5.313-3.542-6.043c0,0,4.9-6.876-22.92-18.128" transform="translate(4.282 17.704)" fill="#d4e4f8"/>
                                                    <path id="path152" d="M1.045.973A14.427,14.427,0,0,1,2.5,12.333L1.628,12.1S2.47,5.23.705,1.776s.34-.8.34-.8" transform="translate(29.699 39.339)" fill="#d4e4f8"/>
                                                    <path id="path154" d="M6.771,26.672s-10.3-5.767-5.493-13.6c0,0,3.845-4.807,7.965-6.043,0,0-2.2,11.673,0,11.949S10.754,5.8,10.754,5.8,21.6.58,25.86.992c0,0-6.729,11.4-4.532,11.123S31.079.3,31.079.3,42.2-1.755,43.988,4.837s-1.1,9.887-2.747,10.3-12.222.274-11.948,1.648,7.416,3.571,11.4,2.335c0,0-4.395,10.849-10.162,10.3s-7.553-4.12-11.124-4.394-6.18.688-4.395,1.648,7.828.315,10.712,2.767,5.218,3.962-.137,5.061-14.969.413-16.892-3.708l-1.923-4.12" transform="translate(34.32 0)" fill="#d2e0ff"/>
                                                    <path id="path156" d="M34.882,0S6.043,9.338,2.747,19.776A21.911,21.911,0,0,1,0,29.8v2.061s3.021-7,4.669-7.967c0,0-6.455-9.062,30.212-23.9" transform="translate(38.344 6.896)" fill="#d4e4f8"/>
                                                    <path id="path158" d="M2.693,1.283A19.021,19.021,0,0,0,.781,16.257l1.144-.308S.815,6.9,3.142,2.34s-.448-1.058-.448-1.058" transform="translate(35.651 35.415)" fill="#d4e4f8"/>
                                                </g>
                                                </g>
                                            </svg>
                                            <svg class="left" xmlns="http://www.w3.org/2000/svg" width="81.125" height="75.286" viewBox="0 0 81.125 75.286">
                                                <g id="Group_178" data-name="Group 178" transform="translate(54.283 83.87) rotate(-135)" opacity="0.64">
                                                <g id="Group_172" data-name="Group 172" transform="translate(0 0)">
                                                    <path id="path142" d="M2.215,11.566S-2.566,5.987,1.92,2.444c0,0,3.277-1.983,5.949-1.822,0,0-3.786,6.349-2.561,6.979S9.016.224,9.016.224,16.473-.5,18.872.655c0,0-6.375,5.216-5.032,5.526s8.228-4.809,8.228-4.809,6.94,1.182,6.57,5.416-2.762,5.54-3.813,5.428-7.2-2.46-7.333-1.6,3.567,3.675,6.159,3.807c0,0-4.893,5.4-8.145,3.838s-3.53-4.025-5.557-4.952-3.758-.924-2.921.021,4.506,1.862,5.665,3.912,2.2,3.434-1.165,2.928S2.7,17.2,2.455,14.385l-.24-2.819" transform="translate(42.397 27.284)" fill="#aec3ff"/>
                                                    <path id="path144" d="M27.209.033S8.358-.693,4.2,4.7A13.63,13.63,0,0,1,.441,9.966L0,11.169S3.266,7.726,4.435,7.517c0,0-1.828-6.678,22.773-7.484" transform="translate(40.417 34.152)" fill="#aec3ff"/>
                                                    <path id="path146" d="M4.327.475A11.838,11.838,0,0,0,0,8.814l.734.064s1.292-5.528,3.628-7.69S4.327.475,4.327.475" transform="translate(36.531 43.643)" fill="#aec3ff"/>
                                                    <path id="path148" d="M27.9,19.694S35.5,15.436,31.952,9.655c0,0-2.839-3.549-5.881-4.461,0,0,1.622,8.618,0,8.821s-1.116-9.734-1.116-9.734S16.945.428,13.8.732c0,0,4.969,8.417,3.346,8.215S9.948.225,9.948.225,1.734-1.3.416,3.57s.811,7.3,2.028,7.605,9.025.2,8.822,1.217S5.79,15.029,2.85,14.118c0,0,3.245,8.011,7.5,7.6s5.577-3.042,8.214-3.244,4.563.507,3.245,1.217-5.78.232-7.909,2.042-3.853,2.927.1,3.737,11.053.305,12.473-2.738l1.42-3.042" transform="translate(0 12.141)" fill="#d4e4f8"/>
                                                    <path id="path150" d="M0,0S21.295,6.9,23.728,14.6a16.181,16.181,0,0,0,2.028,7.4v1.521s-2.231-5.172-3.448-5.882c0,0,4.766-6.692-22.309-17.645" transform="translate(4.168 17.232)" fill="#d4e4f8"/>
                                                    <path id="path152" d="M1.017.947A14.042,14.042,0,0,1,2.429,12l-.845-.227S2.4,5.091.686,1.728s.331-.781.331-.781" transform="translate(28.907 38.291)" fill="#d4e4f8"/>
                                                    <path id="path154" d="M6.591,25.961S-3.435,20.347,1.244,12.728c0,0,3.743-4.679,7.753-5.882,0,0-2.139,11.362,0,11.631s1.47-12.832,1.47-12.832S21.027.565,25.171.965c0,0-6.55,11.094-4.411,10.827S30.25.3,30.25.3s10.827-2,12.565,4.412-1.069,9.623-2.673,10.025-11.9.267-11.629,1.6,7.218,3.476,11.094,2.273c0,0-4.277,10.56-9.891,10.024s-7.352-4.01-10.827-4.277-6.015.669-4.277,1.6,7.619.307,10.426,2.693,5.079,3.856-.134,4.926-14.57.4-16.441-3.609l-1.871-4.01" transform="translate(33.405 0)" fill="#d2e0ff"/>
                                                    <path id="path156" d="M33.952,0S5.881,9.089,2.673,19.248A21.326,21.326,0,0,1,0,29.007v2.006s2.941-6.818,4.545-7.754c0,0-6.282-8.821,29.407-23.258" transform="translate(37.322 6.712)" fill="#d4e4f8"/>
                                                    <path id="path158" d="M2.622,1.248A18.514,18.514,0,0,0,.76,15.824l1.114-.3S.793,6.711,3.058,2.278s-.437-1.03-.437-1.03" transform="translate(34.701 34.471)" fill="#d4e4f8"/>
                                                </g>
                                                </g>
                                            </svg> 
                                            <button>عرض المزيد <img src="~assets/img/moree.png" alt=""></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>  
        <!--=============== End My Courses ===============-->
        <Footer />
    </section>
</template>

<script>
import UserNavBar from 'src/components/utils/UserNavBar'
import courseCard from 'src/components/MyCourses/courseCard'
import afilliateBord from 'src/components/MyCourses/afilliateBord'
import Footer from 'src/components/utils/Footer'
import { AllEnrollmentsForCurrentUser } from 'src/queries/enrollment_management/query/AllEnrollmentsForCurrentUser'

export default {
    name: 'MyCourses',
    data () {
        return {
            lodash: this.$_,
            allEnrollmentsForCurrentUser: {}
        }
    },

	components: {
		UserNavBar,
		courseCard,
        afilliateBord,
        Footer
	},

    apollo: {
      allEnrollmentsForCurrentUser: {
        query() {
            return AllEnrollmentsForCurrentUser
        }
      }
    },

    methods: {
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
        }
    }
}
</script>

<style lang="scss">
@import "src/css/helpers/_mixins.scss";
@import "src/css/helpers/_variabels.scss";
.web {
	width: 100%;
	position: relative;
	overflow: hidden;
}

/*--- START My Courses ---*/
.myCourses{
    padding: 10px;
    margin: 20px 0 45px 0;
    position: relative;
    .titel{
        display: inline-block;
        width: 100%;
        padding: 12px;
        background: #fff;
        margin: 18px 5% 16px 5%;
        img{
            display: inline-block;
            // display: inline-block;
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
    /* لوحتي التعليمية */
    .move{
        margin: 30px 0 30px 0;
        padding: 0 1% 0 1%;
        .col-lg-7{
            //maxMobile
            @media(max-width:767px){
                width: 50%;
            }
        }
        .col-lg-5{
            //maxMobile
            @media(max-width:767px){
                width: 50%;
            }
        }
        .col-lg-7{
            //minSmall
            @media(min-width:768px){
                width: 50%;
            }
        }
        .col-lg-5{
            //minSmall
            @media(min-width:768px){
                width: 50%;
            }
        }
        .bord{
            padding: 15px;
            background-color: #7B86FA;
            border-radius: 14px;
            height: auto;
            margin: 0 0 25px 0;
            position: relative;
            overflow: hidden;
            .money{
                width: auto;
                position: absolute;
                left: 0;
                right: -31px;
                bottom: -43px;
            }
            .price{
                position: relative;
                display: inline-block;
                top: 0;
                width: 100%;
                img{
                    position:absolute;
                    top: 0;
                }
                .hrcooo{
                    right: -16px;
                }
                .hrColor{
                    left: 0;
                }
                h2{
                    color: #fff;
                    font-family: 'cairoR';
                    font-size: 17px;
                }
                h3{
                    color: #FFF067;
                    font-size: 31px;
                    font-family: 'cairoR';
                }
                span{
                    display: inline-block;
                    font-size: 13px;
                    font-family: 'cairoR';
                    color: #fff;
                    margin: 0 0 0 6px;
                }
                .box{
                    text-align: center;
                    width: 78px;
                    background-color: #fff;
                    border-radius: 11px;
                    margin: 12px auto;
                    height: 64px;
                    h3{
                        font-size: 28px;
                        color: #7B86F8;
                        font-family: 'cairoB';
                        margin: 2px 0 3px 0;
                        text-align: center;
                    }
                    span{
                        display: block;
                        color: $textColor;
                        margin: 0;
                    }
                }
            }
            .right{
                h2{
                    text-align: center;
                }
            }
            .linke{
                text-decoration: none;
                margin: 0 20px 0 0;
                position: absolute;
                width: 86px;
                cursor: pointer;
                h3{
                    font-size: 12px;
                    display: inline-block;
                    color: #ffff;
                    font-family: 'cairoR';
                    .mage{
                        width: auto;
                        display: inline-block;
                        margin: 0;
                        position: unset;
                    }
                }
            }
            .share{
                text-align: center;
                margin: 0 0 7px 0;
                padding: 10px;
                form{
                    position: relative;
                    text-align: center;
                    width: 78%;
                    margin: 0 auto;
                    top: 17px;
                    //maxMobile
                    @media(max-width:767px){
                        width: 100%;
                    }
                    input{
                        background-color: #8d96ff;
                        border: none;
                        width: 100%;
                        height: 37px;
                        outline: 0;
                        padding: 0px 29px 0 0;
                        overflow: hidden;
                        border-radius: 100px;
                        font-family: 'cairoR';
                        color: #fff;
                    }
                    button{
                        width: 41px;
                        height: 33px;
                        background-color: #fcc74c;
                        position: absolute;
                        left: 5px;
                        top: 2px;
                        font-size: 16px;
                        outline: 0;
                        img{
                            width: 20px;
                        }
                    }
                }
            }
        }
        .load{
            img{
                width: 100%;
                height: 207px;
                //maxMobile
                @media(max-width:767px){
                    height: 207px;
                }
            }
        }
    }
    /* courses card */
    .cards{
        margin: 20px 0 20px 0;
        .group{
            .card{
                border: 0;
                padding: 13px;
                border-radius: 23px;
                margin: 0 0 25px 0;
                @include prefixer(box-shadow, 2px 6px 30px #e8e8e8, webkit moz o);
                .pro{
                    position: relative;
                    span{
                        position: absolute;
                        z-index: 55;
                        top: -36px;
                        right: 12px;
                        left: 0;
                        font-size: 16px;
                        color: #707070;
                        font-family: 'cairoR';
                    }
                    .progress{
                        margin:-7px 0 -4px 0;
                        height: 7px;
                        position: relative;
                        z-index: 2;
                        background-color: #fff;
                        .progress-bar{
                            background: linear-gradient(90deg, rgba(123,134,250,1) 17%, rgba(252,212,98,1) 66%);
                            border-radius:50px;
                        }
                    }
                }
                .card-img-top{
                    position: relative;
                    .overlay{
                        @include overlay;
                        background-color:rgba(#fff, .2);
                        backdrop-filter: blur(2px);
                        -webkit-backdrop-filter: blur(2px);
                        -moz-backdrop-filter: blur(2px);
                        z-index: 1;
                        background: inherit;
                        border-radius: 14px;
                    }
                    img{
                        width: 100%;
                        border-radius: 14px;
                        position: relative;
                    }
                }
                .card-body{
                    padding: 8px; 
                    h5{
                        font-size: 17px;
                        font-family: 'cairoR';
                        color: #707070;
                        line-height: 1.7;
                        margin: 11px 0 34px 0;
                    }
                    .btn{
                        width: 100%;
                        height: 44px;
                        margin: 0 auto;
                        border-radius: 50px;
                        background-color:#7b86fa;
                        h3{
                            color: #fff;
                            font-size: 14px;
                            font-family: 'cairoR';
                            display: inline-block;
                            margin: 8px 0 0 0;
                        }
                        img{
                            width: auto;
                            float: left;
                        }
                    }
                }
            }
            /* more button*/
            .more{
                position: relative;
                margin: 64px auto 69px auto;
                width: 205px;
                text-align: center;
                .right{
                    position: absolute;
                    top: -19px;
                    right: -44px;
                    width: auto;
                }
                .left{
                    position: absolute;
                    top: 11px;
                    left: -37px;
                    width: auto;
                }
                button{
                    outline: 0;
                    position: relative;
                    width: 197px;
                    height: 53px;
                    border: 2px solid #ECECEC;
                }
            }
        }
    }
}
/*--- End My Courses ---*/
</style>