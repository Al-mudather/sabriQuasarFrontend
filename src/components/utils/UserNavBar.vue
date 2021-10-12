<template>
    <section class="navv">
        <div class="container-fluid">
            <div class="row">
                <div class="col-lg-12">
                    <div class="menu" @click="changeMenuState" style="cursor: pointer">
                        <img src="~assets/img/menu.png" alt="" />
                    </div>
                    <div class="user" v-if="lodash.get(user,'[firstName]')">
                        <img src="~assets/img/man.png" alt="" />
                        <h3>{{lodash.get(user,'[firstName]')}} {{lodash.get(user,'[lastName]')}}</h3>
                    </div>
                    <div class="user" v-else-if="lodash.get(user,'[username]')">
                        <img src="~assets/img/man.png" alt="" />
                        <h3>{{lodash.get(user,'[username]')}}</h3>
                    </div>
                    <div class="user heading" v-else>
                        {{lodash.get(user,'[email]')}}
                    </div>
                    <div class="notification" @click="$router.push({ name: 'notification' })">
                        <!-- {{lodash.get(myNotifications,'[totalCount]')}} -->
                        <span>+{{lodash.get(myNotifications,'[totalCount]')}}</span>
                        <img src="~assets/img/notif.png" alt="" />
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { NotificationCreatedSubscription } from 'src/queries/notification_management/subscription/NotificationCreatedSubscription'
import { GetAllMyNotificationsCount } from 'src/queries/notification_management/query/GetAllMyNotificationsCount'
 
export default {
    name: "CoursesNavBar",
    data () {
        return {
            lodash: this.$_,
            myNotifications: []
        }
    },

    apollo: {

      myNotifications: {
        query: GetAllMyNotificationsCount,
        skip () {
          return !token
        }
      },

      $subscribe: {

        notificationCreated: {

          query: NotificationCreatedSubscription,

          result({data}) {
            if (this.$_.get(this.myNotifications, '[edges]')) {
              this.myNotifications.edges.unshift({
                node: data.notificationCreated.notification
              })
              this.myNotifications.totalCount++
            } else {
              this.myNotifications = {
                totalCount: 1,
                edges: {
                  node: data.notificationCreated.notification
                }
              }
            }
          },

        },

      },
 
    },

    watch: {
      myNotifications (value) {
        this.$root.$emit('NotificationData', value)
      }
    },
    computed: {
      ...mapState('authentication', ['user', 'token'])
    },

    methods: {
      ...mapActions('settings', ['setIsEnglishAction', 'setOpenMenuAction']),

      changeMenuState () {
        this.setOpenMenuAction(true)
      },
    }
};
</script>
<style lang="scss">
@import "src/css/helpers/_mixins.scss";
@import "src/css/helpers/_variabels.scss";
@import "src/css/layout/_navbar.scss";

.heading {
    font-size: 29px;
    font-family: 'cairoR';
    color: #7B7B7B;
}
</style>
