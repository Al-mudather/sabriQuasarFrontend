<template>
    <div class="info">
        <div class="mage">
            <img src="~assets/img/padlock.png" alt="" />
        </div>
        <!-- <h3>{{  content.modelValue.replace("'id'", '"id"').replace("'title'", '"title"').replace("'_state'", '"_state"').replace("'video'", '"video"').replace("'video_time'", '"video_time"').replace("'created'", '"created"').replace("'updated'", '"updated"') }}</h3> -->
        <h3>{{  content.modelValue }}</h3>
    </div>
</template>

<script>
export default {
  props: ['content']
}
</script>

<style></style>
