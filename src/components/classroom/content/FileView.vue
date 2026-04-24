<template>
  <section class="cls-file">
    <div class="cls-file__card">
      <div class="cls-file__icon" aria-hidden="true">
        <q-icon :name="iconName" size="72px" />
      </div>

      <h2 class="cls-file__title">{{ title || $t('classroom.file.download') }}</h2>

      <p v-if="fileExt" class="cls-file__meta">
        <span class="cls-file__chip">{{ fileExt.toUpperCase() }}</span>
        <span class="cls-file__chip cls-file__chip--muted">{{ downloadName }}</span>
      </p>

      <a
        v-if="fileUrl"
        class="cls-file__btn"
        :href="fileUrl"
        :download="downloadName"
        target="_blank"
        rel="noopener noreferrer"
      >
        <q-icon name="download" size="22px" class="q-mr-sm" />
        <span>{{ $t('classroom.file.download') }}</span>
      </a>

      <a
        v-if="fileUrl"
        class="cls-file__link"
        :href="fileUrl"
        target="_blank"
        rel="noopener noreferrer"
      >
        <q-icon name="open_in_new" size="14px" class="q-mr-xs" />
        {{ $t('classroom.file.openInNewTab') }}
      </a>

      <p v-else class="cls-file__empty">
        {{ $t('classroom.empty.contentMissing') }}
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  fileUrl: string
  title?: string | null
}>()

const downloadName = computed<string>(() => {
  const t = (props.title || '').trim()
  if (t) return t
  const path = props.fileUrl || ''
  const seg = path.split('/').pop() || 'download'
  return seg.split('?')[0] || seg
})

const fileExt = computed<string>(() => {
  const m = (props.fileUrl || '').match(/\.([a-z0-9]{1,6})(?:\?|#|$)/i)
  return m ? m[1]! : ''
})

const iconName = computed<string>(() => {
  const ext = fileExt.value.toLowerCase()
  if (['pdf'].includes(ext)) return 'picture_as_pdf'
  if (['doc', 'docx'].includes(ext)) return 'description'
  if (['xls', 'xlsx', 'csv'].includes(ext)) return 'table_chart'
  if (['ppt', 'pptx'].includes(ext)) return 'slideshow'
  if (['zip', 'rar', '7z'].includes(ext)) return 'folder_zip'
  if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(ext)) return 'image'
  if (['mp3', 'wav', 'm4a'].includes(ext)) return 'audiotrack'
  if (['mp4', 'mov', 'mkv'].includes(ext)) return 'movie'
  return 'insert_drive_file'
})
</script>

<style lang="scss" scoped>
.cls-file {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  min-height: 60vh;

  &__card {
    background: var(--cls-surface-elevated);
    border-radius: var(--cls-radius-lg);
    padding: 48px 40px;
    text-align: center;
    max-width: 480px;
    width: 100%;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.25);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }

  &__icon {
    color: var(--cls-accent);
    background: var(--cls-accent-soft);
    width: 96px;
    height: 96px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 999px;
    margin-bottom: 8px;
  }

  &__title {
    color: var(--cls-text-primary);
    font-size: 20px;
    line-height: 1.3;
    margin: 0;
    word-break: break-word;
  }

  &__meta {
    margin: 0;
  }

  &__meta {
    display: inline-flex;
    flex-wrap: wrap;
    gap: 8px;
    justify-content: center;
  }

  &__chip {
    display: inline-block;
    padding: 2px 10px;
    border-radius: 999px;
    background: var(--cls-surface);
    color: var(--cls-text-muted);
    font-size: 11px;
    letter-spacing: 0.08em;

    &--muted {
      letter-spacing: 0;
      font-variant-numeric: tabular-nums;
      max-width: 300px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  &__btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 14px 28px;
    border-radius: var(--cls-radius-md);
    background: var(--cls-accent, #D47A5E);
    color: var(--cls-text-primary, #F5F2EA);
    font-weight: 700;
    font-size: 15px;
    letter-spacing: 0.02em;
    text-decoration: none;
    margin-top: 16px;
    min-width: 240px;
    box-shadow: 0 6px 20px rgba(212, 122, 94, 0.25);
    transition: transform 180ms ease, box-shadow 180ms ease, opacity 180ms ease;

    &:hover { opacity: 0.95; transform: translateY(-1px); box-shadow: 0 10px 28px rgba(212, 122, 94, 0.35); }
    &:focus-visible { outline: var(--cls-focus-ring); outline-offset: 2px; }
  }

  &__link {
    color: var(--cls-text-muted);
    text-decoration: underline;
    font-size: 13px;

    &:hover { color: var(--cls-accent); }
  }

  &__empty {
    color: var(--cls-text-muted);
    margin: 16px 0 0;
  }
}
</style>
