<template>
    <div class="tech">
        <div class="img-user">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="102.018"
                height="78.632"
                viewBox="0 0 102.018 78.632"
            >
                <g
                    id="Group_652"
                    data-name="Group 652"
                    transform="translate(0 78.632)"
                >
                    <path
                        id="Path_979"
                        data-name="Path 979"
                        d="M62.7-76.632a37.495,37.495,0,0,1,37.316,37.316A37.495,37.495,0,0,1,62.7-2,37.494,37.494,0,0,1,25.385-39.316c0-6.916-2.648-10.63-5.783-11.972a8.669,8.669,0,0,0-9.792,2.65c-3.3,3.727-4.579,10.513.817,18.735,2.944,4.485,3.728,7.964,3.168,10.382a4.19,4.19,0,0,1-3.9,3.4c-4.123.275-9.032-4.3-7.658-14.191a1,1,0,0,0-.853-1.128,1,1,0,0,0-1.128.853C-1.375-18.842,5.134-13.8,10.028-14.127,15.011-14.459,19.277-20.368,12.3-31c-5.841-8.9-3.1-15.867,1.347-18.141a5.882,5.882,0,0,1,6.342.375c2.019,1.529,3.4,4.588,3.4,9.449A39.5,39.5,0,0,0,62.7,0a39.5,39.5,0,0,0,39.316-39.316A39.5,39.5,0,0,0,62.7-78.632a1,1,0,0,0-1,1A1,1,0,0,0,62.7-76.632Z"
                        fill="#5666b9"
                        fill-rule="evenodd"
                    />
                    <path
                        id="Path_980"
                        data-name="Path 980"
                        d="M27.281-51.273a37.037,37.037,0,0,1,1.688-4.053,37.354,37.354,0,0,1,27.8-20.535A1.217,1.217,0,0,0,57.79-77.25,1.217,1.217,0,0,0,56.4-78.266,39.792,39.792,0,0,0,26.782-56.393a39.478,39.478,0,0,0-1.8,4.32,1.217,1.217,0,0,0,.749,1.549A1.217,1.217,0,0,0,27.281-51.273Z"
                        fill="#fbc74b"
                        fill-rule="evenodd"
                    />
                </g>
            </svg>
            <!-- <img :src="'http://localhost:8000' + '/media/' + image" alt="" /> -->
            <img :src="CALCULATE_IMAGE_URL" alt="" />
        </div>
        <h3>
            {{ firstName }}
            {{ lastName }}
        </h3>
        <p id="p_data" class="">
            {{ qualification }}
        </p>
        <a
            ref="togleBtn"
            id="togleBtn"
            data-type="more"
            @click="togelMoreOrLessData"
        >
            <h3> {{ $t('المزيــد') }}<img src="~assets/img/moree.png" alt="" /></h3>
        </a>
    </div>
</template>

<script>
// import 'animate.css'
export default {
    data() {
        return {};
    },
    props: ["firstName", "lastName", "qualification", "image"],
    computed: {
        CALCULATE_IMAGE_URL () {
            if (this.image) {
                return location.host + '/media/' + this.image
            }
            return '~assets/img/big_man.png'
        }
    },
    methods: {
        togelMoreOrLessData() {
            const btn = this.$refs.togleBtn;
            const btnType = btn.attributes["data-type"].nodeValue;
            if (btnType === "more") {
                btn.previousSibling.classList.add("show_more_data");
                btn.attributes["data-type"].nodeValue = "less";
                btn.firstChild.firstChild.textContent = this.$t('إخفاء');
            } else if (btnType === "less") {
                btn.previousSibling.classList.remove("show_more_data");
                btn.attributes["data-type"].nodeValue = "more";
                btn.firstChild.firstChild.textContent = this.$t('المزيــد');
            }
        }
    }
};
</script>

<style lang="scss">
#togleBtn {
    cursor: pointer;
    display: inline-block;

}

#p_data {
    line-height: 25px;
    display: block;
    height: 54px;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: all 0.5s ;

}
.show_more_data {
    display: block;
    height: 100% !important;
}

</style>
