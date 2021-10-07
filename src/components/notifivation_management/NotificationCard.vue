<template>
    <transition
        appear
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut"
    >
        <div class="notf" @click="goToTheNotificationSource" style="cursor: pointer">
        <div class="row">            
            <div class="col-lg-2">
                <div class="user">
                    <img src="~assets/img/man.png" alt="" />
                </div>
            </div>
            <div class="col-lg-10 noPadding">
                <div class="content">
                <h3 v-if="notification.type === 'QUESTION_ASK' ">
                    {{$t('السؤال :')}} 
                    <span>{{notification.title}}</span>
                </h3>
                <h3 v-else-if="notification.type === 'QUESTION_ANS' ">
                    {{$t('جواب السؤال :')}} 
                    <span>{{notification.title}}</span>
                    {{$t('هو :')}} 
                    <span>{{notification.description}}</span>
                </h3>
                <h3 v-else-if="notification.type === 'CHECKOUT_DONE' ">
                    {{notification.description}} 
                    <span>{{$t('تمت عملية الدفع بنجاح يمكنك الان التعلم من خلال لوحتك التعليميه')}}</span>
                </h3>
                </div>
            </div>
        </div>
        </div>
    </transition>
</template>

<script>

export default {
  name: "notificationCard",
  data () {
    return {
        lodash: this.$_,
        courseID: ''
    }
  },
  props: ['notification'],
  mounted () {
    if ( (this.lodash.get(this.notification, '[type]') === 'QUESTION_ASK') || (this.lodash.get(this.notification, '[type]') === 'QUESTION_ANS') ) {
        const courseID =  parseInt( this.lodash.get(this.notification, '[extraData]').split('::')[0].split(' ')[1].replace('>', '') )
        this.courseID = courseID 
    }

  }, 

  methods: {

    goToTheNotificationSource () {
        if ( (this.lodash.get(this.notification, '[type]') === 'QUESTION_ASK') || (this.lodash.get(this.notification, '[type]') === 'QUESTION_ANS') ) {
            this.$router.push({ 
                name: 'course-class',
                params: { pk:  this.courseID, id: this.lodash.get(this.notification, '[type]')},
                query:{ tab: 'question' }
            })
        } else if ( (this.lodash.get(this.notification, '[type]') === 'CHECKOUT_DONE') ) {
            this.$router.push({ 
                name: 'my-courses'
            })
        }
    }
    
  }
  
}
</script>

<style></style>
