<script setup>
import { FwbButton, FwbModal } from 'flowbite-vue'
import { useManageStore } from '../../../stores/manage.store'
import { Form, Field, ErrorMessage } from "vee-validate";
import { ref } from 'vue';
import * as yup from "yup";

const manageStore = useManageStore()

const emits = defineEmits(['submitFeedback'])

const feedback = ref('')
const formSchemaFeedback = yup.object().shape({
    feedback: yup.string().required("Phải có giá trị.").min(10, 'Tên phải ít nhất 10 ký tự.').max(250, "Tên có nhiều nhất 250 ký tự."),
})

const btnSubmit = async () => {
    emits('submitFeedback', feedback.value)
    feedback.value = ''
}
</script>

<template>
    <Form v-if="manageStore.isShow.refuse" @submit="btnSubmit" :validation-schema="formSchemaFeedback">
        <fwb-modal @close="manageStore.closeRefuseModal" :size="'xs'" :persistent="true">
            <template #header>
                <div class="flex items-center text-xl gap-2">
                    Phản hồi
                </div>
            </template>
            <template #body>
                <div class="w-full">
                    <Field name="feedback" id="feedback" as="textarea" class="w-full rounded-md"
                        placeholder="Nhập lý do khóa" v-model="feedback" rows="5" />
                    <ErrorMessage name="feedback" class="error" />
                </div>
            </template>
            <template #footer>
                <div class="flex justify-end gap-2">
                    <fwb-button color="blue">
                        Xác nhận
                    </fwb-button>
                    <fwb-button @click="manageStore.closeRefuseModal" color="red">
                        Hủy
                    </fwb-button>
                </div>
            </template>
        </fwb-modal>
    </Form>
</template>