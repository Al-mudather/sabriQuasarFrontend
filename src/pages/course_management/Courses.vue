<template>
  <div>
    <section class="cources">
      <div class="container">
        <div class="row">
          <div class="col-lg-12">
            <div class="titel">
              <img src="~assets/img/tit.png" alt="" />
              <h3>{{ $t("الـــدورات") }}</h3>
            </div>
          </div>
          <!-- strat Fltter-->
          <div class="col-lg-12 col-md-6 col-xs-12">
            <div class="search">
              <form @submit="GetAllCoursesByTitle($event)">
                <q-input
                  v-model="search"
                  borderless
                  @keydown.enter.prevent="GetAllCoursesByTitle($event)"
                  type="text"
                  :placeholder="$t('ما الذي تبحث عنة في التخصص المختار ادناه؟')"
                >
                </q-input>
                <button style="left: 10%" type="submit">
                  <img src="~assets/img/search.png" />
                </button>
              </form>
            </div>
          </div>
          <div class="col-lg-12 col-md-6 col-xs-12">
            <div class="flbut">
              <div class="but">
                <img
                  @click="GetAllCoursesByOrderingDecendinOrAcending('DEC')"
                  class="but-filter"
                  src="~assets/img/sortD.png"
                  alt=""
                />
                <img
                  @click="GetAllCoursesByOrderingDecendinOrAcending('ACE')"
                  class="but-filter"
                  src="~assets/img/sortU.png"
                  alt=""
                />
              </div>
              <!--dropdown-->
              <div class="dropdow">
                <button class="open active">
                  <img src="~assets/img/fltter.png" alt="" />{{ $t("فلتر") }}
                </button>
                <button class="end">
                  <img src="~assets/img/end.png" alt="" />{{ $t("إخفـاء") }}
                </button>
                <div class="listt">
                  <img class="arrow" src="~assets/img/arrow.png" alt="" />
                  <h3>
                    <img class="tih" src="~assets/img/poii.png" alt="" />
                    الدورات
                  </h3>
                  <ul @click="ChangeFilter">
                    <li @click="GetAllCoursesWithoutFilter" class="active">
                      {{ $t("الكل") }}
                    </li>
                    <li @click="GetAllFreeCourses">{{ $t("مجاناً") }}</li>
                    <li @click="GetAllPayidCourses">{{ $t("مدفوعه") }}</li>
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
                <div
                  class="row"
                  v-if="lodash.isEmpty(allCourseSpecialities.edges)"
                >
                  <skeletonChip
                    v-for="(chip, index) in 11"
                    :key="index"
                    class="col"
                  />
                </div>
                <swiper-slide
                  v-else
                  class="nav-item q-pr-sm"
                  v-for="spec in allCourseSpecialities.edges"
                  :key="spec.node.id"
                >
                  <a
                    style="outline: 0"
                    :data-pk="spec.node.pk"
                    @click="changeCourseData(spec.node.pk)"
                    class="nav-link"
                    data-toggle="tab"
                    role="tab"
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
                <div
                  class="cn fadeIn"
                  id="home"
                  role="tabpanel"
                  aria-labelledby="home-tab"
                >
                  <!-- <div class="row justify-center" v-if="!lodash.isEmpty(courses.edges)"> -->
                  <ApolloQuery
                    :query="GetAllCoursesInSpeciality"
                    :variables="{
                      specialityId: activeSpecialityID,
                      first: 8,
                      ...filter,
                      ...searchFilter,
                      ...orderingFilter,
                      isDraft: isDraft,
                    }"
                    :skip="!activeSpecialityID"
                  >
                    <template v-slot="{ result: { loading, data }, query }">
                      <!-- Loading -->
                      <div
                        v-if="loading"
                        class="loading apollo row justify-center"
                      >
                        <q-card
                          class="col-lg-4 col-md-4 col-sm-12 col-xs-12"
                          v-for="i in 12"
                          :key="i"
                          flat
                          style="max-width: 300px"
                        >
                          <q-skeleton height="150px" square />

                          <q-card-section>
                            <q-skeleton type="text" class="text-subtitle1" />
                            <q-skeleton
                              type="text"
                              width="50%"
                              class="text-subtitle1"
                            />
                            <q-skeleton type="text" class="text-caption" />
                          </q-card-section>
                        </q-card>
                      </div>

                      <!-- <div v-else-if="data.allCoursesInSpeciality.edgeCount <= 0" class="no-result apollo"> -->
                      <div
                        v-else-if="
                          $_.get(data, '[allCoursesInSpeciality][edgeCount]') <=
                          0
                        "
                        class="no-result apollo"
                      >
                        <div class="row justify-center">
                          <transition
                            appear
                            enter-active-class="animated fadeIn"
                            leave-active-class="animated fadeOut"
                          >
                            <div
                              class="col col-lg-3 col-md-6 col-sm-6 col-xs-12 notResult"
                            >
                              <img src="~assets/img/search(1).png" alt="" />
                              <p>
                                {{ $t("لا توجد نتائج للبحث") }}
                                <br />
                                {{ $t("حاول الكتابة بشكل مختلف") }}
                              </p>
                            </div>
                          </transition>
                        </div>
                      </div>
                      <!-- Result -->
                      <div v-else-if="data" class="result apollo">
                        <div class="row justify-center">
                          <!-- data.allCoursesInSpeciality.edges -->
                          <div
                            v-for="course in $_.get(
                              data,
                              '[allCoursesInSpeciality][edges]'
                            )"
                            :key="course.node.id"
                            class="col-lg-3 col-md-6 col-sm-6 col-xs-12"
                          >
                            <transition
                              appear
                              enter-active-class="animated fadeIn"
                              leave-active-class="animated fadeOut"
                            >
                              <course-card
                                :course="course.node"
                                :name="course.node.title"
                                instructor="مركز دكتور صبري ابو قرون"
                                :price="course.node.courseFee"
                                unit="SDG"
                              />
                            </transition>
                          </div>
                        </div>

                        <div
                          class="butDown text-center q-mt-md"
                          v-if="
                            data.allCoursesInSpeciality.pageInfo.hasNextPage
                          "
                        >
                          <button @click="loadMoreData(query, data)">
                            {{ $t("عرض المزيد")
                            }}<img
                              class="q-mr-sm"
                              src="~assets/img/moree.png"
                              alt=""
                            />
                          </button>
                        </div>
                        <!-- {{ data }} -->
                      </div>
                    </template>
                  </ApolloQuery>
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
import courseCard from "components/utils/courseCard.vue";
import skeletonChip from "components/skeleton/skeletonChip";
import { GetAllCoursesInSpeciality } from "src/queries/course_management/query/GetAllCoursesInSpeciality.js";

