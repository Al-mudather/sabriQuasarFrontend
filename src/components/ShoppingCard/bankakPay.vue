<template>
    <div class="q-ma-lg">
        <div class="text-h6 text-center">إشعار بنكك</div>
        <file-upload
            imgeSize="4000000"
            :accept="'.png,.jpg, image/*'"
            label="شعار بنكك"
            v-on:File_Handler='paymentImageHandler'
        ></file-upload>
        <q-btn color="red" icon-right="send" label="إرسال" />
    </div>
</template>

<script>
import FileUpload from 'src/components/utils/FileUploader.vue'

export default {
    data() {
        return {
            visible: false
        };
    },
    components: { FileUpload },
    methods: {
        paymentImageHandler (val) {
            if (typeof val == 'object') {
                this.profile = this.courseData.profile
                this.courseData.profile = val
            } else {
                this.courseData.profile = val
            }
        }
    }
}
</script>

<style lang="scss">

.q-btn {
    &> span {
        margin-right: 0 !important;
        margin-left: 0 !important;
        &> span {
            margin-right: 0 !important;
            margin-left: 0 !important;
        }
    }
}

.q-icon {
    margin-left: 0 !important;
    margin-right: 0.3rem;

}
</style>
