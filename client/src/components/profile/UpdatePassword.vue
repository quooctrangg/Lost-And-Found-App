<script setup>
import { FwbButton, FwbModal } from 'flowbite-vue'
import { useUserStore } from '../../stores/user.store'
import { reactive, ref } from 'vue';
import { useToast } from 'vue-toast-notification'
import Loading from '../common/Loading.vue';

const $toast = useToast()
const userStore = useUserStore()

const data = reactive({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
})
const changeType = reactive({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false
})
const isMatch = ref(false)

const toggleChangeType = (text) => {
    console.log(text);
    if (text == 'currentPassword') {
        changeType.currentPassword = !changeType.currentPassword
        return
    }
    if (text == 'newPassword') {
        changeType.newPassword = !changeType.newPassword
        return
    }
    if (text == 'confirmPassword') {
        changeType.confirmPassword = !changeType.confirmPassword
        return
    }
}

const submitUpdatePassword = async () => {
    if (data.newPassword !== data.confirmPassword) isMatch.value = true
    else isMatch.value = false
    if (isMatch.value == false) {
        await userStore.updatePassword(data)
        if (userStore.err) {
            $toast.error(userStore.err, { position: 'top-right' })
            return
        }
        $toast.success(userStore.result.message, { position: 'top-right' })
        data.newPassword = ''
        data.currentPassword = ''
        data.confirmPassword = ''
        userStore.closeUpdatePasswordModal()
    }
}

</script>

<template>
    <fwb-modal v-if="userStore.isShow.updatePassword" @close="userStore.closeUpdatePasswordModal" :size="'md'">
        <template #header>
            <div class="flex items-center text-xl gap-1">
                <i class="fa-solid fa-key text-2xl"></i>
                Đổi mật khẩu
            </div>
        </template>
        <template #body>
            <div class="w-full" v-if="userStore.isLoading == false">
                <form @submit.prevent="submitUpdatePassword">
                    <label for="currentPassword" class="text-lg mx-2">Mật khẩu hiện tại:</label>
                    <div class="flex items-center gap-1 mb-3">
                        <input id="currentPassword" minlength="6" required
                            :type="changeType.currentPassword ? 'text' : 'password'" placeholder="Nhập mật khẩu hiển tại"
                            class="rounded-md w-full" v-model="data.currentPassword">
                        <button type="button" class="text-2xl p-1" @click="() => { toggleChangeType('currentPassword') }">
                            <i v-if="changeType.currentPassword" class="fa-regular fa-eye"></i>
                            <i v-else class="fa-regular fa-eye-slash"></i>
                        </button>
                    </div>
                    <label for="newPassword" class="text-lg mx-2">Mật khẩu mới:</label>
                    <div class="flex items-center gap-1 mb-3">
                        <input id="newPassword" minlength="6" required :type="changeType.newPassword ? 'text' : 'password'"
                            placeholder="Nhập mật khẩu mới" class="rounded-md w-full" v-model="data.newPassword">
                        <button type="button" class="text-2xl p-1" @click="() => { toggleChangeType('newPassword') }">
                            <i v-if="changeType.newPassword" class="fa-regular fa-eye"></i>
                            <i v-else class="fa-regular fa-eye-slash"></i>
                        </button>
                    </div>
                    <label for="confirmPassword" class="text-lg mx-2">Xác nhận mật khẩu mới:</label>
                    <div class="flex items-center gap-1">
                        <input id="confirmPassword" minlength="6" required
                            :type="changeType.confirmPassword ? 'text' : 'password'"
                            placeholder="Nhập xác nhận mật khẩu mới" class="rounded-md w-full"
                            v-model="data.confirmPassword">
                        <button type="button" class="text-2xl p-1" @click="() => { toggleChangeType('confirmPassword') }">
                            <i v-if="changeType.confirmPassword" class="fa-regular fa-eye"></i>
                            <i v-else class="fa-regular fa-eye-slash"></i>
                        </button>
                    </div>
                    <span v-if="isMatch" class="error">
                        Mật khẩu mới không khớp!
                    </span>
                    <button type="submit" id="btn-submit" hidden></button>
                </form>
            </div>
            <div v-else>
                <Loading />
            </div>
        </template>
        <template #footer>
            <div class="flex justify-end gap-2">
                <fwb-button @click="userStore.closeUpdatePasswordModal" color="alternative">
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