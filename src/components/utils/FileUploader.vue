<template>
  <!-- Outer wrapper; the hidden file input lives here so it's always in the DOM -->
  <div class="fu-root">
    <input
      ref="inputRef"
      type="file"
      :accept="accept"
      :disabled="readonly"
      class="fu-input-hidden"
      aria-hidden="true"
      tabindex="-1"
      @change="onInputChange"
    />

    <!-- ------------------------------------------------------------------ -->
    <!-- Empty state — dropzone                                               -->
    <!-- ------------------------------------------------------------------ -->
    <div
      v-if="!selectedFile"
      class="fu-dropzone"
      :class="{
        'fu-dropzone--dragging': isDragging,
        'fu-dropzone--readonly': readonly,
      }"
      role="button"
      :tabindex="readonly ? -1 : 0"
      :aria-disabled="readonly ? 'true' : undefined"
      :aria-describedby="hintId"
      @click="openDialog"
      @keydown.enter.prevent="openDialog"
      @keydown.space.prevent="openDialog"
      @dragenter.prevent="onDragEnter"
      @dragover.prevent="onDragOver"
      @dragleave.prevent="onDragLeave"
      @drop.prevent="onDrop"
    >
      <!-- Upload glyph (purposeful, small) -->
      <svg
        class="fu-dropzone__glyph"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
      >
        <rect x="1" y="1" width="38" height="38" rx="9" fill="var(--ds-surface-sunken)" stroke="var(--ds-border-strong)" stroke-width="1.5"/>
        <path
          d="M20 27V18M20 18l-4 4M20 18l4 4"
          stroke="var(--ds-brand-600)"
          stroke-width="1.75"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M13 28h14"
          stroke="var(--ds-brand-600)"
          stroke-width="1.75"
          stroke-linecap="round"
          opacity="0.45"
        />
      </svg>

      <!-- Prompt -->
      <span class="fu-dropzone__prompt">{{ label || t('انقر لرفع ملف أو اسحب هنا') }}</span>

      <!-- Hint -->
      <span :id="hintId" class="fu-dropzone__hint">{{ hintText }}</span>
    </div>

    <!-- ------------------------------------------------------------------ -->
    <!-- Selected state — preview card                                        -->
    <!-- ------------------------------------------------------------------ -->
    <div
      v-else
      class="fu-preview"
      :class="{ 'fu-preview--readonly': readonly }"
    >
      <!-- Thumbnail -->
      <div class="fu-preview__thumb-wrap" aria-hidden="true">
        <img
          v-if="previewUrl"
          :src="previewUrl"
          class="fu-preview__thumb"
          alt=""
        />
        <svg
          v-else
          class="fu-preview__thumb-icon"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
            stroke="var(--ds-brand-600)"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <polyline
            points="14 2 14 8 20 8"
            stroke="var(--ds-brand-600)"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>

      <!-- File meta -->
      <div class="fu-preview__meta">
        <span class="fu-preview__name">{{ selectedFile.name }}</span>
        <span class="fu-preview__size">{{ formatSize(selectedFile.size) }}</span>
      </div>

      <!-- Actions — only when not readonly -->
      <div v-if="!readonly" class="fu-preview__actions">
        <button
          type="button"
          class="fu-preview__action"
          @click="openDialog"
        >
          {{ t('تغيير') }}
        </button>
        <span class="fu-preview__action-sep" aria-hidden="true">·</span>
        <button
          type="button"
          class="fu-preview__action fu-preview__action--remove"
          @click="removeFile"
        >
          {{ t('إزالة') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { toast } from 'src/design-system/toast'

// ---------------------------------------------------------------------------
// Props / emits (public contract — must stay stable)
// ---------------------------------------------------------------------------
interface Props {
  readonly?: boolean
  accept?: string
  /** Maximum file size in bytes */
  imgeSize?: number
  label?: string
}

const { t } = useI18n()

const props = withDefaults(defineProps<Props>(), {
  readonly: false,
  accept: undefined,
  imgeSize: undefined,
  label: undefined,
})

const emit = defineEmits<{
  (e: 'File_Handler', val: File | null): void
}>()

// ---------------------------------------------------------------------------
// Internal state
// ---------------------------------------------------------------------------
const inputRef = ref<HTMLInputElement | null>(null)
const selectedFile = ref<File | null>(null)
const previewUrl = ref<string | null>(null)
const isDragging = ref(false)
// Drag counter prevents flickering when entering a child element
let dragCounter = 0

// Stable ID for aria-describedby
const hintId = `fu-hint-${Math.random().toString(36).slice(2, 8)}`

// ---------------------------------------------------------------------------
// Computed
// ---------------------------------------------------------------------------
const hintText = computed((): string => {
  const parts: string[] = []

  // Human-readable accept list
  if (props.accept) {
    const exts = props.accept
      .split(',')
      .map(s => s.trim().replace(/^\./, '').toUpperCase())
      .filter(Boolean)
    if (exts.length) parts.push(exts.join(` ${t('أو')} `))
  }

  // Human-readable max size
  if (props.imgeSize != null) {
    const mb = props.imgeSize / (1024 * 1024)
    parts.push(t('حتى {mb} ميجابايت', { mb: mb % 1 === 0 ? mb : mb.toFixed(1) }))
  }

  return parts.length ? parts.join(' — ') : t('انقر أو اسحب ملفاً هنا')
})

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function revokePreview(): void {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
    previewUrl.value = null
  }
}

function isImageFile(file: File): boolean {
  return file.type.startsWith('image/')
}

function matchesAccept(file: File): boolean {
  if (!props.accept) return true
  const tokens = props.accept.split(',').map(t => t.trim().toLowerCase())
  return tokens.some(token => {
    if (token.startsWith('.')) return file.name.toLowerCase().endsWith(token)
    if (token.endsWith('/*')) return file.type.startsWith(token.replace('/*', '/'))
    return file.type === token
  })
}

function processFile(file: File): void {
  if (!matchesAccept(file)) {
    toast.danger(t('نوع الملف غير مدعوم'))
    return
  }
  if (props.imgeSize != null && file.size > props.imgeSize) {
    toast.danger(t('حجم الملف أكبر من المسموح به'))
    return
  }

  revokePreview()
  selectedFile.value = file

  if (isImageFile(file)) {
    previewUrl.value = URL.createObjectURL(file)
  }

  emit('File_Handler', file)
}

function removeFile(): void {
  revokePreview()
  selectedFile.value = null
  // Reset the hidden input so the same file can be re-selected
  if (inputRef.value) inputRef.value.value = ''
  emit('File_Handler', null)
}

function openDialog(): void {
  if (props.readonly) return
  inputRef.value?.click()
}

// ---------------------------------------------------------------------------
// Event handlers
// ---------------------------------------------------------------------------
function onInputChange(event: Event): void {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) processFile(file)
  // Always reset so re-selecting the same file fires change again
  input.value = ''
}

