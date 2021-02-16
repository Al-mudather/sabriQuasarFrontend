<template>
    <div class="tetch">
        <div class="row justify-center">
            <div
                class="col-lg-4 col-xs-12"
                v-for="inst in instructors.edges"
                :key="inst.node.id"
            >
                <instructor 
                :firstName="inst.node.instructor.user.firstName"
                :lastName="inst.node.instructor.user.lastName"
                :qualification="inst.node.instructor.qualification"
                :image="inst.node.instructor.image"
                />

            </div>
        </div>
    </div>
</template>

<script>
import instructor from 'src/components/courseClass/instructor'

export default {
  data () {
    return {
    }
  },
  props: ['instructors'],
  components: {
    instructor
  }
}
</script>

<style >
</style>
