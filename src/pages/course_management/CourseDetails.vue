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
                    <courseMainCard :courseData="courseData" :openCourse="openCourse" /> 
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
                        <h3>{{$t('دورات ذات صلة')}}</h3>
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
import courseMainCard from 'components/courseDetails/courseMainCard.vue'
import aboutTheCourse from 'components/courseDetails/aboutTheCourse'
import whatIwillLearn from 'components/courseDetails/whatIwillLearn.vue'
import coursePreRequisites from 'components/courseDetails/coursePreRequisites'
import courseUnits from 'components/courseDetails/courseUnits.vue'
import courseInstructors from 'components/courseDetails/courseInstructors'
import { GetCourseByID } from 'src/queries/course_management/query/GetCourseByID'
import { AllEnrollmentsForCurrentUser } from 'src/queries/enrollment_management/query/AllEnrollmentsForCurrentUser'
import { FORMAT_THE_IAMGE_URL, FORMAT_THE_WEB_SIT_URL } from 'src/utils/functions.js'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'CourseDetails',
  data () {
    return {
        FORMAT_THE_IAMGE_URL: FORMAT_THE_IAMGE_URL,
        FORMAT_THE_WEB_SIT_URL: FORMAT_THE_WEB_SIT_URL,
        courseID: '',
        coursePK: '',
        openCourse: false,
        courseData: ''
    }
  },

  metaInfo: {
    title: "",
    meta:[
        {charset: 'utf-8'},
        { vmid: 'description', name: 'description', content: "" },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        // TWitter
        { name: 'twitter:title', content: "" },
        { name: 'twitter:description', content: "" },
        { name: 'twitter:image', content: "" },
        { name: 'twitter:title', content: "" },
        // Google+ / Schema.org
        { itemprop: 'name', content: "" },
        { itemprop: 'description', content: "" },
        // Facebook / Open Graph
        // SMO
        { property: 'og:title', content: "" },
        { p: 'og:image', c: "" },
        { p: 'og:url', c: "" },
        { p: 'og:site_name', c: location.origin }
    ]
  },

  metaInfo () {
    return {
      title: this.courseData.title,
      meta: [
        {charset: 'utf-8'},
        { vmid: 'description', name: 'description', content: this.courseData.brief },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        // TWitter
        { name: 'twitter:title', content: this.courseData.title },
        { name: 'twitter:description', content: this.courseData.brief },
        { name: 'twitter:image', content: this.FORMAT_THE_IAMGE_URL(this.courseData.profile) },
        { name: 'twitter:title', content: this.courseData.brief },
        // Google+ / Schema.org
        { itemprop: 'name', content: this.courseData.title },
        { itemprop: 'description', content: this.courseData.brief },
        // Facebook / Open Graph
        // { property: 'fb:app_id', content: '123456789' },
        // SMO
        { property: 'og:title', content: this.courseData.title },
        { p: 'og:image', c: this.FORMAT_THE_IAMGE_URL(this.courseData.profile) },
        { p: 'og:url', c: this.FORMAT_THE_WEB_SIT_URL(`${this.courseData.pk}/${this.courseData.id}`) },
        { p: 'og:site_name', c: location.origin }
      ]
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
  computed: {
    ...mapState('authentication',['token']),
    ...mapState('settings',['isEnglish']),
  },
  mounted () {
    this.changeTheLayoutStyle(this.isEnglish)
  },
  watch: {
    isEnglish (val) {
        this.changeTheLayoutStyle(val)
    },

    '$route.params': {
      handler: async function (params) {
        this.courseID = params.id
        this.coursePK = params.pk
        //TODO: Get the registeration code from the link
        const marketerCode = this.$_.get(params, "[code]")
        //TODO: Set the registerstion code to the stoare
        this.SET_REGISTERATION_CODE_ACTION(marketerCode)
        //TODO: Don't open the course yet
        this.openCourse = false
        // TODO: IS THE USER HAS VALED INROLLMENT IN THIS COURSE
        this.IS_THE_USER_HAS_VALED_INROLLMENT_IN_THIS_COURSE(params.pk)
        // TODO: GET THE COURSE BY PK
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
  },
  methods: { 
    ...mapActions("pyramidManagement", ["SET_REGISTERATION_CODE_ACTION"]),

    async IS_THE_USER_HAS_VALED_INROLLMENT_IN_THIS_COURSE (coursePK) {
        //TODO: IF the user is loged in
        if (this.token) {
            try {
                const res = await this.$apollo.query({
                    query: AllEnrollmentsForCurrentUser,
                })
    
                res.data.allEnrollmentsForCurrentUser.edges.map(enroll => {
                    if (enroll.node.course.pk == coursePK) {
                        this.openCourse = true
                    }
                })
            } catch (error) {
            }
        }
    },
    
    changeTheLayoutStyle(value) {
        if (value) {
            this.$jquery('.hedd > .point > img').css({
                'transform': 'translateX(-1rem)'
            })
        } else {
            this.$jquery('.hedd > .point > img').css({
                'transform': 'translateX(0rem)'
            })
        }
    }
  }

}
</script>
<style lang="scss">
@import "src/css/helpers/_mixins.scss";
@import "src/css/helpers/_variabels.scss";

/*--- START cources ---*/
.courceDetails{
    padding: 50px 0;
    margin: 25px 0 50px 0;
    .titel{
        margin: 0 0 39px 0;
        //maxMobile
        @media(max-width:767px){
            margin: 0 0 -16px 0;
            min-height: 10rem;
        }
        img{
            display: inline-block;
            margin: -9px 0 0 0;
            margin-left: 1rem;
        }
        h3{
            color: $textColor;
            font-size: 22px;
            font-family: 'cairoB';
            line-height: 1.7;
            margin: 0 -10px 0 0;
            display: inline-block;
            width: 94%;
            padding: 10px 20px 8px 0;
            background: #fefefe;
            //maxMobile
            @media(max-width:767px){
                font-size: 18px;
            }
        }
    }
    .mix{
        margin: 57px 0 39px 0;
    }
    .asid{
        margin: -31px 0 50px 0;
        //maxMobile
        @media(max-width:767px){
            margin: -31px 0 0 0;
        }
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
            //maxMobile
            @media(max-width:767px){
                right: 0;
            }
            //maxSmall
            @media(max-width:991px){
                right: 0;
            }
            .mag{
                width: 330px;
                height: 243px;
                border-radius: 47px;
                overflow: hidden;
                //maxMobile
                @media(max-width:767px){
                    width: 100%;
                    overflow: hidden;
                }
                //maxSmall
                @media(max-width:991px){
                    width: 100%;
                    height: auto;
                    overflow: hidden;
                }
                img{
                    height: 100%;
                    width: 100%;
                    //maxMobile
                    @media(max-width:767px){
                        width: 100%;
                    }
                    //maxSmall
                    @media(max-width:991px){
                        width: 100%;
                    }
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
            height: 335px;
            @include prefixer(box-shadow, 2px 9px 18.79px 2.21px rgba(147, 147, 147, 0.14), webkit moz o ms);
            .uper{
                position: relative;
                margin: -106px 0 6px 0;
                z-index: 1;
                //maxMobile
                @media(max-width:767px){
                    margin: -120px 0 12px 0;
                }
                //maxSmall
                @media(max-width:991px){
                    margin: -120px 0 12px 0;
                }
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
                    background: #ffffffde;
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
                width: 250px;
                height: 171px;
                margin: 0 auto;
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
                        width: 105px;
                    }
                }
                .share{
                    position: absolute;
                    top: 102px;
                    right: 16px;
                    width: auto;
                    cursor: pointer;
                }
                .addCou{
                    position: absolute;
                    top: 100px;
                    left: 16px;
                    width: auto;
                    cursor: pointer;
                }
            }
            /*share linke*/
            .share{
                text-align: center;
                margin: 0 0 7px 0;
                form{
                    position: relative;
                    text-align: center;
                    width: 80%;
                    margin: 0 auto;
                    top: 0;
                    //maxMobile
                    @media(max-width:767px){
                        width: 100%;
                    }
                    input{
                        background-color: #5868b8e6;
                        border: none;
                        width: 100%;
                        height: 41px;
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
                        top: 4px    ;
                        font-size: 16px;
                        outline: 0;
                        img{
                            width: 20px;
                        }
                    }
                }
            }
        }
    }

    /*-- detailes --*/
    .detailes{
        padding: 10px;
        border-right: 7px solid #F6F6F6;
        //maxMobile
        @media(max-width:767px){
            border: none;
        }
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
                display: flex;
                width: 100%;
                //maxMobile
                @media(max-width:767px){
                    margin: 0 0px 17px 0;
                }
                img{
                    width: auto;
                    display: inline-block;
                    width: 25px;
                    height: 25px;
                }
                h3{
                    display: inline-block;
                    color: #9C9C9C;
                    font-size: 16px;
                    font-family: 'cairoR';  
                    margin: 0 11px 0 0;
                    line-height: 1.7;
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
                    .img-user{
                        position: relative;
                        width: 97px;
                        text-align: center;
                        margin: 0 auto;
                        svg{
                            position: absolute;
                            top: 0;
                            right: 9px;
                            left: 0;
                        }
                        img{
                            border-radius: 50%;
                            width: 69px;
                            position: relative;
                            height: 69px;
                            margin: 5px 0 14px 0;
                        }
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
                    a{
                        text-decoration: none;
                        h3{
                            font-size:11px;
                            color: $textColor;
                            font-family: 'cairoB';
                            margin: 0;
                            img{
                                width: auto;                        
                                height: auto;
                                margin: 0 5px 0 0;
                            }
                        }
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
                width: 143px;
                height: 53px;
                border: 2px solid #ECECEC;
            }
            .right{
                position: absolute;
                top: -19px;
                right: -11px;
                width: auto;
            }
            .left{
                position: absolute;
                top: 11px;
                left: -11px;
                width: auto;
            }
        }
    }
    .rate {
        margin-top: 30px;
        .parent{
            position: relative;
            border: 0;
            box-shadow: 3px 7px 15px #eceaea;
            border-radius: 37px;
            background: #E3EDFA;
            width: 100%;
            padding: 10px;
            height: 441px;
            .pattern{
                position: absolute;
                top: 0;
                width: 100%;
                left: 0;
                right: 0;
                height: 100%;
            }
            .parent-img-top{
                position: relative;
                padding: 14px;
                height: 294px;
                width: 100%;
                overflow: hidden;
                border-radius: 30px;
                .plays{
                    position: absolute;
                    width: auto;
                    top: 45%;
                    left: 0;
                    right: 44%;
                    height: unset;
                    z-index: 5;
                }
                img{
                    width: 100%;
                    height: 100%;
                    position: absolute;
                    border-width: 0;
                    left: 0;
                    right: 0;
                    top: 0;
                }
            } 
            .parent-body{
                position: relative;
                padding: unset;
                border-radius: 29px;
                background: #F78A78;
                margin: -37px auto 2px auto;
                width: 100%;
                top: -6px;
                height: 164px;
                .parent-title{
                    margin-bottom: 7px;
                    color: #fff;
                    font-size: 17px;
                    font-family: cairoR;
                    line-height: 1.8;
                    background-color: #FC9685;
                    padding: 8px;
                    border-top-left-radius: 26px;
                    border-top-right-radius: 26px;
                    height: 72px;
                    overflow: hidden;
                    -webkit-line-clamp: 2;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                }
                .detai{
                    position: relative;
                    width: 100%;
                    .added{
                        display: inline-block;
                        position: absolute;
                        left: 0;
                        right: -7px;
                        width: 148px;
                        top: 40px;
                        svg{
                            path{
                                fill: #FFF067;
                            }
                            
                        }
                        button{
                            color: #fff;
                            font-size: 14px;
                            font-family: cairoR;
                            position: absolute;
                            left: 0;
                            right: 0;
                            top: 16px;
                            text-align: center;
                            width: 129px;
                            background-color: unset;
                            box-shadow: none;
                            height: unset;
                            outline: 0;
                            color: #7B7B7B;
                        }
                    }
                    h3{
                        display: inline-block;
                        color: #fff067;
                        font-size: 31px;
                        font-family: cairoR;
                        margin-right: 8px;
                    }
                    span{
                        display: inline-block;
                        font-size: 13px;
                        font-family: cairoR;
                        color: #fff;
                    }
                }
                .details{
                    display: inline-block;
                    background-color: unset;
                    height: unset;
                    box-shadow: unset;
                    color: #fff;
                    font-size: 14px;
                    font-family: cairoR;
                    outline: 0;
                    float: left;
                    margin: 4px 0 0 -38px;
                }
            }
        }

    }
}
/*---   End cources ---*/
</style>
