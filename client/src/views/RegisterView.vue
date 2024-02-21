<script setup>
import { onMounted, reactive, ref } from 'vue';
import { useSchoolStore } from '../stores/school.store'
import { useAuthStore } from '../stores/auth.store'
import { useToast } from 'vue-toast-notification'
import { useRouter } from "vue-router";
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";
import Loading from '../components/common/Loading.vue';

const schoolStore = useSchoolStore()
const authStore = useAuthStore()
const router = useRouter()
const $toast = useToast()

const user = reactive({
    email: '',
    name: '',
    password: '',
    schoolId: '',
    confirmPassword: ''
})


const formSchemaRegister = yup.object().shape({
    name: yup.string().required("Tên phải có giá trị.").min(1, 'Tên phải ít nhất 1 ký tự.').max(50, "Tên có nhiều nhất 50 ký tự."),
    email: yup.string().required("Email phải có giá trị.").email("E-mail không đúng.").max(50, "E-mail tối đa 50 ký tự."),
    password: yup.string().required('Mật khẩu phải có giá trị.').min(6, 'Tên phải ít nhất 6 ký tự.'),
    confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Mật khẩu xác nhận không trùng khớp.'),
    schoolId: yup.string().required('Yêu cầu chọn trường / khoa.')
})

const btnSubmit = async () => {
    await authStore.register(user)
    if (authStore.err) {
        $toast.error(authStore.err, { position: 'top-right' })
        return
    }
    $toast.success(authStore.result.message, { position: 'top-right' })
    setTimeout(() => {
        router.push('login')
    }, 1000)
}

onMounted(async () => {
    await schoolStore.getSchool({})
})

</script>

<template>
    <section class="bg-slate-100 h-screen w-screen flex items-center">
        <div v-if="authStore.isLoading == false" class="flex items-center justify-center m-auto w-[30%]">
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
        <Loading v-else />
    </section>
</template>