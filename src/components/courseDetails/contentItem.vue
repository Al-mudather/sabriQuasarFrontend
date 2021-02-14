<template>
    <div class="info">
        <div class="mage">
            <img src="~assets/img/padlock.png" alt="" />
        </div>
        <h3>{{ formatTitle }}</h3>
    </div>
</template>

<script>
export default {
  props: ['content'],
  computed: {
    formatTitle () {
      const result = JSON.parse(this.content.modelValue)
      if (this.content.modelName === 'ContentFile') {
        return result.attachment.split('/attachment/')[1]
      }
      return result.title
    }
  }
}
</script>

<style></style>
