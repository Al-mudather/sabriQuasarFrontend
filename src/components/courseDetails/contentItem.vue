<template>
<div>
    <component
      :is="content.isFree ? 'button' : 'div'"
      class="content-row"
      :class="{ 'content-row--locked': !content.isFree, 'content-row--free': content.isFree }"
      :type="content.isFree ? 'button' : undefined"
      @click="content.isFree && openFreeVideoCourse($event)"
    >
      <span class="content-row__icon" aria-hidden="true">
        <img v-if="content.isFree" src="~assets/img/unlock.png" alt="" />
        <img v-else src="~assets/img/padlock.png" alt="" />
      </span>
      <span class="content-row__title">{{ formatTitle }}</span>
      <ds-badge v-if="content.isFree" variant="success" size="sm">{{ $t('مجاني') }}</ds-badge>
    </component>

    <q-dialog v-model="card" persistent>
      <q-card class="my-card">
        <AlhasifVideoPlayer ref="alhasifPlayer" id="videoPlayer" v-if="video_type === 'TYPE_HASIF'" :videoUuid="videoUuid ?? undefined" />
        <div v-else>
          <div v-show="player" style="padding-top:56.25%;position:relative;">
            <div style="border:0;max-width:100%;position:absolute;top:0;left:0;height:100%;width:100%; padding-bottom: 2rem;" id="videoPlayer" :data-id="content.pk"></div>
          </div>
          <div v-if="!player">
            <div v-if="cipherVideo" v-html="cipherVideo"></div>
            <q-video
              v-else
              :ratio="16/9"
              :src="videoUrl"
            />
          </div>
        </div>

        <q-card-section>
          <div class="row no-wrap items-center" style="margin-left: 0;">
            <div class="col text-h6 ellipsis text-center">
              {{ formatTitle }}
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="center" style="width: 100%;">
          <q-btn label="Stop the video" @click="uninitializeVideo" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
</div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import videoPlayer from 'src/utils/video-client.js'
import AlhasifVideoPlayer from 'src/utils/AlhasifVideoPlayer.vue'
import type { CourseUnitContent } from 'src/types/courses/types'

// modelValue is a JSONString scalar. Apollo's typePolicy only parses
// CourseNode.currency — not CourseUnitContentNode.modelValue — so at runtime
// the field can arrive either as a raw JSON-encoded string (no policy) or as
// the parsed object that codegen advertises (`Record<string, number> | null`).
// Accept both and narrow locally before JSON.parse.
type RawContent = Omit<CourseUnitContent, 'modelValue'> & {
  modelValue: string | Record<string, unknown> | null
}

const props = defineProps<{
  content: RawContent
}>()

function readModelValue (): Record<string, unknown> | null {
  const raw = props.content.modelValue
  if (!raw) return null
  if (typeof raw === 'string') {
    try { return JSON.parse(raw) as Record<string, unknown> } catch { return null }
  }
  return raw as Record<string, unknown>
}

const route = useRoute()
const $q = useQuasar()

const card = ref(false)
const player = ref<InstanceType<typeof videoPlayer> | null>(null)
const cipherVideo = ref<string | null>(null)
const videoUrl = ref('')
const video_type = ref<string | null>(null)
const videoUuid = ref<string | null>(null)

const formatTitle = computed<string>(() => {
  const result = readModelValue()
  if (!result) return ''
  if (props.content.modelName === 'ContentFile') {
    return String(
      (result.attachment as string | undefined)?.split('/attachment/')[1] ?? '',
    )
  }
  if (props.content.modelName === 'ContentQuiz') {
    return String(result.quiz_title ?? '')
  }
  return String(result.title ?? '')
})

function uninitializeVideo (): void {
  try {
    player.value?.uninitializeTheVideo?.()
  } catch { /* ignore */ }
}

function prepareSmartNodeVideo (videoMetadata: Record<string, unknown>): void {
  setTimeout(() => {
    uninitializeVideo()
    const key = (videoMetadata.path as string | undefined) ?? (videoMetadata.id as string | undefined)
    player.value = new videoPlayer('prod', `${location.origin}/api/course/video/auth`)
    try {
      const pk = props.content.pk
      const routePk = (route.params.pk as string | undefined) ?? ''
      player.value.play(`[data-id="${pk}"]`, key, 7, routePk)
    } catch {
      $q.notify({
        type: 'warning',
        multiLine: true,
        progress: true,
        message: 'هنالك ضعف في الشبكه, من فضلك اعد تحميل الصفحه و قم بشغيل الفيديو مجددا',
      })
    }
  }, 1000)
}

function openFreeVideoCourse (e: Event): void {
  try {
    e.preventDefault()
    cipherVideo.value = null
    player.value = null
    videoUuid.value = null
    video_type.value = null
    card.value = true

    const contentData = readModelValue()
    if (!contentData) return
    const videoMeta = contentData.video_metadata as Record<string, unknown> | undefined
    video_type.value = (contentData.video_type as string | undefined) ?? null

    if (videoMeta) {
      if (video_type.value === 'TYPE_HASIF') {
        const vd = videoMeta.videoData as Record<string, unknown> | undefined
        videoUuid.value = (vd?.videoUuid as string | undefined) ?? null
      } else {
        prepareSmartNodeVideo(videoMeta)
      }
    } else {
      const cipher = contentData.cipher_iframe as string | undefined
      if (cipher) {
        cipherVideo.value = cipher
      } else {
        const video = contentData.video as string | undefined ?? ''
        const i = video.indexOf('v')
        const videoKey = video.slice(i + 2)
        if (video.indexOf('youtube') > 0) {
          videoUrl.value = 'https://www.youtube.com/embed?=' + videoKey
        } else {
          videoUrl.value = 'https://player.vimeo.com/video/' + String(video)
        }
      }
    }
  } catch { /* ignore */ }
}
</script>

<style lang="scss" scoped>
.content-row {
  display: flex;
  align-items: center;
  gap: var(--ds-space-3);
  inline-size: 100%;
  text-align: inherit;
  padding: var(--ds-space-2) var(--ds-space-3);
  border: 0;
  border-radius: var(--ds-radius-md);
  background: transparent;
  color: var(--ds-text);
  font-family: var(--ds-font-body);
  font-size: var(--ds-text-sm);
  line-height: var(--ds-leading-normal);
  transition:
    background-color var(--ds-duration-fast) var(--ds-ease-out),
    color            var(--ds-duration-fast) var(--ds-ease-out);

  &--locked {
    color: var(--ds-text-muted);
    cursor: default;
  }

  &--free {
    cursor: pointer;
    &:hover {
      background: var(--ds-brand-50);
      color: var(--ds-brand-700);
    }
    &:focus-visible {
      outline: 2px solid transparent;
      box-shadow: var(--ds-shadow-focus);
    }
  }

  &__icon {
    flex-shrink: 0;
    inline-size: 1.15rem;
    block-size: 1.15rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    img { max-inline-size: 100%; max-block-size: 100%; opacity: 0.7; }
  }

  &--free &__icon img { opacity: 1; }

  &__title {
    flex: 1;
    min-inline-size: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
