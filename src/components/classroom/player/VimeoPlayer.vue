<template>
  <div class="cls-vimeo">
    <div ref="mountRef" class="cls-vimeo__mount" />
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import Player from '@vimeo/player'

interface Props {
  /** Vimeo numeric id, stored on ContentVideoNode.videoMetadata. */
  videoId: string
  /** Optional private-video hash (e.g. vimeo.com/123/abc → "abc"). */
  hash?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  begin: []
  progress: [seconds: number, duration: number]
  complete: []
  error: [message: string]
}>()

const mountRef = ref<HTMLDivElement | null>(null)
let player: Player | null = null

function destroyPlayer(): void {
  if (!player) return
  try { void player.destroy() } catch { /* noop */ }
  player = null
}

function mountPlayer(): void {
  destroyPlayer()
  const el = mountRef.value
  if (!el || !props.videoId) return

  const idNum = Number(props.videoId)
  const options: Record<string, unknown> = {
    responsive: true,
    dnt: true,
    playsinline: true,
    title: false,
    byline: false,
    portrait: false,
  }
  if (Number.isFinite(idNum) && idNum > 0) options.id = idNum
  else options.url = `https://vimeo.com/${props.videoId}`
  if (props.hash) options.h = props.hash

  player = new Player(el, options as unknown as ConstructorParameters<typeof Player>[1])

  player.on('play', () => emit('begin'))
  player.on('timeupdate', (e: { seconds: number; duration: number }) => {
    emit('progress', e.seconds, e.duration)
  })
  player.on('ended', () => emit('complete'))
  player.on('error', (e: { message?: string }) => emit('error', e?.message ?? 'Vimeo player error'))
}

onMounted(mountPlayer)
onBeforeUnmount(destroyPlayer)
watch(() => [props.videoId, props.hash], mountPlayer)
</script>

<style lang="scss" scoped>
.cls-vimeo {
  inline-size: 100%;
  aspect-ratio: 16 / 9;
  border-radius: var(--cls-radius-lg, 16px);
  overflow: hidden;
  background: #000;

  &__mount {
    inline-size: 100%;
    block-size: 100%;

    :deep(iframe) {
      inline-size: 100%;
      block-size: 100%;
      display: block;
    }
  }
}
</style>
