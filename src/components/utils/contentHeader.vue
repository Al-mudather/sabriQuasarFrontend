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
                        src="~assets/img/up_arrow.png"
                        alt="mins"
                    /> 
                    <img v-if="!plussImage"
                        src="~assets/img/down_arrow.png"
                        alt="pluss"
                    />
                </div>
                {{ headerText }}
            </a>
        </h5>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  headerText?: string
}

defineProps<Props>()

const plussImage = ref(true)

function ChangeTheSign (): void {
  plussImage.value = !plussImage.value
}
</script>

<style></style>
