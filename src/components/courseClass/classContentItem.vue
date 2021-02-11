<template>
    <div @click="changeThecourseContent" class="info" style="width: 100%">
        <div class="mage">
            <img src="~assets/img/Rectangle 1.png" alt="" />
        </div>
        <!-- {{ parsedContent }} -->
        <h3>{{ parsedContent.title }}</h3>
    </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data () {
    return {
      parsedContent: {
        type: Object
      }
    }
  },

  props: ['content'],

  created () {
    this.parsedContent = JSON.parse(this.content.modelValue)
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
