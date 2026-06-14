<template>
  <transition name="fab">
    <button
      v-show="visible"
      type="button"
      class="scroll-top-fab"
      :aria-label="$t('العودة إلى الأعلى')"
      @click="toTop"
    >
      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
        <path
          d="M12 19V6M6 12l6-6 6 6"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>
  </transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const visible = ref(false)
let ticking = false

function update (): void {
  const threshold = (typeof window !== 'undefined' ? window.innerHeight : 800) * 0.9
  visible.value = window.scrollY > threshold
  ticking = false
}

function onScroll (): void {
  if (ticking) return
  ticking = true
  window.requestAnimationFrame(update)
}

function prefersReducedMotion (): boolean {
  return typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function toTop (): void {
  window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  update()
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<style lang="scss" scoped>
.scroll-top-fab {
  position: fixed;
  inset-block-end: clamp(1rem, 4vw, 2rem);
  inset-inline-end: clamp(1rem, 4vw, 2rem);
  z-index: var(--ds-z-sticky);
  inline-size: 48px;
  block-size: 48px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 50%;
  background: var(--ds-brand-600);
  color: var(--ds-ivory);
  box-shadow: var(--ds-shadow-md);
  cursor: pointer;
  transition:
    transform var(--ds-duration-fast) var(--ds-ease-out),
    background-color var(--ds-duration-fast) var(--ds-ease-out);

  &:hover {
    transform: translateY(-2px);
    background: var(--ds-brand-700, var(--ds-brand-600));
  }

  &:focus-visible {
    outline: 2px solid transparent;
    box-shadow: var(--ds-shadow-focus), var(--ds-shadow-md);
  }
}

/* Enter/exit on opacity + transform only (no layout properties). */
.fab-enter-active,
.fab-leave-active {
  transition:
    opacity var(--ds-duration-fast) var(--ds-ease-out),
    transform var(--ds-duration-fast) var(--ds-ease-out);
}

.fab-enter-from,
.fab-leave-to {
  opacity: 0;
  transform: translateY(8px) scale(0.9);
}

@media (prefers-reduced-motion: reduce) {
  .scroll-top-fab,
  .fab-enter-active,
  .fab-leave-active {
    transition: none;
  }
}
</style>
