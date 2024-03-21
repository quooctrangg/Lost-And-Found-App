<script setup>
import { FwbButton, FwbModal } from 'flowbite-vue'
import { useManageStore } from '../../../stores/manage.store'
import { useSchoolStore } from '../../../stores/school.store'
import { useMajorStore } from '../../../stores/major.store'
import { useToast } from 'vue-toast-notification'
import { onMounted, ref, watchEffect } from 'vue';
import Loading from '../../common/Loading.vue';
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";

const props = defineProps(['major'])

const manageStore = useManageStore()
const schoolStore = useSchoolStore()
const majorStore = useMajorStore()
const $toast = useToast()

const name = ref('')
const schoolId = ref(null)
const trainingDuration = ref(4.5)
const formSchemaMajor = yup.object().shape({
    name: yup.string().required('Tên phải có giá trị.').min(1, 'Tên phải ít nhất 1 ký tự.').max(50, "Tên có nhiều nhất 50 ký tự."),
    schoolId: yup.string().required('Yêu cầu chọn trường / khoa.'),
    trainingDuration: yup.number().min(1, 'Thời gian đào tạo ít nhất 1 năm.').max(10, 'Thời gian đào tạo nhiều nhất 10 năm.')
})

const updateMajor = async () => {
    await majorStore.updateMajor(props.major?.id, { name: name.value, schoolId: schoolId.value, trainingDuration: trainingDuration.value })
    if (majorStore.err) {
        $toast.error(majorStore.err, { position: 'top-right' })
        return
    }
    $toast.success(majorStore.result.message, { position: 'top-right' })
    await majorStore.getAlls({ key: majorStore.key, page: majorStore.currentPage })
    manageStore.closeEditMajorModal()
}

watchEffect(async () => {
    if (props.major) {
        name.value = props.major.name
        schoolId.value = props.major.schoolId
        trainingDuration.value = props.major.trainingDuration
    }
})
</script>

<template>
    <fwb-modal v-if="manageStore.isShow.editMajor" @close="manageStore.closeEditMajorModal" :size="'sm'"
        :persistent="true">
        <template #header>
            <div class="flex items-center text-xl gap-2">
                <i class="fa-solid fa-plus"></i>
                Chỉnh sửa chuyên ngành
            </div>
        </template>
        <template #body>
            <div class="w-full">
                <Form @submit="updateMajor" v-if="majorStore.isLoading == false" :validation-schema="formSchemaMajor"
                    class="flex flex-col gap-1">
                    <label for="name" class="text-lg mx-2">Tên chuyên ngành:</label>
                    <Field type="text" name="name" id="name" class="rounded-md w-full" v-model="name"
                        placeholder="Nhập tên chuyên ngành" />
                    <ErrorMessage name="name" class="error" />
                    <label for="trainingDuration" class="text-lg mx-2">Thời gian đào tạo:</label>
                    <Field type="number" name="trainingDuration" id="trainingDuration" class="rounded-md w-full"
                        v-model="trainingDuration" placeholder="Nhập thời gian đào tạo" step="0.5" />
                    <ErrorMessage name="trainingDuration" class="error" />
                    <label for="schoolId" class="text-lg mx-2">Chọn trường / khoa:</label>
                    <Field as="select" name="schoolId" id="schoolId" class="input-custom shadow-lg" v-model="schoolId">
                        <option v-if="schoolStore.schools?.length" v-for="school in schoolStore.schools"
                            :key="school.id" :value="school.id">
                            {{ school.name }}
                        </option>
                    </Field>
                    <button type="submit" hidden id="btn-submit"></button>
                </Form>
                <div v-else>
                    <Loading />
                </div>
            </div>
        </template>
        <template #footer>
            <div class="flex justify-end gap-2">
                <fwb-button @click="manageStore.closeEditMajorModal" color="red">
                    Hủy
                </fwb-button>
                <label for="btn-submit" class="btn-submit">
                    Sửa
                </label>
            </div>
        </template>
    </fwb-modal>
</template>