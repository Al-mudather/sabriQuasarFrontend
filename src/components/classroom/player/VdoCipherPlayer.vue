<template>
  <div class="cls-vdo" :data-state="view">
    <!-- Exactly ONE <iframe>, built by the session controller from the single
         player URL parsed out of the pasted embed code. We never inject the
         raw blob (v-html / innerHTML): real rows contain the code pasted
         twice, and two live VdoCipher players → "Error 6006 Multiple active
         videos". The iframe is appended to the host below and SURVIVES lesson
         changes: this component is not keyed on the lesson. -->
    <template v-if="embed">
      <div v-show="view === 'player'" ref="hostEl" class="cls-vdo__host" />
      <div v-if="view === 'player' && busy" class="cls-vdo__busy" role="status" aria-live="polite">
        <q-spinner size="36px" color="white" />
        <p v-if="phase === 'recovering'" class="cls-vdo__busy-text">
          {{ $t('classroom.player.vdocipher.recovering') }}
        </p>
      </div>
      <div v-else-if="view === 'stopped'" class="cls-vdo__paused" role="status">
        <p class="cls-vdo__paused-text">
          {{ $t(stopped === 'away'
            ? 'classroom.player.vdocipher.stoppedAway'
            : 'classroom.player.vdocipher.pausedElsewhere') }}
        </p>
        <q-btn
          unelevated
          no-caps
          color="primary"
          icon="play_arrow"
          :label="$t('classroom.player.vdocipher.resumeHere')"
          @click="start"
        />
      </div>
      <div v-else-if="view === 'failed'" class="cls-vdo__help" role="alert">
        <p class="cls-vdo__help-title">{{ $t('classroom.player.vdocipher.help.title') }}</p>
        <p class="cls-vdo__help-intro">{{ $t('classroom.player.vdocipher.help.intro') }}</p>
        <ol class="cls-vdo__help-steps">
          <li>{{ $t('classroom.player.vdocipher.help.closeOthers') }}</li>
          <li>{{ $t('classroom.player.vdocipher.help.restart') }}</li>
          <li>{{ $t('classroom.player.vdocipher.help.browser') }}</li>
          <li>{{ $t('classroom.player.vdocipher.help.protectedContent') }}</li>
        </ol>
        <q-btn
          unelevated
          no-caps
          color="primary"
          icon="refresh"
          class="cls-vdo__help-retry"
          :label="$t('classroom.player.vdocipher.help.retry')"
          @click="retry"
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
  VdoCipher player — ONE persistent player, reused across lessons.

  `cipherIframe` is the embed code an admin pasted in the dashboard
  (ContentVideo.cipher_iframe). We parse it to ONE player URL
  (src/utils/vdocipher.ts). The iframe itself is owned by a VdoCipherSession
  (src/composables/classroom/useVdoCipherSession.ts):

    - it is built in LITE mode, so opening a lesson requests no licence and
      opens no DRM session until the student taps play;
    - when `cipherIframe` changes (the parent does NOT key this component on
      the lesson), a player that has played is switched with the vendor
      Player API (`loadVideo`, which closes the old session first); a player
      that never played is simply rebuilt — there is nothing to release;
    - session errors (6002 / 6003 / 6006) rebuild the player after a backoff,
      twice; then the help panel below explains what to do.

  Only one VdoCipher player may be alive per browser (all tabs): the
  SinglePlayerArbiter (src/utils/singleActivePlayer.ts) UNLOADS any other
  player — in this tab or another tab — when this one starts, and this one
  shows a "play here" button if another player takes over. pagehide / freeze
  unload the player too; coming back shows "play here" (never auto-loads).

  A pasted code that holds no VdoCipher player URL shows its own message and
  emits `error`; a code holding several players is logged so admins can find
  double-pasted lessons.

  Progress events are NOT captured here. The classroom ends the learning
  unit via EndLearningUnit on content switch, same as CC2.
*/
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import logger from 'src/utils/logger'
import { parseVdoCipherEmbed, redactVdoCipher, type VdoCipherEmbed } from 'src/utils/vdocipher'
import { getPlayerArbiter, type RevokeReason, type RevokeResult } from 'src/utils/singleActivePlayer'
import {
  VdoCipherSession,
  type VdoSessionPhase,
  type VdoTarget,
} from 'src/composables/classroom/useVdoCipherSession'

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
const target = computed<VdoTarget | null>(() =>
  embed.value ? { src: embed.value.src, title: props.title ?? '' } : null,
)

