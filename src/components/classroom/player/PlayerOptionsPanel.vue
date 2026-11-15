<template>
  <div class="pop" :data-mode="mode">
    <!-- Sheet only: dimmed backdrop; tapping it closes. -->
    <div v-if="mode === 'sheet'" class="pop__backdrop" @click="emit('close')"></div>

    <div
      ref="panelRef"
      class="pop__panel"
      role="dialog"
      :aria-modal="mode === 'sheet' ? 'true' : undefined"
      :aria-labelledby="titleId"
      @keydown="onKeydown"
    >
      <div class="pop__header">
        <h2 :id="titleId" class="pop__title">{{ title }}</h2>
        <button type="button" class="pop__close" :aria-label="closeLabel" @click="emit('close')">
          <q-icon name="close" size="22px" />
        </button>
      </div>

      <div class="pop__list" role="radiogroup" :aria-labelledby="titleId">
        <button
          v-for="(option, index) in options"
          :key="option.id"
          :ref="(el) => setOptionRef(el, index)"
          type="button"
          class="pop__option"
          role="radio"
          :aria-checked="option.id === activeId ? 'true' : 'false'"
          :tabindex="index === focusIndex ? 0 : -1"
          :data-option-id="option.id"
          @click="emit('select', option.id)"
        >
          <span class="pop__option-label" dir="auto">{{ option.label }}</span>
          <q-icon v-if="option.id === activeId" name="check" size="22px" class="pop__check" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/*
  PlayerOptionsPanel — the one options list behind the player's Speed and
  Quality buttons. Two presentations of the same markup:

    - mode="sheet"   → YouTube-style bottom sheet over a dimmed backdrop
                       (phones, narrow players, landscape phones, touch).
    - mode="popover" → small menu anchored above its button (desktop).

  It is deliberately NOT a Quasar QMenu/QDialog: those teleport to <body>, and
  anything outside the fullscreen element is invisible while the player shell
  is fullscreen (the app does not install Quasar's AppFullscreen plugin). The
  parent decides where this renders, so it works in both modes.
*/
import { nextTick, onBeforeUnmount, onMounted, ref, type ComponentPublicInstance } from 'vue'

export interface PanelOption {
  id: string
  label: string
}

const props = defineProps<{
  mode: 'sheet' | 'popover'
  title: string
  options: PanelOption[]
  activeId: string
  closeLabel: string
}>()

const emit = defineEmits<{
  select: [id: string]
  close: []
}>()

let uid = 0
const titleId = `cls-pop-title-${Date.now().toString(36)}-${++uid}`

const panelRef = ref<HTMLElement | null>(null)
const optionEls: Array<HTMLElement | null> = []
const focusIndex = ref<number>(Math.max(0, props.options.findIndex((o) => o.id === props.activeId)))

function setOptionRef(el: Element | ComponentPublicInstance | null, index: number): void {
  optionEls[index] = el instanceof HTMLElement ? el : null
}

function focusOption(index: number): void {
  const count = props.options.length
  if (!count) return
  const next = ((index % count) + count) % count
  focusIndex.value = next
  optionEls[next]?.focus()
}

function focusables(): HTMLElement[] {
  const panel = panelRef.value
  if (!panel) return []
  return Array.from(panel.querySelectorAll<HTMLElement>('button:not([tabindex="-1"])'))
}

function onKeydown(e: KeyboardEvent): void {
  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault(); e.stopPropagation(); focusOption(focusIndex.value + 1); break
    case 'ArrowUp':
      e.preventDefault(); e.stopPropagation(); focusOption(focusIndex.value - 1); break
    case 'Home':
      e.preventDefault(); e.stopPropagation(); focusOption(0); break
    case 'End':
      e.preventDefault(); e.stopPropagation(); focusOption(props.options.length - 1); break
    case 'Tab': {
      // Focus trap: cycle between the current option and the close button.
      const items = focusables()
      if (!items.length) return
      const first = items[0] as HTMLElement
      const last = items[items.length - 1] as HTMLElement
      const active = document.activeElement
      if (e.shiftKey && (active === first || !panelRef.value?.contains(active))) {
        e.preventDefault(); last.focus()
      } else if (!e.shiftKey && active === last) {
        e.preventDefault(); first.focus()
      }
      break
    }
    default: break
  }
}

/** Esc closes wherever focus happens to be (e.g. after a backdrop touch). */
function onDocumentKeydown(e: KeyboardEvent): void {
  if (e.key !== 'Escape') return
  e.stopPropagation()
  emit('close')
}

/** Popover: a press anywhere outside closes it. Presses on a trigger button
 *  are left to that button's own toggle so it does not close-then-reopen. */
function onDocumentPointerDown(e: PointerEvent): void {
  if (props.mode !== 'popover') return
  const target = e.target
  if (!(target instanceof Element)) return
  if (panelRef.value?.contains(target)) return
  if (target.closest('[data-cvc-trigger]')) return
  emit('close')
}

onMounted(() => {
  document.addEventListener('keydown', onDocumentKeydown, true)
  document.addEventListener('pointerdown', onDocumentPointerDown, true)
  void nextTick(() => {
    const el = optionEls[focusIndex.value]
    el?.focus({ preventScroll: true })
    // Bring the active row into view inside the list without moving the page.
    const list = el?.parentElement
    if (el && list) {
      const top = el.offsetTop - list.offsetTop
      if (top + el.offsetHeight > list.clientHeight) {
        list.scrollTop = top - (list.clientHeight - el.offsetHeight) / 2
      }
    }
  })
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onDocumentKeydown, true)
  document.removeEventListener('pointerdown', onDocumentPointerDown, true)
})
</script>

