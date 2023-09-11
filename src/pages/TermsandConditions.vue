<template>
 <section class="profile q-mt-xl q-pa-sm">
    <div class="container">
      <div class="row">
        <div class="col-lg-12">
          <div class="privacy">
            <div class="titel">
              <img src="~assets/img/tit.png" alt="">
              <h3>{{ isEnglish ? 'Terms and Conditions' : 'الأحكام والشروط' }}</h3>
            </div>
            <div class="Conditions">
              <h3 class="condH">{{ isEnglish ? 'Important note' : 'ملاحظه مهمة' }}</h3>
              <p class="condP">
                {{
                  isEnglish
                  ?
                  `
                    Please read the following conditions carefully before using the educational platform.
                    By using the platform you are agree to all the terms and conditions and committed to be bound by them.
                    If you do not agree to any of the terms, please do not use the platform.
                  `
                  :
                  'يرجى قراءة الشروط التاليه جيدا قبل إستخدامك للمنصه التعليميه. حيث إستخدامك لها يعني قبولك لهذه الشروط و موافقتك على الإلتزام بها. في حالة عدم موافقتك يرجى عدم إستخدام المنصه.'
                }}
              </p>
            </div>

            <div class="uses">
              <h3 class="condH">{{ isEnglish ? 'Terms and conditions' : 'الأحكام والشروط' }}</h3>
              <p class="condP">
                {{ isEnglish ?
                  `
                  1) All rights of courses and advertisements on the platform are reserved to Dr. Sabri Abu Qarun Training Center.
                  `
                  :
                  `
                  1) جميع حقوق  الكورسات و الاعلانات بالمنصة محفوظة  لمركز د.صبري أبوقرون للتدريب.
                  `
                }}
              </p>
              <br>
              <p class="condP">
                {{ isEnglish ?
                  `
                  2) It is forbidden to circulate any lecture or part of a lecture by downloading from the platform and sending it to another person.
                  `
                  :
                  `
                  2) يمنع تداول أي محاضرة أو جزء من محاضرة بالتحميل  من المنصه و ارسالها لشخص آخر.
                  `
                }}
              </p>
              <br>
              <p class="condP">
                {{ isEnglish ?
                  `
                  3) It is prohibited to circulate any questions or part of the exams within the platform to any other person.
                  `
                  :
                  `
                  3) يمنع تداول أي اسئلة أو جزء منها من الامتحانات الموجودة داخل المنصة لأي شخص آخر .
                  `
                }}
              </p>
              <br>
              <p class="condP">
                {{ isEnglish ?
                  `
                  4) Fees are not refunded after completing the registration process and attaching payment invoice  on the platform.
                  `
                  :
                  `
                  4) لا تسترد الرسوم بعد اتمام عملية التسجيل وارفاق اشعار التوريد في المنصة.
                  `
                }}
              </p>
              <br>
              <p class="condP">
                {{ isEnglish ?
                  `
                  5) In the case of attaching the payment invoice, you must be ensured that the date of the transaction is clear in addition to the name of the recipient, the amount paid and the invoice number.
                  `
                  :
                  `
                  5) في حالة إرفاق فاتورة الدفع يجب التأكد من أن يكون تاريخ العمليه واضحا بإضافه إلى إسم المرسل إليه, المبلغ المدفوع و رقم الفاتوره .
                  `
                }}
              </p>
              <br>
              <p class="condP">
                {{ isEnglish ?
                  `
                  6) Do not share the account "e-mail" registered on the platform with anyone else.
                  `
                  :
                  `
                  6) عدم مشاركه الحساب "الايميل" المسجل بالمنصة مع أي شخص آخر .
                  `
                }}
              </p>
              <br>
              <p class="condP">
                {{ isEnglish ?
                  `
                  7) Lectures are available for the duration of the course plus half the course period (if the duration of a course is one month as an example, the material is available for a month and a half).
                  `
                  :
                  `
                  7) المحاضرات تكون متاحة طيلة فترة الكورس زائدا نصف فتره الكورس ( اذا كان الكورس مدته شهر تكون المادة متاحة شهر و نصف ) علي سبيل المثال .
                  `
                }}
              </p>
              <br>
              <p class="condP">
                {{ isEnglish ?
                  `
                  8) The course certificate is granted after attending more than 80% of the course content.
                  `
                  :
                  `
                  8) تمنح شهادة الكورسات بعد حضور اكثر من 80% من محتوي الكورس .
                  `
                }}
              </p>
              <br>
              <p class="condP">
                {{ isEnglish ?
                  `
                  9) The course registration request is accepted within 72 hours from the time of submitting the application.
                  `
                  :
                  `
                  9) يقبل طلب التسجيل في الكورس خلال 72 ساعه من  زمن رفع الطلب .
                  `
                }}
              </p>
              <br>
              <p class="condP">
                {{ isEnglish ?
                  `
                  10) The course content is available on the date specified for the start of the course.
                  `
                  :
                  `
                  10) يتوفر محتوي الكورس في التاريخ المحدد لبداية الكورس .
                  `
                }}
              </p>
              <br>
              <p class="condP">
                {{ isEnglish ?
                  `
                  11) The participant in a particular course is not entitled to change the account after completing the registration process for any reason, and the password for his account is not available anywhere within the platform..
                  `
                  :
                  `
                  11) لا يحق للمشترك في الكورس المعين تغيير البريد الالكتروني بعد اتمام عملية التسجيل لأي سبب و كلمة المرور الخاصه بالبريد الالكتروني للدخول خاصة بصاحب الحساب لا تتوفر في أي مكان  داخل المنصة.
                  `
                }}
              </p>
              <br>
              <p class="condP">
                {{ isEnglish ?
                  `
                  12) No payment invoice is accepted, except on the approved accounts number for the education platform. The approved account numbers (1952614 - 2571033).
                  `
                  :
                  `
                  12) لا يقبل أي اشعار توريد الا على الحسابات المعتمدة للمركز ارقام الحساب المعتمدة ( 1952614 - 2571033 )
                  `
                }}
              </p>
              <br>
              <p class="condP">
                {{ isEnglish ?
                  `
                  13) The payment invoice for the registration process of a course is not accepted,  unless the invoice contains all its details (operation number + date + amount + account number from which the amount was issued + account number to which the amount was supplied + writing the name in quadrant in the comment box inside the invoice).
                  `
                  :
                  `
                  13) لايقبل اشعار توريد لاتمام عملية التسجيل للكورس إلا إذا كان الاشعار يحتوي على كل تفاصيله ( رقم العمليه + التاريخ + المبلغ + رقم الحساب الصادر منه المبلغ + رقم الحساب المورد إليه المبلغ + كتابه الاسم رباعي في خانة التعليق داخل الاشعار).
                  `
                }}
              </p>
              <br>
              <p class="condP">
                {{ isEnglish ?
                  `
                  14) The certificate is issued for the courses with the name entered by the user, and any attempt to mendment the certificate name after the certificate is issued by the platform entails additional procedures and fees.
                  `
                  :
                  `
                  14)  تصدر الشهادة للدورات بالاسم المدخل من قبل الطالب وأي تعديل بعد صدور الشهادة من قبل المنصه تترتب عليه اجراءات و رسوم إضافية .
                  `
                }}
              </p>
              <br>
              <p class="condP">
                {{ isEnglish ?
                  `
                  15) Violation of any of the aforementioned terms, exposes the account holder on the platform to legal accountability.
                  `
                  :
                  `
                  15) مخالفة أي من البنود المذكورة تعرض صاحب الحساب في المنصه للمساءلة القانونية .
                  `
                }}
              </p>
            </div>
          </div>
      </div>
      </div>
    </div>
  </section>
