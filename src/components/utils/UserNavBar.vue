<template>
    <section class="navv">
        <div class="container-fluid">
            <div class="row">
                <div class="col-lg-12">
                    <div class="menu">
                        <img src="~assets/img/menu.png" alt="" />
                    </div>
                    <div class="user" v-if="lodash.get(user,'[firstName]')">
                        <img src="~assets/img/hassbo.png" alt="" />
                        <h3>{{lodash.get(user,'[firstName]')}} {{lodash.get(user,'[lastName]')}}</h3>
                    </div>
                    <div class="user" v-else-if="lodash.get(user,'[username]')">
                        <img src="~assets/img/hassbo.png" alt="" />
                        <h3>{{lodash.get(user,'[username]')}}</h3>
                    </div>
                    <div class="user heading" v-else>
                        غير معروف
                    </div>
                    <div class="notification">
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
import gql from 'graphql-tag';
import { mapState } from 'vuex'

export default {
    name: "CoursesNavBar",
    data () {
        return {
            lodash: this.$_,
            globalenotification: []
        }
    },
    created () {
        this.$root.$on('updateGlobalNotification', this.updateNotificationCallback)
    },
    beforeDestroy () {
        // Don't forget to turn the listener off before your component is destroyed
        this.$root.$off('updateGlobalNotification')
    },
    methods: {
        updateNotificationCallback (notification) {
            console.log('llllllllllllllllllllllllllllllll')
            console.log(notification)
            console.log('llllllllllllllllllllllllllllllll')
            this.globalenotification.push({
                node: notification
            })
        }
    },
    apollo: {

        myNotifications: {
        query: gql`query
GetMyNotification{
	myNotifications{
    totalCount,
    edges{
      node{
        pk
        title
        description
        extraData
        type
        created
        updated
      }
    }
  }
}

      `
      },

      $subscribe: {

        notificationCreated: {

          query: gql`

subscription S{
  notificationCreated{
    notification{
      pk
      title
      description
      extraData
      type
      created
      updated
    }
  }
}

          `,

          result({data}) {
            console.log("ssssssssssssssssssssssssssss")
            // this.myNotifications = data.notificationCreated.notifications;
            console.log(data.notificationCreated)
            // console.log()
            if (this.$_.get(this.myNotifications, '[edges]')) {
              this.myNotifications.edges.push({
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

            // console.log(this.notificationCreated)
            console.log("ssssssssssssssssssssssssssss")
          },

        },

      },

    },
    computed: {
        ...mapState('authentication', ['user'])
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
