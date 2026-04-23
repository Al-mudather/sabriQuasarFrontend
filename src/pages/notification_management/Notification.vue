<template>
  <main class="notifications-page">
    <header class="notifications-page__head">
      <h1>
        <img src="~assets/img/tit.png" alt="" aria-hidden="true" />
        <span>{{ $t('الإشعارات') }}</span>
      </h1>
    </header>

    <section class="notifications-page__body">
      <div v-if="loading && notifications.length === 0" class="notifications-page__skeletons">
        <ds-skeleton v-for="i in 5" :key="i" shape="rect" height="5rem" />
      </div>

      <ds-empty-state
        v-else-if="notifications.length === 0"
        :title="$t('لا توجد إشعارات بعد')"
        size="md"
      >
        <template #illustration>
          <img src="~assets/img/no_notification.png" alt="" />
        </template>
        <template #description>
          {{ $t('ستصلك هنا أي تنبيهات عن كورساتك ومدفوعاتك وشهاداتك.') }}
        </template>
      </ds-empty-state>

      <div v-else class="notifications-page__list">
        <NotificationCard
          v-for="n in notifications"
          :key="n.node.pk"
          :notification="n.node"
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
import NotificationCard from 'src/components/notification_management/NotificationCard.vue'
import { GetAllMyNotifications } from 'src/queries/notification_management/query/GetAllMyNotifications'
import { mapActions } from 'vuex'

export default {
  name: 'Notification',
  components: { NotificationCard },

  data () {
    return {
      myNotifications: '',
      loading: false,
      notificationData: []
    }
  },

  apollo: {
    myNotifications: {
      query: GetAllMyNotifications,
      variables: { orderBy: ['-id'], limit: 2 },
      result (res) {
        this.loading = res.loading
        if (!res.loading) this.notificationData = res.data.myNotifications
      }
    }
  },

  computed: {
    notifications () { return this.$_.get(this.notificationData, 'edges', []) || [] },
    hasMore () { return this.$_.get(this.myNotifications, '[pageInfo][hasNextPage]', false) }
  },

  mounted () { this.setActiveNavAction('NOTIFICATION') },

  methods: {
    ...mapActions('settings', ['setActiveNavAction']),

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
  max-inline-size: 720px;
  margin-inline: auto;
  padding: var(--ds-space-6) var(--ds-space-3) var(--ds-space-12);

  @media (min-width: 600px) {
    padding: var(--ds-space-8) var(--ds-space-4) var(--ds-space-16);
  }

  &__head {
    margin-block-end: var(--ds-space-6);
    h1 {
      display: inline-flex;
      align-items: center;
      gap: var(--ds-space-2);
      font-family: var(--ds-font-heading);
      font-size: var(--ds-text-3xl);
      font-weight: var(--ds-weight-bold);
      color: var(--ds-text);
      margin: 0;
      img { block-size: 1.75rem; inline-size: auto; }
    }
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
</style>
