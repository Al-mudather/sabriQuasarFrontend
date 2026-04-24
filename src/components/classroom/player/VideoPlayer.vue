<template>
  <div class="cls-player">
    <TypeHasifHlsPlayer
      v-if="provider === 'type_hasif' && videoUuid"
      :video-uuid="videoUuid"
      :title="parsed?.title ?? undefined"
      @begin="$emit('begin')"
      @progress="(s, d) => $emit('progress', s, d)"
      @complete="$emit('complete')"
      @error="(m) => $emit('error', m)"
    />
    <VdoCipherPlayer
      v-else-if="provider === 'vdocipher' && parsed?.cipher_iframe"
      :cipher-iframe="parsed.cipher_iframe ?? null"
      :title="parsed.title ?? undefined"
      @begin="$emit('begin')"
      @progress="(s, d) => $emit('progress', s, d)"
      @complete="$emit('complete')"
      @error="(m) => $emit('error', m)"
    />
    <iframe
      v-else-if="provider === 'youtube' && youtubeEmbedUrl"
      class="cls-player__youtube"
      :src="youtubeEmbedUrl"
      :title="parsed?.title ?? 'Video'"
      allow="autoplay; encrypted-media; picture-in-picture"
      allowfullscreen
      frameborder="0"
    />
    <VimeoPlayer
      v-else-if="provider === 'vimeo' && vimeoId"
      :video-id="vimeoId"
      :hash="vimeoHash"
      @begin="$emit('begin')"
      @progress="(s, d) => $emit('progress', s, d)"
      @complete="$emit('complete')"
      @error="(m) => $emit('error', m)"
    />
    <div v-else class="cls-player__placeholder" role="img" :aria-label="fallbackLabel">
      <q-icon name="construction" size="64px" />
      <p class="cls-player__placeholder-title">{{ fallbackLabel }}</p>
      <p class="cls-player__placeholder-sub">{{ $t('classroom.player.providerPending') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  parseModelValue,
  resolveVideoProvider,
  type ParsedVideoValue,
  type VideoProvider,
} from 'src/types/classroom/types'
import TypeHasifHlsPlayer from 'src/components/classroom/player/TypeHasifHlsPlayer.vue'
import VimeoPlayer from 'src/components/classroom/player/VimeoPlayer.vue'
import VdoCipherPlayer from 'src/components/classroom/player/VdoCipherPlayer.vue'

interface Props {
  /** Raw modelValue JSON string from the CourseUnitContent row. */
  modelValueRaw: string | null
}

const props = defineProps<Props>()

defineEmits<{
  begin: []
  progress: [seconds: number, duration: number]
  complete: []
  error: [message: string]
}>()

const { t } = useI18n()

const parsed = computed<ParsedVideoValue | null>(() =>
  parseModelValue<ParsedVideoValue>(props.modelValueRaw),
)

const provider = computed<VideoProvider>(() => resolveVideoProvider(parsed.value))

// TYPE_HASIF: videoUuid is at modelValue.video_metadata.videoData.videoUuid
const videoUuid = computed<string | null>(() => {
  const uuid = parsed.value?.video_metadata?.videoData?.videoUuid
  return typeof uuid === 'string' && uuid.length > 0 ? uuid : null
})

// Vimeo: accept numeric id, "vimeo.com/<id>/<hash>" URL, or bare string.
const vimeoParts = computed<{ id: string | null; hash: string | undefined }>(() => {
  const raw = parsed.value?.video
  if (!raw) return { id: null, hash: undefined }
  const s = String(raw).trim()
  if (/^\d+$/.test(s)) return { id: s, hash: undefined }
  const m = s.match(/vimeo\.com\/(?:video\/)?(\d+)(?:\/(\w+))?/i)
  if (m) return { id: m[1] ?? null, hash: m[2] || undefined }
  return { id: null, hash: undefined }
})
const vimeoId = computed<string | null>(() => vimeoParts.value.id)
const vimeoHash = computed<string | undefined>(() => vimeoParts.value.hash)

// YouTube: extract the video id via common URL shapes.
const youtubeEmbedUrl = computed<string | null>(() => {
  const raw = parsed.value?.video
  if (!raw) return null
  const s = String(raw).trim()
  const patterns = [
    /youtube\.com\/watch\?v=([\w-]{6,})/i,
    /youtube\.com\/embed\/([\w-]{6,})/i,
    /youtu\.be\/([\w-]{6,})/i,
  ]
  for (const rx of patterns) {
    const m = s.match(rx)
    if (m?.[1]) return `https://www.youtube.com/embed/${m[1]}?rel=0`
  }
  return null
})

const fallbackLabel = computed<string>(() => {
  const key = `classroom.player.provider.${provider.value}`
  return t(key)
})
</script>

<style lang="scss" scoped>
.cls-player {
  inline-size: 100%;

  &__youtube {
    inline-size: 100%;
    aspect-ratio: 16 / 9;
    border: 0;
    border-radius: var(--cls-radius-lg, 16px);
    background: #000;
  }

  &__placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    aspect-ratio: 16 / 9;
    background: rgba(18, 14, 34, 0.8);
    border: 1px dashed var(--cls-divider, rgba(245, 242, 234, 0.08));
    border-radius: var(--cls-radius-lg, 16px);
    color: var(--cls-text-muted, #9890A8);
    text-align: center;
  }

  &__placeholder-title {
    margin: 0;
    color: var(--cls-text-primary, #F5F2EA);
    font-size: 15px;
    font-weight: 600;
  }

  &__placeholder-sub {
    margin: 0;
    font-size: 12px;
    max-inline-size: 32ch;
  }
}
</style>
