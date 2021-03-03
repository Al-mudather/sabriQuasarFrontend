<template>
    <div class="row">
        <div class="col-lg-2">
            <div class="users">
                <img src="~assets/img/man.png" alt="" />
                <h3 v-if="!lodash.isEmpty(replay.user.firstName)">
                    {{replay.user.firstName}} {{replay.user.lastName}}
                </h3>
                <h3 v-else>
                    {{replay.user.email.split('@')[0]}}
                </h3>
            </div>
        </div>
        <div class="col-lg-10">
            <div class="pragh">
                <h3>
                    {{replay.answer}}
                </h3>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  data () {
    return {
        lodash: this.$_
    }
  },
  props: ['replay']
}
</script>

<style></style>
