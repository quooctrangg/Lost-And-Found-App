<script setup>
import { reactive } from 'vue';
import { useAuthStore } from '../stores/auth.store'
import { useUserStore } from '../stores/user.store'
import { useToast } from 'vue-toast-notification'
import { useRouter } from "vue-router";
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";

const authStore = useAuthStore()
const userStore = useUserStore()
const router = useRouter()
const $toast = useToast()

const user = reactive({
    email: '',
    password: ''
})

const formSchemaLogin = yup.object().shape({
    email: yup.string().required("Email phải có giá trị.").email("E-mail không đúng.").max(50, "E-mail tối đa 50 ký tự."),
    password: yup.string().required('Mật khẩu phải có giá trị.').min(6, 'Tên phải ít nhất 6 ký tự.')
})

const submitLogin = async () => {
    await authStore.login(user)
    if (authStore.err) {
        $toast.error(authStore.err, { position: 'top-right' })
        return
    }
    $toast.success(authStore.result.message, { position: 'top-right' })
    await userStore.getMe()
    router.push({ name: 'home' })
}
</script>

<template>
    <section class="bg-slate-100 h-screen w-screen flex items-center">
        <div class="flex items-center justify-center m-auto w-[25%]">
            <div class="w-full shadow p-6 bg-white rounded-lg">
                <h1 class="h1-custom">
                    ĐĂNG NHẬP
                </h1>
                <Form class="flex flex-col gap-3" @submit="submitLogin" :validation-schema="formSchemaLogin">
                    <div>
                        <label for="email" class="label-custom">
                            Email:
                        </label>
                        <Field type="email" name="email" id="email" class="input-custom" v-model="user.email" />
                        <ErrorMessage name="email" class="error" />
                    </div>
                    <div>
                        <label for="password" class="label-custom">
                            Mật khẩu:
                        </label>
                        <Field name="password" type="password" id="password" class="input-custom" v-model="user.password" />
                        <ErrorMessage name="password" class="error" />
                    </div>
                    <div class="flex items-center justify-between">
                        <router-link
                            class="text-xs font-medium text-primary-600 hover:underline hover:text-red-600 text-gray-500"
                            :to="{ name: 'forgot-password' }">
                            Quên mật khẩu?
                        </router-link>
                    </div>
                    <button type="submit" class="btn-custom">
                        Đăng nhập
                    </button>
                    <p class="text-xs font-light text-gray-500">
                        Bạn chưa có tài khoản?
                        <router-link class="font-medium text-primary-600 hover:underline hover:text-red-600"
                            :to="{ name: 'register' }">
                            Đăng ký.
                        </router-link>
                    </p>
                </Form>
            </div>
        </div>
    </section>
</template>