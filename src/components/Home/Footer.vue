<template>
  <footer>
    <div class="copright">
      <h3>جميع الحقوق محفوظة لمنصة <span><img src="~assets/img/logo.png" alt=""></span> 2021&copy; </h3>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer',
  props: {
  }
}
</script>
<style lang="scss">
footer{
    padding: 20px 0;
    margin: 70px 0 0 0;
    background-color: #5666B9;
    .copright{
        text-align: center;
        h3{
            font-size: 17px;
            color: #fff;
            font-family: 'cairoR';
            margin: 0;
            img{
                width: 30px;
                height: 25px;
                margin: 0 5px 0 5px;
            }
        }
    }
}
</style>
