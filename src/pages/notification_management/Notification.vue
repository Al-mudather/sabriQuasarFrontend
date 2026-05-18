<template>
  <main class="notifications-page">
    <header class="notifications-page__head">
      <div class="notifications-page__head-text">
        <h1>
          التنبيهات
          <ds-badge
            v-if="unreadCount > 0"
            variant="terracotta"
            size="md"
            class="notifications-page__count"
          >
            {{ unreadCount }}
          </ds-badge>
        </h1>
        <p>تنبيهات دوراتك ومعاملاتك وتسويقك في مكان واحد.</p>
      </div>
      <ds-button
        v-if="unreadCount > 0"
        variant="ghost"
        size="sm"
        @click="markAllRead"
      >
        {{ $t('تعيين الكل كمقروء') }}
      </ds-button>
    </header>

    <section class="notifications-page__body">
      <div v-if="loading && filtered.length === 0" class="notifications-page__skeletons">
        <ds-skeleton v-for="i in 5" :key="i" shape="rect" height="5rem" />
      </div>

      <ds-empty-state
        v-else-if="filtered.length === 0"
        variant="search"
        :title="$t('لا توجد إشعارات')"
        :description="$t('ستصلك هنا أي تنبيهات عن كورساتك ومدفوعاتك وشهاداتك.')"
        size="md"
      />

      <ul v-else class="notifications-page__list" role="list">
        <li
          v-for="item in mappedList"
          :key="item.pk ?? `x-${item.type}-${item.timestamp}`"
          class="notif-row"
          :class="[
            `notif-row--${item.tone}`,
            { 'notif-row--unread': !item.read }
          ]"
          role="article"
          tabindex="0"
          :aria-label="item.ariaLabel"
          @click="onRowClick(item)"
          @keydown.enter.prevent="onRowClick(item)"
          @keydown.space.prevent="onRowClick(item)"
        >
          <span class="notif-row__icon" :aria-hidden="true">
            <span class="notif-row__icon-inner" v-html="iconFor(item.iconKey)" />
          </span>

          <div class="notif-row__body">
            <div class="notif-row__titleline">
              <h3 class="notif-row__title">{{ item.title }}</h3>
              <span v-if="!item.read" class="notif-row__dot" aria-label="غير مقروء" />
            </div>

            <!-- sanitized rich body -->
            <div
              v-if="item.bodyKind === 'html' && item.bodyHtml"
              class="notif-row__desc notif-row__desc--rich"
              v-html="item.bodyHtml"
            />
            <p
              v-else-if="item.bodyKind === 'text' && item.bodyText"
              class="notif-row__desc"
            >
              <!-- eslint-disable-next-line vue/no-v-html -->
              <span v-html="item.bodyText" />
            </p>
          </div>

          <div class="notif-row__meta">
            <time
              v-if="item.relativeTime"
              class="notif-row__time"
              :datetime="item.timestamp ?? ''"
            >
              {{ item.relativeTime }}
            </time>
          </div>
        </li>
      </ul>

      <div v-if="hasMore && filtered.length > 0" class="notifications-page__more">
        <ds-button variant="secondary" @click="loadMoreData">
          {{ $t('عرض المزيد') }}
        </ds-button>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { GetAllMyNotifications } from 'src/graphql/notification_management/query/GetAllMyNotifications'
import { useSettingsStore } from 'src/stores/settings'
import { useQuery } from '@vue/apollo-composable'
import type {
  MyNotificationsResult,
  MyNotificationsVars,
  Notification,
} from 'src/types/notifications/types'

// -----------------------------------------------------------------------
// Stores / composables
// -----------------------------------------------------------------------
const router = useRouter()
const $q = useQuasar()
const { t } = useI18n()
const settings = useSettingsStore()

// -----------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------
type NotificationTypeBucket = 'transactions' | 'courses' | 'marketing'
type FilterKey = 'all' | 'unread' | NotificationTypeBucket
type IconKey = 'orders' | 'courses' | 'marketing' | 'announcement' | 'system'
type Tone = 'brand' | 'accent' | 'success' | 'warning' | 'info'