<style lang="scss" scoped>
.pop__panel {
  display: flex;
  flex-direction: column;
  background: var(--cls-surface-elevated, #1A1430);
  color: var(--cls-text-primary, #F5F2EA);
  border: 1px solid var(--cls-divider, rgba(245, 242, 234, 0.08));
  box-shadow: 0 -8px 40px rgba(0, 0, 0, 0.55);
  min-block-size: 0;
}

.pop__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex: none;
  border-block-end: 1px solid var(--cls-divider, rgba(245, 242, 234, 0.08));
}

.pop__title {
  margin: 0;
  font-size: 15px;
  line-height: 1.4;
  font-weight: 700;
  letter-spacing: 0;
}

.pop__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  inline-size: 44px;
  block-size: 44px;
  border: 0;
  border-radius: var(--cls-radius-sm, 8px);
  background: transparent;
  color: var(--cls-text-muted, #9890A8);
  cursor: pointer;
  &:hover { background: rgba(245, 242, 234, 0.08); color: var(--cls-text-primary, #F5F2EA); }
  &:focus-visible { outline: var(--cls-focus-ring, 2px solid #C1623C); outline-offset: -2px; }
}

.pop__list {
  flex: 1 1 auto;
  min-block-size: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
}

.pop__option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  inline-size: 100%;
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  font-variant-numeric: tabular-nums;
  text-align: start;
  cursor: pointer;
  transition: background var(--cls-dur-fast, 120ms) ease;

  &:hover { background: rgba(245, 242, 234, 0.07); }
  &:active { background: rgba(245, 242, 234, 0.12); }
  &:focus-visible { outline: var(--cls-focus-ring, 2px solid #C1623C); outline-offset: -2px; }

  &[aria-checked='true'] {
    color: #fff;
    font-weight: 700;
    background: var(--cls-accent-soft, rgba(193, 98, 60, 0.16));
  }
}

.pop__check { color: var(--cls-accent, #C1623C); flex: none; }

// ---- Bottom sheet -----------------------------------------------------------
.pop[data-mode='sheet'] {
  position: fixed;
  inset: 0;
  // Above Quasar's layout/drawers/dialogs (max 6000) when rendered in <body>.
  z-index: 7000;
  display: flex;
  align-items: flex-end;
  justify-content: center;

  .pop__backdrop {
    position: absolute;
    inset: 0;
    background: rgba(8, 5, 16, 0.6);
    animation: pop-fade var(--cls-dur-med, 220ms) ease both;
  }

  .pop__panel {
    position: relative;
    inline-size: 100%;
    max-inline-size: 480px;
    max-block-size: min(60vh, 520px);
    border-block-end: 0;
    border-start-start-radius: var(--cls-radius-lg, 16px);
    border-start-end-radius: var(--cls-radius-lg, 16px);
    padding-block-end: env(safe-area-inset-bottom, 0px);
    animation: pop-rise var(--cls-dur-med, 220ms) var(--cls-ease, ease) both;
  }

  .pop__header {
    position: relative;
    padding: 14px 8px 6px;
    padding-inline-start: 20px;

    // Grabber — the visual cue that this is a sheet.
    &::before {
      content: '';
      position: absolute;
      inset-block-start: 6px;
      inset-inline-start: 50%;
      inline-size: 36px;
      block-size: 4px;
      margin-inline-start: -18px;
      border-radius: 4px;
      background: rgba(245, 242, 234, 0.22);
    }
  }

  .pop__option {
    min-block-size: 52px;
    padding: 8px 20px;
    font-size: 15px;
  }
}

// Landscape phones: the sheet may take most of the height, but always leaves a
// strip of backdrop to tap (and the × in the header) so it can be closed.
@media (max-height: 500px) {
  .pop[data-mode='sheet'] .pop__panel {
    max-block-size: calc(100vh - 56px);
    max-block-size: calc(100dvh - 56px);
  }
  .pop[data-mode='sheet'] .pop__option { min-block-size: 48px; }
}

// ---- Anchored popover (desktop) ---------------------------------------------
.pop[data-mode='popover'] {
  position: absolute;
  inset-block-end: calc(100% + 8px);
  inset-inline-end: 0;
  z-index: 5;

  .pop__panel {
    min-inline-size: 190px;
    max-block-size: min(60vh, 380px);
    border-radius: var(--cls-radius-md, 12px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.55);
    overflow: hidden;
    animation: pop-fade var(--cls-dur-fast, 120ms) ease both;
  }

  .pop__header { padding: 4px 4px 4px 14px; padding-inline: 14px 4px; }
  .pop__title { font-size: 13px; color: var(--cls-text-muted, #9890A8); }
  .pop__close { inline-size: 36px; block-size: 36px; }

  .pop__option {
    min-block-size: 40px;
    padding: 6px 14px;
    font-size: 14px;
    white-space: nowrap;
  }
}

@keyframes pop-rise {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}
@keyframes pop-fade {
  from { opacity: 0; }
  to { opacity: 1; }
}

@media (prefers-reduced-motion: reduce) {
  .pop__panel,
  .pop__backdrop { animation: none !important; }
}
</style>
