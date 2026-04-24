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

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useQuasar } from 'quasar'

interface Props {
  readonly?: boolean
  accept?: string
  imgeSize?: number
  label?: string
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'File_Handler', val: File | null): void
}>()

const $q = useQuasar()

// File is typed as File | null; the Upload scalar maps to File at the call site.
const file = ref<File | null>(null)

watch(file, (val) => {
  emit('File_Handler', val)
})

interface RejectedEntry {
  file: { size: number }
}

function onRejected (rejected: RejectedEntry[]): void {
  $q.notify({
    type: 'negative',
    position: 'top',
    message: `Image size is: ${rejected[0].file.size}. Image max size is 4 M (4000000)`
  })
}
</script>
