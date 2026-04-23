<template>
  <div class="hero">
    <div class="hero__media">
      <img
        class="hero__image"
        src="~assets/img/image1.png"
        alt="Medical Training Platform"
      />
    </div>
    <div class="hero__content">
      <h2 class="hero__title">
        {{ $t('المنصة الأولى على مستوى الوطن العربي في التدريب الطبي') }}
      </h2>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SwiperHeader',
  data () {
    return {}
  },
  components: {},
  methods: {}
}
</script>

<style lang="scss" scoped>
.hero {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: var(--ds-space-8, 2rem);
  padding-block: var(--ds-space-10, 3rem);
  padding-inline: var(--ds-space-6, 1.5rem);
  max-inline-size: 1200px;
  margin-inline: auto;
}

.hero__media {
  display: flex;
  justify-content: center;
  align-items: center;
}

.hero__image {
  max-inline-size: 100%;
  block-size: auto;
  border-radius: var(--ds-radius-lg, 16px);
  object-fit: cover;
}

.hero__content {
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-4, 1rem);
}

.hero__title {
  font-family: var(--ds-font-heading, inherit);
  font-weight: var(--ds-weight-bold, 700);
  font-size: var(--ds-font-size-3xl, 2rem);
  line-height: var(--ds-line-height-tight, 1.2);
  color: var(--ds-color-text-primary, #104982);
  margin: 0;
}

@media (max-width: 768px) {
  .hero {
    grid-template-columns: 1fr;
    text-align: center;
    padding-block: var(--ds-space-6, 1.5rem);
  }

  .hero__title {
    font-size: var(--ds-font-size-2xl, 1.5rem);
  }
}
</style>
