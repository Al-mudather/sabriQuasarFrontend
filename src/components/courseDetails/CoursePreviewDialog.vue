<template>
  <q-dialog
    :model-value="modelValue"
    persistent
    no-route-dismiss
    no-esc-dismiss
    no-backdrop-dismiss
    transition-show="fade"
    transition-hide="fade"
    @update:model-value="onDialogUpdate"
  >
    <div class="preview-dialog" role="dialog" aria-modal="true" aria-labelledby="preview-title">
      <!-- Sticky header ------------------------------------------------- -->
      <header class="preview-dialog__head">
        <div class="preview-dialog__head-text">
          <span class="preview-dialog__kicker">{{ $t('معاينة الدورة') }}</span>
          <p id="preview-title" class="preview-dialog__title">
            {{ courseTitle }}
          </p>
        </div>
        <button
          type="button"
          class="preview-dialog__close"
          :aria-label="$t('إغلاق')"
          @click="emit('close')"
        >
          <svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true">
            <path
              d="M5 5l10 10M15 5L5 15"
              stroke="currentColor"
              stroke-width="1.75"
              stroke-linecap="round"
            />
          </svg>
        </button>
      </header>

      <!-- Scrollable body ---------------------------------------------- -->
      <div ref="bodyEl" class="preview-dialog__body">
        <!-- Video region ---------------------------------------------- -->
        <!--
          The stage is a 16:9 ratio box (padding-block-end trick). Every
          player variant is rendered as a direct absolutely-positioned
          child that fills the box; the stage itself owns the black
          letterbox background. Each variant enforces 100% × 100% on any
          iframe / video descendant so third-party players with fixed
          width/height attributes still fill the stage.
        -->
        <div class="preview-dialog__stage">
          <template v-if="activeSample">
            <div
              v-if="activeVideoType === 'TYPE_HASIF' && activeVideoUuid"
              class="preview-dialog__player"
            >
              <AlhasifVideoPlayer
                ref="alhasifRef"
                :key="'alhasif-' + activeSample.id"
                :videoUuid="activeVideoUuid"
              />
            </div>

            <div
              v-else-if="activeCipher"
              class="preview-dialog__cipher"
              v-html="activeCipher"
            />

            <iframe
              v-else-if="activeEmbedUrl"
              :key="'embed-' + activeSample.id"
              class="preview-dialog__embed"
              :src="activeEmbedUrl"
              frameborder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowfullscreen
              referrerpolicy="no-referrer"
            />

            <div
              v-else-if="activeVideoMeta"
              :key="'smart-' + activeSample.id"
              :data-id="activeSample.pk ?? ''"
              class="preview-dialog__smartnode"
            />

            <div v-else class="preview-dialog__stage-empty">
              <span>{{ $t('لا يمكن تشغيل هذا المحتوى') }}</span>
            </div>
          </template>
          <div v-else class="preview-dialog__stage-empty">
            <span>{{ $t('اختر فيديوًا من القائمة') }}</span>
          </div>
        </div>

        <!-- Free samples list ---------------------------------------- -->
        <section class="preview-dialog__samples">
          <h3 class="preview-dialog__samples-title">
            {{ $t('الفيديوهات المجانية') }}
            <span class="preview-dialog__samples-count">{{ samples.length }}</span>
          </h3>

          <ul v-if="samples.length" class="preview-dialog__list">
            <li v-for="s in samples" :key="s.id">
              <button
                type="button"
                class="preview-dialog__row"
                :class="{ 'is-active': activeId === s.id }"
                @click="onRowSelect(s.id)"
              >
                <span
                  class="preview-dialog__row-thumb"
                  :class="{ 'is-active': activeId === s.id }"
                  aria-hidden="true"
                >
                  <svg viewBox="0 0 24 24" width="18" height="18">
                    <circle
                      cx="12" cy="12" r="9"
                      stroke="currentColor" stroke-width="1.5" fill="none"
                    />
                    <path d="M10.25 8.25 L15.5 12 L10.25 15.75 Z" fill="currentColor"/>
                  </svg>
                </span>
                <span class="preview-dialog__row-body">
                  <span class="preview-dialog__row-title">{{ s.title || $t('فيديو') }}</span>
                  <span v-if="s.unitTitle" class="preview-dialog__row-unit">
                    {{ s.unitTitle }}
                  </span>
                </span>
                <span v-if="s.duration" class="preview-dialog__row-duration">
                  {{ s.duration }}
                </span>
              </button>
            </li>
          </ul>

          <p v-else class="preview-dialog__empty">
            {{ $t('لا توجد عينات مجانية في هذه الدورة') }}
          </p>
        </section>
      </div>
    </div>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch, onBeforeUnmount, nextTick } from 'vue'
