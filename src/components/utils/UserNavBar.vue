<template>
    <section class="navv">
        <div class="container-fluid">
            <div class="row">
                <div class="col-lg-12">
                    <div class="menu">
                        <img src="~assets/img/menu.png" alt="" />
                    </div>
                    <div class="user" v-if="lodash.get(user,'[firstName]')">
                        <img src="~assets/img/hassbo.png" alt="" />
                        <h3>{{lodash.get(user,'[firstName]')}} {{lodash.get(user,'[lastName]')}}</h3>
                    </div>
                    <div class="user" v-else-if="lodash.get(user,'[username]')">
                        <img src="~assets/img/hassbo.png" alt="" />
                        <h3>{{lodash.get(user,'[username]')}}</h3>
                    </div>
                    <div class="user heading" v-else>
                        غير معروف
                    </div>
                    <!-- <div class="notification">
                        <span>+8</span>
                        <img src="~assets/img/notif.png" alt="" />
                    </div> -->
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import { mapState } from 'vuex'

export default {
    name: "CoursesNavBar",
    data () {
        return {
            lodash: this.$_
        }
    },
    computed: {
        ...mapState('authentication', ['user'])
    }
};
</script>
<style lang="scss">
@import "src/css/helpers/_mixins.scss";
@import "src/css/helpers/_variabels.scss";
@import "src/css/layout/_navbar.scss";

.heading {
    font-size: 29px;
    font-family: 'cairoR';
    color: #7B7B7B;
}
</style>
