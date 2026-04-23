<template>
  <DsCard
    class="notif"
    :class="[
      `notif--${resolvedType}`,
      {
        'notif--unread': !notification.read,
        'notif--compact': compact
      }
    ]"
    variant="default"
    elevation="xs"
    :interactive="true"
    role="article"
    :aria-label="ariaLabel"
    @click="onCardClick"
  >
    <div class="notif__row">
      <span class="notif__icon" :aria-hidden="true">
        <svg viewBox="0 0 24 24" class="notif__icon-svg">
          <path :d="iconPath" />
        </svg>
      </span>

      <div class="notif__body">
        <h4 v-if="notification.title" class="notif__title">{{ notification.title }}</h4>
        <p v-if="notification.body" class="notif__desc">{{ notification.body }}</p>
      </div>

      <div class="notif__meta">
        <span v-if="relativeTime" class="notif__time">{{ relativeTime }}</span>
        <span v-if="!notification.read" class="notif__dot" aria-label="غير مقروء"></span>
        <DsButton
          v-if="notification.actionLabel"
          variant="ghost"
          size="sm"
          :magnetic-enabled="false"
          class="notif__action"
          @click.stop="onActionClick"
        >
          {{ notification.actionLabel }}
        </DsButton>
      </div>
    </div>
  </DsCard>
</template>

<script>
import DsCard from 'src/design-system/components/DsCard.vue'
import DsButton from 'src/design-system/components/DsButton.vue'

const ICONS = {
  info:    'M12 2a10 10 0 100 20 10 10 0 000-20zm.9 15h-1.8v-6h1.8v6zm0-8h-1.8V7h1.8v2z',
  success: 'M12 2a10 10 0 100 20 10 10 0 000-20zm-1.2 14.2l-3.5-3.5 1.3-1.3 2.2 2.2 5-5 1.3 1.3-6.3 6.3z',
  warning: 'M12 2L1.5 21h21L12 2zm1 15h-2v-2h2v2zm0-4h-2V9h2v4z',
  danger:  'M12 2a10 10 0 100 20 10 10 0 000-20zm4.9 13.6l-1.3 1.3L12 13.3l-3.6 3.6-1.3-1.3L10.7 12 7.1 8.4l1.3-1.3L12 10.7l3.6-3.6 1.3 1.3L13.3 12l3.6 3.6z'
}

const UNITS = [
  { sec: 60,         unit: 'second' },
  { sec: 3600,       unit: 'minute', div: 60 },
  { sec: 86400,      unit: 'hour',   div: 3600 },
  { sec: 604800,     unit: 'day',    div: 86400 },
  { sec: 2629800,    unit: 'week',   div: 604800 },
  { sec: 31557600,   unit: 'month',  div: 2629800 },
  { sec: Infinity,   unit: 'year',   div: 31557600 }
]

export default {
  name: 'AppNotification',
  components: { DsCard, DsButton },
  props: {
    notification: {
      type: Object,
      required: true
    },
    compact: { type: Boolean, default: false },
    locale:  { type: String, default: 'ar' }
  },
  computed: {
    resolvedType () {
      const t = (this.notification && this.notification.type) || 'info'
      return ['info', 'success', 'warning', 'danger'].includes(t) ? t : 'info'
    },
    iconPath () { return ICONS[this.resolvedType] || ICONS.info },
    relativeTime () {
      const ts = this.notification && this.notification.timestamp
      if (!ts) return ''
      const date = ts instanceof Date ? ts : new Date(ts)
      if (isNaN(date.getTime())) return ''
      const diffSec = Math.round((date.getTime() - Date.now()) / 1000)
      try {
        const rtf = new Intl.RelativeTimeFormat(this.locale, { numeric: 'auto' })
        const abs = Math.abs(diffSec)
        for (const u of UNITS) {
          if (abs < u.sec) {
            const div = u.div || 1
            return rtf.format(Math.round(diffSec / div), u.unit)
          }
        }
        return rtf.format(Math.round(diffSec / 31557600), 'year')
      } catch (e) {
        return ''
      }
    },
    ariaLabel () {
      const parts = []
      if (!this.notification.read) parts.push('غير مقروء')
      if (this.notification.title) parts.push(this.notification.title)
      if (this.relativeTime) parts.push(this.relativeTime)
      return parts.join('، ')
    }
  },
  methods: {
    onCardClick (e) {
      if (!this.notification.read) this.$emit('read', this.notification)
      this.$emit('click', { event: e, notification: this.notification })
    },
    onActionClick (e) {
      this.$emit('action-click', {
        event: e,
        notification: this.notification,
        to: this.notification.actionTo
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.notif {
  transition:
    background-color var(--ds-duration-fast) var(--ds-ease-out),
    transform        var(--ds-duration-fast) var(--ds-ease-out);

  ::v-deep .ds-card__body {
    padding: var(--ds-space-4);
  }

  &--compact ::v-deep .ds-card__body {
    padding: var(--ds-space-3);
  }

  &__row {
    display: flex;
    align-items: flex-start;
    gap: var(--ds-space-3);
  }

  &__icon {
    flex: 0 0 auto;
    width: 36px;
    height: 36px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--ds-radius-pill);
    color: var(--ds-ivory);
  }

  &__icon-svg {
    width: 18px;
    height: 18px;
    fill: currentColor;
  }

  &__body {
    flex: 1 1 auto;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-1);
    line-height: var(--ds-leading-arabic);
  }

  &__title {
    margin: 0;
    font-family: var(--ds-font-heading);
    font-weight: var(--ds-weight-medium);
    font-size: 15px;
    color: var(--ds-ink);
    line-height: 1.4;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__desc {
    margin: 0;
    font-family: var(--ds-font-body);
    font-weight: var(--ds-weight-regular);
    font-size: 14px;
    color: var(--ds-taupe);
    line-height: var(--ds-leading-arabic);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__meta {
    flex: 0 0 auto;
    display: inline-flex;
    flex-direction: column;
    align-items: flex-end;
    gap: var(--ds-space-1);
    padding-inline-start: var(--ds-space-2);
  }

  &__time {
    font-family: var(--ds-font-body);
    font-weight: var(--ds-weight-regular);
    font-size: 12px;
    color: var(--ds-taupe);
    white-space: nowrap;
  }

  &__dot {
    width: 8px;
    height: 8px;
    border-radius: var(--ds-radius-pill);
    background: var(--ds-accent-300);
    display: inline-block;
  }

  &__action {
    margin-block-start: var(--ds-space-1);
  }

  // Hover — subtle cream-sunken shift
  @media (hover: hover) {
    &:hover {
      background: var(--ds-surface-sunken);
    }
  }

  // Type → icon badge background
  &--info    .notif__icon { background: var(--ds-brand-600); }
  &--success .notif__icon { background: var(--ds-success); }
  &--warning .notif__icon { background: var(--ds-warning); }
  &--danger  .notif__icon { background: var(--ds-danger); }

  &--unread {
    background: var(--ds-ivory);
  }
}
</style>
