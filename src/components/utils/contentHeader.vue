<template>
    <div class="card-header" style="width: 100% !important" id="headingOne">
        <h5 class="mb-0">
            <a
                data-toggle="collapse"
                data-target="#collapseOne"
                aria-expanded="true"
                aria-controls="collapseOne"
            >
                <div class="linke">
                    <img src="~assets/img/mins.png" v-if="!open" alt="" />
                    <img src="~assets/img/pluus.png" v-if="open" alt="" />
                </div>
                {{ headerText }} || title
            </a>
        </h5>
    </div>
</template>

<script>
export default {
  props: ['headerText', 'open']
}
</script>

<style></style>
