<script setup>
import { FwbButton, FwbModal } from 'flowbite-vue'
import { useUserStore } from '../../stores/user.store'
import { reactive, ref } from 'vue';
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
    newPassword: yup.string().required('Mật khẩu phải có giá trị.').min(6, 'Tên phải ít nhất 6 ký tự.'),
    confirmPassword: yup.string().oneOf([yup.ref('newPassword'), null], 'Mật khẩu xác nhận không trùng khớp.')
})
const changeType = reactive({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false
})

const toggleChangeType = (text) => {
    if (text == 'currentPassword') {
        changeType.currentPassword = !changeType.currentPassword
        return
    }
    if (text == 'newPassword') {
        changeType.newPassword = !changeType.newPassword
        return
    }
    if (text == 'confirmPassword') {
        changeType.confirmPassword = !changeType.confirmPassword
        return
    }
}

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
    <fwb-modal v-if="userStore.isShow.updatePassword" @close="userStore.closeUpdatePasswordModal" :size="'md'"
        :persistent="true">
        <template #header>
            <div class="flex items-center text-xl gap-1">
                <i class="fa-solid fa-key text-2xl"></i>
                Đổi mật khẩu
            </div>
        </template>
        <template #body>
            <div class="w-full" v-if="userStore.isLoading == false">
                <Form @submit="submitUpdatePassword" :validation-schema="formSchemaPassword">
                    <label for="currentPassword" class="text-lg mx-2">Mật khẩu hiện tại:</label>
                    <div class="mb-3">
                        <div class="flex items-center gap-1">
                            <Field name="currentPassword" :type="changeType.currentPassword ? 'text' : 'password'"
                                id="currentPassword" class="rounded-md w-full" placeholder="Nhập mật khẩu hiển tại"
                                v-model="data.currentPassword" />
                            <button type="button" class="text-2xl p-1"
                                @click="() => { toggleChangeType('currentPassword') }">
                                <i v-if="changeType.currentPassword" class="fa-regular fa-eye"></i>
                                <i v-else class="fa-regular fa-eye-slash"></i>
                            </button>
                        </div>
                        <ErrorMessage name="currentPassword" class="error" />
                    </div>
                    <label for="newPassword" class="text-lg mx-2">Mật khẩu mới:</label>
                    <div class="mb-3">
                        <div class="flex items-center gap-1">
                            <Field name="newPassword" :type="changeType.newPassword ? 'text' : 'password'" id="newPassword"
                                class="rounded-md w-full" placeholder="Nhập mật khẩu mới" v-model="data.newPassword" />
                            <button type="button" class="text-2xl p-1" @click="() => { toggleChangeType('newPassword') }">
                                <i v-if="changeType.newPassword" class="fa-regular fa-eye"></i>
                                <i v-else class="fa-regular fa-eye-slash"></i>
                            </button>
                        </div>
                        <ErrorMessage name="newPassword" class="error" />
                    </div>
                    <label for="confirmPassword" class="text-lg mx-2">Xác nhận mật khẩu mới:</label>
                    <div class="mb-3">
                        <div class="flex items-center gap-1">
                            <Field name="confirmPassword" :type="changeType.confirmPassword ? 'text' : 'password'"
                                id="confirmPassword" class="rounded-md w-full" placeholder="Nhập xác nhận mật khẩu mới"
                                v-model="data.confirmPassword" />
                            <button type="button" class="text-2xl p-1"
                                @click="() => { toggleChangeType('confirmPassword') }">
                                <i v-if="changeType.confirmPassword" class="fa-regular fa-eye"></i>
                                <i v-else class="fa-regular fa-eye-slash"></i>
                            </button>
                        </div>
                        <ErrorMessage name="confirmPassword" class="error" />
                    </div>
                    <button type="submit" id="btn-submit" hidden></button>
                </Form>
            </div>
            <div v-else>
                <Loading />
            </div>
        </template>
        <template #footer>
            <div class="flex justify-end gap-2">
                <fwb-button @click="userStore.closeUpdatePasswordModal" color="alternative">
                    Hủy
                </fwb-button>
                <label for="btn-submit"
                    class="bg-green-500 rounded-lg text-sm px-5 py-3 text-center text-white font-semibold cursor-pointer hover:bg-green-600">
                    Đổi
                </label>
            </div>
        </template>
    </fwb-modal>
</template>