import { GetSpecialities } from "src/queries/course_management/query/GetAllSpeciallites";
import { mapActions } from "vuex";
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import "swiper/swiper-bundle.css";
import "swiper/swiper.min.css";

export default {
  name: "Courses",
  data() {
    return {
      GetAllCoursesInSpeciality: GetAllCoursesInSpeciality,
      counter: 0,
      totalCount: 0,
      edgeCount: 0,
      lodash: this.$_,
      isDraft: false,
      search: "",
      tab: "main",
      openFilter: true,
      activeSpecialityID: null,
      allCourseSpecialities: "",
      filter: {},
      searchFilter: {},
      orderingFilter: {},
      swiperOptions: {
        effect: "coverflow",
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: "auto",
        coverflowEffect: {
          rotate: 500,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: false,
        },
      },
    };
  },
  components: {
    courseCard,
    skeletonChip,
    Swiper,
    SwiperSlide,
  },

  computed: {},

  apollo: {
    allCourseSpecialities: {
      query() {
        return GetSpecialities;
      },
      variables() {
        return {
          courseNumber: 20,
        };
      },
    },
  },

  watch: {
    "$route.params": {
      handler: function (params) {
        // TODO: save the searching data
        this.search = params.search;
        // TODO: Make the searching
        this.GetAllCoursesByTitle();
      },
      deep: true,
      immediate: true,
    },

    search(val) {
      if (this.$_.isEmpty(val)) {
        this.GetAllCoursesByTitle();
      }
    },
  },

  computed: {
    swiper() {
      return this.$refs.mySwiper.$swiper;
    },
  },

  mounted() {
    //TODO: Save the active link so when render it will be make active again
    this.setActiveNavAction("COURSES");
    // TODO: Adjest the swiper
    this.swiper.slideTo(3, 1000, false);
    // TODO: Disable the navebar
    this.setNavbarSearchAction(false);

    this.TRANSITION_THE_FILTER();
  },

  destroyed() {
    // TODO: Enable the navebar
    this.setNavbarSearchAction(true);
  },

  updated() {
    this.TRANSITION_THE_FILTER();
    if (this.counter === 0) {
      // TODO: When the page is loadded, select the first category with it's
      // data courses to be viewd
      const targetedAncer =
        this.$refs.cat.firstChild.firstChild.firstChild.firstChild;
      // TODO: make the first category active
      targetedAncer.classList.add("active");
      const specialityID = JSON.parse(targetedAncer.dataset.pk);
      this.changeCourseData(specialityID);
      this.activeSpecialityID = specialityID;
      // this.courses = data
      this.counter += 10;
    }
  },

  methods: {
    ...mapActions("authentication", ["setNavbarSearchAction"]),
    ...mapActions("settings", ["setActiveNavAction"]),

    TRANSITION_THE_FILTER() {
      // Drowp Down js
      var butFilter = document.querySelector(".dropdow .open"),
        butClose = document.querySelector(".dropdow .end"),
        control = document.querySelector(".listt");
      butFilter.addEventListener("click", function () {
        butFilter.style.opacity = "0";
        setTimeout(function () {
          butFilter.style.display = "none";
          butClose.style.display = "block";
          setTimeout(function () {
            butClose.style.opacity = "1";
          }, 50);
        }, 50);
        control.style.display = "block";
        setTimeout(function () {
          control.style.opacity = "1";
          control.style.transform = "translateY(0)";
          control.style.transition = "all 0.2s ease-in-out";
        }, 50);
      });

      // close
      butClose.addEventListener("click", function () {
        control.style.opacity = "0";
        control.style.transform = "translateY(45px)";
        control.style.transition = "all 0.3s ease-in-out";
        setTimeout(function () {
          control.style.display = "none";
        }, 100);
        setTimeout(function () {
          butClose.style.display = "none";
          butFilter.style.display = "block";
          setTimeout(function () {
            butFilter.style.opacity = "1";
          }, 50);
        }, 50);
      });
    },

    // TODO: Get All courses by Title from search
    GetAllCoursesByOrderingDecendinOrAcending(type) {
      if (type === "DEC") {
        this.orderingFilter = { orderBy: ["-title"] };
        this.changeCourseData(this.activeSpecialityID);
      } else {
        this.orderingFilter = { orderBy: ["title"] };
        this.changeCourseData(this.activeSpecialityID);
      }
    },
    // TODO: Get All courses by Title from search
    GetAllCoursesByTitle(e) {
      try {
        e.preventDefault();
      } catch (error) {}
      this.searchFilter = { title_Icontains: this.search };
      this.changeCourseData(this.activeSpecialityID);
      // TODO: Remove the search filter
    },
    // TODO: Get Only the free courses
    GetAllFreeCourses() {
      this.filter = { isPaid: false };
      this.changeCourseData(this.activeSpecialityID);
    },
    // TODO: Get only the payeed courses
    GetAllPayidCourses() {
      this.filter = { isPaid: true };
      this.changeCourseData(this.activeSpecialityID);
    },
    // TODO: Get all courses without filter
    GetAllCoursesWithoutFilter() {
      this.filter = {};
      this.changeCourseData(this.activeSpecialityID);
    },
    // TODO: Change the filter activation class
    ChangeFilter(e) {
      const ulParent = e.target.parentElement;
      for (const child of ulParent.childNodes) {
        child.classList.remove("active");
      }
      e.target.classList.add("active");
    },
    next() {
      this.$refs.flickity.next();
    },

    previous() {
      this.$refs.flickity.previous();
    },
    // TODO: Get the related courses data when the selected speciality become active
    async changeCourseData(specialityID) {
      this.activeSpecialityID = specialityID;
    },

    async loadMoreData(query, data) {
      await query.fetchMore({
        variables: {
          specialityId: this.activeSpecialityID,
          cursor: data.allCoursesInSpeciality.pageInfo.endCursor,
          isDraft: this.isDraft,
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          const newEdges = fetchMoreResult.allCoursesInSpeciality.edges;
          const pageInfo = fetchMoreResult.allCoursesInSpeciality.pageInfo;

          if (newEdges.length) {
            data = {
              __typename: previousResult.allCoursesInSpeciality.__typename,
              edges: [
                ...previousResult.allCoursesInSpeciality.edges,
                ...newEdges,
              ],
              pageInfo,
            };

            return { allCoursesInSpeciality: data };
          }
          return previousResult;
        },
      });
    },

    // TODO: Change the speciality when it been clicked
    changeTab(e) {
      e.preventDefault();
      // TODO: Get the cliked li parent for the a child
      const clickedLiParent = e.target.parentElement;
      // TODO: Get the parent ul element
      const ulParent = clickedLiParent.parentElement;
      if (clickedLiParent.classList.contains("nav-item")) {
        // TODO: Remove the class active from all the li elements
        for (const liParent of ulParent.childNodes) {
          liParent.firstChild.classList.remove("active");
        }
        // TODO: Add the class active to only the cliked item
        clickedLiParent.firstChild.classList.add("active");
      }
    },
  },
};
</script>
<style lang="scss">
@import "src/assets/css/sass/helpers/_variabels.scss";
@import "src/assets/css/sass/helpers/_mixins.scss";
@import "src/assets/css/account.scss";