function onDragEnter(): void {
  if (props.readonly) return
  dragCounter++
  isDragging.value = true
}

function onDragOver(): void {
  // Needed to allow drop; prevent default already handled by modifier
  if (props.readonly) return
  isDragging.value = true
}

function onDragLeave(): void {
  if (props.readonly) return
  dragCounter--
  if (dragCounter <= 0) {
    dragCounter = 0
    isDragging.value = false
  }
}

function onDrop(event: DragEvent): void {
  if (props.readonly) return
  dragCounter = 0
  isDragging.value = false
  const file = event.dataTransfer?.files?.[0]
  if (file) processFile(file)
}

// ---------------------------------------------------------------------------
// Cleanup
// ---------------------------------------------------------------------------
onBeforeUnmount(() => {
  revokePreview()
})
</script>

<style lang="scss" scoped>
// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------
.fu-root {
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-2);
  inline-size: 100%;
}

.fu-input-hidden {
  position: absolute;
  inline-size: 1px;
  block-size: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

// ---------------------------------------------------------------------------
// Dropzone
// ---------------------------------------------------------------------------
.fu-dropzone {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--ds-space-2);
  padding-block: var(--ds-space-8);
  padding-inline: var(--ds-space-6);
  border: 1.5px dashed var(--ds-border-strong);
  border-radius: var(--ds-radius-lg);
  background-color: var(--ds-surface-elevated);
  cursor: pointer;
  text-align: center;
  // Only animate paint props — no transform here
  transition:
    background-color var(--ds-duration-fast) var(--ds-ease-out),
    border-color var(--ds-duration-fast) var(--ds-ease-out);
  outline: none;

  &:focus-visible {
    box-shadow: var(--ds-shadow-focus);
    border-color: var(--ds-brand-600);
  }

  &:hover:not(.fu-dropzone--readonly) {
    background-color: var(--ds-surface-sunken);
    border-color: var(--ds-brand-400);
  }

  &--dragging {
    background-color: var(--ds-surface-sunken);
    border-color: var(--ds-brand-600);
    border-style: solid;
  }

  &--readonly {
    cursor: default;
    opacity: 0.65;
  }

  &__glyph {
    inline-size: 2.5rem;
    block-size: 2.5rem;
    flex-shrink: 0;
  }

  &__prompt {
    font-family: var(--ds-font-heading);
    font-size: var(--ds-text-md);
    font-weight: var(--ds-weight-semibold);
    color: var(--ds-text);
    line-height: var(--ds-leading-tight);
  }

  &__hint {
    font-family: var(--ds-font-body);
    font-size: var(--ds-text-sm);
    color: var(--ds-text-muted);
    line-height: var(--ds-leading-arabic);
  }
}

