<template>
    <div class="row">
        <div class="col-lg-4 col-xs-12">
            <div class="asid">
                <div class="titel">
                    <img src="~assets/img/tit2.png" alt="" />
                    <h3>المحتــوى</h3>
                    <div class="butt">
                        <img src="~assets/img/visibility.png" alt="" />
                        <img src="~assets/img/full screen.png" alt="" />
                    </div>
                </div>
                <!--colapss-->
                <div class="accord" id="accordion">
                    <q-list ref="contentList" class="rounded-borders">
                        <transition-group
                            appear
                            enter-active-class="animated fadeIn"
                            leave-active-class="animated fadeOut"
                        >
                            <q-expansion-item
                                header-class="text-white"
                                class="card"
                                v-for="unit in 3"
                                :key="unit"
                            >
                                <template slot="header">
                                    <contentHeader headerText="header 1" :open="open" />
                                </template>

                                <div
                                    id="collapseOne"
                                    class="collapse show"
                                    aria-labelledby="headingOne"
                                    data-parent="#accordion"
                                >
                                    <div class="card-body">
                                        <q-item
                                            style="width: 95%"
                                            v-for="content in 3"
                                            :key="content"
                                            clickable v-ripple
                                        >
                                            <classContentItem
                                                :content="content"
                                            />
                                        </q-item>
                                    </div>
                                </div>
                            </q-expansion-item>
                        </transition-group>
                    </q-list>
                </div>
            </div>
        </div>
        <div class="col-lg-8 col-xs-12">
            <div class="vedio">
                <div class="megx">
                    <img src="~assets/img/pexels.png" alt="" />
                    <img class="play" src="~assets/img/player.png" alt="" />
                </div>
                <div class="arrow">
                    <div class="next">
                        <img src="~assets/img/previous.png" alt="" />
                        <h3>الدرس السابق</h3>
                    </div>
                    <div class="next">
                        <h3>الدرس التالي</h3>
                        <img src="~assets/img/next.png" alt="" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import contentHeader from 'components/utils/contentHeader'
import classContentItem from 'components/courseClass/classContentItem'
export default {
  data () {
    return {
      open: true
    }
  },
  components: {
    classContentItem,
    contentHeader
  }
}
</script>

<style lang="scss">
.card-body {
    padding: 0 !important;
    margin-right: 20px !important;
}
.q-card__section--vert {
    padding: 0 !important;
}
.q-item__section--side {
    display: none;
    visibility: hidden;
    width: 0;
}
</style>
