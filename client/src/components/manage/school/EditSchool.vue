<script setup>
import { FwbButton, FwbModal } from 'flowbite-vue'
import { useManageStore } from '../../../stores/manage.store'
import { useSchoolStore } from '../../../stores/school.store'
import { useToast } from 'vue-toast-notification'
import { ref, watchEffect } from 'vue';
import Loading from '../../common/Loading.vue';
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";

const props = defineProps(['school'])

const manageStore = useManageStore()
const schoolStore = useSchoolStore()
const $toast = useToast()

const name = ref('')
const formSchemaSchool = yup.object().shape({
    name: yup.string().required('Tên phải có giá trị.').min(1, 'Tên phải ít nhất 1 ký tự.').max(50, "Tên có nhiều nhất 50 ký tự.")
})

const updateSchool = async () => {
    await schoolStore.updateSchool(props.school?.id, { name: name.value })
    if (schoolStore.err) {
        $toast.error(schoolStore.err, { position: 'top-right' })
        return
    }
    $toast.success(schoolStore.result.message, { position: 'top-right' })
    await schoolStore.getSchool({ key: schoolStore.key, page: schoolStore.currentPage })
    manageStore.closeEditSchoolModal()
}

watchEffect(async () => {
    if (props.school) {
        name.value = props.school.name
    }
})
</script>

<template>
    <fwb-modal v-if="manageStore.isShow.editSchool" @close="manageStore.closeEditSchoolModal" :size="'sm'"
        :persistent="true">
        <template #header>
            <div class="flex items-center text-xl gap-2">
                <i class="fa-solid fa-plus"></i>
                Chỉnh sửa trường / khoa
            </div>
        </template>
        <template #body>
            <div class="w-full">
                <Form @submit="updateSchool" v-if="schoolStore.isLoading == false" :validation-schema="formSchemaSchool">
                    <Field type="text" name="name" id="name" class="rounded-md w-full" v-model="name"
                        placeholder="Nhập tên trường / khoa" />
                    <ErrorMessage name="name" class="error" />
                    <button type="submit" hidden id="btn-submit"></button>
                </Form>
                <div v-else>
                    <Loading />
                </div>
            </div>
        </template>
        <template #footer>
            <div class="flex justify-end gap-2">
                <fwb-button @click="manageStore.closeEditSchoolModal" color="alternative">
                    Hủy
                </fwb-button>
                <label for="btn-submit"
                    class="bg-green-500 rounded-lg text-sm px-5 py-3 text-center text-white font-semibold cursor-pointer hover:bg-green-600">
                    Sửa
                </label>
            </div>
        </template>
    </fwb-modal>
</template>