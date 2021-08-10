<template>
  <div>
    <q-file
      :readonly='readonly'
      :accept="accept"
      :max-file-size="imgeSize"
      v-model="file"
      :label="label"
      @rejected="onRejected"
    />
    <br>
  </div>
</template>

<script>

export default {
  name: 'FileUploader',
  data () {
    return {
      file: null,
      progressBar: 0
    }
  },
  props: ['readonly', 'accept', 'imgeSize', 'label'],
  watch: {
    file (val) {
      this.$emit('File_Handler', val)
    }
  },
  methods: {
    onRejected (rejected) {
      // Notify plugin needs to be installed
      // https://quasar.dev/quasar-plugins/notify#Installation
      this.$q.notify({
        type: 'negative',
        position: top,
        message: `Image size is: ${rejected[0].file.size}. Image max size is 4 M (4000000)`
      })
    }
  }
}
</script>
