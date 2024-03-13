<script setup>
import { FwbButton, FwbModal } from 'flowbite-vue'
import { useManageStore } from '../../../stores/manage.store'
import { useUserStore } from '../../../stores/user.store'
import { useSchoolStore } from '../../../stores/school.store'
import { useToast } from 'vue-toast-notification'
import { reactive, ref, watchEffect } from 'vue'
import Loading from '../../common/Loading.vue'
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";

const manageStore = useManageStore()
const userStore = useUserStore()
const schoolStore = useSchoolStore()
const $toast = useToast()

const props = defineProps(['user'])

const user = reactive({
    name: '',
    password: '',
    schoolId: ''
})
const formSchemaUser = yup.object().shape({
    name: yup.string().required("Tên phải có giá trị.").min(1, 'Tên phải ít nhất 1 ký tự.').max(50, "Tên có nhiều nhất 50 ký tự."),
    schoolId: yup.string().required('Yêu cầu chọn trường / khoa.')
})

const url = ref(null)
const selectedFile = ref(null)

const onFileSelected = (e) => {
    selectedFile.value = e.target.files[0]
    url.value = URL.createObjectURL(selectedFile.value)
}

const removeImage = () => {
    selectedFile.value = null
    url.value = null
}

const editUser = async () => {
    const data = new FormData()
    if (!selectedFile.value && user.password == '' && user.schoolId === props.user.schoolId && user.name == props.user.name) return
    if (selectedFile.value) {
        data.append('image', selectedFile.value)
    }
    if (user.password !== '') {
        data.append('newPassword', user.password)
    }
    if (user.name !== props.user.name) {
        data.append('name', user.name)
    }
    if (user.schoolId !== props.user.schoolId) {
        data.append('schoolId', user.schoolId)
    }
    await userStore.updateUser(data, props.user.id)
    if (userStore.err) {
        $toast.error(userStore.err, { position: 'top-right' })
        return
    }
    $toast.success(userStore.result.message, { position: 'top-right' })
    user.name = ''
    user.password = ''
    user.schoolId = ''
    selectedFile.value = null
    url.value = null
    await userStore.getAllUsers({ page: userStore.currentPage, key: userStore.key, isBan: userStore.isBan, schoolId: userStore.schoolId })
    manageStore.closeEditUserModal()
}

watchEffect(async () => {
    if (props.user) {
        user.name = props.user.name
        user.schoolId = props.user.schoolId
    }
})
</script>

<template>
    <fwb-modal v-if="manageStore.isShow.editUser" @close="manageStore.closeEditUserModal" :persistent="true">
        <template #header>
            <div class="flex items-center text-xl gap-2">
                <i class="fa-solid fa-pen"></i>
                Cập nhật tài khoản
            </div>
        </template>
        <template #body>
            <div class="w-full">
                <Form v-if="userStore.isLoadingUpdate == false" @submit="editUser" :validation-schema="formSchemaUser">
                    <div>
                        <label for="email" class="label-custom">
                            Email:
                        </label>
                        <input type="email" maxlength="50" name="email" id="email" class="input-custom"
                            v-model="props.user.email" disabled>
                    </div>
                    <div class="flex flex-col items-center justify-center gap-2 mt-4">
                        <div class="h-36 w-36 border-dashed border-black border-2 rounded-full overflow-hidden">
                            <label for="images" class="cursor-pointer h-full w-full flex justify-center items-center">
                                <div v-if="url == null" class="flex flex-col items-center gap-2">
                                    <i class="fa-solid fa-cloud-arrow-up text-2xl"></i>
                                    Chọn hình ảnh
                                </div>
                                <img v-else :src="url" alt="" class="object-cover">
                            </label>
                        </div>
                        <button type="button" v-if="url != null" @click="removeImage"
                            class="border border-red-500 p-1 rounded text-red-500 text-sm">
                            Xóa
                        </button>
                    </div>
                    <input type="file" hidden id="images" accept="image/png, image/jpeg" @change="onFileSelected">
                    <div class="mt-4">
                        <label for="name" class="label-custom">
                            Họ và tên:
                        </label>
                        <Field name="name" type="text" class="input-custom" id="name" v-model="user.name" />
                        <ErrorMessage name="name" class="error" />
                    </div>
                    <div class="mt-4">
                        <label for="schoolId" class="label-custom">
                            Trường / Khoa:
                        </label>
                        <Field as="select" name="schoolId" id="schoolId" class="input-custom" v-model="user.schoolId">
                            <option v-if="schoolStore.schools?.length" v-for="school in schoolStore.schools"
                                :key="school.id" :value="school.id">
                                {{ school.name }}
                            </option>
                        </Field>
                        <ErrorMessage name="schoolId" class="error" />
                    </div>
                    <div class="mt-4">
                        <label for="password" class="label-custom">
                            Mật khẩu:
                        </label>
                        <input minlength="6" type="text" name="password" id="password" class="input-custom"
                            v-model="user.password">
                    </div>
                    <button type="submit" hidden id="btn-submit"></button>
                </Form>
                <div v-else>
                    <Loading />
                </div>
            </div>
        </template>
        <template #footer>
            <div class="flex justify-end gap-2">
                <fwb-button @click="manageStore.closeEditUserModal" color="alternative">
                    Hủy
                </fwb-button>
                <label for="btn-submit"
                    class="bg-green-500 rounded-lg text-sm px-5 py-3 text-center text-white font-semibold cursor-pointer hover:bg-green-600">
                    Cập nhật
                </label>
            </div>
        </template>
    </fwb-modal>
</template>