const TYPE_BUCKET: Record<string, NotificationTypeBucket> = {
  CHECKOUT_DONE: 'transactions',
  PAYMENT:       'transactions',
  WITHDRAW:      'transactions',
  QUESTION_ASK:  'courses',
  QUESTION_ANS:  'courses',
  COURSE:        'courses',
  CERTIFICATE:   'courses',
  REFERRAL:      'marketing',
  AFFILIATE:     'marketing',
  PYRAMID:       'marketing',
}

const ICON_KEY: Record<string, IconKey> = {
  CHECKOUT_DONE: 'orders',
  PAYMENT:       'orders',
  WITHDRAW:      'orders',
  QUESTION_ASK:  'courses',
  QUESTION_ANS:  'courses',
  COURSE:        'courses',
  CERTIFICATE:   'announcement',
  REFERRAL:      'marketing',
  AFFILIATE:     'marketing',
  PYRAMID:       'marketing',
}

const TONE: Record<string, Tone> = {
  CHECKOUT_DONE: 'accent',
  PAYMENT:       'success',
  WITHDRAW:      'warning',
  QUESTION_ASK:  'brand',
  QUESTION_ANS:  'success',
  COURSE:        'brand',
  CERTIFICATE:   'success',
  REFERRAL:      'accent',
  AFFILIATE:     'brand',
  PYRAMID:       'brand',
}

// Inline stroke-1.8 currentColor SVGs — consistent with UserSidebar.vue style.
const ICONS: Record<IconKey, string> = {
  orders:
    '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h16l-1.5 11a2 2 0 0 1-2 1.8H7.5a2 2 0 0 1-2-1.8L4 7Z"/><path d="M9 7a3 3 0 1 1 6 0"/></svg>',
  courses:
    '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5h12a3 3 0 0 1 3 3v11H7a3 3 0 0 1-3-3V5Z"/><path d="M4 5v11a3 3 0 0 0 3 3"/></svg>',
  marketing:
    '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 11h4l7-5v12l-7-5H3z"/><path d="M17 8a5 5 0 0 1 0 8"/></svg>',
  announcement:
    '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="9" r="5"/><path d="M9 13.5 7.5 21l4.5-2 4.5 2L15 13.5"/></svg>',
  system:
    '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 8a6 6 0 1 1 12 0c0 5 2 7 2 7H4s2-2 2-7Z"/><path d="M10 19a2 2 0 0 0 4 0"/></svg>',
}

// -----------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------
const notifQuery = useQuery<MyNotificationsResult, MyNotificationsVars>(
  GetAllMyNotifications,
  { orderBy: ['-id'], limit: 15 },
)

const myNotifications = computed(() => notifQuery.result.value?.myNotifications ?? null)
const loading = notifQuery.loading

// -----------------------------------------------------------------------
// Local state
// -----------------------------------------------------------------------
const activeFilter = ref<FilterKey>('all')
const readLocal = ref<Record<number, boolean>>({})

// -----------------------------------------------------------------------
// Derived state
// -----------------------------------------------------------------------
type NotifNode = Notification

const notifications = computed<NotifNode[]>(() =>
  (myNotifications.value?.edges ?? [])
    .filter((e): e is NonNullable<typeof e> => !!e && !!e.node)
    .map(e => e.node as NotifNode),
)

const hasMore = computed(
  () => myNotifications.value?.pageInfo?.hasNextPage ?? false,
)

const unreadCount = computed(
  () => notifications.value.filter(n => n.pk != null && !readLocal.value[n.pk]).length,
)

const bucketCounts = computed(() => {
  const counts: Record<string, number> = {
    all: notifications.value.length,
    unread: unreadCount.value,
    courses: 0,
    transactions: 0,
    marketing: 0,
  }
  for (const n of notifications.value) {
    const b = TYPE_BUCKET[n.type]
    if (b && counts[b] != null) counts[b] += 1
  }
  return counts
})

interface FilterItem {
  key: FilterKey
  label: string
  count: number | null
}

