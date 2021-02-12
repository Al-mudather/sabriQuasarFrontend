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
      const title = JSON.parse(this.content.modelValue)
      if (this.content.modelName === 'ContentFile') {
        return title.attachment.split('/attachment/')[1]
      }
      return title.title
    }
  }
}
</script>

<style></style>