// ---------------------------------------------------------------------------
// Preview card
// ---------------------------------------------------------------------------
.fu-preview {
  display: flex;
  align-items: center;
  gap: var(--ds-space-3);
  padding: var(--ds-space-3) var(--ds-space-4);
  border: 1px solid var(--ds-border);
  border-radius: var(--ds-radius-lg);
  background: var(--ds-surface-elevated);
  box-shadow: var(--ds-shadow-xs);

  &__thumb-wrap {
    flex-shrink: 0;
    inline-size: 3rem;
    block-size: 3rem;
    border-radius: var(--ds-radius-sm);
    overflow: hidden;
    background: var(--ds-surface-sunken);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__thumb {
    inline-size: 100%;
    block-size: 100%;
    object-fit: cover;
  }

  &__thumb-icon {
    inline-size: 1.5rem;
    block-size: 1.5rem;
  }

  &__meta {
    flex: 1;
    min-inline-size: 0;
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-1);
  }

  &__name {
    font-family: var(--ds-font-body);
    font-size: var(--ds-text-sm);
    font-weight: var(--ds-weight-medium);
    color: var(--ds-text);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: block;
  }

  &__size {
    font-family: var(--ds-font-mono);
    font-size: var(--ds-text-xs);
    color: var(--ds-text-muted);
    font-variant-numeric: tabular-nums;
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: var(--ds-space-2);
    flex-shrink: 0;
  }

  &__action-sep {
    color: var(--ds-border-strong);
    user-select: none;
  }

  &__action {
    background: none;
    border: none;
    padding: var(--ds-space-1) var(--ds-space-2);
    font-family: var(--ds-font-body);
    font-size: var(--ds-text-xs);
    color: var(--ds-brand-600);
    cursor: pointer;
    border-radius: var(--ds-radius-sm);
    transition:
      background-color var(--ds-duration-fast) var(--ds-ease-out),
      color var(--ds-duration-fast) var(--ds-ease-out);
    outline: none;

    &:hover {
      background-color: var(--ds-brand-50);
    }

    &:focus-visible {
      box-shadow: var(--ds-shadow-focus);
    }

    &--remove {
      color: var(--ds-danger);

      &:hover {
        background-color: var(--ds-danger-bg);
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Reduced motion
// ---------------------------------------------------------------------------
@media (prefers-reduced-motion: reduce) {
  .fu-dropzone {
    transition: none;
  }
  .fu-preview__action {
    transition: none;
  }
}
</style>
