<template>
    <div @click="changeThecourseContent" class="info" style="width: 100%">
        <div class="mage">
            <img src="~assets/img/Rectangle 1.png" alt="" />
        </div>
        <h3>{{ formatTitle }}</h3>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  data () {
    return {
      parsedContentTitle: ''
    }
  },

  props: ['content'],

  computed: {
    ...mapState('courseManagement', ['courseFiles']),
    formatTitle () {
      const title = JSON.parse(this.content.modelValue)
      if (this.content.modelName === 'ContentFile') {
        return title.attachment.split('/attachment/')[1]
      }
      return title.title
    }
  },

  mounted () {
    // TODO: Fill the content list
    this.setContentListsAction(this.content)
    // TODO: Save all course content file
    if (this.content.modelName === 'ContentFile') {
      this.setCourseFilesAction(this.content)
    }
  },

  methods: {
    ...mapActions('courseManagement', [
      'setSelectedClassUnitContentAction',
      'setCurrentContentAction',
      'setContentListsAction',
      'setCourseFilesAction'
    ]),

    changeThecourseContent () {
      // TODO: Get the current selected content
      this.setCurrentContentAction(this.content)
      this.setSelectedClassUnitContentAction(this.content)
    }
  }
}
</script>

<style></style>
