<template>
    <section class="navv">
        <div class="container-fluid">
            <div class="row">
                <div class="col-lg-12">
                    <div class="menu">
                        <img src="~assets/img/menu.png" alt="" />
                    </div>
                    <div class="user">
                        <img src="~assets/img/hassbo.png" alt="" />
                        <h3>محمد حسب الرسول</h3>
                    </div>
                    <div class="notification">
                        <span>+8</span>
                        <img src="~assets/img/notif.png" alt="" />
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
export default {
    name: "CoursesNavBar"
};
</script>
<style lang="scss">
@import "src/css/helpers/_mixins.scss";
@import "src/css/helpers/_variabels.scss";
@import "src/css/layout/_navbar.scss";
</style>
