<script setup>
import { FwbButton, FwbModal } from 'flowbite-vue'
import { useManageStore } from '../../../stores/manage.store'
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";
import { ref } from 'vue';

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
    <fwb-modal v-if="manageStore.isShow.refuse" @close="manageStore.closeRefuseModal" :size="'xs'" :persistent="true">
        <template #header>
            <div class="flex items-center text-xl gap-2">
                Phản hồi
            </div>
        </template>
        <template #body>
            <Form @submit="btnSubmit" :validation-schema="formSchemaFeedback">
                <div class="w-full">
                    <Field name="feedback" id="feedback" as="textarea" class="w-full rounded-md"
                        placeholder="Nhập lý do khóa" v-model="feedback" rows="5" />
                    <ErrorMessage name="feedback" class="error" />
                    <button type="submit" hidden id="btn-submit"></button>
                </div>
            </Form>
        </template>
        <template #footer>
            <div class="flex justify-end gap-2">
                <fwb-button @click="manageStore.closeRefuseModal" color="red">
                    Hủy
                </fwb-button>
                <label for="btn-submit" class="btn-submit">
                    Xác nhận
                </label>
            </div>
        </template>
    </fwb-modal>
</template>