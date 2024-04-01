<script setup>
import { FwbButton, FwbModal } from 'flowbite-vue'
import { useManageStore } from '../../../stores/manage.store'
import { ref, watch } from 'vue';
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";

const manageStore = useManageStore()

const props = defineProps(['user'])
const emits = defineEmits(['user'])

const feedback = ref('')
const time = ref(1)
const formSchemaFeedback = yup.object().shape({
    feedback: yup.string().required("Phải có giá trị.").min(10, 'Tên phải ít nhất 10 ký tự.').max(250, "Tên có nhiều nhất 250 ký tự."),
})

const sumitFeedback = () => {
    emits('user', { user: props.user, feedback: feedback.value, time: time.value })
    feedback.value = ''
    time.value = 1
}
</script>

<template>
    <Form v-if="manageStore.isShow.feedback" @submit="sumitFeedback" :validation-schema="formSchemaFeedback">
        <fwb-modal @close="manageStore.closeFeedbackModal" :persistent="true">
            <template #header>
                <div class="flex items-center text-xl gap-2">
                    Phản hồi
                </div>
            </template>
            <template #body>
                <div class="w-full">
                    <div class="flex gap-2 items-center">
                        <label for="studentId" class="label-custom">
                            MSSV:
                        </label>
                        <Field name="studentId" id="studentId" type="text" class="input-custom"
                            v-model="props.user.studentId" disabled />
                    </div>
                    <div class="mt-3">
                        <label for="time" class="label-custom">Thời gian khóa:</label>
                        <Field as="select" name="time" id="time" class="input-custom w-auto" v-model="time">
                            <option :value="1">1 ngày</option>
                            <option :value="7">7 ngày</option>
                            <option :value="14">14 ngày</option>
                            <option :value="30">30 ngày</option>
                            <option :value="-1">Vĩnh viễn</option>
                        </Field>
                        <ErrorMessage name="time" class="error" />
                        <label for="time" class="label-custom">Lý do khóa:</label>
                        <Field name="feedback" id="feedback" as="textarea" class="w-full rounded-md"
                            placeholder="Nhập lý do khóa" v-model="feedback" rows="5" />
                        <ErrorMessage name="feedback" class="error" />
                    </div>
                </div>
            </template>
            <template #footer>
                <div class="flex justify-end gap-2">
                    <fwb-button color="blue">
                        Khóa
                    </fwb-button>
                    <fwb-button @click="manageStore.closeFeedbackModal" color="red">
                        Hủy
                    </fwb-button>
                </div>
            </template>
        </fwb-modal>
    </Form>
</template>