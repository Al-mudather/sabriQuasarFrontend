<template>
  <footer class="cls-footer" role="contentinfo">
    <span class="cls-footer__copy">&copy; STC</span>
    <a
      href="#"
      class="cls-footer__help"
      @click.prevent
    >
      {{ t('classroom.footer.help') }}
    </a>
  </footer>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<style lang="scss" scoped>
.cls-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  block-size: 48px;
  padding-inline: 16px;
  background: #120E22;
  color: #9890A8;
  border-block-start: 1px solid rgba(245, 242, 234, 0.08);
  font-size: 12px;

  &__help {
    color: inherit;
    text-decoration: none;

    &:hover { color: #F5F2EA; }
  }
}
</style>
