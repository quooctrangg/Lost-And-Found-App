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
    <fwb-modal v-if="manageStore.isShow.feedback" @close="manageStore.closeFeedbackModal" :persistent="true">
        <template #header>
            <div class="flex items-center text-xl gap-2">
                Phản hồi
            </div>
        </template>
        <template #body>
            <Form @submit="sumitFeedback" :validation-schema="formSchemaFeedback">
                <div class="w-full">
                    <div class="flex gap-2 items-center">
                        <label for="email" class="label-custom">
                            Email:
                        </label>
                        <input type="email" maxlength="50" name="email" id="email" class="input-custom"
                            v-model="props.user.email" disabled>
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
                    <button type="submit" hidden id="btn-submit"></button>
                </div>
            </Form>
        </template>
        <template #footer>
            <div class="flex justify-end gap-2">
                <fwb-button @click="manageStore.closeFeedbackModal" color="alternative">
                    Hủy
                </fwb-button>
                <label for="btn-submit"
                    class="bg-green-500 rounded-lg text-sm px-5 py-3 text-center text-white font-semibold cursor-pointer hover:bg-green-600">
                    Khóa
                </label>
            </div>
        </template>
    </fwb-modal>
</template>