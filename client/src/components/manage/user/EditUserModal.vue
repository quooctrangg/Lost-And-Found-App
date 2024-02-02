<script setup>
import { FwbButton, FwbModal } from 'flowbite-vue'
import { useManageStore } from '../../../stores/manage.store'
import { useUserStore } from '../../../stores/user.store'
import { useSchoolStore } from '../../../stores/school.store'
import { useToast } from 'vue-toast-notification'
import { onMounted, reactive, ref, watchEffect } from 'vue'
import Loading from '../../common/Loading.vue'

const manageStore = useManageStore()
const userStore = useUserStore()
const schoolStore = useSchoolStore()
const $toast = useToast()

const props = defineProps(['user'])

const user = reactive({
    name: '',
    password: '',
    schoolId: ''
})

const url = ref(null)
const selectedFile = ref(null)

const onFileSelected = (e) => {
    selectedFile.value = e.target.files[0]
    url.value = URL.createObjectURL(selectedFile.value)
}

const editUser = async () => {
    const data = new FormData()
    if (selectedFile.value) {
        data.append('image', selectedFile.value)
    }
    if (user.password !== '') {
        data.append('newPassword', user.password)
    }
    if (user.name !== props.user.name) {
        data.append('name', user.name)
    }
    if (user.schoolId !== props.user.schoolId) {
        data.append('schoolId', user.schoolId)
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
    selectedFile.value = null
    url.value = null
    await userStore.getAllUsers({ page: userStore.currentPage, key: userStore.key, isBan: userStore.isBan, schoolId: userStore.schoolId })
    manageStore.closeEditUserModal()
}

watchEffect(async () => {
    if (props.user) {
        user.name = props.user.name
        user.schoolId = props.user.schoolId
    }
})

onMounted(async () => {
    await schoolStore.getSchool({ page: 1 })
})
</script>

<template>
    <fwb-modal v-if="manageStore.isShow.editUser" @close="manageStore.closeEditUserModal">
        <template #header>
            <div class="flex items-center text-xl gap-2">
                <i class="fa-solid fa-pen"></i>
                Cập nhật tài khoản
            </div>
        </template>
        <template #body>
            <div class="w-full">
                <form v-if="userStore.isLoading == false" @submit.prevent="editUser">
                    <div>
                        <label for="email" class="label-custom">
                            Email:
                        </label>
                        <input type="email" maxlength="50" name="email" id="email" class="input-custom"
                            v-model="props.user.email" disabled>
                    </div>
                    <div class="flex justify-center mt-4">
                        <div class="h-36 w-36 border-dashed border-black border-2 rounded-full overflow-hidden">
                            <label for="images" class="cursor-pointer h-full w-full flex justify-center items-center">
                                <div v-if="url == null" class="flex flex-col items-center gap-2">
                                    <i class="fa-solid fa-cloud-arrow-up text-2xl"></i>
                                    Chọn hình ảnh
                                </div>
                                <img v-else :src="url" alt="" class="object-cover">
                            </label>
                        </div>
                    </div>
                    <input type="file" hidden id="images" accept="image/png, image/jpeg" @change="onFileSelected">
                    <div class="mt-4">
                        <label for="firstname" class="label-custom">
                            Họ và tên:
                        </label>
                        <input type="text" maxlength="50" name="firstname" id="firstname" class="input-custom"
                            v-model="user.name">
                    </div>
                    <div class="mt-4">
                        <label for="school" class="label-custom">
                            Trường / Khoa:
                        </label>
                        <select name="school" id="school" class="input-custom" v-model="user.schoolId">
                            <option v-for="school in schoolStore.schools" :key="school.id" :value="school.id">
                                {{
                                    school.name
                                }}
                            </option>
                        </select>
                    </div>
                    <div class="mt-4">
                        <label for="password" class="label-custom">
                            Mật khẩu:
                        </label>
                        <input minlength="6" type="text" name="password" id="password" class="input-custom"
                            v-model="user.password">
                    </div>
                    <button type="submit" hidden id="btn-submit"></button>
                </form>
                <div v-else>
                    <Loading />
                </div>
            </div>
        </template>
        <template #footer>
            <div class="flex justify-end gap-2">
                <fwb-button @click="manageStore.closeEditUserModal" color="alternative">
                    Hủy
                </fwb-button>
                <label for="btn-submit"
                    class="bg-green-500 rounded-lg text-sm px-5 py-3 text-center text-white font-semibold cursor-pointer hover:bg-green-600">
                    Thêm
                </label>
            </div>
        </template>
    </fwb-modal>
</template>