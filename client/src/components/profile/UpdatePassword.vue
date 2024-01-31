<script setup>
import { FwbButton, FwbModal } from 'flowbite-vue'
import { useUserStore } from '../../stores/user.store'

const userStore = useUserStore()

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
            <div class="w-full">
                <label for="currentPass" class="text-lg mx-2">Mật khẩu hiện tại:</label>
                <input id="currentPass" maxlength="50" type="text" placeholder="Nhập mật khẩu hiển tại"
                    class="rounded-md w-full mb-3">
                <label for="currentPass" class="text-lg mx-2">Mật khẩu mới:</label>
                <input id="currentPass" maxlength="50" type="text" placeholder="Nhập mật khẩu mới"
                    class="rounded-md w-full mb-3">
                <label for="currentPass" class="text-lg mx-2">Xác nhận mật khẩu mới:</label>
                <input id="currentPass" maxlength="50" type="text" placeholder="Nhập xác nhận mật khẩu mới"
                    class="rounded-md w-full mb-3">
            </div>
        </template>
        <template #footer>
            <div class="flex justify-end gap-2">
                <fwb-button @click="userStore.closeUpdatePasswordModal" color="alternative">
                    Hủy
                </fwb-button>
                <fwb-button @click="userStore.closeUpdatePasswordModal" color="green">
                    Đổi
                </fwb-button>
            </div>
        </template>
    </fwb-modal>
</template>