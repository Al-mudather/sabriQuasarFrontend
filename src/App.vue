<template>
    <div id="q-app">
        <router-view />
    </div>
</template>
<script>
import { mapActions, mapState, mapGetters } from "vuex";
import { GetMyProfileData } from "src/queries/account_management/query/GetMyProfileData";
import { LocalStorage } from 'quasar'
import {WOW} from 'wowjs'
import 'animate.css'

export default {
    name: "App",
    data () {
        return {

        }
    },

    computed: {
        ...mapState('authentication', ['token']),
        ...mapGetters("authentication", ["user"]),
    },
    methods: {
        ...mapActions('authentication', ['RE_LOGIN_USER']),
        ...mapActions('authentication', ['logOutAction'])
    },


    created() {
        //TODO: IF the user blocked the notification
        if (Notification.permission == 'denied') {
            this.$q.notify({
                type: 'negative',
                progress: true,
                multiLine: true,
                position: 'top',
                message: this.$t('لقد قمت بحجب اللإشعارات , الرجاء السماح لها بالظهور لتتمتع باخر التحديثات على المنصه')
            })
        }

        window.addEventListener('DOMContentLoaded', (event) => {
            window.OneSignal.push( () => {

                //TODO: IF the user not enabled the notification Show it again on visiting
                window.OneSignal.isPushNotificationsEnabled(function(isEnabled) {
                    if (isEnabled) {
                    } else {
                        //TODO: Show the subscribe message again until the user accept it
                        window.OneSignal.showSlidedownPrompt({force: true}); 
                    }
                });

                window.OneSignal.on('popoverAllowClick', () => {
                    //TODO: If the user allowed the subscription, set his email
                    if (this.user) {
                        //TODO: Set the external user id for notification
                        let externalUserId = this.user.email; // You will supply the external user id to the OneSignal SDK 
                        OneSignal.push(function() { 
                            OneSignal.setExternalUserId(externalUserId); 
                        });
                    }
                });

                window.OneSignal.on('notificationPermissionChange', (permissionChange) => {
                    var currentPermission = permissionChange.to;
                    if (currentPermission == 'granted') {
                        this.$q.notify({
                            type: 'positive',
                            progress: true,
                            multiLine: true,
                            position: 'center',
                            message: this.$t('تهانينا, الان يمكنك ان تكون مطلعا على كل ماهو جديد في المنصه التعليميه')
                        })

                        if (this.user.email) {
                            //TODO: Set the external user id for notification
                            let externalUserId = this.user.email; // You will supply the external user id to the OneSignal SDK 
                            window.OneSignal.push(function() { 
                                window.OneSignal.setExternalUserId(externalUserId); 
                            });
                        }
                    } else if (currentPermission == 'denied' || currentPermission == 'default') {
                        this.$q.notify({
                            type: 'negative',
                            progress: true,
                            multiLine: true,
                            position: 'center',
                            message: this.$t('بعدم قبولك للإشعارات, لايمكننا ان نخبرك بمراحل امتلاكك للدوره التدريبيه اللتي تريدها, من فضلك اقبل الإشعارات')
                        })
                    }
                });
            });
        });

        // console.log({router: this.$router})
        //TODO: Empty the nav bar 
        LocalStorage.set('activeNav', '')

        // TODO: If There is a token, reLogin the user
        if (this.token) {
            this.RE_LOGIN_USER().then((re) => {
                if (re === false) {
                    this.$q.notify({
                        type: 'warning',
                        progress: true,
                        multiLine: true,
                        position: 'top',
                        message: 'لقد انتهت صلاحية دخولك للموقع... الرجاء الدخول مره اخرى لتتمكن من تطوير مهاراتك'
                    })
                    //TODO: Delete the user data
                    this.logOutAction()
                    //TODO: Go to login page
                    this.$router.push({ name: "login" });
                }
                this.$q.notify({
                    type: 'positive',
                    progress: true,
                    multiLine: true,
                    position: 'bottom',
                    message: this.$t('تم تسجيل الدخول')
                })
            }).catch(e => {
              // console.log({ReloginError: e})
              this.$router.push({ name: "login" });
           });
        }
    },
    async mounted () {
        let options={
            //Default is true
            live:false
        }
        new WOW(options)
        try {
            const res = await this.$apollo.query({ 
            query: GetMyProfileData
            })

            if (res.data.me.pk) {
                //TODO: IF the data exists go to payment page
                if (res.data.me.fullName && (res.data.me.phoneNumber2 || res.data.me.phoneNumber3) ) {
                } else {
                    this.$q.notify({
                        type: 'negative',
                        progress: true,
                        multiLine: true,
                        position: 'top',
                        message: "عندما تقوم باكمال بياناتك الشخصيه, ستسهل لنا عملية الوصول اليك وحل جميع مشاكلك باسرع ما يمكن"
                    })
                    this.$router.push({ name: 'user-profile' })
                }
            }
        } catch (error) {
        }
        
    },
};
</script>
<style>
#q-app {
    direction: rtl !important;
}
</style>
