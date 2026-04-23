<template>
  <main class="account-shell">
    <router-view />
  </main>
</template>

<script>
export default {
  name: 'Account'
}
</script>

<style lang="scss" scoped>
.account-shell {
  min-block-size: 100vh;
  background: var(--ds-surface-muted);
}
</style>
