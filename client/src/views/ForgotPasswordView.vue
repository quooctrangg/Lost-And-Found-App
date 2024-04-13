<script setup>
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";
import { reactive } from "vue";
import { useToast } from 'vue-toast-notification'
import { useUserStore } from '../stores/user.store'
import { useRouter } from 'vue-router'
import { ref } from "vue";
import Footer from "../components/common/Footer.vue";

const $toast = useToast()
const userStore = useUserStore()
const router = useRouter()

const seconds = ref(0)
const timeout = ref(false)
const user = reactive({
    studentId: '',
    newPassword: '',
    confirmPassword: '',
    code: ''
})
const formSchemaForgotPassword = yup.object().shape({
    studentId: yup.string().required("MSSV phải có giá trị.").max(10, "MSSV tối đa 10 ký tự."),
    newPassword: yup.string().required('Mật khẩu phải có giá trị.').min(6, 'Tên phải ít nhất 6 ký tự.'),
    confirmPassword: yup.string().oneOf([yup.ref('newPassword'), null], 'Mật khẩu xác nhận không trùng khớp.'),
    code: yup.number().typeError('Mã xác nhận phải là số.').required('Mã xác nhận phải có giá trị.')
})

const submitForgot = async () => {
    await userStore.forgotPassword(user)
    if (userStore.err) {
        $toast.error(userStore.err, { position: 'top-right' })
        return
    }
    $toast.success(userStore.result.message, { position: 'top-right' })
    setTimeout(() => {
        router.push('login')
    }, 1000)
}

const countDown = () => {
    if (seconds.value > 0) seconds.value = seconds.value - 1;
    else timeout.value = false;
}

const btnSendCode = async () => {
    if (user.studentId == '') {
        $toast.error('Vui lòng nhập MSSV', { position: 'top-right' })
        return
    }
    await userStore.sendVerifyCode({ studentId: user.studentId })
    if (userStore.err) {
        $toast.error(userStore.err, { position: 'top-right' })
        return
    }
    $toast.success(userStore.result.message, { position: 'top-right' })
    seconds.value = 120
    timeout.value = true
    setInterval(countDown, 1000)
}

</script>

<template>
    <section class="bg-slate-100 h-screen w-full flex items-center">
        <div class="flex items-center justify-center m-auto md:w-[60%] lg:w-[30%]">
            <div class="w-full shadow p-6 bg-white rounded-lg">
                <h1 class="h1-custom italic">
                    Quên mật khẩu
                </h1>
                <Form class="flex flex-col gap-3" @submit="submitForgot" :validation-schema="formSchemaForgotPassword">
                    <div>
                        <label for="studentId" class="label-custom">
                            Mã số sinh viên:
                        </label>
                        <Field type="text" name="studentId" id="studentId" class="input-custom"
                            v-model="user.studentId" />
                        <ErrorMessage name="studentId" class="error" />
                    </div>
                    <div>
                        <label for="newPassword" class="label-custom">
                            Mật khẩu mới:
                        </label>
                        <Field type="password" name="newPassword" id="newPassword" class="input-custom"
                            v-model="user.newPassword" />
                        <ErrorMessage name="newPassword" class="error" />
                    </div>
                    <div>
                        <label for="confirmPassword" class="label-custom">
                            Nhập lại mật khẩu mới:
                        </label>
                        <Field type="password" name="confirmPassword" id="confirmPassword" class="input-custom"
                            v-model="user.confirmPassword" />
                        <ErrorMessage name="confirmPassword" class="error" />
                    </div>
                    <div class="">
                        <label for="code" class="label-custom">
                            Mã xác nhận:
                        </label>
                        <div class="grid grid-cols-3 gap-2 w-full mb-4">
                            <Field type="number" name="code" id="code" class="input-custom col-span-2"
                                placeholder="XXXXXX" v-model="user.code" />
                            <button type="button" @click="async () => { await btnSendCode() }"
                                v-if="!userStore.isLoading && timeout == false"
                                class="grow shrink-0 bg-blue-600 rounded-lg text-white font-bold hover:bg-blue-700">
                                Lấy mã
                            </button>
                            <button v-else-if="!userStore.isLoading && timeout == true" type="button"
                                class="w-full flex justify-center items-center cursor-not-allowed bg-blue-600 rounded-lg text-white font-bold hover:bg-blue-700">
                                {{ seconds }}s
                            </button>
                            <button v-else type="button"
                                class="w-full flex justify-center items-center cursor-not-allowed bg-blue-600 rounded-lg text-white font-bold hover:bg-blue-700">
                                <div class="custom-loader"></div>
                            </button>
                        </div>
                        <ErrorMessage name="code" class="error" />
                    </div>
                    <div>
                        <button type="submit" class="btn-custom">
                            Đổi mật khẩu
                        </button>
                    </div>
                </Form>
            </div>
        </div>
    </section>
    <Footer />
</template>

<style scoped>
.custom-loader {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: conic-gradient(#0000 10%, #766DF4);
    animation: s3 1s infinite linear;
}

@keyframes s3 {
    to {
        transform: rotate(1turn)
    }
}
</style>