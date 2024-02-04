<script setup>
import { onMounted, reactive, ref } from 'vue';
import { useSchoolStore } from '../stores/school.store'
import { useAuthStore } from '../stores/auth.store'
import { useToast } from 'vue-toast-notification'
import { useRouter } from "vue-router";
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";

const schoolStore = useSchoolStore()
const authStore = useAuthStore()
const router = useRouter()
const $toast = useToast()

const seconds = ref(0)
const timeout = ref(false)
const user = reactive({
    email: '',
    name: '',
    password: '',
    schoolId: '',
    code: '',
    confirmPassword: ''
})

const countDown = () => {
    if (seconds.value > 0) seconds.value = seconds.value - 1;
    else timeout.value = false;
}

const formSchemaRegister = yup.object().shape({
    name: yup.string().required("Tên phải có giá trị.").min(1, 'Tên phải ít nhất 1 ký tự.').max(50, "Tên có nhiều nhất 50 ký tự."),
    email: yup.string().required("Email phải có giá trị.").email("E-mail không đúng.").max(50, "E-mail tối đa 50 ký tự."),
    password: yup.string().required('Mật khẩu phải có giá trị.').min(6, 'Tên phải ít nhất 6 ký tự.'),
    confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Mật khẩu xác nhận không trùng khớp.'),
    code: yup.number().typeError('Mã xác nhận phải là số.').required('Mã xác nhận phải có giá trị.'),
    schoolId: yup.string().required('Yêu cầu chọn trường / khoa.')
})

const btnSendCode = async () => {
    // await authStore.sendVerifyCode({ email: user.email, name: user.name })
    // if (authStore.err) {
    //     $toast.error(authStore.err, { position: 'top-right' })
    //     return
    // }
    // $toast.success(authStore.result.message, { position: 'top-right' })
    // seconds.value = 120
    // timeout.value = true
    // setInterval(countDown, 1000)
    console.log('code');
}

const btnSubmit = async () => {
    console.log('submit');
}

onMounted(async () => {
    await schoolStore.getSchool({})
})

</script>

<template>
    <section class="bg-slate-100 h-screen w-screen flex items-center">
        <div class="flex items-center justify-center m-auto w-[30%]">
            <div class="w-full shadow p-6 bg-white rounded-lg">
                <h1 class="h1-custom">
                    ĐĂNG KÝ
                </h1>
                <Form class="flex flex-col gap-3" @submit="btnSubmit" :validation-schema="formSchemaRegister">
                    <div>
                        <label for="email" class="label-custom">
                            Email:
                        </label>
                        <Field type="email" name="email" id="email" class="input-custom" v-model="user.email" />
                        <ErrorMessage name="email" class="error" />
                    </div>
                    <div>
                        <label for="name" class="label-custom">
                            Họ và tên:
                        </label>
                        <Field name="name" type="text" class="input-custom" v-model="user.name" />
                        <ErrorMessage name="name" class="error" />
                    </div>
                    <div class="grid grid-cols-2 gap-2">
                        <div>
                            <label for="password" class="label-custom">
                                Mật khẩu:
                            </label>
                            <Field name="password" type="password" id="password" class="input-custom"
                                v-model="user.password" />
                            <ErrorMessage name="password" class="error" />
                        </div>
                        <div>
                            <label for="confirm-password" class="label-custom">
                                Nhập lại mật khẩu:
                            </label>
                            <Field name="confirmPassword" type="password" id="confirmPassword" class="input-custom"
                                v-model="user.confirmPassword" />
                            <ErrorMessage name="confirmPassword" class="error" />
                        </div>
                    </div>
                    <div>
                        <label for="schoolId" class="label-custom">
                            Trường / Khoa:
                        </label>
                        <Field as="select" name="schoolId" id="schoolId" class="input-custom" v-model="user.schoolId">
                            <option value="">Chọn trường / khoa</option>
                            <option v-if="schoolStore.schools?.length" v-for="school in schoolStore.schools"
                                :key="school.id" :value="school.id">
                                {{
                                    school.name
                                }}
                            </option>
                        </Field>
                        <ErrorMessage name="schoolId" class="error" />
                    </div>
                    <div class="grid grid-cols-3 items-end gap-2">
                        <div class="col-span-2">
                            <label for="code" class="label-custom">
                                Nhập mã xác nhận:
                            </label>
                            <Field type="text" name="code" id="code" class="input-custom" v-model="user.code" />
                        </div>
                        <div>
                            <button type="button" v-if="authStore.isLoading == false && timeout == false"
                                @click="btnSendCode"
                                class="w-full rounded-lg text-sm px-5 py-3 text-center text-white font-semibold bg-green-500 hover:bg-green-600">
                                Lấy mã
                            </button>
                            <button v-else-if="authStore.isLoading == false && timeout == true" type="button"
                                class="w-full rounded-lg px-5 py-3 text-white text-sm font-semibold bg-green-300 flex justify-center items-center cursor-not-allowed">
                                {{ seconds }}s
                            </button>
                            <button v-else type="button"
                                class="w-full rounded-lg px-5 py-3 text-white font-semibold bg-green-300 flex justify-center items-center cursor-not-allowed">
                                <div class="custom-loader"></div>
                            </button>
                        </div>
                        <div class="col-span-2">
                            <ErrorMessage name="code" class="error" />
                        </div>
                    </div>
                    <button type="submit" class="btn-custom mt-3">
                        Tạo tài khoản
                    </button>
                    <p class="text-xs font-light text-gray-500">
                        Đã có tài khoản?
                        <router-link class="font-medium text-primary-600 hover:underline hover:text-red-600"
                            :to="{ name: 'login' }">
                            Đăng nhập tại đây.
                        </router-link>
                    </p>
                </Form>
            </div>
        </div>
    </section>
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