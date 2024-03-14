<script setup>
import { onMounted, reactive, watch } from 'vue';
import { useSchoolStore } from '../stores/school.store'
import { useAuthStore } from '../stores/auth.store'
import { useMajorStore } from '../stores/major.store'
import { useToast } from 'vue-toast-notification'
import { useRouter } from "vue-router";
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import Loading from '../components/common/Loading.vue';
import Footer from '../components/common/Footer.vue';

const schoolStore = useSchoolStore()
const majorStore = useMajorStore()
const authStore = useAuthStore()
const router = useRouter()
const $toast = useToast()

const user = reactive({
    email: '',
    name: '',
    password: '',
    schoolId: '',
    confirmPassword: '',
    majorId: ''
})

const formSchemaRegister = yup.object().shape({
    name: yup.string().required("Tên phải có giá trị.").min(1, 'Tên phải ít nhất 1 ký tự.').max(50, "Tên có nhiều nhất 50 ký tự."),
    email: yup.string().required("Email phải có giá trị.").email("E-mail không đúng.").matches(/^[a-zA-Z0-9+_.-]+b\d{7}@student\.ctu\.edu\.vn$/i, 'Email không đúng định dạng của trường Đại học Cần Thơ.').max(50, "E-mail tối đa 50 ký tự."),
    password: yup.string().required('Mật khẩu phải có giá trị.').min(6, 'Tên phải ít nhất 6 ký tự.'),
    confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Mật khẩu xác nhận không trùng khớp.'),
    schoolId: yup.string().required('Yêu cầu chọn trường / khoa.'),
    majorId: yup.string().required('Yêu cầu chọn chuyên ngành.')
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

watch(() => user.schoolId, async newval => {
    user.majorId = ''
    if (newval) {
        await majorStore.getAllsBySchoolId(newval)
    } else {
        majorStore.majors = []
    }
})

onMounted(async () => {
    await schoolStore.getSchool({})
})

</script>

<template>
    <section class="bg-white h-screen w-full py-14">
        <div v-if="authStore.isLoading == false" class="flex items-center justify-center m-auto w-[30%]">
            <div class="w-full bg-white">
                <Form class="flex flex-col gap-8" @submit="btnSubmit" :validation-schema="formSchemaRegister">
                    <h1 class="h1-custom italic">
                        Đăng ký tài khoản
                    </h1>
                    <div>
                        <Field type="email" name="email" id="email" class="input-custom shadow-lg" v-model="user.email"
                            placeholder="Nhập email" />
                        <ErrorMessage name="email" class="error" />
                    </div>
                    <div>
                        <Field name="name" type="text" class="input-custom shadow-lg" v-model="user.name"
                            placeholder="Nhập họ và tên" />
                        <ErrorMessage name="name" class="error" />
                    </div>
                    <div class="grid grid-cols-2 gap-5">
                        <div>
                            <Field name="password" type="password" id="password" class="input-custom shadow-lg"
                                v-model="user.password" placeholder="Nhập mật khẩu" />
                            <ErrorMessage name="password" class="error" />
                        </div>
                        <div>
                            <Field name="confirmPassword" type="password" id="confirmPassword"
                                class="input-custom shadow-lg" v-model="user.confirmPassword"
                                placeholder="Nhập lại mật khẩu" />
                            <ErrorMessage name="confirmPassword" class="error" />
                        </div>
                    </div>
                    <div>
                        <Field as="select" name="schoolId" id="schoolId" class="input-custom shadow-lg"
                            v-model="user.schoolId">
                            <option value="">Chọn trường / khoa</option>
                            <option v-if="schoolStore.schools?.length" v-for="school in schoolStore.schools"
                                :key="school.id" :value="school.id">
                                {{ school.name }}
                            </option>
                        </Field>
                        <ErrorMessage name="schoolId" class="error" />
                    </div>
                    <div>
                        <Field as="select" name="majorId" id="majorId" class="input-custom shadow-lg"
                            v-model="user.majorId">
                            <option value="">Chọn chuyên ngành</option>
                            <option v-if="majorStore.majors?.length" v-for="major in majorStore.majors" :key="major.id"
                                :value="major.id">
                                {{ major.name }}
                            </option>
                        </Field>
                        <ErrorMessage name="majorId" class="error" />
                    </div>
                    <div>
                        <button type="submit" class="btn-custom shadow-lg">
                            Tạo tài khoản
                        </button>
                        <p class="text-sm font-light text-gray-500 py-2">
                            Đã có tài khoản?
                            <router-link class="font-medium text-primary-600 hover:underline hover:text-red-600"
                                :to="{ name: 'login' }">
                                Đăng nhập tại đây.
                            </router-link>
                        </p>
                    </div>
                </Form>
            </div>
        </div>
        <Loading v-else />
    </section>
    <Footer />
</template>