const filters = computed<FilterItem[]>(() => {
  const c = bucketCounts.value
  return [
    { key: 'all',          label: t('الكل'),          count: c.all ?? null },
    { key: 'unread',       label: t('غير مقروءة'),    count: c.unread ?? null },
    { key: 'courses',      label: t('الدورات'),       count: c.courses ?? null },
    { key: 'transactions', label: t('المعاملات'),     count: c.transactions ?? null },
    { key: 'marketing',    label: t('التسويق'),       count: c.marketing ?? null },
  ]
})

const filtered = computed<NotifNode[]>(() => {
  if (activeFilter.value === 'all') return notifications.value
  if (activeFilter.value === 'unread') {
    return notifications.value.filter(n => n.pk != null && !readLocal.value[n.pk])
  }
  return notifications.value.filter(n => TYPE_BUCKET[n.type] === activeFilter.value)
})

// -----------------------------------------------------------------------
// HTML / text sanitizer (inline allowlist — DOMPurify not in deps)
// -----------------------------------------------------------------------
const ALLOWED_TAGS = new Set([
  'a', 'b', 'strong', 'i', 'em', 'u', 'p', 'br', 'div', 'span',
  'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'code', 'pre', 'blockquote', 'img', 'font',
])
const ALLOWED_ATTRS_BY_TAG: Record<string, Set<string>> = {
  a:   new Set(['href', 'title', 'target', 'rel']),
  img: new Set(['src', 'alt', 'title', 'width', 'height']),
}
const GLOBAL_ATTRS = new Set(['dir', 'lang'])

function isSafeUrl (raw: string): boolean {
  const s = (raw || '').trim().toLowerCase()
  if (!s) return false
  if (s.startsWith('javascript:')) return false
  if (s.startsWith('data:') && !s.startsWith('data:image/')) return false
  if (s.startsWith('vbscript:')) return false
  return true
}

function sanitizeHtml (raw: string): string {
  if (typeof window === 'undefined' || !raw) return ''
  const tpl = document.createElement('template')
  tpl.innerHTML = raw

  const walk = (root: Node): void => {
    const kids = Array.from(root.childNodes)
    for (const node of kids) {
      if (node.nodeType === Node.COMMENT_NODE) {
        node.parentNode?.removeChild(node)
        continue
      }
      if (node.nodeType !== Node.ELEMENT_NODE) continue

      const el = node as Element
      const tag = el.tagName.toLowerCase()

      if (!ALLOWED_TAGS.has(tag)) {
        // unwrap: keep children, drop the element
        const parent = el.parentNode
        if (!parent) continue
        while (el.firstChild) parent.insertBefore(el.firstChild, el)
        parent.removeChild(el)
        continue
      }

      // strip attributes
      for (const attr of Array.from(el.attributes)) {
        const name = attr.name.toLowerCase()
        if (name.startsWith('on')) {
          el.removeAttribute(attr.name)
          continue
        }
        const tagAllow = ALLOWED_ATTRS_BY_TAG[tag]
        const allowed = GLOBAL_ATTRS.has(name) || tagAllow?.has(name)
        if (!allowed) {
          el.removeAttribute(attr.name)
          continue
        }
        if ((name === 'href' || name === 'src') && !isSafeUrl(attr.value)) {
          el.removeAttribute(attr.name)
        }
      }

      // Links: force safe target/rel
      if (tag === 'a' && el.hasAttribute('href')) {
        el.setAttribute('target', '_blank')
        el.setAttribute('rel', 'noopener noreferrer')
      }

      walk(el)
    }
  }

  walk(tpl.content)
  return tpl.innerHTML
}

function looksLikeHtml (raw: string): boolean {
  // heuristic: presence of a tag-like construct
  return /<\/?[a-zA-Z][^>]*>/.test(raw || '')
}

