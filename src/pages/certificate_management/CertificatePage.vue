<template>
    <section class="web">
       <div class="certificate-box">
           <div class="container">
               <div class="row">
                   <div class="col-lg-12 col-sm-7 col-md-12 col-xs-6">
                      <div class="courc">
                        <h3>شهادتـــي</h3>
                        <div class="tabl" v-for="certificate in myCertificate.edges" :key="certificate.node.pk">
                          <h3>{{ $_.get(certificate, '[node][enrollment][course][title]')  || $_.get(certificate, '[node][batch][courseName]') }}</h3>
                          <h3>{{ FORMAT_DATE( $_.get(certificate, '[node][created]') ) }}</h3>
                          <div class="butt">
                            <q-spinner-clock
                              color="primary"
                              size="2em"
                              v-if="loading"
                            />
                            <button v-else @click="DOWNLOAD_MY_CERTIFICATE(certificate)" class="">تحميـل <img src="img/download.png" alt=""></button>
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
import axios from 'axios'
// const FileDownload = require('js-file-download');
import {AllCertificates} from 'src/queries/certificatesManagement/query/GetAllCertificates.js'
import { mapGetters } from "vuex";
import { exportFile  } from 'quasar'

const moment = require('moment')


export default {
    name: 'CertificatePage',
    data () {
      return {
        loading: false,
        myCertificate: []
      }
    },

	components: {
	},

  computed: {
    ...mapGetters("authentication", ["user", "token"]),
  },

  apollo: {
    allCertificates: {
      query () {
        return AllCertificates
      },
      variables () {
        return {
          'filters': JSON.stringify({
            // 'enrollment__user__id': this.user.pk
            'user__id': this.user.pk
          })
        }
      },

      update (data) {
        this.myCertificate = data.allCertificates
        console.log('dddddddddddddddddddddd')
        console.log( this.myCertificate )
        console.log('dddddddddddddddddddddd')
      }
    }
  },

  methods: {

    FORMAT_DATE (date) {
      if (date) return moment(date).format('YYYY-MM-DD HH:mm:ss')
      return 'Not Defined'
    },

    async DOWNLOAD_MY_CERTIFICATE (certificate) {

      if (this.user.certificateName) {
        this.loading = true
        try {
          const res = await axios(
            {
              method: 'GET',
              // url: `http://localhost:8000/api/enrollment/certificate/download/${certificate.node.pk}`,
              url: `${location.origin}/api/enrollment/certificate/download/${certificate.node.pk}`,
              responseType: 'arraybuffer',
              // responseType: 'blob',
              headers: {
                'Authorization': `JWT ${this.token}`,
                'Content-Type': 'application/json',
              }
            }
          )

          if (res.data) {
            // openURL(res.config.url)
            const fileName = `${this.$_.get(certificate, '[node][enrollment][course][title]') || this.$_.get(certificate, '[node][batch][courseName]') }-${this.user.username}.pdf`

            // const status = exportFile(fileName,res.data, 'utf8')
            exportFile(fileName,res.data, {
              encoding: 'windows-1252',
              mimeType: 'text/csv;charset=windows-1252;'
            })

            this.loading = false
          } else {
            this.loading = false
          }
        } catch (error) {
          this.loading = false
        }

      } else {
        //TODO: Start the loading
        this.$q.notify({
          type: 'warning',
          progress: true,
          multiLine: true,
          position: 'top',
          message: "يجب تعيين إسم شهادة التدريب"
        })
        this.$router.push({ name: "user-profile" });
      }

    }
  }
}
</script>

<style lang="scss">
@import "src/css/helpers/_mixins.scss";
@import "src/css/helpers/_variabels.scss";

.certificate-box {
  width: 841px;
  min-height: 595px;
  position: relative;
  margin: 43px auto 68px auto;

  @include respond(phone) { // width < 900?
    width: 780px;
  }
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
  width: max-content;
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

  @include respond(phone) { // width < 900?
    width: 230px;
  }
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
