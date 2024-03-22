<script setup>
import { reactive } from 'vue';
import { useAuthStore } from '../stores/auth.store'
import { useToast } from 'vue-toast-notification'
import { useRouter } from "vue-router";
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";
import Footer from '../components/common/Footer.vue';
import FeedbackModal from '../components/login/FeedbackModal.vue';

const authStore = useAuthStore()
const router = useRouter()
const $toast = useToast()

const user = reactive({
    email: '',
    password: ''
})

const formSchemaLogin = yup.object().shape({
    email: yup.string().required("Email phải có giá trị.").email("E-mail không đúng.").matches(/^[a-zA-Z0-9+_.-]+b\d{7}@student\.ctu\.edu\.vn$/i, 'Email không đúng định dạng của trường Đại học Cần Thơ.').max(50, "E-mail tối đa 50 ký tự."),
    password: yup.string().required('Mật khẩu phải có giá trị.').min(6, 'Tên phải ít nhất 6 ký tự.')
})

const submitLogin = async () => {
    await authStore.login(user)
    if (authStore.err) {
        if (authStore.result.statusCode == 403) {
            console.log(authStore.result);
            authStore.showFeedbackModal()
        }
        console.log(1);
        $toast.error(authStore.err, { position: 'top-right' })
        return
    }
    $toast.success(authStore.result.message, { position: 'top-right' })
    router.push({ name: 'home' })
}
</script>

<template>
    <section class="bg-[#FFFFFF] h-screen w-full py-14">
        <div class="flex items-center justify-center m-auto w-4/5 gap-3">
            <div class="w-2/4 p-6 flex flex-col items-center justify-center gap-4">
                <div class="text-center">
                    <h1 class="text-2xl font-semibold italic text-[#0068A3]">
                        Hệ thống hỗ trợ tìm kiếm đồ thất lạc
                    </h1>
                    <h1 class="text-lg text-[#0068A3]">cho sinh viên</h1>
                    <h1 class="text-2xl font-semibold italic text-[#0068A3] uppercase">
                        Trường Đại học Cần Thơ
                    </h1>
                </div>
                <img class="w-72" src="/logo.png" alt="">
            </div>
            <div class="w-2/4 p-6">
                <Form class="flex flex-col gap-10" @submit="submitLogin" :validation-schema="formSchemaLogin">
                    <h1 class="h1-custom italic">
                        Đăng nhập tài khoản
                    </h1>
                    <div>
                        <Field type="email" name="email" id="email" class="input-custom shadow-lg" v-model="user.email"
                            placeholder="Nhập email" />
                        <ErrorMessage name="email" class="error" />
                    </div>
                    <div>
                        <Field name="password" type="password" id="password" class="input-custom shadow-lg"
                            v-model="user.password" placeholder="Nhập mật khẩu" />
                        <ErrorMessage name="password" class="error" />
                    </div>
                    <div>
                        <div class="flex items-center justify-between py-2">
                            <router-link
                                class="text-sm font-medium text-primary-600 hover:underline hover:text-red-600 text-[#5B5764]"
                                :to="{ name: 'forgot-password' }">
                                Quên mật khẩu?
                            </router-link>
                        </div>
                        <button type="submit" class="btn-custom shadow-lg">
                            Đăng nhập
                        </button>
                        <!-- <div class="text-sm font-light text-[#5B5764] py-2">
                            Bạn chưa có tài khoản?
                            <router-link class="font-medium text-[#5B5764] hover:underline hover:text-red-600"
                                :to="{ name: 'register' }">
                                Đăng ký.
                            </router-link>
                        </div> -->
                    </div>
                </Form>
            </div>
        </div>
    </section>
    <FeedbackModal :feedback="authStore.result?.data?.feedback" />
    <Footer />
</template>