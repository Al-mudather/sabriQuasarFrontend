<template>
  <section class="shoppgCart showcart">
        <svg class="backgroun" xmlns="http://www.w3.org/2000/svg" width="89.315" height="87.309" viewBox="0 0 89.315 87.309">
          <path id="Path_460" data-name="Path 460" d="M80.426-72.274V0c-5.385-4.158-13.32-7.672-24.842-7.924a45.312,45.312,0,0,0-12.7,1.45,31.586,31.586,0,0,1-7.9,1.005h-4.1A30.884,30.884,0,0,1,0-36.353v0A30.884,30.884,0,0,1,30.884-67.239h4.1a30.923,30.923,0,0,1,8,1.047,46.05,46.05,0,0,0,13.588,1.524C64.273-64.975,73.583-66.693,80.426-72.274Zm8.889-11.259h-1.1a30.409,30.409,0,0,0,1.034-3.776Z" transform="translate(0 87.309)" fill="#fcc74c" fill-rule="evenodd"/>
        </svg>
        <div class="cart" @click="OpenShoppingCartSection">
            <!--notifation-->
            <div v-show="!lodash.isEmpty(shoppingCartDataList)" class="notifc"> 
                <span>{{lodash.size(shoppingCartDataList)}}</span>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="45.206" height="40.979" viewBox="0 0 45.206 40.979">
              <g id="Group_280" data-name="Group 280" transform="translate(-1295.238 -118.414)">
                <path id="Path_461" data-name="Path 461" d="M44.579-51.788a17.729,17.729,0,0,1,1.893,1.436.508.508,0,0,0,.709-.042.488.488,0,0,0-.043-.7,18.715,18.715,0,0,0-2-1.517.507.507,0,0,0-.7.136A.489.489,0,0,0,44.579-51.788Z" transform="translate(1287 172.619)" fill="#fafafa" fill-rule="evenodd"/>
                <path id="Path_462" data-name="Path 462" d="M48.1-48.743a17.136,17.136,0,0,1,4.344,11.4,17.057,17.057,0,0,1-1.11,6.07,17.158,17.158,0,0,1-1.16,2.449.489.489,0,0,0,.19.672.507.507,0,0,0,.684-.187,18.147,18.147,0,0,0,1.226-2.589,18.027,18.027,0,0,0,1.174-6.415,18.11,18.11,0,0,0-4.591-12.052.508.508,0,0,0-.708-.048A.488.488,0,0,0,48.1-48.743Z" transform="translate(1287 172.619)" fill="#fafafa" fill-rule="evenodd"/>
                <path id="Path_463" data-name="Path 463" d="M42.845-20.95a.919.919,0,0,0-.426-.774.919.919,0,0,0-.881-.058,17.13,17.13,0,0,1-2.079.8,2.826,2.826,0,0,0-2.024,2.7h-.023a3.193,3.193,0,0,1-3.22,3.166h0a3.193,3.193,0,0,1-3.22-3.166h0A2.848,2.848,0,0,0,28.931-21h0a1.071,1.071,0,0,0-.942.152,1.032,1.032,0,0,0-.432.837v3.994a1.859,1.859,0,0,1-1.875,1.843,1.859,1.859,0,0,1-1.875-1.843v-6.74a1.712,1.712,0,0,0-.637-1.328h0a.379.379,0,0,0-.4-.049.368.368,0,0,0-.215.333c0,.648,0,1.452,0,1.452a1.477,1.477,0,0,1-1.49,1.464h0a1.477,1.477,0,0,1-1.49-1.464v-.9a20.743,20.743,0,0,0-1.5-7.733,16.642,16.642,0,0,1-1.195-6.213A17.171,17.171,0,0,1,34.192-54.2,17.171,17.171,0,0,1,51.5-37.189a16.717,16.717,0,0,1-2.606,8.979,13.7,13.7,0,0,0-2.083,7.261h-.022a1.921,1.921,0,0,1-.577,1.37,1.988,1.988,0,0,1-1.394.567h0a1.988,1.988,0,0,1-1.394-.567,1.921,1.921,0,0,1-.577-1.37Z" transform="translate(1287 172.619)" fill="#fff" fill-rule="evenodd"/>
                <path id="Path_464" data-name="Path 464" d="M17.948-28.687A22.354,22.354,0,0,0,17.164-31a16.99,16.99,0,0,1-1.219-6.342,17.145,17.145,0,0,1,.366-3.532.494.494,0,0,0-.39-.583.5.5,0,0,0-.593.383,18.113,18.113,0,0,0-.387,3.732,17.96,17.96,0,0,0,1.29,6.7,21.369,21.369,0,0,1,.75,2.209.5.5,0,0,0,.617.345A.493.493,0,0,0,17.948-28.687Z" transform="translate(1287 172.619)" fill="#fafafa" fill-rule="evenodd"/>
                <path id="Path_465" data-name="Path 465" d="M46.787-15.7a1.97,1.97,0,0,0-1.97-1.97h0a1.97,1.97,0,0,0-1.97,1.97v.5a1.97,1.97,0,0,0,1.97,1.97h0a1.97,1.97,0,0,0,1.97-1.97Z" transform="translate(1287 172.619)" fill="#fff" fill-rule="evenodd"/>
                <path id="Path_466" data-name="Path 466" d="M8.742-45.554l3.271,1.576a1.5,1.5,0,0,1,.842,1.585c-.4,2.42-.839,6.824.115,10.064a.9.9,0,0,0,1.117.6.885.885,0,0,0,.615-1.1c-.881-2.99-.434-7.055-.066-9.3a3.273,3.273,0,0,0-1.83-3.452L9.536-47.146a.909.909,0,0,0-1.206.406A.88.88,0,0,0,8.742-45.554Z" transform="translate(1287 172.619)" fill="#fff" fill-rule="evenodd"/>
              </g>
            </svg>
            <h3>{{$t('السلة')}}</h3>
        </div>
    </section>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  name: 'ShoppingCart',
  data () {
    return {
      lodash: this.$_
    }
  },
  props: {
  },

  computed: {
    ...mapState('shoppingCart', ['shoppingCartDataList'])
  },

  methods: {
    ...mapActions('shoppingCart', ['setShoppinCartDialogAction']),

    OpenShoppingCartSection () {
      this.$router.push({ name: 'cart' })
    }
  }
}
</script>
