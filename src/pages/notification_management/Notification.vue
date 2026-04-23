<template>
  <main class="notifications-page">
    <header class="notifications-page__head">
      <div class="notifications-page__head-text">
        <h1>
          {{ $t('الإشعارات') }}
          <ds-badge
            v-if="unreadCount > 0"
            variant="terracotta"
            size="md"
            class="notifications-page__count"
          >
            {{ unreadCount }}
          </ds-badge>
        </h1>
        <p>{{ $t('تنبيهات دوراتك ومعاملاتك وتسويقك في مكان واحد.') }}</p>
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

    <nav class="notifications-page__filters" role="tablist" aria-label="notifications filters">
      <button
        v-for="f in filters"
        :key="f.key"
        type="button"
        class="filter-chip"
        :class="{ 'filter-chip--active': activeFilter === f.key }"
        role="tab"
        :aria-selected="activeFilter === f.key ? 'true' : 'false'"
        @click="activeFilter = f.key"
      >
        {{ f.label }}
        <span v-if="f.count != null" class="filter-chip__count">{{ f.count }}</span>
      </button>
    </nav>

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

      <div v-else class="notifications-page__list">
        <app-notification
          v-for="n in filtered"
          :key="n.pk"
          :notification="mapNotification(n)"
          @read="onRead"
          @click="onNotificationClick"
        />

        <div v-if="hasMore" class="notifications-page__more">
          <ds-button variant="secondary" @click="LOAD_MORE_DATA">
            {{ $t('عرض المزيد') }}
          </ds-button>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import AppNotification from 'src/components/shared/Notification.vue'
import { GetAllMyNotifications } from 'src/queries/notification_management/query/GetAllMyNotifications'
import { mapActions } from 'vuex'

const TYPE_BUCKET = {
  CHECKOUT_DONE: 'transactions',
  PAYMENT: 'transactions',
  WITHDRAW: 'transactions',
  QUESTION_ASK: 'courses',
  QUESTION_ANS: 'courses',
  COURSE: 'courses',
  CERTIFICATE: 'courses',
  REFERRAL: 'marketing',
  AFFILIATE: 'marketing',
  PYRAMID: 'marketing'
}

const VISUAL_TYPE = {
  CHECKOUT_DONE: 'success',
  PAYMENT: 'success',
  WITHDRAW: 'info',
  QUESTION_ASK: 'info',
  QUESTION_ANS: 'success',
  COURSE: 'info',
  CERTIFICATE: 'success',
  REFERRAL: 'info',
  AFFILIATE: 'info',
  PYRAMID: 'info'
}

