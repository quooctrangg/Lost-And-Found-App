<script setup>
import { FwbButton, FwbModal } from 'flowbite-vue'
import { useManageStore } from '../../../stores/manage.store'
import { useUserStore } from '../../../stores/user.store'
import { useSchoolStore } from '../../../stores/school.store'
import { useMajorStore } from '../../../stores/major.store'
import { useToast } from 'vue-toast-notification'
import { reactive, ref, watch, watchEffect } from 'vue'
import Loading from '../../common/Loading.vue'
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";

const manageStore = useManageStore()
const userStore = useUserStore()
const schoolStore = useSchoolStore()
const majorStore = useMajorStore()
const $toast = useToast()

const props = defineProps(['user'])

const user = reactive({
    name: '',
    password: '',
    schoolId: '',
    majorId: '',
    type: ''
})
const formSchemaUser = yup.object().shape({
    name: yup.string().required("Tên phải có giá trị.").min(1, 'Tên phải ít nhất 1 ký tự.').max(50, "Tên có nhiều nhất 50 ký tự."),
    schoolId: yup.string().required('Yêu cầu chọn trường / khoa.'),
    majorId: yup.string().required('Yêu cầu chọn chuyên ngành')
})

const url = ref(null)
const selectedFile = ref(null)

const onFileSelected = (e) => {
    selectedFile.value = e.target.files[0]
    url.value = URL.createObjectURL(selectedFile.value)
}

const removeImage = () => {
    selectedFile.value = null
    url.value = null
}

const editUser = async () => {
    const data = new FormData()
    if (!selectedFile.value && user.password == '' && user.schoolId === props.user.schoolId && user.name == props.user.name && user.type == props.user.type) return
    if (selectedFile.value) {
        data.append('image', selectedFile.value)
    }
    if (user.password !== '') {
        data.append('newPassword', user.password)
    }
    if (user.name !== props.user.name) {
        data.append('name', user.name)
    }
    if (user.majorId !== props.user.majorId) {
        data.append('majorId', user.majorId)
    }
    if (user.type !== props.user.type) {
        data.append('type', user.type)
    }
    await userStore.updateUser(data, props.user.id)
    if (userStore.err) {
        $toast.error(userStore.err, { position: 'top-right' })
        return
    }
    $toast.success(userStore.result.message, { position: 'top-right' })
    user.name = ''
    user.password = ''
    user.schoolId = ''
    user.majorId = ''
    user.type = ''
    selectedFile.value = null
    url.value = null
    await userStore.getAllUsers({ page: userStore.currentPage, key: userStore.key, isBan: userStore.isBan, majorId: userStore.majorId })
    manageStore.closeEditUserModal()
}

watch(() => user.schoolId, async newval => {
    if (newval) {
        if (newval !== props.user?.Major?.schoolId) {
            user.majorId = ''
        }
        await majorStore.getAllsBySchoolId(newval)
    }
})

watchEffect(async () => {
    if (props.user) {
        user.name = props.user.name
        user.schoolId = props.user?.Major?.schoolId
        user.majorId = props.user?.Major?.id
        user.type = props.user?.type
    }
})
</script>

<template>
    <Form v-if="manageStore.isShow.editUser" @submit="editUser" :validation-schema="formSchemaUser">
        <fwb-modal @close="manageStore.closeEditUserModal" :persistent="true">
            <template #header>
                <div class="flex items-center text-xl gap-2">
                    <i class="fa-solid fa-pen"></i>
                    Cập nhật tài khoản
                </div>
            </template>
            <template #body>
                <div class="w-full" v-if="!userStore.isLoadingUpdate">
                    <div>
                        <label for="studentId" class="label-custom">
                            MSSV:
                        </label>
                        <Field name="studentId" id="studentId" type="text" class="input-custom"
                            v-model="props.user.studentId" disabled />
                    </div>
                    <div class="flex flex-col items-center justify-center gap-2 mt-4">
                        <div class="h-36 w-36 border-dashed border-black border-2 rounded-full overflow-hidden">
                            <label for="images" class="cursor-pointer h-full w-full flex justify-center items-center">
                                <div v-if="url == null" class="flex flex-col items-center gap-2">
                                    <i class="fa-solid fa-cloud-arrow-up text-2xl"></i>
                                    Chọn hình ảnh
                                </div>
                                <img v-else :src="url" alt="" class="object-cover">
                            </label>
                        </div>
                        <button type="button" v-if="url != null" @click="removeImage"
                            class="border border-red-500 p-1 rounded text-red-500 text-sm">
                            Xóa
                        </button>
                    </div>
                    <input type="file" hidden id="images" accept="image/png, image/jpeg" @change="onFileSelected">
                    <div class="mt-4">
                        <label for="name" class="label-custom">
                            Họ và tên:
                        </label>
                        <Field name="name" type="text" class="input-custom" id="name" v-model="user.name" />
                        <ErrorMessage name="name" class="error" />
                    </div>
                    <div class="mt-4">
                        <label for="schoolId" class="label-custom">
                            Trường / Khoa:
                        </label>
                        <Field as="select" name="schoolId" id="schoolId" class="input-custom" v-model="user.schoolId">
                            <option v-if="schoolStore.schools?.length" v-for="school in schoolStore.schools"
                                :key="school.id" :value="school.id">
                                {{ school.name }}
                            </option>
                        </Field>
                        <ErrorMessage name="schoolId" class="error" />
                    </div>
                    <div class="mt-4">
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
                    <div class="mt-4">
                        <label for="type" class="label-custom">
                            Quyền:
                        </label>
                        <Field as="select" name="type" id="type" class="input-custom" v-model="user.type">
                            <option :value="2">Người dùng</option>
                            <option :value="1">Quản lý bài viết</option>
                        </Field>
                        <ErrorMessage name="type" class="error" />
                    </div>
                    <div class="mt-4">
                        <label for="password" class="label-custom">
                            Mật khẩu:
                        </label>
                        <input minlength="6" type="text" name="password" id="password" class="input-custom"
                            v-model="user.password">
                    </div>
                </div>
                <div v-else>
                    <Loading />
                </div>
            </template>
            <template #footer>
                <div class="flex justify-end gap-2">
                    <fwb-button v-if="!userStore.isLoadingUpdate" color="blue">
                        Cập nhật
                    </fwb-button>
                    <fwb-button v-else color="blue" disabled>
                        Cập nhật
                    </fwb-button>
                    <fwb-button v-if="!userStore.isLoadingUpdate" @click="manageStore.closeEditUserModal" color="red">
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