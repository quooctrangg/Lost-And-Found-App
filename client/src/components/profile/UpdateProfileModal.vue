<script setup>
import { FwbButton, FwbModal } from 'flowbite-vue'
import { useUserStore } from '../../stores/user.store'
import { useSchoolStore } from '../../stores/school.store'
import { onMounted, reactive } from 'vue';
import { useToast } from 'vue-toast-notification'
import Loading from '../common/Loading.vue';
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";

const userStore = useUserStore()
const schoolStore = useSchoolStore()
const $toast = useToast()

const email = userStore.user?.email
const profile = reactive({
    name: userStore.user?.name,
    schoolId: userStore.user?.School?.id
})

const formSchemaProfile = yup.object().shape({
    name: yup.string().required("Tên phải có giá trị.").min(1, 'Tên phải ít nhất 1 ký tự.').max(50, "Tên có nhiều nhất 50 ký tự."),
    schoolId: yup.string().required('Yêu cầu chọn trường / khoa.')
})

const submitUpdateProfile = async () => {
    if (profile.name == userStore.user?.name && profile.schoolId == userStore.user?.School?.id) return
    await userStore.updateProfile(profile)
    if (userStore.err) {
        $toast.error(userStore.err, { position: 'top-right' })
        return
    }
    $toast.success(userStore.result.message, { position: 'top-right' })
    userStore.user.name = profile.name
    userStore.user.School = schoolStore.schools.find((e) => e.id == profile.schoolId)
    userStore.closeUpdateProfileModal()
}

onMounted(async () => {
    await schoolStore.getSchool({})
})
</script>

<template>
    <fwb-modal v-if="userStore.isShow.updateProfile" @close="userStore.closeUpdateProfileModal" :size="'md'"
        :persistent="true">
        <template #header>
            <div class="flex items-center text-xl gap-1">
                <i class="fa-solid fa-pen text-2xl"></i>
                Chỉnh sửa thông tin
            </div>
        </template>
        <template #body>
            <div v-if="userStore.isLoading == false" class="w-full">
                <Form @submit="submitUpdateProfile" :validation-schema="formSchemaProfile">
                    <div>
                        <label for="email" class="text-lg mx-2">Email:</label>
                        <input id="email" type="email" placeholder="Nhập email" class="rounded-md w-full mb-3 bg-gray-200"
                            v-model="email" disabled>
                    </div>
                    <div class="mb-3">
                        <label for="name" class="text-lg mx-2">Họ và tên:</label>
                        <Field name="name" id="name" type="text" placeholder="Nhập họ và tên" class="rounded-md w-full"
                            v-model="profile.name" />
                        <ErrorMessage name="name" class="error" />
                    </div>
                    <div class="mb-3">
                        <label for="schoolId" class="text-lg mx-2">Trường / Khoa:</label>
                        <Field as="select" name="schoolId" id="schoolId" class="rounded-md w-full"
                            v-model="profile.schoolId">
                            <option v-if="schoolStore.schools?.length" v-for="school in schoolStore.schools"
                                :key="school.id" :value="school.id">
                                {{
                                    school.name
                                }}
                            </option>
                        </Field>
                        <ErrorMessage name="schoolId" class="error" />
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
                <fwb-button @click="userStore.closeUpdateProfileModal" color="alternative">
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