export default {
  name: 'Notification',
  components: { AppNotification },

  data () {
    return {
      myNotifications: '',
      loading: false,
      notificationData: [],
      readLocal: {},        // pk -> true (optimistic local read state)
      activeFilter: 'all'
    }
  },

  apollo: {
    myNotifications: {
      query: GetAllMyNotifications,
      variables: { orderBy: ['-id'], limit: 15 },
      result (res) {
        this.loading = res.loading
        if (!res.loading) this.notificationData = res.data.myNotifications
      }
    }
  },

  computed: {
    notifications () {
      return (this.$_.get(this.notificationData, 'edges', []) || []).map(e => e.node)
    },
    hasMore () { return this.$_.get(this.myNotifications, '[pageInfo][hasNextPage]', false) },
    unreadCount () {
      return this.notifications.filter(n => !this.readLocal[n.pk]).length
    },
    bucketCounts () {
      const counts = { all: this.notifications.length, unread: this.unreadCount, courses: 0, transactions: 0, marketing: 0 }
      for (const n of this.notifications) {
        const b = TYPE_BUCKET[n.type]
        if (b && counts[b] != null) counts[b] += 1
      }
      return counts
    },
    filters () {
      const c = this.bucketCounts
      return [
        { key: 'all',          label: this.$t('الكل'),          count: c.all },
        { key: 'unread',       label: this.$t('غير مقروءة'),    count: c.unread },
        { key: 'courses',      label: this.$t('الدورات'),       count: c.courses },
        { key: 'transactions', label: this.$t('المعاملات'),     count: c.transactions },
        { key: 'marketing',    label: this.$t('التسويق'),       count: c.marketing }
      ]
    },
    filtered () {
      if (this.activeFilter === 'all') return this.notifications
      if (this.activeFilter === 'unread') {
        return this.notifications.filter(n => !this.readLocal[n.pk])
      }
      return this.notifications.filter(n => TYPE_BUCKET[n.type] === this.activeFilter)
    }
  },

  mounted () { this.setActiveNavAction('NOTIFICATION') },

  methods: {
    ...mapActions('settings', ['setActiveNavAction']),

    mapNotification (n) {
      return {
        pk: n.pk,
        title: n.title || this.typeFallbackTitle(n.type),
        body: n.description || '',
        type: VISUAL_TYPE[n.type] || 'info',
        timestamp: n.created || n.updated,
        read: !!this.readLocal[n.pk],
        _raw: n
      }
    },

    typeFallbackTitle (type) {
      const map = {
        CHECKOUT_DONE: this.$t('تمت عملية الدفع'),
        QUESTION_ASK: this.$t('سؤال جديد'),
        QUESTION_ANS: this.$t('تمت الإجابة على سؤالك'),
        REFERRAL: this.$t('إحالة جديدة'),
        AFFILIATE: this.$t('تحديث تسويقي')
      }
      return map[type] || this.$t('إشعار')
    },

    onRead (n) {
      if (n && n.pk != null) this.$set(this.readLocal, n.pk, true)
    },

    onNotificationClick (evt) {
      const n = evt && evt.notification && evt.notification._raw
      if (!n) return
      const type = n.type
      if (type === 'QUESTION_ASK' || type === 'QUESTION_ANS') {
        let courseID = null
        try {
          courseID = parseInt(String(n.extraData || '').split('::')[0].split(' ')[1].replace('>', ''))
        } catch (e) { /* malformed — ignore */ }
        if (courseID) window.location.href = `${location.origin}/classroom/#/class/${courseID}/`
      } else if (type === 'CHECKOUT_DONE') {
        this.$router.push({ name: 'my-courses' })
      }
    },

    markAllRead () {
      for (const n of this.notifications) this.$set(this.readLocal, n.pk, true)
      this.$q.notify({
        type: 'positive',
        position: 'top',
        progress: true,
        message: this.$t('تم تعيين جميع الإشعارات كمقروءة')
      })
    },

    async LOAD_MORE_DATA () {
      await this.$apollo.queries.myNotifications.fetchMore({
        variables: { cursor: this.myNotifications.pageInfo.endCursor },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          const newEdges = fetchMoreResult.myNotifications.edges
          const pageInfo = fetchMoreResult.myNotifications.pageInfo
          if (newEdges.length) {
            this.myNotifications = {
              __typename: previousResult.myNotifications.__typename,
              edges: [...previousResult.myNotifications.edges, ...newEdges],
              pageInfo
            }
            return { myNotifications: this.myNotifications }
          }
          return previousResult
        }
      })
    }
  }
}
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
  }

  &__body { min-block-size: 16rem; }

  &__skeletons {
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-3);
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-3);
  }

  &__more {
    margin-block-start: var(--ds-space-4);
    display: flex;
    justify-content: center;
  }
}

.filter-chip {
  display: inline-flex;
  align-items: center;
  gap: var(--ds-space-1);
  padding: 0.45rem 0.95rem;
  background: var(--ds-surface);
  border: 1px solid var(--ds-border);
  border-radius: var(--ds-radius-pill);
  font-family: var(--ds-font-heading);
  font-size: var(--ds-text-sm);
  color: var(--ds-text);
  cursor: pointer;
  transition: all var(--ds-duration-fast) var(--ds-ease-out);

  &:hover { background: var(--ds-surface-sunken); }
  &:focus-visible { outline: 2px solid transparent; box-shadow: var(--ds-shadow-focus); }

  &--active {
    background: var(--ds-brand-700, #322873);
    color: var(--ds-text-onBrand, #fff);
    border-color: var(--ds-brand-700, #322873);
  }

  &__count {
    font-family: var(--ds-font-mono);
    font-size: var(--ds-text-xs);
    opacity: 0.85;
    padding-inline-start: var(--ds-space-1);
  }
}
</style>
