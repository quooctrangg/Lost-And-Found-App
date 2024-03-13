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
const formSchemaMajor = yup.object().shape({
    name: yup.string().required('Tên phải có giá trị.').min(1, 'Tên phải ít nhất 1 ký tự.').max(50, "Tên có nhiều nhất 50 ký tự."),
    schoolId: yup.string().required('Yêu cầu chọn trường / khoa.')
})

const createMajor = async () => {
    await majorStore.create({ name: name.value, schoolId: schoolId.value })
    if (majorStore.err) {
        $toast.error(majorStore.err, { position: 'top-right' })
        return
    }
    $toast.success(majorStore.result.message, { position: 'top-right' })
    name.value = ''
    schoolId.value = null
    await majorStore.getAlls({ key: majorStore.key, page: majorStore.currentPage })
    manageStore.closeAddMajorModal()
}
</script>

<template>
    <fwb-modal v-if="manageStore.isShow.addMajor" @close="manageStore.closeAddMajorModal" :size="'xs'"
        :persistent="true">
        <template #header>
            <div class="flex items-center text-xl gap-2">
                <i class="fa-solid fa-plus"></i>
                Thêm chuyên ngành
            </div>
        </template>
        <template #body>
            <div class="w-full">
                <Form @submit="createMajor" v-if="majorStore.isLoading == false" :validation-schema="formSchemaMajor">
                    <label for="name" class="text-lg mx-2">Tên chuyên ngành:</label>
                    <Field type="text" name="name" id="name" class="rounded-md w-full" v-model="name"
                        placeholder="Nhập tên chuyên ngành" />
                    <ErrorMessage name="name" class="error" />
                    <label for="schoolId" class="text-lg mx-2">Chọn trường / khoa:</label>
                    <Field as="select" name="schoolId" id="schoolId" class="input-custom shadow-lg" v-model="schoolId">
                        <option value="">Chọn trường / khoa</option>
                        <option v-if="schoolStore.schools?.length" v-for="school in schoolStore.schools"
                            :key="school.id" :value="school.id">
                            {{ school.name }}
                        </option>
                    </Field>
                    <ErrorMessage name="schoolId" class="error" />
                    <button type="submit" hidden id="btn-submit"></button>
                </Form>
                <div v-else>
                    <Loading />
                </div>
            </div>
        </template>
        <template #footer>
            <div class="flex justify-end gap-2">
                <fwb-button @click="manageStore.closeAddMajorModal" color="alternative">
                    Hủy
                </fwb-button>
                <label for="btn-submit"
                    class="bg-green-500 rounded-lg text-sm px-5 py-3 text-center text-white font-semibold cursor-pointer hover:bg-green-600">
                    Thêm
                </label>
            </div>
        </template>
    </fwb-modal>
</template>