<template>
    <div class="notf" @click="goToTheNotificationSource" style="cursor: pointer">
        <div class="row">            
            <div class="col-lg-2">
                <div class="user">
                <img src="~assets/img/hassbo.png" alt="" />
                </div>
            </div>
            <div class="col-lg-10 noPadding">
                <div class="content">
                <h3 v-if="notification.type === 'QUESTION_ASK' ">
                    السؤال : 
                    <span>{{notification.title}}</span>
                </h3>
                <h3 v-else-if="notification.type === 'QUESTION_ANS' ">
                    <!-- الجواب : 
                    <span>{{notification.description}}</span> -->
                    جواب سؤال : 
                    <span>{{notification.title}}</span>
                    هو : 
                    <span>{{notification.description}}</span>
                </h3>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
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
        }
    }
    
  }
  
}
</script>

<style></style>
