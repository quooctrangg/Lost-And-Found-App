<script setup>
import { FwbButton, FwbModal } from 'flowbite-vue'
import { useManageStore } from '../../../stores/manage.store'
import { useUserStore } from '../../../stores/user.store'
import { useSchoolStore } from '../../../stores/school.store'
import { useMajorStore } from '../../../stores/major.store'
import { useToast } from 'vue-toast-notification'
import { reactive, watch } from 'vue'
import Loading from '../../common/Loading.vue'
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";

const manageStore = useManageStore()
const userStore = useUserStore()
const schoolStore = useSchoolStore()
const majorStore = useMajorStore()
const $toast = useToast()

const user = reactive({
    name: '',
    email: '',
    password: '',
    schoolId: '',
    majorId: ''
})
const formSchemaUser = yup.object().shape({
    name: yup.string().required("Tên phải có giá trị.").min(1, 'Tên phải ít nhất 1 ký tự.').max(50, "Tên có nhiều nhất 50 ký tự."),
    email: yup.string().required("Email phải có giá trị.").email("E-mail không đúng.").matches(/^[a-zA-Z0-9+_.-]+b\d{7}@student\.ctu\.edu\.vn$/i, 'Email không đúng định dạng của trường Đại học Cần Thơ.').max(50, "E-mail tối đa 50 ký tự."),
    password: yup.string().required('Mật khẩu phải có giá trị.').min(6, 'Tên phải ít nhất 6 ký tự.'),
    schoolId: yup.string().required('Yêu cầu chọn trường / khoa.'),
    majorId: yup.string().required('Yêu cầu chọn chuyên ngành.')
})

const createUser = async () => {
    await userStore.createUser(user)
    if (userStore.err) {
        $toast.error(userStore.err, { position: 'top-right' })
        return
    }
    $toast.success(userStore.result.message, { position: 'top-right' })
    user.name = ''
    user.password = ''
    user.schoolId = ''
    user.email = ''
    user.majorId = ''
    await userStore.getAllUsers({ page: userStore.currentPage, key: userStore.key, isBan: userStore.isBan, schoolId: userStore.schoolId })
    manageStore.closeAddUserModal()
}

watch(() => user.schoolId, async newval => {
    if (newval) {
        user.majorId = ''
        await majorStore.getAllsBySchoolId(newval)
    }
})

</script>

<template>
    <fwb-modal v-if="manageStore.isShow.addUser" @close="manageStore.closeAddUserModal" :persistent="true">
        <template #header>
            <div class="flex items-center text-xl gap-2">
                <i class="fa-solid fa-user-plus"></i>
                Thêm tài khoản
            </div>
        </template>
        <template #body>
            <div class="w-full">
                <Form v-if="userStore.isLoading == false" @submit="createUser" :validation-schema="formSchemaUser">
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
                        <Field name="name" id="name" type="text" class="input-custom" v-model="user.name" />
                        <ErrorMessage name="name" class="error" />
                    </div>
                    <div>
                        <label for="password" class="label-custom">
                            Mật khẩu:
                        </label>
                        <Field name="password" type="password" id="password" class="input-custom"
                            v-model="user.password" />
                        <ErrorMessage name="password" class="error" />
                    </div>
                    <div>
                        <label for="schoolId" class="label-custom">
                            Trường / Khoa:
                        </label>
                        <Field as="select" name="schoolId" id="schoolId" class="input-custom" v-model="user.schoolId">
                            <option value="">Chọn trường / khoa</option>
                            <option v-if="schoolStore.schools?.length" v-for="school in schoolStore.schools"
                                :key="school.id" :value="school.id">
                                {{ school.name }}
                            </option>
                        </Field>
                        <ErrorMessage name="schoolId" class="error" />
                    </div>
                    <div>
                        <label for="majorId" class="label-custom">
                            Chuyên ngành:
                        </label>
                        <Field as="select" name="majorId" id="majorId" class="input-custom" v-model="user.majorId">
                            <option value="">Chọn chuyên ngành</option>
                            <option v-if="majorStore.majors?.length" v-for="major in majorStore.majors" :key="major.id"
                                :value="major.id">
                                {{ major.name }}
                            </option>
                        </Field>
                        <ErrorMessage name="majorId" class="error" />
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
                <fwb-button @click="manageStore.closeAddUserModal" color="red">
                    Hủy
                </fwb-button>
                <label for="btn-submit" class="btn-submit">
                    Thêm
                </label>
            </div>
        </template>
    </fwb-modal>
</template>