function escapeHtml (raw: string): string {
  return (raw || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function plaintextToHtml (raw: string): string {
  return escapeHtml(raw).replace(/\r?\n/g, '<br>')
}

// -----------------------------------------------------------------------
// Relative-time formatter (ar-locale aware)
// -----------------------------------------------------------------------
interface TimeUnit {
  sec: number
  unit: Intl.RelativeTimeFormatUnit
  div?: number
}
const UNITS: TimeUnit[] = [
  { sec: 60,       unit: 'second' },
  { sec: 3600,     unit: 'minute', div: 60 },
  { sec: 86400,    unit: 'hour',   div: 3600 },
  { sec: 604800,   unit: 'day',    div: 86400 },
  { sec: 2629800,  unit: 'week',   div: 604800 },
  { sec: 31557600, unit: 'month',  div: 2629800 },
  { sec: Infinity, unit: 'year',   div: 31557600 },
]

function relativeTime (ts: string | null | undefined): string {
  if (!ts) return ''
  const d = new Date(ts)
  if (Number.isNaN(d.getTime())) return ''
  const diffSec = Math.round((d.getTime() - Date.now()) / 1000)
  try {
    const rtf = new Intl.RelativeTimeFormat('ar', { numeric: 'auto' })
    const abs = Math.abs(diffSec)
    for (const u of UNITS) {
      if (abs < u.sec) {
        const div = u.div ?? 1
        return rtf.format(Math.round(diffSec / div), u.unit)
      }
    }
    return rtf.format(Math.round(diffSec / 31557600), 'year')
  } catch {
    return ''
  }
}

// -----------------------------------------------------------------------
// Mapping
// -----------------------------------------------------------------------
function typeFallbackTitle (type: string): string {
  const map: Record<string, string> = {
    CHECKOUT_DONE: t('تمت عملية الدفع'),
    PAYMENT:       t('تم استلام الدفع'),
    WITHDRAW:      t('طلب سحب'),
    QUESTION_ASK:  t('سؤال جديد'),
    QUESTION_ANS:  t('تمت الإجابة على سؤالك'),
    COURSE:        t('تحديث على دورتك'),
    CERTIFICATE:   t('شهادة جديدة'),
    REFERRAL:      t('إحالة جديدة'),
    AFFILIATE:     t('تحديث تسويقي'),
    PYRAMID:       t('نشاط في شبكتك'),
  }
  return map[type] ?? t('إشعار')
}

interface MappedRow {
  pk: number | null
  title: string
  bodyKind: 'html' | 'text' | 'empty'
  bodyHtml: string
  bodyText: string
  type: string
  iconKey: IconKey
  tone: Tone
  timestamp: string | null
  relativeTime: string
  read: boolean
  raw: NotifNode
  ariaLabel: string
}

function iconFor (key: IconKey): string {
  return ICONS[key] ?? ICONS.system
}

function stripToPlainText (raw: string): string {
  if (typeof window === 'undefined' || !raw) return raw
  const tpl = document.createElement('template')
  tpl.innerHTML = raw
  // .textContent walks through all descendants and concatenates text nodes —
  // strips every tag and attribute. Collapse runs of whitespace.
  return (tpl.content.textContent ?? '').replace(/\s+/g, ' ').trim()
}

function mapRow (n: NotifNode): MappedRow {
  const rawTitle = (n.title && n.title.trim()) || ''
  // Titles sometimes arrive with Gmail-paste HTML (nested <font style="...">).
  // Treat the title as plain text always — strip any markup to get clean copy.
  const title = rawTitle
    ? (stripToPlainText(rawTitle) || typeFallbackTitle(n.type))
    : typeFallbackTitle(n.type)
  const description = n.description ?? ''
  const isHtml = looksLikeHtml(description)
  const bodyKind: MappedRow['bodyKind'] = !description.trim()
    ? 'empty'
    : (isHtml ? 'html' : 'text')

  const bodyHtml = bodyKind === 'html' ? sanitizeHtml(description) : ''
  const bodyText = bodyKind === 'text' ? plaintextToHtml(description) : ''

  const iconKey = ICON_KEY[n.type] ?? 'system'
  const tone    = TONE[n.type] ?? 'brand'
  const timestamp = n.created ?? n.updated ?? null
  const rel = relativeTime(timestamp)
  const read = n.pk != null ? !!readLocal.value[n.pk] : false

  const ariaParts: string[] = []
  if (!read) ariaParts.push(t('غير مقروء'))
  ariaParts.push(title)
  if (rel) ariaParts.push(rel)

  return {
    pk: n.pk ?? null,
    title,
    bodyKind,
    bodyHtml,
    bodyText,
    type: n.type,
    iconKey,
    tone,
    timestamp,
    relativeTime: rel,
    read,
    raw: n,
    ariaLabel: ariaParts.join('، '),
  }
}

const mappedList = computed<MappedRow[]>(() => filtered.value.map(mapRow))

// -----------------------------------------------------------------------
// Actions
// -----------------------------------------------------------------------
function onRowClick (item: MappedRow): void {
  if (item.pk != null && !item.read) {
    readLocal.value[item.pk] = true
  }
  const n = item.raw
  const type = n.type
  if (type === 'QUESTION_ASK' || type === 'QUESTION_ANS') {
    let courseID: number | null = null
    try {
      courseID = parseInt(
        String(n.extraData ?? '').split('::')[0].split(' ')[1].replace('>', ''),
      )
    } catch {
      /* malformed — ignore */
    }
    if (courseID) window.location.href = `${location.origin}/classroom/#/class/${courseID}/`
  } else if (type === 'CHECKOUT_DONE' || type === 'PAYMENT') {
    void router.push({ name: 'my-courses' })
  }
}

function markAllRead (): void {
  for (const n of notifications.value) {
    if (n.pk != null) readLocal.value[n.pk] = true
  }
  $q.notify({
    type: 'positive',
    position: 'top',
    progress: true,
    message: t('تم تعيين جميع الإشعارات كمقروءة'),
  })
}

async function loadMoreData (): Promise<void> {
  const pageInfo = myNotifications.value?.pageInfo
  if (!pageInfo?.hasNextPage) return
  await notifQuery.fetchMore({
    variables: { cursor: pageInfo.endCursor },
    updateQuery: (
      previousResult: MyNotificationsResult,
      { fetchMoreResult }: { fetchMoreResult: MyNotificationsResult },
    ): MyNotificationsResult => {
      const prev = previousResult.myNotifications
      const next = fetchMoreResult?.myNotifications
      if (!next || !prev) return previousResult
      const newEdges = next.edges
      if (!newEdges.length) return previousResult
      return {
        myNotifications: {
          __typename: prev.__typename,
          totalCount: next.totalCount,
          pageInfo: next.pageInfo,
          edges: [...prev.edges, ...newEdges],
        },
      }
    },
  })
}

// -----------------------------------------------------------------------
// Lifecycle
// -----------------------------------------------------------------------
onMounted(() => {
  settings.setActiveNav('NOTIFICATION')
})
</script>

<style lang="scss" scoped>
.notifications-page {
  background: var(--ds-cream, var(--ds-surface-muted));
  min-block-size: 100vh;
  max-inline-size: 840px;
  margin-inline: auto;
  padding: var(--ds-space-6) var(--ds-space-3) var(--ds-space-12);

  @media (min-width: 600px) {
    padding: var(--ds-space-8) var(--ds-space-4) var(--ds-space-16);
  }

  &__head {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: var(--ds-space-3);
    flex-wrap: wrap;
    margin-block-end: var(--ds-space-5);

    h1 {
      display: inline-flex;
      align-items: center;
      gap: var(--ds-space-2);
      font-family: var(--ds-font-heading);
      font-size: var(--ds-text-3xl);
      font-weight: var(--ds-weight-bold);
      color: var(--ds-ink, var(--ds-text));
      margin: 0 0 var(--ds-space-1);
    }
    p {
      margin: 0;
      color: var(--ds-taupe, var(--ds-text-muted));
      font-size: var(--ds-text-sm);
    }
  }

  &__count {
    font-variant-numeric: tabular-nums;
  }

  &__filters {
    display: flex;
    gap: var(--ds-space-2);
    flex-wrap: wrap;
    margin-block-end: var(--ds-space-5);
    overflow-x: visible;
  }

  &__body { min-block-size: 16rem; }

  &__skeletons {
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-3);
  }

  &__list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-2);
  }

  &__more {
    margin-block-start: var(--ds-space-5);
    display: flex;
    justify-content: center;
  }
}