.swiper-slide {
  width: max-content !important;
}

.q-field__before > i {
  transform: translateX(1rem);
}

/*--- START cources ---*/
.cources {
  padding: 50px 0;
  margin: 25px 0 0 0;
  .titel {
    margin: 0 0 55px 0;
    img {
      display: inline-block;
      margin: -9px 0 0 0;
    }
    h3 {
      color: $textColor;
      font-size: 22px;
      font-family: "cairoB";
      line-height: 1.7;
      margin: 0 11px 0 0;
      display: inline-block;
    }
  }
  .flbut {
    width: 30%;
    margin: -42px 0 0 0;
    //maxMobile
    @media (max-width: 767px) {
      width: 100%;
      text-align: center;
    }
    //maxSmall
    @media (max-width: 991px) {
      width: 100%;
      text-align: center;
      margin: -2px 0 0 0;
    }
    .but {
      display: inline-block;
      overflow: hidden;
      position: relative;
      top: 9px;
      height: 2rem;

      &-filter {
        cursor: pointer;
        transition: all 0.2s ease-in-out;
        &:hover {
          transform: scale(1.1);
        }
      }

      img {
        display: inline-block;
        margin: 0 0 0 22px;
      }
    }
    .dropdow {
      display: inline-block;
      position: relative;
      z-index: 1;
      button {
        outline: 0;
        width: 117px;
        height: 49px;
        background-color: #f8f8f8;
        img {
          margin-left: 16px;
        }
        &.active {
          background-color: $yalloColor;
        }
      }
      .end {
        display: none;
        opacity: 0;
      }
      .listt {
        opacity: 0;
        transform: translateY(45px);
        display: none;
        transition: all 0.3s ease-in-out;
        position: absolute;
        background-color: #7b86fa;
        padding: 10px;
        border-radius: 13px;
        margin: 20px 0 0 0;
        width: 218px;
        .arrow {
          position: absolute;
          top: -11px;
          left: 112px;
        }
        h3 {
          font-size: 14px;
          color: #fff;
          font-family: "cairoR";
          margin: 6px 0 14px 0;
          .tih {
            display: inline-block;
            position: relative;
            top: -1px;
          }
        }
        ul {
          list-style: none;
          margin: 0;
          li {
            display: inline-block;
            cursor: pointer;
            background-color: #8993fb;
            color: #fff;
            padding: 3px 12px;
            height: 30px;
            text-align: center;
            font-size: 14px;
            border-radius: 12px;
            &.active {
              background-color: #fff;
              color: #bbbbbb;
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
    //maxMobile
    @media (max-width: 767px) {
      width: 100%;
      margin-bottom: 50px;
      padding: 0;
    }
    //maxSmall
    @media (max-width: 991px) {
      width: 100%;
      padding: 0;
    }
    form {
      position: relative;
      text-align: center;
      input {
        width: 100%;
        height: 54px;
        padding: 15px;
        font-size: 17px;
        font-family: "cairoR";
        border-radius: 50px;
        border: 0;
        background-color: #fff;
        color: #7b7b7b;
        outline: 0;
        transition: all ease-in-out 0.3s;

        &:focus {
          border-bottom: 3px solid #fcc74c;
        }

        @include prefixer(
          box-shadow,
          2px 9px 18.79px 2.21px rgba(147, 147, 147, 0.14),
          webkit moz o ms
        );
      }
      input::placeholder {
        color: #bbbbbb !important;
        font-size: 14px;
        font-family: "cairoR";
      }

      button {
        width: 47px;
        height: 40px;
        background-color: #f8f8f8;
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
  .nav-tabs {
    margin: 0 0 59px 0;
    padding: 15px;
    border: 0;
    background-color: #fafafa;
    border-radius: 50px;
    .nav-item {
      //maxMobile
      @media (max-width: 767px) {
        margin: 0 9px 10px 0;
      }
      .nav-link {
        //maxMobile
        @media (max-width: 767px) {
          width: 100%;
        }
        img {
          margin: -3px -3px 0 2px;
        }
        font-size: 18px;
        font-family: "cairoR";
        width: 100%;
        height: 44px;
        margin-left: 10px;
        border-radius: 50px;
        color: $textColor;
        border: 1px solid #f6f6f6;
        padding: 7px 10px 0 0;
        background-color: #fff;
        @include prefixer(
          box-shadow,
          2px 9px 18.79px 2.21px rgba(147, 147, 147, 0.14),
          webkit moz o ms
        );
        &.active {
          background-color: #2d77d8;
          color: #fff;
        }
      }
    }
  }

  .rate {
    margin-top: 30px;

    .cn {
      padding: 0 0 0 0;
      position: relative;
      @media (min-width: 320px) and (max-width: 700px) {
        right: 0;
      }

      .card {
        position: relative;
        border: 0;
        box-shadow: 3px 7px 15px #eceaea;
        border-radius: 37px;
        background: #e3edfa;
        width: 100%;
        padding: 10px;
        height: 441px;
        .pattern {
          position: absolute;
          top: 0;
          width: 100%;
          left: 0;
          right: 0;
          height: 100%;
        }
        .card-img-top {
          position: relative;
          padding: 14px;
          height: 294px;
          width: 100%;
          overflow: hidden;
          border-radius: 30px;
          .plays {
            position: absolute;
            width: auto;
            top: 45%;
            left: 0;
            right: 44%;
            height: unset;
            z-index: 5;
          }
          img {
            width: 100%;
            height: 100%;
            position: absolute;
            border-width: 0;
            left: 0;
            right: 0;
            top: 0;
          }
        }
        .card-body {
          position: relative;
          padding: unset;
          border-radius: 29px;
          background: #f78a78;
          margin: -37px auto 2px auto;
          width: 100%;
          top: -6px;
          height: 164px;
          .card-title {
            margin-bottom: 7px;
            color: #fff;
            font-size: 17px;
            font-family: cairoR;
            line-height: 1.8;
            background-color: #fc9685;
            padding: 8px;
            border-top-left-radius: 26px;
            border-top-right-radius: 26px;
            height: 72px;
            overflow: hidden;
            -webkit-line-clamp: 2;
            display: -webkit-box;
            -webkit-box-orient: vertical;
          }
          .detai {
            position: relative;
            // width: 89px;
            .added {
              display: inline-block;
              position: absolute;
              left: 0;
              right: -7px;
              width: 148px;
              top: 40px;
              svg {
                path {
                  fill: #fff067;
                }
              }
              button {
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
                color: #7b7b7b;
              }
            }
            h3 {
              display: inline-block;
              color: #fff067;
              font-size: 31px;
              font-family: cairoR;
              margin-right: 8px;
            }
            span {
              display: inline-block;
              font-size: 13px;
              font-family: cairoR;
              color: #fff;
            }
          }
          .details {
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
      .parent {
        @media (min-width: 320px) and (max-width: 700px) {
          margin-bottom: 0;
        }
        //maxMobile
        @media (max-width: 767px) {
          margin-bottom: -53px;
        }
        .imag {
          position: relative;
          border-radius: 50px;
          overflow: hidden;
          margin: 0 auto 0 auto;
          height: 294px;
          width: 82%;
          //maxMobile
          @media (max-width: 767px) {
            height: 274px;
          }
          //minMedium
          @media (min-width: 922px) {
            height: auto;
          }
          .overlay {
            @include overlay;
            background-color: rgba(#fbfbff, 0.6);
          }

          img {
            width: 100%;
          }

          .magtxt {
            h4 {
              position: absolute;
              top: 25px;
              left: 0;
              color: #7b7b7b;
              font-size: 17px;
              font-family: "cairoR";
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
          background-color: #7b86fa;
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
              font-family: "cairoR";
              color: #fff;
              margin: 0 0 0 6px;
            }

            h3 {
              display: inline-block;
              color: #fff067;
              font-size: 31px;
              font-family: "cairoR";
            }
          }

          button {
            width: 85px;
            height: 33px;
            background-color: #fff067;
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
          background-color: #5666b9;
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
        .color {
          background-color: #0c79d6;
        }
      }
    }
  }
  .notResult {
    padding: 10px;
    margin: 0 auto 40px auto;
    text-align: center;
    img {
      width: auto;
    }
    p {
      font-size: 18px;
      color: $textColor;
      font-family: "cairoR";
      margin: 30px 0 20px 0;
      line-height: 1.8;
    }
  }
}

/*--- End Training ---*/
</style>
