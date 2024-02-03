<script setup>
import { FwbButton, FwbModal } from 'flowbite-vue'
import { useManageStore } from '../../../stores/manage.store'
import { useUserStore } from '../../../stores/user.store'
import { useSchoolStore } from '../../../stores/school.store'
import { useToast } from 'vue-toast-notification'
import { reactive } from 'vue'
import Loading from '../../common/Loading.vue'

const manageStore = useManageStore()
const userStore = useUserStore()
const schoolStore = useSchoolStore()
const $toast = useToast()

const user = reactive({
    name: '',
    email: '',
    password: '',
    schoolId: ''
})
const error = reactive({
    schoolId: false,
    email: false
})

const createUser = async () => {
    if (user.schoolId == '') error.schoolId = true
    else error.schoolId = false
    if (!error.schoolId) {
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
        await userStore.getAllUsers({ page: userStore.currentPage, key: userStore.key, isBan: userStore.isBan, schoolId: userStore.schoolId })
        manageStore.closeAddUserModal()
    }
}
</script>

<template>
    <fwb-modal v-if="manageStore.isShow.addUser" @close="manageStore.closeAddUserModal">
        <template #header>
            <div class="flex items-center text-xl gap-2">
                <i class="fa-solid fa-user-plus"></i>
                Thêm tài khoản
            </div>
        </template>
        <template #body>
            <div class="w-full">
                <form v-if="userStore.isLoading == false" @submit.prevent="createUser">
                    <div>
                        <label for="firstname" class="label-custom">
                            Họ và tên:
                        </label>
                        <input type="text" maxlength="50" required name="firstname" id="firstname" class="input-custom"
                            v-model="user.name">
                    </div>
                    <div>
                        <label for="email" class="label-custom">
                            Email:
                        </label>
                        <input type="email" maxlength="50" required name="email" id="email" class="input-custom"
                            v-model="user.email">
                        <span v-if="error.email" class="error">
                            Email không hợp lệ!
                        </span>
                    </div>
                    <div>
                        <label for="password" class="label-custom">
                            Mật khẩu:
                        </label>
                        <input minlength="6" type="text" name="password" id="password" class="input-custom" required
                            v-model="user.password">
                    </div>
                    <div>
                        <label for="school" class="label-custom">
                            Trường / Khoa:
                        </label>
                        <select name="school" id="school" class="input-custom" v-model="user.schoolId" required>
                            <option value="">Chọn trường / khoa</option>
                            <option v-if="schoolStore.schools?.length" v-for="school in schoolStore.schools"
                                :key="school.id" :value="school.id">
                                {{
                                    school.name
                                }}
                            </option>
                        </select>
                        <span v-if="error.schoolId" class="error">
                            Hãy chọn trường / khoa!
                        </span>
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
                <fwb-button @click="manageStore.closeAddUserModal" color="alternative">
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