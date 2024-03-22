<script setup>
import { FwbButton, FwbModal } from 'flowbite-vue'
import { useManageStore } from '../../../stores/manage.store'
import { useSchoolStore } from '../../../stores/school.store'
import { ref } from 'vue';
import { useToast } from 'vue-toast-notification'
import Loading from '../../common/Loading.vue';
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";

const manageStore = useManageStore()
const schoolStore = useSchoolStore()
const $toast = useToast()

const name = ref('')
const formSchemaSchool = yup.object().shape({
    name: yup.string().required('Tên phải có giá trị.').min(1, 'Tên phải ít nhất 1 ký tự.').max(50, "Tên có nhiều nhất 50 ký tự.")
})

const createSchool = async () => {
    await schoolStore.createSchool({ name: name.value })
    if (schoolStore.err) {
        $toast.error(schoolStore.err, { position: 'top-right' })
        return
    }
    $toast.success(schoolStore.result.message, { position: 'top-right' })
    name.value = ''
    await schoolStore.getSchool({ key: schoolStore.key, page: schoolStore.currentPage })
    manageStore.closeAddSchoolModal()
}
</script>

<template>
    <Form v-if="manageStore.isShow.addSchool" @submit="createSchool" :validation-schema="formSchemaSchool">
        <fwb-modal @close="manageStore.closeAddSchoolModal" :size="'xs'" :persistent="true">
            <template #header>
                <div class="flex items-center text-xl gap-2">
                    <i class="fa-solid fa-plus"></i>
                    Thêm trường / khoa
                </div>
            </template>
            <template #body>
                <div v-if="!schoolStore.isLoading" class="w-full">
                    <label for="name" class="text-lg mx-2">Tên trường / khoa:</label>
                    <Field type="text" name="name" id="name" class="rounded-md w-full" v-model="name"
                        placeholder="Nhập tên trường / khoa" />
                    <ErrorMessage name="name" class="error" />
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
                    <fwb-button @click="manageStore.closeAddSchoolModal" color="red">
                        Hủy
                    </fwb-button>
                </div>
            </template>
        </fwb-modal>
    </Form>
</template>