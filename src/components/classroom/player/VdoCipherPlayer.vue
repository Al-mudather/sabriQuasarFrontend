<template>
  <div class="cls-vdo">
    <div
      v-if="cipherIframe"
      class="cls-vdo__mount"
      v-html="cipherIframe"
    />
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
defineProps<{
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
</script>

<style lang="scss" scoped>
.cls-vdo {
  position: relative;
  inline-size: 100%;
  aspect-ratio: 16 / 9;
  background: #000;
  border-radius: var(--cls-radius-lg, 16px);
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
