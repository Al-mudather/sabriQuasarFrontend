<template>
    <div @click="changeThecourseContent" class="info row items-center" style="width: 100%">
      <div class="mage col-1">
          <img src="~assets/img/Rectangle 1.png" alt="" />
      </div>
      <h3 class="col-9">{{ formatTitle }}</h3>
      <div class="q-gutter-sm self-end col-1">
        <q-checkbox disable v-model="lessonFinished" />
      </div>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { GetAllLearningProgressByCourse } from 'src/queries/learning_management/query/GetAllLearningProgressByCourse'

export default {
  data () {
    return {
      lessonFinished: false,
      parsedContentTitle: ''
    }
  },

  props: ['content', 'courseId'],

  apollo: {
    learningProgressByCourse: {
      query () {
        return GetAllLearningProgressByCourse
      },
      variables () {
        return {
          enrollmentId: this.enrollmentId,
          courseId: this.courseId
        }
      }
    }
  },

  watch: {
    learningProgressByCourse (value) {
      for (const progess of value.edges) {
        if (this.content.pk === progess.node.courseUnitContent.pk) {
          if (progess.node.begin &&  progess.node.complete) {
            // TODO: marke the lesson as completed
            this.lessonFinished = true
          }
        }
      }
    }
  },

  computed: {
    ...mapState('courseManagement', ['courseFiles']),
    ...mapState('learningProgress',['enrollmentId']),
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

    // FORMAT_TITLE () {
    //   const title = JSON.parse(this.content.modelValue)
    //   console.log(';;;;;;;;;;;;;;;;;;;;;;;;;;;;;')
    //   console.log(this.content.modelName)
    //   console.log(';;;;;;;;;;;;;;;;;;;;;;;;;;;;;')
    //   if (this.content.modelName === 'ContentFile') {
    //     console.log(';;;;;;;;;;;;;;;;;;;;;;;;;;;;;')
    //     console.log(this.content.modelName)
    //     console.log(';;;;;;;;;;;;;;;;;;;;;;;;;;;;;')
    //     // return title.attachment.split('/attachment/')[1]
    //   } else {
    //     return title.title
    //   }
    // },

    changeThecourseContent () {
      // TODO: Get the current selected content
      this.setCurrentContentAction(this.content)
      this.setSelectedClassUnitContentAction(this.content)
    }
  }
}
</script>

<style></style>
