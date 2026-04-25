<script setup lang="ts">
/**
 * BackToTopFab — small floating button bottom-end of the viewport.
 *
 * Appears once the learner has scrolled past `threshold` pixels and scrolls
 * the page back to the top on click. Listens to both window scroll and the
 * classroom side-panel body scroll, since on mobile the panel body has its
 * own overflow.
 */
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const props = withDefaults(defineProps<{ threshold?: number }>(), {
  threshold: 320,
})

const { t } = useI18n()
const visible = ref(false)
const panelBody = ref<Element | null>(null)

function update(): void {
  const winY = window.scrollY || document.documentElement.scrollTop || 0
  const panelY = panelBody.value?.scrollTop ?? 0
  visible.value = winY > props.threshold || panelY > props.threshold
}

function scrollTop(): void {
  window.scrollTo({ top: 0, behavior: 'smooth' })
  panelBody.value?.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  panelBody.value = document.querySelector('.cls-panel__body')
  window.addEventListener('scroll', update, { passive: true })
  panelBody.value?.addEventListener('scroll', update, { passive: true } as AddEventListenerOptions)
  update()
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', update)
  panelBody.value?.removeEventListener('scroll', update)
})
</script>

<template>
  <Transition name="cls-fab">
    <button
      v-if="visible"
      type="button"
      class="cls-fab"
      :aria-label="t('classroom.backToTop')"
      :title="t('classroom.backToTop')"
      @click="scrollTop"
    >
      <q-icon name="keyboard_arrow_up" size="22px" />
    </button>
  </Transition>
</template>

<style lang="scss" scoped>
.cls-fab {
  position: fixed;
  inset-block-end: 20px;
  inset-inline-end: 20px;
  z-index: 50;
  inline-size: 44px;
  block-size: 44px;
  border-radius: 999px;
  border: 0;
  background: var(--cls-accent, #C1623C);
  color: var(--cls-text-primary, #F5F2EA);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.45);
  transition:
    transform var(--cls-dur-fast, 180ms) var(--cls-ease, ease),
    opacity var(--cls-dur-fast, 180ms) var(--cls-ease, ease);

  &:hover {
    transform: translateY(-2px);
    opacity: 0.95;
  }

  &:focus-visible {
    outline: var(--cls-focus-ring);
    outline-offset: 2px;
  }
}

.cls-fab-enter-from,
.cls-fab-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
.cls-fab-enter-active,
.cls-fab-leave-active {
  transition: opacity 180ms ease, transform 180ms ease;
}
</style>