</template>

<script>
import {mapState} from 'vuex'

export default {
  name: 'Privacy',
  data () {
    return {
    }
  },

  computed: {
    ...mapState('settings', ['isEnglish'])
  }
}
</script>
<style lang="scss">
@import "src/assets/css/sass/helpers/_variabels.scss";
@import "src/assets/css/sass/helpers/_mixins.scss";

.profile {
    .titel {
        img {
            opacity: 1;
        }
        h3 {
            font-family: "cairoB";
            font-size: 18px;
            color: #787878;
            margin: -29px 18px 39px 0;
        }
    }
    .cn-pay {
        padding: 0 10.1%;
        display: block;
        /*--box-pay--*/
        .box-pay {
            margin: 0 0 30px 0;
            .inv {
                text-align: center;
                .box {
                    border: 1px solid #ddd;
                    border-radius: 62px;
                    max-width: 80%;
                    display: block;
                    height: 40px;
                    padding: 5px 0 0 0;
                    margin: 0 auto 12px auto;

                    h2 {
                        display: inline-block;
                        font-family: "cairoR";
                        font-size: 15px;
                        color: #7b86fa;
                        span {
                            color: #fcd462;
                        }
                    }
                    img {
                        display: inline-block;
                        width: 30px;
                        margin: -9px 0 0 0;
                    }
                    svg {
                        display: none;
                        width: 46px;
                        margin: -11px 0 0 0;
                    }
                }
                .detaii {
                    border-radius: 62px;
                    max-width: 80%;
                    display: block;
                    height: 45px;
                    padding: 11px 0 0 0;
                    background-color: #7b86fa;
                    position: relative;
                    top: -6px;
                    text-align: center;
                    margin: 0 auto;
                    a{
                        display: block;
                        font-family: "cairoR";
                        font-size: 15px;
                        color: #fff;
                        text-decoration: none;
                    }
                    svg {
                        margin: 0 0 0 0;
                    }
                }
            }
            .data {
                text-align: center;
                background: #fff;
                box-shadow: 4px 8px 9px #e5e4e4;
                padding: 53px 0;
                height: 237px;
                border-radius: 32px;
                img {
                    width: 70px;
                    text-align: center;
                    margin: 0 0 12px 0;
                }
                h2 {
                    font-family: "cairoR";
                    font-size: 19px;
                    color: #32ba7c;
                    margin: 0 0 10px 0;
                }
                p {
                    font-family: "cairoR";
                    font-size: 16px;
                    color: #313131;
                }
            }
        }
        /*--box-done--*/
        .box-done {
            .inv {
                opacity: 1;
                .box {
                    opacity: 1;
                    h2 {
                        opacity: 1;
                        span {
                            opacity: 1;
                        }
                    }
                    img {
                        opacity: 1;
                    }
                }
                svg {
                   opacity: 1;
                }
            }
            .data {
                opacity: 1;
                img {
                    opacity: 1;
                }
                h2 {
                    opacity: 1;
                }
                p {
  opacity: 1;
                }
            }
        }
        /*--box-wait--*/
        .box-wait {
            .inv {
                opacity: 1;
                .box {
                    opacity: 1;
                    h2 {
                        opacity: 1;
                        span {
                            opacity: 1;
                        }
                    }
                    img {
                        opacity: 1;
                    }
                }
                svg {
                   opacity: 1;
                }
            }
            .data {
                opacity: 1;
                img {
                    opacity: 1;
                }
                h2 {
                    color: #7b86fa;
                }
                p {
                    opacity: 1;
                }
            }
        }
        /*--box-unacceptable--*/
        .box-unacceptable {
            .inv {
                opacity: 1;
                .box {
                    opacity: 1;
                    h2 {
                        opacity: 1;
                        span {
                            opacity: 1;
                        }
                    }
                    img {
                        opacity: 1;
                    }
                }
                svg {
                   opacity: 1;
                }
            }
            .data {
                opacity: 1;
                img {
                    opacity: 1;
                }
                h2 {
                    color: #ff5f5a;
                }
                p {
                    opacity: 1;
                }
            }
        }
        /*--pending-request--*/
        .pending-request {
            opacity: 1;
            .inv {
                opacity: 1;
                .box {
                    opacity: 1;
                    h2 {
                        opacity: 1;
                        span {
                            opacity: 1;
                        }
                    }
                    img {
                        opacity: 1;
                    }
                }
                svg {
                   opacity: 1;
                }
            }
            .data {
                padding: 24px 0 0 0;
                img {
                    width: 35px;
                }
                h2 {
                    color: #dc8638;
                    display: inline-block;
                    margin: 0 5px 0 0
                }
                .money {
                    background: #D97A22;
                    max-width: 201px;
                    margin: 27px auto 0 auto;
                    border-radius: 30px;
                    padding: 10px 0 10px 0;
                    h3 {
                        display: inline-block;
                        font-family: "cairoB";
                        font-size: 15px;
                        color: #fff;
                        margin: 0 -17px 10px 0;
                    }
                    .price {
                        display: inline-block;
                        background: #FCD462;
                        border-radius: 37px;
                        float: left;
                        position: relative;
                        left: 6px;
                        top: -2px;
                        h4 {
                            font-size: 15px;
                            font-family: "cairoB";
                            padding: 8px 15px 0 15px;
                            color: #787878;
                            span {
                                color: #fff;
                                margin: 0 0 0 6px;
                            }
                        }
                    }
                }
                .viewpay {
                    opacity: 1;
                    .box {
                        max-width: 180px;
                        margin: 0 auto;
                        background: #fad25e;
                        padding: 9px 0 9px 0;
                        border-radius: 34px;
                        cursor: pointer;
                        img {
                            opacity: 1;
                        }
                        h2 {
                            color: #787878;
                            display: inline-block;
                            margin: 0 5px 0 0;
                            font-size: 18px;
                        }
                    }
                    svg {
                        width: 80px;
                        position: relative;
                        top: 1px;
                    }
                }
            }
        }
    }
    .msPay{
        display: none;
        margin: 0 auto;
        text-align: center;
        h3{
            font-size: 19px;
            font-family: 'cairoR';
            color: #7B7B7B;
            margin: 35px 0 0 0;
        }
    }
    .cer{
        background-color: #3A54A1;
        width: 841px;
        height: 595px;
        margin: 0 auto 30px auto;
        padding: 20px;
        position: relative;
        overflow: hidden;
        .backg{
            position: absolute;
            top: 0;
            z-index: 4;
        }
        .boodW{
            background-color: #fff;
            padding: 25px;
            height: 555px;
            position: relative;
            svg{
                position:absolute;
                top: 0;
                left: 0;
                right: 0;
            }
            .heddd{
                margin: 0 0 0 0;
                text-align: center;
                position: relative;
                z-index: 5;
                .left{
                    float: right;
                    margin: -9px 0 0 0;
                }
                .right{
                    float: left;
                }
                span{
                    font-size: 16px;
                    color: #5D5D5D;
                    font-family: 'segoR';
                }
                h2{
                    font-size: 26px;
                    color: #2F2F2F;
                    font-family: 'segoI';
                }
                img{
                    margin: 10px 0 0 0;
                }
            }
            .name{
                text-align: center;
                position: relative;
                margin: 7px 0 0 0;
                z-index: 5;
                h3{
                    font-size: 30px;
                    color: #1A1818;
                    font-family: 'segoB';
                }
                svg{
                    position: absolute;
                    left: 0;
                    right: 0;
                    top: 39px;
                    margin: 0 auto;
                }
                span{
                    font-size: 16px;
                    color: #5D5D5D;
                    font-family: 'segoI';
                    display: block;
                    margin: 15px 0 0 0;
                }
                h4{
                    color: #1A1818;
                    font-size: 26px;
                    font-family: 'segosR';
                    margin: 12px 0 0 0;
                }
            }
            .detaills{
                margin: 20px 0 0 0;
                padding: 0 109px 0 109px;
                .hours{
                    position: relative;
                    z-index: 5;
                    text-align: left;
                    width: 146px;
                    display: inline-block;
                    span{
                        font-size: 16px;
                        color: #5D5D5D;
                        font-family: 'segoI';
                    }
                    h3{
                        display: inline-block;
                        font-family: 'segosB';
                        font-size: 23px;
                        color: #1A1818;
                        span{
                            display: inline-block;
                            color: #1A1818;
                            margin-left: 11px;
                        }
                    }
                }
                .date{
                    position: relative;
                    z-index: 5;
                    text-align: left;
                    width: 382px;
                    display: inline-block;
                    h4{
                        font-size: 16px;
                        color: #5D5D5D;
                        font-family: 'segoI';
                    }
                    h3{
                        display: inline-block;
                        font-family: 'segoB';
                        color: #1A1818;
                        font-size: 18px;
                        margin-right: 10px;
                    }
                    span{
                        font-size: 16px;
                        color: #5D5D5D;
                        font-family: 'segoI';
                        display: inline-block;
                        margin-right: 10px;
                    }
                }
            }
            .ended{
                position: relative;
                z-index: 5;
                margin: 10px 0 0 0;
                ul{
                    li{
                        list-style: none;
                        display: inline-block;
                        margin-right: 38px;
                        margin-left: 35px;
                        text-align: left;
                        span{
                            color: #1A1818;
                            font-family: 'segoI';
                            font-size: 17px;
                        }
                        h3{
                            font-size: 15px;
                            color: #5D5D5D;
                            font-family: 'segoI';
                        }
                    }
                }
            }
            .number{
                position: relative;
                z-index: 5;
                margin: -6px 0 0 0;
                ul{
                    li{
                        list-style: none;
                        display: inline-block;
                        margin-right: 34px;
                        margin-left: 2px;
                        h3{
                            display: inline-block;
                            font-size: 13px;
                            color: #5D5D5D;
                            font-family: 'segoI';
                            span{
                                font-size: 16px;
                                display: inline-block;
                                color: #5D5D5D;
                                font-family: 'segoI';
                            }
                        }
                    }
                }
            }
        }
    }


    .downlodd{
        margin: 0 auto 40px auto;
        text-align: center;
        button{
            font-size: 16px;
            color: #fff;
            font-family: 'cairoR';
            background-color: #7B86FA;
            width: 183px;
            height: 46px;
            transition: all ease-in-out .4s;
            outline: 0;
            &:hover{
                background-color: #fad25e;
                color: #1A1818;
            }
        }
    }


    /*الاسئلة الشائعــــــة*/
    .faq{
        max-width: 726px;
        margin: 0 auto;
        .accord{
            padding: 0 10px 0 10px;
            .card{
                margin: 0 0 10px 0;
                border: 0;
                .card-header{
                    background-color: #7B86FA;
                    border-bottom:2px solid #F2F2F2;
                    padding: 0;
                    a{
                        color: #fff;
                        font-size: 16px;
                        font-family: 'cairoR';
                        cursor: pointer;
                        //maxMobile
                        @media(max-width:767px){
                            font-size: 15px;
                        }
                        .linke{
                            background-color: #6D76D8;
                            width: 49px;
                            height: 52px;
                            display: inline-block;
                            text-align: center;
                            margin:0 -20px 0 9px;
                            line-height:3;
                        }
                    }
                }
                .collapse{
                    .card-body{
                        background-color: #fff;
                        p{
                            font-size: 16px;
                            color: #5D5D5D;
                            font-family: 'cairoR';
                        }
                    }
                }
            }
        }
    }

    /* سياســة الخصوصيــة*/

    .privacy{

        .Conditions{
            margin-bottom: 40px;
            .condH{
                color: #fff;
                font-family: 'cairoB';
                font-size:18px;
                padding: 10px;
                background-color: #7B86FA;
                margin-bottom: 20px;
            }
            .condP{
                font-family: 'cairoR';
                font-size: 16px;
                color: $textColor;
                margin: 0;
            }
        }

        .uses{
            .condH{
                color: #fff;
                font-family: 'cairoB';
                font-size:18px;
                padding: 10px;
                background-color: #7B86FA;
                margin-bottom: 20px;
            }
            .condP{
                font-family: 'cairoR';
                font-size: 16px;
                color: $textColor;
                margin: 0;
            }
        }
    }
}
</style>
