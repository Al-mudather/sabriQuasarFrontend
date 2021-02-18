<template>
	<section class="web">
        <!--=============== START navbar ===============-->
        <courses-nav-bar />
        <!--=============== End navbar ===============-->

        <!--=============== START My Courses ===============-->
        <section class="myCourses">
            <div class="container-fluid">
                <div class="row">
                    <div class="col-lg-12">
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
                                    <div v-for="enrollment in lodash.get(allEnrollmentsForCurrentUser, '[edges]')" :key="enrollment.node.id" class="col-lg-3 col-md-6 col-sm-6 col-xs-12">
                                        <course-card
                                            :course="enrollment.node.course"
                                            :totalFinishedCourseContents="enrollment.node.learningprogressSet.totalCount"
                                        />
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

    </section>
</template>

<script>
import CoursesNavBar from 'src/components/utils/CoursesNavBar'
import courseCard from 'src/components/MyCourses/courseCard'
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
		CoursesNavBar,
		courseCard
	},

    apollo: {
      allEnrollmentsForCurrentUser: {
        query() {
            return AllEnrollmentsForCurrentUser
        }
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
                        width: 138px;
                        display: block;
                        margin: 0 auto;
                        border-radius: 50px;
                        background-color:#7b86fa;
                        color: #fff;
                        font-size: 14px;
                        font-family: 'cairoR';
                    }
                }
            }
        }
    }
}
/*--- End My Courses ---*/
</style>