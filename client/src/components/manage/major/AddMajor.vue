<script setup>
import { FwbButton, FwbModal } from 'flowbite-vue'
import { useManageStore } from '../../../stores/manage.store'
import { useSchoolStore } from '../../../stores/school.store'
import { useMajorStore } from '../../../stores/major.store'
import { onMounted, ref } from 'vue';
import { useToast } from 'vue-toast-notification'
import Loading from '../../common/Loading.vue';
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";

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

const createMajor = async () => {
    await majorStore.create({ name: name.value, schoolId: schoolId.value, trainingDuration: trainingDuration.value })
    if (majorStore.err) {
        $toast.error(majorStore.err, { position: 'top-right' })
        return
    }
    $toast.success(majorStore.result.message, { position: 'top-right' })
    name.value = ''
    schoolId.value = null
    trainingDuration.value = 4.5
    await majorStore.getAlls({ key: majorStore.key, page: majorStore.currentPage })
    manageStore.closeAddMajorModal()
}
</script>

<template>
    <Form @submit="createMajor" :validation-schema="formSchemaMajor">
        <fwb-modal v-if="manageStore.isShow.addMajor" @close="manageStore.closeAddMajorModal" :size="'xl'"
            :persistent="true">
            <template #header>
                <div class="flex items-center text-xl gap-2">
                    <i class="fa-solid fa-plus"></i>
                    Thêm chuyên ngành
                </div>
            </template>
            <template #body>
                <div v-if="!majorStore.isLoading" class="w-full">
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
                        <option value="">Chọn trường / khoa</option>
                        <option v-if="schoolStore.schools?.length" v-for="school in schoolStore.schools"
                            :key="school.id" :value="school.id">
                            {{ school.name }}
                        </option>
                    </Field>
                    <ErrorMessage name="schoolId" class="error" />
                </div>
                <div v-else>
                    <Loading />
                </div>
            </template>
            <template #footer>
                <div class="flex justify-end gap-2">
                    <fwb-button color="blue">
                        Thêm
                    </fwb-button>
                    <fwb-button @click="manageStore.closeAddMajorModal" color="red">
                        Hủy
                    </fwb-button>
                </div>
            </template>
        </fwb-modal>
    </Form>
</template>