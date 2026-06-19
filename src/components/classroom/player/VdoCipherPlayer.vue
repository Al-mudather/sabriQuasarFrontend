<template>
  <div class="cls-vdo">
    <!-- The iframe is injected ONCE, imperatively, into this mount node (see
         script). We deliberately do NOT use v-html: v-html re-runs on every
         re-render and any DOM patch that re-touches the iframe makes VdoCipher
         reload and re-request its SINGLE-USE OTP → "Authentication failed 6007". -->
    <div v-if="cipherIframe" ref="mountEl" class="cls-vdo__mount" />
    <div v-else class="cls-vdo__missing" role="alert">
      {{ $t('classroom.player.vdocipher.missingCredentials') }}
    </div>
  </div>
</template>

<script setup lang="ts">
/*
  VdoCipher player — mirrors CourseClassRoom2 class.vue:41-45.

  CC2's pattern: the backend returns a server-rendered iframe blob in
  `modelValue.cipher_iframe` (already signed for the current user). We
  drop the HTML into the DOM via v-html. No postMessage bridge, no OTP
  refresh, no client-side DRM negotiation — all of that lives inside
  the VdoCipher player iframe.

  Progress events are NOT captured here. The classroom ends the learning
  unit via EndLearningUnit on content switch, same as CC2.
*/
import { ref, watch } from 'vue'

const props = defineProps<{
  /** Server-rendered iframe HTML blob from modelValue.cipher_iframe. */
  cipherIframe: string | null
  title?: string | null
}>()

defineEmits<{
  (e: 'begin'): void
  (e: 'progress', seconds: number, duration: number): void
  (e: 'complete'): void
  (e: 'error', message: string): void
}>()

// The backend's cipher_iframe ships `allowFullScreen` but `allow="encrypted-media"`
// — and an `allow` attribute that OMITS `fullscreen` makes Chromium ignore the
// legacy `allowFullScreen`, so the VdoCipher player's fullscreen button silently
// does nothing. We rewrite the <iframe> tag to delegate fullscreen (and PiP) via
// the modern `allow` attribute, keeping a legacy `allowfullscreen` for old engines.
// Trusted server value — we only add attributes, never inject new markup.
function ensureIframePermissions(html: string | null | undefined): string {
  if (!html) return ''
  return html.replace(/<iframe\b[^>]*>/i, (tag) => {
    let out = tag
    const need = ['encrypted-media', 'fullscreen', 'picture-in-picture']
    const allowRe = /\sallow\s*=\s*"([^"]*)"/i
    const m = out.match(allowRe)
    if (m) {
      const have = m[1].split(';').map((s) => s.trim()).filter(Boolean)
      const merged = Array.from(new Set([...have, ...need]))
      out = out.replace(allowRe, ` allow="${merged.join('; ')}"`)
    } else {
      out = out.replace(/<iframe\b/i, `<iframe allow="${need.join('; ')}"`)
    }
    if (!/\sallowfullscreen\b/i.test(out)) {
      out = out.replace(/<iframe\b/i, '<iframe allowfullscreen')
    }
    return out
  })
}

// Inject the VdoCipher iframe EXACTLY ONCE. After the first injection we never
// touch the node again, so the player never reloads and never replays its
// single-use OTP. A genuine lesson change remounts this whole component (it's
// keyed on the content pk in ClassroomContentView) and re-injects with a fresh
// OTP. This is what makes VdoCipher reliable across re-renders / resizes / the
// mobile↔desktop layout flip.
const mountEl = ref<HTMLElement | null>(null)
let injected = false

function injectOnce(): void {
  if (injected) return
  const el = mountEl.value
  if (!el || !props.cipherIframe) return
  el.innerHTML = ensureIframePermissions(props.cipherIframe)
  injected = true
}

// mountEl is null until the v-if div renders (which only happens once
// cipherIframe is truthy); when it populates we inject, exactly once.
watch(mountEl, injectOnce, { immediate: true })
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

  &__mount {
    position: absolute;
    inset: 0;
    inline-size: 100%;
    block-size: 100%;

    :deep(iframe),
    :deep(div) {
      position: absolute;
      inset: 0;
      inline-size: 100% !important;
      block-size: 100% !important;
      border: 0;
    }
  }

  &__missing {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--cls-text-muted, #9890A8);
    font-size: 0.95rem;
    padding-inline: var(--cls-space-lg, 24px);
    text-align: center;
  }
}
</style>
