<template>
    <section class="web">
       <div class="certificate-box">
           <div class="container">
               <div class="row">
                   <div class="col-lg-12">
                        <div class="tittel">
                            <a href="#">
                                <h3>طلب شهادة جديدة</h3>
                            </a>
                        </div>
                        <div class="courc">
                            <h3>شهادتـــي</h3>
                            <div class="tabl">
                                <h3>الكورس التأهيلي لطلاب الشهادة السودانية</h3>
                                <div class="butt">
                                    <button class="">تحميـل <img src="img/download.png" alt=""></button>
                                    <button class="blue">عـرض <img src="img/eyess.png" alt=""></button>
                                </div>
                            </div>
                            <div class="tabl">
                                <h3>الكورس التأهيلي لطلاب الشهادة السودانية</h3>
                                <div class="butt">
                                    <button>تحميـل <img src="img/download.png" alt=""></button>
                                    <button class="blue">عـرض <img src="img/eyess.png" alt=""></button>
                                </div>
                            </div>
                            <div class="tabl">
                                <h3>الكورس التأهيلي لطلاب الشهادة السودانية</h3>
                                <div class="butt">
                                    <button>تحميـل <img src="img/download.png" alt=""></button>
                                    <button class="blue">عـرض <img src="img/eyess.png" alt=""></button>
                                </div>
                            </div>
                        </div>
                   </div>
               </div>
           </div>
        </div>
    </section>
</template>

<script>

export default {
    name: 'CertificatePage',
    data () {
        return {
        }
    },
 
	components: {
	},

    apollo: {
    //   myAttachmentTransactions: {
    //     query () {
    //         return MyAttachmentTransactions
    //     },
    //     result (result) {
    //         if (!result.loading) {
    //         this.myTransactionsOrders = result.data.myAttachmentTransactions
    //         }
    //     }
    //     }
    }
}
</script>

<style lang="scss">
@import "src/css/helpers/_mixins.scss";
@import "src/css/helpers/_variabels.scss";

.certificate-box {
  width: 841px;
  height: 595px;
  position: relative;
  margin: 43px auto 68px auto;
}

.certificate-box .tittel {
  position: absolute;
  top: -23px;
  left: 0;
  z-index: 2;
}

.certificate-box .tittel a {
  text-decoration: none;
}

.certificate-box .tittel a h3 {
  font-family: 'cairoR';
  font-size: 18px;
  background: #7b86fa;
  padding: 10px 8px;
  width: 200px;
  text-align: center;
  border-radius: 22px;
  color: #fff;
}

.certificate-box .courc {
  position: relative;
  padding: 42px 10px 20px 10px;
  border: 1px solid #cccccc3d;
  border-radius: 8px;
}

.certificate-box .courc h3 {
  margin: -13px 0 26px 0;
  font-size: 18px;
  font-family: 'cairoB';
  color: #7b7b7b;
}

.certificate-box .courc .tabl {
  background-color: #fff;
  padding: 10px;
  border-radius: 15px;
  margin: 20px 0 20px 0;
  -webkit-box-shadow: 0px 3px 20px #eae8e878;
          box-shadow: 0px 3px 20px #eae8e878;
  margin: 5px 0 20px 0;
}

.certificate-box .courc .tabl h3 {
  font-size: 18px;
  display: inline-block;
  font-family: 'cairoR';
  color: #7B7B7B;
  width: 398px;
  margin: 0;
  line-height: 1.8;
}

.certificate-box .courc .tabl .butt {
  display: block;
  float: left;
}

.certificate-box .courc .tabl .butt button {
  position: relative;
  display: inline-block;
  color: #fff;
  background-color: #FCC74C;
  font-size: 14px;
  font-family: 'cairoR';
  height: 34px;
  width: 85px;
  top: 0;
  right: 0;
  left: 0;
}

.certificate-box .courc .tabl .butt button img {
  margin-right: 5px;
}

.certificate-box .courc .tabl .butt .blue {
  background-color: #7B86FA;
}

.certificate-box button {
  color: #fff;
  background-color: #7B86FA;
  font-size: 16px;
  font-family: 'cairoR';
  height: 47px;
  width: 187px;
  position: absolute;
  bottom: -48px;
  margin: 0 auto;
  text-align: center;
  right: 0;
  left: 0;
}

/*--- start popup form ---*/
.popCurr {
  display: block;
  position: fixed;
  width: 100%;
  height: 100vh;
  background: #fcd462ab;
  top: 0;
  right: 0;
  text-align: center;
  z-index: 999;
}

.popCurr .clos {
  position: relative;
  margin: 0 auto;
  height: 52px;
  width: 38px;
  cursor: pointer;
}

.popCurr .clos svg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
}

.popCurr .clos img {
  position: absolute;
  width: auto;
  top: 24px;
  right: 11px;
}

.popCurr .cn {
  max-width: 400px;
  margin: 68px auto 50px auto;
  padding: 23px 20px 23px 20px;
  opacity: 1;
  background-color: #fff;
  border-radius: 20px;
}

.popCurr .cn form {
  margin: 10px 0 10px 0;
}

.popCurr .cn form .inp {
  position: relative;
  margin: 0 0 15px 0;
}

.popCurr .cn form .inp img {
  position: absolute;
  top: 22px;
  right: 12px;
}

.popCurr .cn form .form-select {
  width: 100%;
  height: 52px;
  border: 1px solid #E1E1E1;
  border-radius: 100px;
  color: #767676;
  padding: 7px;
}

.popCurr .cn form button {
  width: 139px;
  height: 42px;
  background-color: #7B86FA;
  color: #fff;
  margin: 17px 0 0 0;
  font-size: 16px;
  -webkit-transition: all ease-in .3s;
  transition: all ease-in .3s;
  outline: 0;
}

.popCurr .cn form button:hover {
  background-color: #FCC74C;
  color: #7B7B7B;
}

</style>