<script setup>
import { FwbButton, FwbModal } from 'flowbite-vue'
import { useManageStore } from '../../../stores/manage.store'
import { useUserStore } from '../../../stores/user.store'
import { useSchoolStore } from '../../../stores/school.store'
import { useMajorStore } from '../../../stores/major.store'
import { useToast } from 'vue-toast-notification'
import { reactive, ref, watch } from 'vue'
import Loading from '../../common/Loading.vue'
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";

const manageStore = useManageStore()
const userStore = useUserStore()
const schoolStore = useSchoolStore()
const majorStore = useMajorStore()
const $toast = useToast()

const isShow = ref(false)
const selectedFile = ref(null)
const user = reactive({
    name: '',
    studentId: '',
    password: '',
    schoolId: '',
    majorId: ''
})
const formSchemaUser = yup.object().shape({
    name: yup.string().required("Tên phải có giá trị.").min(1, 'Tên phải ít nhất 1 ký tự.').max(50, "Tên có nhiều nhất 50 ký tự."),
    studentId: yup.string().required("MSSV phải có giá trị.").max(10, "MSSV tối đa 10 ký tự."),
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
    user.studentId = ''
    user.majorId = ''
    await userStore.getAllUsers({ page: userStore.currentPage, key: userStore.key, isBan: userStore.isBan, schoolId: userStore.schoolId })
}

const onFileSelected = (e) => {
    selectedFile.value = e.target.files[0]
}

const createUsers = async () => {
    if (!selectedFile.value) return
    const data = new FormData()
    data.append('file', selectedFile.value)
    await userStore.createUsers(data)
    if (userStore.err) {
        $toast.error(userStore.err, { position: 'top-right' })
        return
    }
    $toast.success(userStore.result.message, { position: 'top-right' })
    selectedFile.value = null
    await userStore.getAllUsers({ page: userStore.currentPage, key: userStore.key, isBan: userStore.isBan, schoolId: userStore.schoolId })
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
                <fwb-button v-if="isShow" @click="isShow = false" color="alternative">
                    Một tài khoản
                </fwb-button>
                <fwb-button v-else disabled color="alternative">
                    Một tài khoản
                </fwb-button>
                <fwb-button v-if="!isShow" @click="isShow = true" color="alternative">
                    Nhiều tài khoản
                </fwb-button>
                <fwb-button v-else disabled color="alternative">
                    Nhiều tài khoản
                </fwb-button>
            </div>
        </template>
        <template #body>
            <Form v-if="!isShow" @submit="createUser" :validation-schema="formSchemaUser">
                <div class="w-full" v-if="!userStore.isLoading">
                    <div>
                        <label for="studentId" class="label-custom">
                            MSSV:
                        </label>
                        <Field type="text" name="studentId" id="studentId" class="input-custom"
                            v-model="user.studentId" />
                        <ErrorMessage name="studentId" class="error" />
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
                    <div class="flex justify-end gap-2 mt-4">
                        <fwb-button v-if="!userStore.isLoading" color="blue">
                            Thêm
                        </fwb-button>
                        <fwb-button v-else color="blue" disabled>
                            Thêm
                        </fwb-button>
                        <fwb-button v-if="!userStore.isLoading" @click="manageStore.closeAddUserModal" color="red">
                            Hủy
                        </fwb-button>
                        <fwb-button v-else color="red" disabled>
                            Hủy
                        </fwb-button>
                    </div>
                </div>
                <div v-else>
                    <Loading />
                </div>
            </Form>
            <div v-else>
                <div v-if="!userStore.isLoading">
                    <div>
                        <input type="file" accept=".xls, .xlsx" @change="onFileSelected">
                    </div>
                    <div class="mt-5"
                        v-if="userStore.statusCreateUsers.totalSuccess + userStore.statusCreateUsers.totalError > 0">
                        <div>
                            <div class="text-green-600">
                                Thành công: {{ userStore.statusCreateUsers.totalSuccess }} tài khoản.
                            </div>
                            <div class="text-red-600">
                                Thất bại: {{ userStore.statusCreateUsers.totalError }} tài khoản.
                            </div>
                        </div>
                        <div class="text-center italic text-red-500 font-semibold mt-3">
                            Danh sách tài khoản không tạo thành công
                        </div>
                        <div class="max-h-[300px] overflow-y-scroll">
                            <table class="table-auto border-collapse border border-slate-500 w-full mt-2">
                                <thead>
                                    <tr>
                                        <th class="border border-slate-600 bg-blue-300 p-2">STT</th>
                                        <th class="border border-slate-600 bg-blue-300 p-2">MSSV</th>
                                        <th class="border border-slate-600 bg-blue-300 p-2">Họ và tên</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(user, i) in userStore.statusCreateUsers.userError"
                                        class="even:bg-blue-100">
                                        <td class="border border-slate-700 p-2 text-center">
                                            {{ i + 1 }}
                                        </td>
                                        <td class="border border-slate-700 p-2">
                                            {{ user.studentId }}
                                        </td>
                                        <td class="border border-slate-700 p-2">
                                            {{ user.name }}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div v-else>
                    <Loading />
                </div>
                <div class="flex justify-end gap-2 mt-4">
                    <fwb-button v-if="!userStore.isLoading" @click="createUsers" color="blue">
                        Thêm
                    </fwb-button>
                    <fwb-button v-else color="blue" disabled>
                        Thêm
                    </fwb-button>
                    <fwb-button v-if="!userStore.isLoading" @click="manageStore.closeAddUserModal" color="red">
                        Hủy
                    </fwb-button>
                    <fwb-button v-else color="red" disabled>
                        Hủy
                    </fwb-button>
                </div>
            </div>
        </template>
    </fwb-modal>

</template>