/* --------------------------------------------------------------------
   Tab / filter chip — matches MyCourses `.chip` pattern
   -------------------------------------------------------------------- */
.chip {
  display: inline-flex;
  align-items: center;
  gap: var(--ds-space-2);
  padding-block: 6px;
  padding-inline: var(--ds-space-3);
  background: transparent;
  border: 1px solid var(--ds-border);
  border-radius: 999px;
  font-family: var(--ds-font-body);
  font-size: var(--ds-text-sm);
  color: var(--ds-text-muted, var(--ds-taupe));
  cursor: pointer;
  transition:
    background-color var(--ds-duration-fast, 150ms) ease,
    color            var(--ds-duration-fast, 150ms) ease,
    border-color     var(--ds-duration-fast, 150ms) ease,
    box-shadow       var(--ds-duration-fast, 150ms) ease;

  &:hover,
  &:focus-visible {
    color: var(--ds-brand-600, #322873);
    border-color: var(--ds-brand-300, #897dc3);
    background: rgba(50, 40, 115, 0.04);
  }

  &:focus-visible {
    outline: 2px solid var(--ds-brand-300, #897dc3);
    outline-offset: 2px;
  }

  &--active {
    background: var(--ds-surface-elevated, #fff);
    color: var(--ds-brand-600, #322873);
    border-color: var(--ds-brand-600, #322873);
    box-shadow: var(--ds-shadow-xs);
  }

  &--active:hover,
  &--active:focus-visible {
    color: var(--ds-brand-600, #322873);
    border-color: var(--ds-brand-600, #322873);
    background: var(--ds-surface-elevated, #fff);
  }

  &__label { line-height: 1; }

  &__count {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-inline-size: 1.5rem;
    padding-block: 2px;
    padding-inline: 6px;
    border-radius: 999px;
    background: var(--ds-border);
    font-family: var(--ds-font-mono, var(--ds-font-body));
    font-size: var(--ds-text-xs);
    font-variant-numeric: tabular-nums;
    color: var(--ds-text-muted, var(--ds-taupe));
    line-height: 1;
  }

  &:hover &__count,
  &:focus-visible &__count { color: var(--ds-brand-600, #322873); }

  &--active &__count {
    background: var(--ds-brand-600, #322873);
    color: var(--ds-ivory, #fbf6ee);
  }
}

/* --------------------------------------------------------------------
   Notification row — flat feed on ivory, no nested cards, no stripes
   -------------------------------------------------------------------- */
.notif-row {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: flex-start;
  gap: var(--ds-space-3);
  padding: var(--ds-space-3) var(--ds-space-3);
  background: var(--ds-surface-elevated, #fff);
  border: 1px solid var(--ds-border);
  border-radius: var(--ds-radius-md, 12px);
  cursor: pointer;
  transition:
    background-color var(--ds-duration-fast, 150ms) ease,
    border-color     var(--ds-duration-fast, 150ms) ease,
    box-shadow       var(--ds-duration-fast, 150ms) ease;

  &:hover,
  &:focus-visible {
    background: var(--ds-ivory, #fbf6ee);
    border-color: var(--ds-brand-300, #897dc3);
  }

  &:focus-visible {
    outline: 2px solid var(--ds-brand-300, #897dc3);
    outline-offset: 2px;
  }

  &--unread { background: var(--ds-ivory, #fbf6ee); }

  @media (min-width: 600px) {
    padding: var(--ds-space-4);
    gap: var(--ds-space-4);
  }

  &__icon {
    flex: 0 0 auto;
    width: 36px;
    height: 36px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 999px;
    color: var(--ds-ivory, #fbf6ee);
  }

  &__icon-inner {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
  }

  &--brand   &__icon { background: var(--ds-brand-600, #322873); }
  &--accent  &__icon { background: var(--ds-accent-300, #c1623c); }
  &--success &__icon { background: var(--ds-success, #2e7d5b); }
  &--warning &__icon { background: var(--ds-warning, #b8761a); }
  &--info    &__icon { background: var(--ds-brand-600, #322873); }

  &__body {
    min-inline-size: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
    line-height: var(--ds-leading-arabic, 1.7);
  }

  &__titleline {
    display: inline-flex;
    align-items: center;
    gap: var(--ds-space-2);
    min-inline-size: 0;
  }

  &__title {
    margin: 0;
    font-family: var(--ds-font-heading);
    font-size: 15px;
    color: var(--ds-ink, var(--ds-text));
    line-height: 1.4;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: var(--ds-weight-regular, 400);
  }

  &--unread &__title { font-weight: var(--ds-weight-bold, 700); }

  &__dot {
    flex: 0 0 auto;
    inline-size: 8px;
    block-size: 8px;
    border-radius: 999px;
    background: var(--ds-accent-300, #c1623c);
    display: inline-block;
  }

  &__desc {
    margin: 0;
    font-family: var(--ds-font-body);
    font-size: 14px;
    color: var(--ds-taupe, var(--ds-text-muted));
    line-height: var(--ds-leading-arabic, 1.7);
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    word-break: break-word;
  }

  &__desc--rich {
    :deep(a) {
      color: var(--ds-brand-600, #322873);
      text-decoration: underline;
    }
    :deep(img) {
      max-inline-size: 100%;
      height: auto;
      border-radius: var(--ds-radius-sm, 8px);
    }
    :deep(p) { margin: 0; }
    :deep(ul), :deep(ol) {
      margin: 0;
      padding-inline-start: 1.25rem;
    }
    :deep(code) {
      font-family: var(--ds-font-mono, ui-monospace, monospace);
      font-size: 0.9em;
      background: var(--ds-cream-sunken, rgba(50, 40, 115, 0.06));
      color: var(--ds-brand-700, #2a2063);
      padding: 0.1em 0.35em;
      border-radius: var(--ds-radius-sm, 6px);
    }
    :deep(pre) {
      font-family: var(--ds-font-mono, ui-monospace, monospace);
      font-size: 13px;
      line-height: 1.6;
      background: var(--ds-cream-sunken, rgba(50, 40, 115, 0.06));
      color: var(--ds-ink);
      padding: var(--ds-space-3, 12px);
      border-radius: var(--ds-radius-md, 10px);
      overflow-x: auto;
      margin-block: var(--ds-space-2, 8px);
      direction: ltr;
      text-align: start;
    }
    :deep(pre code) {
      background: transparent;
      padding: 0;
      color: inherit;
      font-size: inherit;
    }
    :deep(blockquote) {
      margin: var(--ds-space-2, 8px) 0;
      padding-inline-start: var(--ds-space-3, 12px);
      color: var(--ds-taupe, var(--ds-text-muted));
      font-style: italic;
    }
  }

  &__meta {
    flex: 0 0 auto;
    display: inline-flex;
    align-items: flex-start;
    padding-inline-start: var(--ds-space-2);
  }

  &__time {
    font-family: var(--ds-font-body);
    font-size: 12px;
    color: var(--ds-taupe, var(--ds-text-muted));
    white-space: nowrap;
    font-variant-numeric: tabular-nums;
  }
}

/* narrow: keep layout 3-col but tighten. No horizontal scroll at 360. */
@media (max-width: 420px) {
  .notif-row {
    gap: var(--ds-space-2);
    padding: var(--ds-space-3);

    &__icon { width: 32px; height: 32px; }
    &__icon-inner { width: 16px; height: 16px; }
    &__title { font-size: 14px; }
    &__desc  { font-size: 13px; -webkit-line-clamp: 2; }
    &__time  { font-size: 11px; }
  }
}
</style>
