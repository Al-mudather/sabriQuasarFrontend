<template>
<div>
    <section class="cources">
        <div class="container">
            <div class="row">
                <div class="col-lg-12">
                    <div class="titel">
                        <img src="~assets/img/tit.png" alt="" />
                        <h3>الـــدورات</h3>
                    </div>
                </div>
                <!-- strat Fltter-->
                <div class="col-lg-12">
                    <div class="search">
                        <form @submit="GetAllCoursesByTitle">
                            <input
                                v-model="search"
                                type="text"
                                placeholder="ما الذي تبحث عنة في التخصص المختار ادناه؟"
                            />
                            <button type="submit"><img src="~assets/img/search.png" /></button>
                        </form>
                    </div>
                </div>
                <div class="col-lg-12">
                    <div class="flbut">
                        <div class="but">
                            <img @click="GetAllCoursesByOrderingDecendinOrAcending('DEC')" class="but-filter" src="~assets/img/sortD.png" alt="" />
                            <img @click="GetAllCoursesByOrderingDecendinOrAcending('ACE')" class="but-filter" src="~assets/img/sortU.png" alt="" />
                        </div>
                        <!--dropdown-->
                        <div class="dropdow">
                            <button class="open active">
                                <img src="~assets/img/fltter.png" alt="" />فلتر
                            </button>
                            <button class="end">
                                <img src="~assets/img/end.png" alt="" />إخفـاء
                            </button>
                            <div class="listt">
                                <img class="arrow" src="~assets/img/arrow.png" alt="" />
                                <h3>
                                    <img
                                        class="tih"
                                        src="~assets/img/poii.png"
                                        alt=""
                                    />
                                    الدورات
                                </h3>
                                <ul @click="ChangeFilter">
                                    <li @click="GetAllCoursesWithoutFilter" class="active">الكل</li>
                                    <li @click="GetAllFreeCourses">مجاني</li>
                                    <li @click="GetAllPayeedCourses">مدفوع</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section class="tabCourc">
      <div class="container">
            <div class="row">
                <div ref="col" class="col-lg-12">

                    <div ref="cat" @click="changeTab" class="swiper-container q-mt-xl">
                        <swiper
                            ref="mySwiper"
                            class="nav nav-tabs"
                            :space-between="1"
                            :options="swiperOptions"
                            
                        >
                            <swiper-slide class="nav-item" v-for="spec in allCourseSpecialities.edges" :key="spec.node.id">
                                <a
                                  style="outline: 0"
                                  :data-course="
                                      JSON.stringify(spec.node.courseSet)
                                  "
                                  @click="changeCourseData(spec.node.id)"
                                  class="nav-link"
                                  id="home-tab"
                                  data-toggle="tab"
                                  role="tab"
                                  aria-controls="home"
                                  aria-selected="true"
                                >
                                  <img src="~assets/img/brain.png" alt="" />{{
                                      spec.node.speciality
                                  }}
                                </a>
                            </swiper-slide>
                        </swiper>
                    </div>

                    <!-- start rate -->
                    <div class="rate">
                        <div class="container-fluid">
                          <div class="tab-content" id="myTabContent">
                            <div class="cn fadeIn" id="home" role="tabpanel" aria-labelledby="home-tab">
                    <!-- {{courses}} -->
                                <div class="row justify-center" v-if="courses.edgeCount > 0">
                                    <div  v-for="course in courses.edges" :key="course.node.id" class="col-lg-3 col-md-6 col-sm-6 col-xs-12">
                                        <transition
                                        appear
                                        enter-active-class="animated fadeIn"
                                        leave-active-class="animated fadeOut"
                                        >
                                            <course-card
                                                :course="course.node"
                                                :name="course.node.title"
                                                instructor="د.صبري أبوقرون"
                                                :price="course.node.courseFee"
                                                unit="SDG"
                                            />
                                        </transition>

                                    </div>
                                </div>
                                <div class="row justify-center" v-else>
                                    <div class="col-lg-3 col-md-6 col-sm-6 col-xs-12">
                                        No data is here
                                    </div>
                                </div>
                            </div>
                          </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</div>
</template>