import AlhasifVideoPlayer from 'src/utils/AlhasifVideoPlayer.vue'
import videoPlayer from 'src/utils/video-client.js'

export interface FreeSample {
  id: string
  pk: number | null
  title: string
  modelName: string
  duration?: string
  thumbnail?: string
  unitTitle?: string
  /** Parsed modelValue object from the content node */
  modelValue: Record<string, unknown> | null
}

interface Props {
  modelValue: boolean
  samples: FreeSample[]
  activeId: string | null
  courseTitle: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void
  (e: 'select', id: string): void
  (e: 'close'): void
}>()

function onDialogUpdate(v: boolean): void {
  // Quasar will fire this only when its own dismiss paths trigger (none, since
  // we disabled them all). Still, forward it defensively.
  emit('update:modelValue', v)
  if (!v) emit('close')
}

const bodyEl = ref<HTMLElement | null>(null)

function onRowSelect(id: string): void {
  emit('select', id)
  // Snap the dialog body back to the top so the video stage is in view —
  // otherwise switching the active sample while scrolled halfway down the
  // list leaves the just-started video off-screen.
  if (bodyEl.value) {
    bodyEl.value.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

// Active sample --------------------------------------------------------------
const activeSample = computed<FreeSample | null>(() =>
  props.samples.find((s) => s.id === props.activeId) ?? null,
)

const activeVideoMeta = computed<Record<string, unknown> | null>(() => {
  const m = activeSample.value?.modelValue
  if (!m) return null
  return (m.video_metadata as Record<string, unknown> | undefined) ?? null
})

const activeVideoType = computed<string | null>(() => {
  const m = activeSample.value?.modelValue
  if (!m) return null
  return (m.video_type as string | undefined) ?? null
})

const activeVideoUuid = computed<string | null>(() => {
  const meta = activeVideoMeta.value
  if (!meta) return null
  const vd = meta.videoData as Record<string, unknown> | undefined
  return (vd?.videoUuid as string | undefined) ?? null
})

const activeCipher = computed<string | null>(() => {
  const m = activeSample.value?.modelValue
  if (!m) return null
  return (m.cipher_iframe as string | undefined) ?? null
})

const activeEmbedUrl = computed<string>(() => {
  const m = activeSample.value?.modelValue
  if (!m) return ''
  if (activeVideoMeta.value || activeCipher.value) return ''
  const video = (m.video as string | undefined) ?? ''
  if (!video) return ''
  // Crude key extraction preserved from the legacy contentItem flow.
  const i = video.indexOf('v')
  const videoKey = video.slice(i + 2)
  if (video.indexOf('youtube') > 0) {
    // `?autoplay=1&mute=1` lands us in the browser-accepted autoplay path
    // (unmuted autoplay is blocked until user gesture; muted autoplay
    // survives first paint).
    return `https://www.youtube.com/embed/${videoKey}?autoplay=1&mute=1&rel=0`
  }
  return `https://player.vimeo.com/video/${String(video)}?autoplay=1&muted=1`
})

// SmartNode player lifecycle ------------------------------------------------
const alhasifRef = ref<InstanceType<typeof AlhasifVideoPlayer> | null>(null)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let smartPlayer: any = null

function uninitSmartPlayer(): void {
  try {
    smartPlayer?.uninitializeTheVideo?.()
  } catch { /* ignore */ }
  smartPlayer = null
}

function initSmartNode(): void {
  if (!activeSample.value || !activeVideoMeta.value) return
  if (activeVideoType.value === 'TYPE_HASIF') return
  if (activeCipher.value || activeEmbedUrl.value) return

  uninitSmartPlayer()
  void nextTick(() => {
    try {
      const meta = activeVideoMeta.value as Record<string, unknown>
      const key = (meta.path as string | undefined) ?? (meta.id as string | undefined)
      if (!key || activeSample.value?.pk == null) return
      smartPlayer = new videoPlayer('prod', `${location.origin}/api/course/video/auth`)
      smartPlayer.play(`[data-id="${activeSample.value.pk}"]`, key, 7, '')
    } catch { /* ignore network errors */ }
  })
}

watch(
  () => [props.modelValue, props.activeId] as const,
  ([open]) => {
    if (!open) {
      uninitSmartPlayer()
      return
    }
    initSmartNode()
  },
  { immediate: true },
)

onBeforeUnmount(uninitSmartPlayer)
</script>

<style lang="scss" scoped>
.preview-dialog {
  inline-size: min(720px, 100vw);
  max-block-size: min(88vh, 900px);
  display: flex;
  flex-direction: column;
  background: var(--ds-surface-indigo, #1f1847);
  color: var(--ds-text-on-indigo, #f6f1ea);
  border-radius: var(--ds-radius-lg);
  box-shadow: 0 32px 80px -24px rgba(0, 0, 0, 0.55);
  overflow: hidden;

  @media (max-width: 640px) {
    inline-size: 100vw;
    max-block-size: 100vh;
    border-radius: 0;
  }

  // Sticky header -----------------------------------------------------------
  &__head {
    flex: 0 0 auto;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--ds-space-3);
    padding: var(--ds-space-4) var(--ds-space-5);
    background: rgba(0, 0, 0, 0.18);
    border-block-end: 1px solid rgba(246, 241, 234, 0.08);
    position: sticky;
    inset-block-start: 0;
    z-index: 2;
  }

  &__head-text {
    min-inline-size: 0;
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
  }

  &__kicker {
    font-family: var(--ds-font-body);
    font-size: var(--ds-text-xs);
    letter-spacing: 0.06em;
    color: rgba(246, 241, 234, 0.72);
  }

  &__title {
    margin: 0;
    font-family: var(--ds-font-heading);
    font-weight: 700;
    font-size: var(--ds-text-lg);
    line-height: 1.3;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  &__close {
    flex: 0 0 auto;
    inline-size: 2rem;
    block-size: 2rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: rgba(246, 241, 234, 0.08);
    border: 0;
    cursor: pointer;
    color: var(--ds-text-on-indigo, #f6f1ea);
    transition: background-color var(--ds-duration-fast) var(--ds-ease-out);

    &:hover { background: rgba(246, 241, 234, 0.16); }
    &:focus-visible {
      outline: 2px solid var(--ds-accent-300);
      outline-offset: 2px;
    }
  }

  // Scrollable body ---------------------------------------------------------
  &__body {
    flex: 1 1 auto;
    overflow-y: auto;
    overflow-x: hidden;
    padding: var(--ds-space-5);
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-5);

    scrollbar-width: thin;
    scrollbar-color: rgba(246, 241, 234, 0.24) transparent;

    &::-webkit-scrollbar { width: 6px; }
    &::-webkit-scrollbar-thumb {
      background: rgba(246, 241, 234, 0.2);
      border-radius: 3px;
    }
  }

  // Video stage -------------------------------------------------------------
  // Use the classic padding-block-end ratio box: iframes and third-party
  // players often ship with intrinsic width/height attributes and don't
  // respect `aspect-ratio` on a flex parent, so we force a fixed 16:9 slot
  // and absolutely position every variant into it.
  &__stage {
    position: relative;
    inline-size: 100%;
    padding-block-end: 56.25%;
    block-size: 0;
    border-radius: var(--ds-radius-md);
    overflow: hidden;
    background: #000;
    box-shadow: 0 8px 24px -12px rgba(0, 0, 0, 0.6);
    flex-shrink: 0;
  }

  &__player,
  &__smartnode,
  &__embed,
  &__cipher,
  &__stage-empty {
    position: absolute;
    inset: 0;
    inline-size: 100%;
    block-size: 100%;
    border: 0;
    background: #000;
    display: block;
  }

  // Force any nested iframe / video / div the third-party players inject to
  // fill the stage. Covers: videojs (AlhasifVideoPlayer), SmartNode
  // video-client's injected <video>, Vimeo/YouTube cipher iframes that
  // ship with fixed width/height attrs.
  &__player :deep(.video-js),
  &__player :deep(video),
  &__cipher :deep(iframe),
  &__cipher :deep(video),
  &__smartnode :deep(video),
  &__smartnode :deep(iframe),
  &__smartnode :deep(> *) {
    position: absolute !important;
    inset: 0 !important;
    inline-size: 100% !important;
    block-size: 100% !important;
    max-inline-size: 100% !important;
    max-block-size: 100% !important;
    border: 0 !important;
    margin: 0 !important;
    padding: 0 !important;
    object-fit: contain;
  }

  &__stage-empty {
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(246, 241, 234, 0.64);
    font-family: var(--ds-font-body);
    font-size: var(--ds-text-sm);
    background: transparent;
  }

  // Free samples ------------------------------------------------------------
  &__samples-title {
    font-family: var(--ds-font-heading);
    font-weight: 700;
    font-size: var(--ds-text-md);
    color: var(--ds-text-on-indigo, #f6f1ea);
    margin: 0 0 var(--ds-space-3);
    display: inline-flex;
    align-items: center;
    gap: var(--ds-space-2);
  }

  &__samples-count {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-inline-size: 1.5rem;
    padding-inline: 0.45rem;
    block-size: 1.5rem;
    border-radius: var(--ds-radius-pill);
    background: rgba(246, 241, 234, 0.1);
    font-family: var(--ds-font-mono);
    font-size: var(--ds-text-xs);
    font-weight: 600;
  }

  &__list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-2);
  }

  &__row {
    inline-size: 100%;
    display: flex;
    align-items: center;
    gap: var(--ds-space-3);
    padding: var(--ds-space-3);
    background: rgba(246, 241, 234, 0.04);
    border: 1px solid rgba(246, 241, 234, 0.06);
    border-radius: var(--ds-radius-md);
    cursor: pointer;
    text-align: inherit;
    color: inherit;
    transition:
      background-color var(--ds-duration-fast) var(--ds-ease-out),
      border-color var(--ds-duration-fast) var(--ds-ease-out),
      transform var(--ds-duration-fast) var(--ds-ease-out);

    &:hover {
      background: rgba(246, 241, 234, 0.08);
      border-color: rgba(246, 241, 234, 0.14);
    }

    &:focus-visible {
      outline: 2px solid var(--ds-accent-300);
      outline-offset: 2px;
    }

    &.is-active {
      background: rgba(193, 98, 60, 0.16);
      border-color: var(--ds-accent-300);
    }
  }

  &__row-thumb {
    flex: 0 0 auto;
    inline-size: 2.25rem;
    block-size: 2.25rem;
    border-radius: 50%;
    background: rgba(246, 241, 234, 0.1);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--ds-text-on-indigo, #f6f1ea);
    transition:
      background-color var(--ds-duration-fast) var(--ds-ease-out),
      color var(--ds-duration-fast) var(--ds-ease-out);

    &.is-active {
      background: var(--ds-accent-300);
      color: var(--ds-ink);
    }
  }

  &__row-body {
    flex: 1 1 auto;
    min-inline-size: 0;
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
  }

  &__row-title {
    font-family: var(--ds-font-body);
    font-weight: 500;
    font-size: var(--ds-text-sm);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__row-unit {
    font-family: var(--ds-font-body);
    font-size: var(--ds-text-xs);
    color: rgba(246, 241, 234, 0.6);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__row-duration {
    flex: 0 0 auto;
    font-family: var(--ds-font-mono);
    font-size: var(--ds-text-xs);
    font-variant-numeric: tabular-nums;
    color: rgba(246, 241, 234, 0.72);
  }

  &__empty {
    font-family: var(--ds-font-body);
    font-size: var(--ds-text-sm);
    color: rgba(246, 241, 234, 0.64);
    text-align: center;
    padding: var(--ds-space-4);
    margin: 0;
  }
}
</style>
