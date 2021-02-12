<template>
    <div @click="ChangeTheSign" class="card-header" style="width: 100% !important" id="headingOne">
        <h5 class="dowUp mb-0">
            <a
                data-toggle="collapse"
                data-target="#collapseOne"
                aria-expanded="true"
                aria-controls="collapseOne"
            >
                <div class="linke">
                    <img
                        v-if="plussImage"
                        src="~assets/img/pluus.png"
                        alt="mins"
                    />
                    <img v-if="!plussImage"
                        src="~assets/img/mins.png"
                        alt="pluss"
                    />
                </div>
                {{ headerText }}
            </a>
        </h5>
    </div>
</template>

<script>
export default {
  data () {
    return {
      plussImage: true
    }
  },
  props: ['headerText'],

  methods: {
    ChangeTheSign (e) {
      this.plussImage = !this.plussImage
    }
  }
}
</script>

<style></style>