<script>
import courseCard from 'components/utils/courseCard'
import { GetSpecialities } from 'src/queries/course_management/query/GetAllSpeciallites'
import { GetAllCourses } from 'src/queries/course_management/query/GetAllCourses'
import { QSpinnerHourglass } from 'quasar'
import { mapActions } from 'vuex'
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import 'swiper/swiper-bundle.css'
import 'swiper/swiper.min.css'

export default {
  name: 'Courses',
  data () {
    return {
      counter: 0,
      search: '',
      tab: 'main',
      openFilter: true,
      activeSpecialityID: '',
      allCourseSpecialities: '',
      courses: [],
      allCourses: null,
      filter: {},
      searchFilter: {},
      orderingFilter: {},
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
    courseCard,
    Swiper,
    SwiperSlide
  },

  computed: {},

  apollo: {
    allCourseSpecialities: {
      query () {
        return GetSpecialities
      },
      variables () {
        return {
          courseNumber: 20
        }
      }
    }
  },

  watch: {
    '$route.params': {
      handler: function (params) {
        // TODO: save the searching data 
        this.search = params.search
        // TODO: Make the searching
        this.GetAllCoursesByTitle()
      },
      deep: true,
      immediate: true
    },

    search (val) {
      if (this.$_.isEmpty(val)) {
        this.GetAllCoursesByTitle()
      }
    }
  },

  computed: {
    swiper() {
      return this.$refs.mySwiper.$swiper
    }
  },

  mounted () {
    // TODO: Adjest the swiper
    this.swiper.slideTo(3, 1000, false)
    // TODO: Disable the navebar
    this.setNavbarSearchAction(false)
    // Drowp Down js
    var
      butFilter = document.querySelector('.dropdow .open'),
      butClose = document.querySelector('.dropdow .end'),
      control = document.querySelector('.listt')
    butFilter.addEventListener('click', function () {
      butFilter.style.opacity = '0'
      setTimeout(function () {
        butFilter.style.display = 'none'
        butClose.style.display = 'block'
        setTimeout(function () {
          butClose.style.opacity = '1'
        }, 50)
      }, 50)
      control.style.display = 'block'
      setTimeout(function () {
        control.style.opacity = '1'
        control.style.transform = 'translateY(0)'
        control.style.transition = 'all 0.2s ease-in-out'
      }, 50)
    })

    // close
    butClose.addEventListener('click', function () {
      control.style.opacity = '0'
      control.style.transform = 'translateY(45px)'
      control.style.transition = 'all 0.3s ease-in-out'
      setTimeout(function () {
        control.style.display = 'none'
      }, 100)
      setTimeout(function () {
        butClose.style.display = 'none'
        butFilter.style.display = 'block'
        setTimeout(function () {
          butFilter.style.opacity = '1'
        }, 50)
      }, 50)
    })
  },

  destroyed () {
    // TODO: Enable the navebar
    this.setNavbarSearchAction(true)
  },

  updated () {
    if (this.counter === 0) {
      // TODO: When the page is loadded, select the first category with it's
      // data courses to be viewd
      const targetedAncer = this.$refs.cat.firstChild.firstChild.firstChild.firstChild 
      // TODO: make the first category active
      targetedAncer.classList.add("active");
      const data = JSON.parse(
          targetedAncer.dataset.course
      );
      this.activeSpecialityID = targetedAncer.dataset.id
      this.courses = data
      this.counter += 10
    }
  },

  methods: {
    ...mapActions('authentication', [
      'setNavbarSearchAction'
    ]),
    // TODO: Get All courses by Title from search
    GetAllCoursesByOrderingDecendinOrAcending (type) {
      if (type === 'DEC') {
        this.orderingFilter = { orderBy: ['-title'] }
        this.changeCourseData(this.activeSpecialityID)
      } else {
        this.orderingFilter = { orderBy: ['title'] }
        this.changeCourseData(this.activeSpecialityID)
      }
    },
    // TODO: Get All courses by Title from search
    GetAllCoursesByTitle () {
      this.searchFilter = { title_Icontains: this.search }
      this.changeCourseData(this.activeSpecialityID)
      // TODO: Remove the search filter
      this.searchFilter = {}
    },
    // TODO: Get Only the free courses
    GetAllFreeCourses () {
      this.filter = { isPaid: false }
      this.changeCourseData(this.activeSpecialityID)
    },
    // TODO: Get only the payeed courses
    GetAllPayeedCourses () {
      this.filter = { isPaid: true }
      this.changeCourseData(this.activeSpecialityID)
    },
    // TODO: Get all courses without filter
    GetAllCoursesWithoutFilter () {
      this.filter = { }
      this.changeCourseData(this.activeSpecialityID)
    },
    // TODO: Change the filter activation class
    ChangeFilter (e) {
      const ulParent = e.target.parentElement
      for (const child of ulParent.childNodes) {
        child.classList.remove('active')
      }
      e.target.classList.add('active')
    },
    next () {
      this.$refs.flickity.next()
    },

    previous () {
      this.$refs.flickity.previous()
    },
    // TODO: Get the related courses data when the selected speciality become active
    changeCourseData (specialityID) {

      this.activeSpecialityID = specialityID
      this.$q.loading.show({
        spinner: QSpinnerHourglass,
        spinnerColor: 'primary',
        delay: 400 // ms
      })
      // TODO: fill the varaibles
      this.$apollo.query({
        query: GetAllCourses,
        variables: {
          courseSpeciality: specialityID,
          ...this.filter,
          ...this.searchFilter,
          ...this.orderingFilter
        }
      }).then((res) => {
        this.courses = res.data.allCourses
        this.$q.loading.hide()
      })
    },
    // TODO: Change the speciality when it been clicked
    changeTab (e) {
      e.preventDefault()
      // TODO: Get the cliked li parent for the a child
      const clickedLiParent = e.target.parentElement
      // TODO: Get the parent ul element
      const ulParent = clickedLiParent.parentElement
      if (clickedLiParent.classList.contains('nav-item')) {
        // TODO: Remove the class active from all the li elements
        for (const liParent of ulParent.childNodes) {
          liParent.firstChild.classList.remove('active')
        }
        // TODO: Add the class active to only the cliked item
        clickedLiParent.firstChild.classList.add('active')
      }
    }
  }
}
</script>
<style lang="scss" >
@import "src/assets/css/sass/helpers/_variabels.scss";
@import "src/assets/css/sass/helpers/_mixins.scss";
@import "src/assets/css/account.scss";

.swiper-slide {
    width: max-content !important;
}
/*--- START cources ---*/
.cources{
    padding: 50px 0;
    margin: 25px 0 0 0;
    .titel{
        margin: 0 0 55px 0;
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
    .flbut{
        width: 30%;
        margin: -42px 0 0 0;
        .but{
            display: inline-block;
            overflow: hidden;
            position: relative;
            top: 9px;

            &-filter {
                cursor: pointer;
                transition: all 0.2s ease-in-out;
                &:hover {
                    transform: scale(1.1);
                }
            }

            img{
                display: inline-block;
                margin: 0 0 0 22px;
            }
        }
        .dropdow{
            display: inline-block;
            position: relative;
            z-index: 1;
            button{
                outline: 0;
                width: 117px;
                height: 49px;
                background-color: #F8F8F8;
                img{
                    margin-left: 16px;
                }
                &.active{
                    background-color:$yalloColor;
                }
            }
            .end{
                display: none;
                opacity: 0;
            }
            .listt{
                opacity: 0;
                transform:translateY(45px);
                display: none;
                transition: all 0.3s ease-in-out ;
                position: absolute;
                background-color: #7B86FA;
                padding: 10px;
                border-radius: 13px;
                margin: 20px 0 0 0;
                width: 218px;
                .arrow{
                    position: absolute;
                    top: -11px;
                    left: 112px;
                }
                h3{
                    font-size: 14px;
                    color: #fff;
                    font-family: 'cairoR';
                    margin: 6px 0 14px 0;
                    .tih{
                        display: inline-block;
                        position: relative;
                        top: -1px;
                    }
                }
                ul{
                    list-style: none;
                    margin: 0;
                    li{
                        display: inline-block;
                        cursor: pointer;
                        background-color: #8993fb;
                        color: #fff;
                        padding: 3px 12px;
                        height: 30px;
                        text-align: center;
                        font-size: 14px;
                        border-radius: 12px;
                        &.active{
                            background-color: #fff;
                            color: #BBBBBB;
                        }
                    }
                }
            }
        }
    }
    .search {
        padding: 0 18% 0 0;
        width: 74%;
        margin: -9px auto;
        form {
            position: relative;
            text-align: center;
            input {
                width: 100%;
                height: 54px;
                padding: 15px;
                font-size: 17px;
                font-family: 'cairoR';
                border-radius: 50px;
                border: 0;
                background-color: #fff;
                color: #7B7B7B;
                outline: 0;
                @include prefixer(box-shadow, 2px 9px 18.79px 2.21px rgba(147, 147, 147, 0.14), webkit moz o ms);
            }
            input::placeholder {
                color: #BBBBBB !important;
                font-size: 14px;
                font-family: 'cairoR';
            }

            button {
                width: 47px;
                height: 40px;
                background-color: #F8F8F8;
                position: absolute;
                left: 8px;
                top: 5px;
                font-size: 16px;
                outline: 0;
                img {
                    margin-left: 0px;
                }
            }
        }
    }
}

/*--- Start Training ---*/
.tabCourc {
    padding: 20px 0;
    margin-top: 0;
    .nav-tabs{
        margin: 0 0 59px 0;
        padding: 15px;
        border: 0;
        background-color: #FAFAFA;
        border-radius: 50px;
        .nav-link{
            img{
               margin: -3px -3px 0 2px;
            }
            font-size: 18px;
            font-family: 'cairoR';
            width: 155px;
            height: 44px;
            margin-left: 10px;
            border-radius: 50px;
            color:$textColor;
            border: 1px solid #F6F6F6;
            padding: 7px 10px 0 0;
            background-color: #fff;
            @include prefixer(box-shadow, 2px 9px 18.79px 2.21px rgba(147, 147, 147, 0.14), webkit moz o ms);
            &.active{
                background-color: #2D77D8;
                color: #fff;
            }
        }
    }
    .rate {
        margin-top: 30px;

        .cn {
            padding: 0 0 0 0;
            position: relative;
            @media (min-width: 320px) and (max-width: 700px){
                right: 0;
            }
            .parent {
                @media (min-width: 320px) and (max-width: 700px){
                    margin-bottom: 0;
                }
                .imag {
                    position: relative;
                    border-radius: 50px;
                    overflow: hidden;
                    margin: 0 auto 0 auto;
                    height: 294px;
                    width: 82%;

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
                            top: 25px;
                            left: 0;
                            color: #7B7B7B;
                            font-size: 17px;
                            font-family: 'cairoR';
                            width: 100%;
                            padding: 0 8% 0 13%;
                        }

                        img {
                            position: absolute;
                            width: 26px;
                            top: 45%;
                            left: 44%;
                        }
                    }
                }

                .pric {
                    background-color: #7B86FA;
                    padding: 20px;
                    border-radius: 107px 107px 27px 27px;
                    height: 117px;
                    width: 176px;
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
                        width: 85px;
                        height: 33px;
                        background-color: #FFF067;
                        color: $textColor;
                        font-size: 14px;
                        outline: 0;
                        margin: 8px 0 0 0;
                        @include prefixer(box-shadow, 8px 3px 7px #9e9e9e36, webkit moz ms);
                    }

                    .cart {
                        position: relative;
                        cursor: pointer;
                        right: 12px;
                        margin: 0 0 0 0;

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
                    border-radius: 50px;
                    background-color: #5666B9;
                    width: 100%;
                    padding-top: 178px;
                    height: 222px;
                    position: relative;
                    top: -108px;
                    z-index: -1;
                    @include prefixer(box-shadow, 8px 12px 8px #eceaea, webkit moz ms);

                    .user {
                        margin-right: 23px;

                        img {
                            display: inline-block;
                            width: 25px;
                        }

                        h3 {
                            display: inline-block;
                            font-size: 12px;
                            color: #fff;
                        }
                    }
                }
                .color{
                    background-color: #0C79D6;
                }
            }
        }

    }
}

/*--- End Training ---*/
</style>
