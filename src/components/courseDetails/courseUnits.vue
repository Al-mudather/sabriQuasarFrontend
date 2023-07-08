<template>
    <div class="all">
      <div class="hedd">
            <div class="point">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="67.452"
                    height="54.53"
                    viewBox="0 0 67.452 54.53"
                >
                    <g
                        id="Group_633"
                        data-name="Group 633"
                        transform="translate(-798.943 -217.261)"
                    >
                        <circle
                            id="Ellipse_15"
                            data-name="Ellipse 15"
                            cx="14.5"
                            cy="14.5"
                            r="14.5"
                            transform="translate(809 233)"
                            fill="#5666b9"
                        />
                        <path
                            id="Path_598"
                            data-name="Path 598"
                            d="M19.826-38.194a1.169,1.169,0,0,0-.072.62,1.519,1.519,0,0,0,.116.316,2.864,2.864,0,0,0,.9.994c1.416,1.044,2.627,1.9,2.937,3.215.234.994,0,2.31-1.2,4.227a13.254,13.254,0,0,0-1.6,3.9,16.244,16.244,0,0,0-.473,4.231.668.668,0,0,1-.623.709A.668.668,0,0,1,19.1-20.6a17.509,17.509,0,0,1,.424-4.641,14.709,14.709,0,0,1,1.709-4.363c.856-1.418,1.138-2.346.955-3.071a2.3,2.3,0,0,0-.852-1.154c-.438-.369-.968-.717-1.521-1.11a3.75,3.75,0,0,1-1.757-2.706,2.274,2.274,0,0,1,.6-1.794,1.467,1.467,0,0,1,1.1-.45L22.627-40A18.548,18.548,0,0,0,34.41-46.131,18.432,18.432,0,0,0,39.093-58.5,18.439,18.439,0,0,0,33.7-71.548a18.488,18.488,0,0,0-13.05-5.493A18.56,18.56,0,0,0,7.451-71.7,18.7,18.7,0,0,0,1.836-58.5a.668.668,0,0,1-.667.667A.668.668,0,0,1,.5-58.5,20.14,20.14,0,0,1,6.3-72.844a20.277,20.277,0,0,1,14.346-6.07,20.343,20.343,0,0,1,14.493,5.923A20.393,20.393,0,0,1,41.163-58.5a20.376,20.376,0,0,1-5.306,13.67,20.334,20.334,0,0,1-13.046,6.571Z"
                            transform="matrix(-0.259, -0.966, 0.966, -0.259, 885.823, 251.85)"
                            fill="#e5e5e6"
                            fill-rule="evenodd"
                        />
                    </g>
                </svg>
                <img src="~assets/img/questio.png" alt="" />
            </div>
            <h3>{{$t('المحتويـات')}}</h3>
        </div>
        <div id="accordion">
          <q-list ref="contentList"
            class="rounded-borders q-mb-sm"
            bordered
            padding
            v-for="unit in $_.get(allUnitsData,'[edges]')"
            :key="$_.get(unit,'[node][pk]')"
            >
            <q-item-label header>{{$_.get(unit,'[node][title]')}}</q-item-label>

            <div
                        id="collapseOne"
                        class="collapse show"
                        aria-labelledby="headingOne"
                        data-parent="#accordion"
                      >
                        <div class="card-body">
                          <div v-if=" $_.get(unit, '[node][isExternal]') ">
                            <div
                              v-for="content in $_.get(unit, '[node][external][courseunitcontentSet][edges]')"
                              :key="$_.get(content, '[node][pk]')"
                            >
                              <contentItem
                                :content="content.node"
                                v-if=" ($_.get(content, '[node][modelName]') === 'ContentVideo') ||
                                ($_.get(content, '[node][modelName]') === 'ContentFile') ||
                                ($_.get(content, '[node][modelName]') === 'ContentQuiz') "
                              />
                            </div>
                          </div>
                          <div
                            v-else
                            v-for="content in $_.get(unit, '[node][courseunitcontentSet][edges]')"
                            :key="$_.get(content, '[node][pk]')"
                          >
                            <contentItem
                              :content="content.node"
                              v-if=" ($_.get(content, '[node][modelName]') === 'ContentVideo') ||
                                          ($_.get(content, '[node][modelName]') === 'ContentFile') ||
                                          ($_.get(content, '[node][modelName]') === 'ContentQuiz') "
                            />
                          </div>
                        </div>
                      </div>
          </q-list>
        </div>
    </div>
</template>

<script>
import contentHeader from 'components/utils/contentHeader.vue'
import contentItem from 'components/courseDetails/contentItem.vue'
import { GetAllCourseUnitsByCourseID } from 'src/queries/course_management/query/GetAllCourseUnitsByCourseID'
import skeletonList from 'src/components/skeleton/skeletonList'
import expandableItem from 'src/components/utils/expandable_item.vue'

export default {
  name: 'courseUnits',
  data () {
    return {
      allCourseUnits: { pageInfo: { hasNextPage: '' } },
      allUnitsData: []
    }
  },

  components: {
    // contentHeader,
    contentItem,
    // skeletonList,
    // expandableItem
  },

  // mounted () {
  //   print('..........................')
  //   print(this.allUnitsData)
  //   print('..........................')
  // },

  apollo: {
    allCourseUnits: {
      query () {
        return GetAllCourseUnitsByCourseID
      },

      variables () {
        return {
          courseID: this.course_id,
          limit: 5
        }
      },

      update (data) {
        this.allUnitsData = this.$_.get(data, '[allCourseUnits]')
      },
      error ( e ) {
       }
    }
  },

  props: ['course_id'],

  methods: {
    async loadMoreData () {
      await this.$apollo.queries.allCourseUnits.fetchMore({
        variables: {
          courseID: this.course_id,
          cursor: this.allUnitsData.pageInfo.endCursor
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          const newEdges = fetchMoreResult.allCourseUnits.edges
          const pageInfo = fetchMoreResult.allCourseUnits.pageInfo

          if (newEdges.length) {
            this.allUnitsData = {
              __typename:
                                previousResult.allCourseUnits.__typename,
              edges: [
                ...previousResult.allCourseUnits.edges,
                ...newEdges
              ],
              pageInfo
            }

            return { allCourseUnits: this.allUnitsData }
          }
          return previousResult
        }
      })
    }
  }
}
</script>

<style lang="scss">
.q-card__section--vert {
    padding: 0 !important;
}
.q-item__section--side {
    display: none;
    visibility: hidden;
    width: 0;
}
</style>
