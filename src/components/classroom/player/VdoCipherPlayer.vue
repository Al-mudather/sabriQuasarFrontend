<template>
  <div class="cls-vdo">
    <!-- Exactly ONE <iframe>, rendered by us from the single player URL parsed
         out of the pasted embed code. We never inject the raw blob (v-html /
         innerHTML): real rows contain the code pasted twice, and two live
         VdoCipher players → "Error 6006 Multiple active videos". -->
    <template v-if="embed">
      <iframe
        v-if="active"
        ref="iframeEl"
        :key="embed.src"
        class="cls-vdo__frame"
        :src="embed.src"
        :title="title || 'Video'"
        :allow="VDOCIPHER_IFRAME_ALLOW"
        allowfullscreen
        frameborder="0"
      />
      <div v-else-if="revoked" class="cls-vdo__paused" role="status">
        <p class="cls-vdo__paused-text">{{ $t('classroom.player.vdocipher.pausedElsewhere') }}</p>
        <q-btn
          unelevated
          no-caps
          color="primary"
          icon="play_arrow"
          :label="$t('classroom.player.vdocipher.resumeHere')"
          @click="start"
        />
      </div>
    </template>
    <div v-else-if="hasCode" class="cls-vdo__missing" role="alert">
      {{ $t('classroom.player.vdocipher.invalidEmbed') }}
    </div>
    <div v-else class="cls-vdo__missing" role="alert">
      {{ $t('classroom.player.vdocipher.missingCredentials') }}
    </div>
  </div>
</template>

<script setup lang="ts">
/*
  VdoCipher player.

  `cipherIframe` is the embed code an admin pasted in the dashboard
  (ContentVideo.cipher_iframe). We parse it to ONE player URL
  (src/utils/vdocipher.ts) and render ONE iframe with the permissions
  VdoCipher needs (encrypted-media, fullscreen, picture-in-picture).

  Only one VdoCipher player may be alive per browser (all tabs): the
  SinglePlayerArbiter (src/utils/singleActivePlayer.ts) unmounts any other
  player — in this tab or another tab — when this one starts, and this one
  shows a "resume here" button if another player takes over.

  The parent keys this component on the lesson pk, so a lesson switch fully
  unmounts the old iframe before the new one loads; the arbiter delays the
  load until other tabs confirm they stopped and a short gap has passed, so
  the device can release the previous DRM session. pagehide / freeze stop the
  player (arbiter.suspend → onRevoke); coming back shows "play here".

  A pasted code that holds no VdoCipher player URL shows its own message and
  emits `error`; a code holding several players is logged so admins can find
  double-pasted lessons.

  Progress events are NOT captured here. The classroom ends the learning
  unit via EndLearningUnit on content switch, same as CC2.
*/
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import logger from 'src/utils/logger'
import { parseVdoCipherEmbed, VDOCIPHER_IFRAME_ALLOW, type VdoCipherEmbed } from 'src/utils/vdocipher'
import { getPlayerArbiter } from 'src/utils/singleActivePlayer'

const props = defineProps<{
  /** Pasted VdoCipher embed code (or bare player URL) from modelValue.cipher_iframe. */
  cipherIframe: string | null
  title?: string | null
}>()

const emit = defineEmits<{
  (e: 'begin'): void
  (e: 'progress', seconds: number, duration: number): void
  (e: 'complete'): void
  (e: 'error', message: string): void
}>()

const embed = computed<VdoCipherEmbed | null>(() => parseVdoCipherEmbed(props.cipherIframe))
const hasCode = computed<boolean>(() => !!props.cipherIframe?.trim())

function reportEmbed(): void {
  if (hasCode.value && !embed.value) {
    logger.warn('[VdoCipherPlayer] unrecognised VdoCipher embed code', {
      title: props.title ?? null,
      parsed: embed.value,
      // First 120 chars, with any OTP / playbackInfo redacted.
      code: props.cipherIframe?.replace(/(otp|playbackInfo)=[^&"'#\s]+/gi, '$1=…').slice(0, 120),
    })
    emit('error', 'invalid-vdocipher-embed')
  } else if (embed.value && embed.value.iframeCount > 1) {
    logger.warn('[VdoCipherPlayer] embed code holds several players; rendering only the first', {
      title: props.title ?? null,
      iframeCount: embed.value.iframeCount,
    })
  }
}

const arbiter = getPlayerArbiter()
const playerId = `vdo-${Math.random().toString(36).slice(2, 10)}`
const active = ref<boolean>(false)
const revoked = ref<boolean>(false)
const iframeEl = ref<HTMLIFrameElement | null>(null)
let unmounted = false

function blankIframe(): void {
  // Navigate the player away before Vue detaches it, so VdoCipher tears its
  // DRM session down instead of leaving it to garbage collection.
  try {
    if (iframeEl.value) iframeEl.value.src = 'about:blank'
  } catch { /* ignore */ }
}

function onRevoke(): void {
  blankIframe()
  active.value = false
  revoked.value = true
}

function start(): void {
  if (unmounted || !embed.value) return
  revoked.value = false
  arbiter.claim(playerId, onRevoke, () => {
    if (unmounted || arbiter.activeId() !== playerId) return
    active.value = true
  })
}

onMounted(() => {
  reportEmbed()
  start()
})

onBeforeUnmount(() => {
  unmounted = true
  blankIframe()
  active.value = false
  arbiter.release(playerId)
})
</script>

<style lang="scss" scoped>
.cls-vdo {
  position: relative;
  inline-size: 100%;
  // Fill the parent box — `.cls-cockpit__media` owns the dimensions.
  block-size: 100%;
  background: #000;
  border-radius: inherit;
  overflow: hidden;

  &__frame {
    position: absolute;
    inset: 0;
    inline-size: 100%;
    block-size: 100%;
    border: 0;
  }

  &__paused,
  &__missing {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
    align-items: center;
    justify-content: center;
    color: var(--cls-text-muted, #9890A8);
    font-size: 0.95rem;
    padding-inline: var(--cls-space-lg, 24px);
    text-align: center;
  }

  &__paused-text {
    margin: 0;
    max-inline-size: 36ch;
  }
}
</style>
