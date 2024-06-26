<script setup>
import { FwbButton, FwbModal } from 'flowbite-vue'
import { useUserStore } from '../../stores/user.store'
import { reactive } from 'vue';
import { useToast } from 'vue-toast-notification'
import Loading from '../common/Loading.vue';
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";

const $toast = useToast()
const userStore = useUserStore()

const data = reactive({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
})
const formSchemaPassword = yup.object().shape({
    currentPassword: yup.string().required('Mật khẩu phải có giá trị.').min(6, 'Tên phải ít nhất 6 ký tự.'),
    newPassword: yup.string().required('Mật khẩu phải có giá trị.').min(6, 'Tên phải ít nhất 6 ký tự.').notOneOf([yup.ref('currentPassword')], 'Mật khẩu mới không được trùng với mật khẩu hiện tại.'),
    confirmPassword: yup.string().oneOf([yup.ref('newPassword'), null], 'Mật khẩu xác nhận không trùng khớp.')
})

const submitUpdatePassword = async () => {
    await userStore.updatePassword(data)
    if (userStore.err) {
        $toast.error(userStore.err, { position: 'top-right' })
        return
    }
    $toast.success(userStore.result.message, { position: 'top-right' })
    data.newPassword = ''
    data.currentPassword = ''
    data.confirmPassword = ''
    userStore.closeUpdatePasswordModal()
}
</script>

<template>
    <Form v-if="userStore.isShow.updatePassword" @submit="submitUpdatePassword" :validation-schema="formSchemaPassword">
        <fwb-modal @close="userStore.closeUpdatePasswordModal" :size="'md'" :persistent="true">
            <template #header>
                <div class="flex items-center text-xl gap-1">
                    <i class="fa-solid fa-key text-2xl"></i>
                    Đổi mật khẩu
                </div>
            </template>
            <template #body>
                <div class="w-full" v-if="!userStore.isLoading">
                    <label for="currentPassword" class="text-lg mx-2">Mật khẩu hiện tại:</label>
                    <div class="mb-3">
                        <Field name="currentPassword" type="password" id="currentPassword" class="rounded-md w-full"
                            placeholder="Nhập mật khẩu hiển tại" v-model="data.currentPassword" />
                        <ErrorMessage name="currentPassword" class="error" />
                    </div>
                    <label for="newPassword" class="text-lg mx-2">Mật khẩu mới:</label>
                    <div class="mb-3">
                        <Field name="newPassword" type="password" id="newPassword" class="rounded-md w-full"
                            placeholder="Nhập mật khẩu mới" v-model="data.newPassword" />
                        <ErrorMessage name="newPassword" class="error" />
                    </div>
                    <label for="confirmPassword" class="text-lg mx-2">Xác nhận mật khẩu mới:</label>
                    <div class="mb-3">
                        <Field name="confirmPassword" type="password" id="confirmPassword" class="rounded-md w-full"
                            placeholder="Nhập xác nhận mật khẩu mới" v-model="data.confirmPassword" />
                        <ErrorMessage name="confirmPassword" class="error" />
                    </div>
                    <button type="submit" id="btn-submit" hidden></button>
                </div>
                <div v-else>
                    <Loading />
                </div>
            </template>
            <template #footer>
                <div class="flex justify-end gap-2">
                    <fwb-button v-if="!userStore.isLoading" color="blue">
                        Đổi
                    </fwb-button>
                    <fwb-button v-else color="blue" disabled>
                        Đổi
                    </fwb-button>
                    <fwb-button v-if="!userStore.isLoading" @click="userStore.closeUpdatePasswordModal" color="red">
                        Hủy
                    </fwb-button>
                    <fwb-button v-else color="red" disabled>
                        Hủy
                    </fwb-button>
                </div>
            </template>
        </fwb-modal>
    </Form>
</template>