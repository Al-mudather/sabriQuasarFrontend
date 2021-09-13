<template>
    <div class="msPayment">
        <div class="text-center text-h6 text-weight-regular">
            ادخل معلوماتك الشخصيه
        </div>   
        <div class="details q-mt-md">
            <form>
                <div class="row">
                    <div class="col-lg-12 col-xs-12">
                        <div class="">
                            <q-input
                                rounded
                                outlined
                                v-model="fullName"
                                hint="Enter your Name in english"
                                label="Full Name"
                                :rules="[
                                    val => !!val || '* Required',
                                ]"
                            />
                        </div>
                    </div>
                    <div class="col-lg-12 col-xs-12 ">
                        <div class="">
                            <q-input
                                rounded
                                outlined
                                :label="whatsAppLabel"
                                mask="################"
                                v-model="whatsAppNumber"
                            />
                        </div>
                    </div>
                    <div class="col-lg-12 col-xs-12 ">
                        <div class="">
                            <q-input
                                rounded 
                                outlined 
                                v-model="telegramNumber" 
                                :label="telegramLabel"
                                mask="################"
                            />
                        </div>
                    </div>
                </div>
                <div class="but" @click="UPDATE_THE_USER_PROFILE($event)">
                    <h3><img src="~assets/img/payment.png" alt="">{{ $t('حفظ و الدهاب الى صفحة البيع') }}</h3>
                </div>
                <q-inner-loading :showing="visible">
                    <q-spinner-hourglass size="70px" />
                </q-inner-loading>
            </form>
        </div>
    </div>
</template>

<script>
import { UpdateUserProfile } from "src/queries/account_management/mutation/UpdateUserProfile";
import { GetMyProfileData } from "src/queries/account_management/query/GetMyProfileData";

export default {
    name:  "userInformation",

    data () {
        return {
            fullName: null,
            whatsAppNumber: null,
            whatsAppLabel: this.$t('رقم الواتساب اذا وجد'),
            telegramLabel: this.$t('رقم التلجرام اذا وجد'),
            telegramNumber: null,
            visible: false,
        }
    },

    async created () {
        //TODO: Get my personal data
       const res = await this.$apollo.query({ 
                query: GetMyProfileData
            })

        if (res.data.me.pk) {
            //TODO: IF the data exists go to payment page
            if (res.data.me.fullName && (res.data.me.phoneNumber2 || res.data.me.phoneNumber3) ) {
                this.$router.push({ name: 'payment' })
            } else {
                this.fullName = res.data.me.fullName
                this.whatsAppNumber = res.data.me.phoneNumber2
                this.telegramNumber = res.data.me.phoneNumber3
            }
        }
    },

    methods: {
        errorHandler(errorsObj) {
            if (typeof errorsObj == 'object') {
                for (const key of Object.keys(errorsObj))
                    for (const val of errorsObj[key] ) {
                        console.log( val)
                        if (typeof val.message == 'object') {
                            this.$q.notify({
                                type: 'warning',
                                progress: true,
                                multiLine: true,
                                position: 'top',
                                message: val.message.msg
                            })
                        } else {
                            this.$q.notify({
                                type: 'warning',
                                progress: true,
                                multiLine: true,
                                position: 'top',
                                message: ` ${val.message} : ${key}`
                            })
                        }
                    }
            } else {
                for (const val in errorsObj) {
                    if (typeof val.message == 'object') {
                        this.$q.notify({
                            type: 'warning',
                            progress: true,
                            multiLine: true,
                            position: 'top',
                            message: val.message.msg
                        })
                    } else {
                        this.$q.notify({
                            type: 'warning',
                            progress: true,
                            multiLine: true,
                            position: 'top',
                            message: val.message
                        })
                    }
                }
            }
        },

        async UPDATE_THE_USER_PROFILE(e) {

            e.preventDefault();
            //////////////////////////////
            // TODO: Update the user data
            //////////////////////////////
            this.visible = true
            try {
                if (this.fullName && (this.whatsAppNumber || this.telegramNumber)) {
                    //TODO: Make the updation
                    const res = await this.$apollo
                        .mutate({ 
                            mutation: UpdateUserProfile,
                            variables: {
                                fullName: this.fullName,
                                phoneNumber2: this.whatsAppNumber,
                                phoneNumber3: this.telegramNumber
                            }
                        })
                    //TODO: Get the success result
                    const success = res.data.updateAccount.success
                    //TODO: Get the errors result
                    const errors = res.data.updateAccount.errors
    
                    if (success) {
                        this.visible = false
                        this.$q.notify({
                            type: "positive",
                            multiLine: true,
                            progress: true,
                            message: "Great the data wase updated"
                        }) 
                        this.$router.push({ name: 'payment' })
                    }
    
                    if (errors) {
                        this.visible = false
                        this.errorHandler(errors);
                    }
                } else {
                    this.$q.notify({
                        type: "positive",
                        multiLine: true,
                        progress: true,
                        message: "يجب ان تكمل بياناتك لكي نستطيع التواصل معك"
                    }) 
                }

            } catch {
                this.visible = false
            }
        },
    }
}
</script>

<style lang="scss">
.q-field__label {
    margin-left: 1rem;
}

.q-field {
    margin-right: 0rem;
    direction: initial;
}

.q-field__native {
    margin-right: 2rem;
}
</style>
