<template>
  <section class="Notific" style="min-height: 44vh">
    <div class="container-fluid">
      <div class="row justify-center">
        <div class="col-lg-12">
          <div class="titel">
            <img src="~assets/img/tit.png" alt="" />
            <h3>{{$t('الإشعارات')}}</h3>
          </div>
        </div>
        <div v-if="$_.get(GET_NOTIFICATION_DATA, 'totalCount') == 0" class="empty">
            <img src="~assets/img/no_notification.png" alt="">
            <h3> عذرا لا تـوجد إشــعارات فــي الوقــت الحـالــي </h3>
        </div>
        <div v-if="$_.isEmpty(GET_NOTIFICATION_DATA, 'edges')" style="width: 55%">
          <q-skeleton class="q-mt-sm" v-for="i in 7" :key="i" height="100px" />
        </div>
        <div v-else class="notifi">
          <Notification-Card
            v-for="notification in GET_NOTIFICATION_DATA.edges"
            :key="notification.node.pk"
            :notification="notification.node"
          />
          <div class="butDown text-center" v-if='$_.get(myNotifications,"[pageInfo][hasNextPage]")'>
            <button @click="LOAD_MORE_DATA">{{$t('عرض المزيد')}}<img class="q-mr-sm" src="~assets/img/moree.png" alt=""></button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import NotificationCard from 'src/components/notifivation_management/NotificationCard.vue'
import { GetAllMyNotifications } from 'src/queries/notification_management/query/GetAllMyNotifications'
// import { DoneReadingNotification } from 'src/queries/notification_management/mutation/DoneReadingNotification'
import { mapActions } from 'vuex'

export default {
  name: "Notification",
  data () {
    return {
      myNotifications: '',
      loading: false,
      notificationData: []
    }
  },
  apollo: {
    myNotifications: {
      query: GetAllMyNotifications,
      variables: {
        orderBy: ['-id'],
        limit: 2
      },
      result (res) {
        this.loading = res.loading 
        if (!res.loading) {
          this.notificationData = res.data.myNotifications
        }
      }
    }
  },
  components: {
    NotificationCard
  },
 
  mounted () {
    //TODO: Save the active link so when render it will be make active again
    this.setActiveNavAction('NOTIFICATION')
    // TODO: Get the notification from the [ UserNavBar ] component
    // this.$root.$on('NotificationData', this.GET_NOTIFICATION_DATA)
    // TODO: Get the notification 
    // this.$apollo.query({
    //   query: GetAllMyNotifications,
    //   variables: {
    //     orderBy: ['-id'],
    //     limit: 2
    //   }
    // }).then( res => {
      
    // } )
  },

  computed: {
    GET_NOTIFICATION_DATA () {
      return this.notificationData
    }
  },

  methods: {
    ...mapActions('settings', ['setActiveNavAction']),
    async LOAD_MORE_DATA () {
      await this.$apollo.queries.myNotifications.fetchMore({
        variables: {
          cursor: this.myNotifications.pageInfo.endCursor
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          const newEdges = fetchMoreResult.myNotifications.edges
          const pageInfo = fetchMoreResult.myNotifications.pageInfo

          if (newEdges.length) {
            this.myNotifications = {
              __typename:
                                previousResult.myNotifications.__typename,
              edges: [
                ...previousResult.myNotifications.edges,
                ...newEdges
              ],
              pageInfo
            }

            return { myNotifications: this.myNotifications }
          }
          return previousResult
        }
      })
    },
  }

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
    .empty{
        display: block;
        text-align: center;
        img{
            width:auto;
        }
        h3{
            font-size: 19px;
            font-family: 'cairoR';
            color: $textColor;
            margin: 35px 0 0 0;
        }
    }
}
/*--============= End Notification page =============--*/
</style>
