<template>
  <div class="move">
    <div class="container-fluid">
      <div class="row">
        <div class="col-lg-4 col-sm-12">
          <div class="bord">
            <div class="row">
              <img class="money" src="~assets/img/money.png" alt="" />
              <div class="col-lg-7">
                <div class="price">
                  <img class="hrcooo" src="~assets/img/titleft.png" alt="" />
                  <h2>{{$t('الأرباح المستحقة')}}</h2>
                  <h3><span>SDG</span>1588</h3>
                  <div class="linke">
                    <h3>
                      {{$t('طلب سحب')}}
                      <img
                        class="mage"
                        src="~assets/img/Group 734.png"
                        alt=""
                      />
                    </h3>
                  </div>
                  <img class="hrColor" src="~assets/img/titleft.png" alt="" />
                </div>
              </div>
              <div class="col-lg-5">
                <div class="price right">
                  <h2>{{$t('منضم من خلالي')}}</h2>
                  <div class="box">
                    <h3>480</h3>
                    <span>{{$t('شخص')}}</span>
                  </div>
                </div>
              </div>
              <!--share linke-->
              <div class="col-lg-12">
                <div class="share">
                  <form>
                    <input type="text" value="stc.training/link/12568" />
                    <button><img src="~assets/img/copy.png" /></button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-8 col-sm-12">
          <div class="load">
            <img src="~assets/img/load.png" alt="" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "afilliateBord",

  data() {
    return {};
  },

  computed: {}
};
</script>
<style lang="scss"></style>