function reportEmbed(): void {
  if (hasCode.value && !embed.value) {
    logger.warn('[VdoCipherPlayer] unrecognised VdoCipher embed code', {
      title: props.title ?? null,
      parsed: embed.value,
      // First 120 chars, with any OTP / playbackInfo redacted.
      code: redactVdoCipher(props.cipherIframe).slice(0, 120),
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
const hostEl = ref<HTMLElement | null>(null)
const phase = ref<VdoSessionPhase>('idle')
/** Why the player is unloaded here: another tab/player took over, or the page went away. */
const stopped = ref<'elsewhere' | 'away' | null>(null)
/** True while this component holds the arbiter's go-ahead to load. */
let ready = false
let unmounted = false
let idleTimer: ReturnType<typeof setTimeout> | null = null

const session = new VdoCipherSession({
  host: () => hostEl.value,
  arbiter,
  frameClass: 'cls-vdo__frame',
  onPhase: (next) => {
    phase.value = next
    if (next === 'failed') emit('error', 'vdocipher-session-failed')
    if (idleTimer) {
      clearTimeout(idleTimer)
      idleTimer = null
    }
    // Stopped from outside (stopVdoCipherPlayers) while still mounted: that is
    // normally followed by an unmount. If it is not, offer "play here".
    if (next === 'idle' && ready && !stopped.value) {
      idleTimer = setTimeout(() => {
        idleTimer = null
        if (unmounted || phase.value !== 'idle' || !ready) return
        ready = false
        stopped.value = 'away'
        arbiter.release(playerId, { kind: 'vdocipher', hadSession: false })
      }, 800)
    }
  },
})

const view = computed<'player' | 'stopped' | 'failed'>(() => {
  if (stopped.value) return 'stopped'
  if (phase.value === 'failed') return 'failed'
  return 'player'
})
const busy = computed<boolean>(() => phase.value === 'loading' || phase.value === 'recovering')

function onRevoke(reason: RevokeReason): RevokeResult {
  ready = false
  stopped.value = reason === 'suspend' ? 'away' : 'elsewhere'
  // pagehide / freeze: the page may never run again → synchronous teardown.
  return reason === 'suspend' ? session.stopSync() : session.stop()
}

function start(): void {
  if (unmounted || !target.value) return
  stopped.value = null
  arbiter.claim(playerId, onRevoke, () => {
    if (unmounted || arbiter.activeId() !== playerId) return
    ready = true
    if (target.value) session.show(target.value)
  })
}

function retry(): void {
  if (unmounted) return
  if (ready && arbiter.activeId() === playerId) session.retry()
  else start()
}

// Lesson switch: same component, same iframe — only the wanted video changes.
watch(
  () => target.value?.src ?? null,
  (src) => {
    reportEmbed()
    if (unmounted) return
    const next = target.value
    if (!src || !next) {
      ready = false
      void session.stop().then((info) => arbiter.release(playerId, info))
      return
    }
    // A lesson picked here is an explicit "play here", whoever holds the player.
    if (ready && arbiter.activeId() === playerId) session.show(next)
    else start()
  },
)

// Keep the iframe's accessible name in step when only the title changes.
watch(
  () => props.title,
  () => {
    if (ready && target.value) session.show(target.value)
  },
)

onMounted(() => {
  reportEmbed()
  start()
})

onBeforeUnmount(() => {
  unmounted = true
  if (idleTimer) clearTimeout(idleTimer)
  // Vue detaches the iframe right after this hook, so this path is
  // synchronous. Callers that can wait run stopVdoCipherPlayers() first.
  const info = session.destroy()
  arbiter.release(playerId, info)
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

  &__host {
    position: absolute;
    inset: 0;
  }

  // The iframe is created by the session controller, outside the template,
  // so it carries no scoped-style attribute.
  :deep(.cls-vdo__frame) {
    position: absolute;
    inset: 0;
    inline-size: 100%;
    block-size: 100%;
    border: 0;
  }

  &__busy {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
    align-items: center;
    justify-content: center;
    padding-inline: var(--cls-space-lg, 24px);
    background: rgba(0, 0, 0, 0.55);
    color: #fff;
    text-align: center;
    // Never swallow a tap meant for the player underneath.
    pointer-events: none;
  }

  &__busy-text {
    margin: 0;
    max-inline-size: 40ch;
    font-size: 0.9rem;
    line-height: 1.6;
  }

  &__help {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
    // Taller than a 16:9 phone box: scroll inside if the parent cannot grow.
    overflow-y: auto;
    padding: 16px var(--cls-space-lg, 24px);
    background: var(--cls-surface-raised, #171226);
    color: var(--cls-text-primary, #F5F2EA);
    font-size: 0.9rem;
    line-height: 1.7;
    text-align: start;
  }

  &__help-title {
    margin: 0;
    font-size: 1rem;
    font-weight: 700;
  }

  &__help-intro {
    margin: 0;
    color: var(--cls-text-muted, #9890A8);
  }

  &__help-steps {
    margin: 0;
    padding-inline-start: 1.4em;

    li + li {
      margin-block-start: 4px;
    }
  }

  &__help-retry {
    flex: 0 0 auto;
    margin-block-start: 4px;
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
