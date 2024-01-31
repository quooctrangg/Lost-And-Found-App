<script setup>
import { FwbButton, FwbModal } from 'flowbite-vue'
import { useUserStore } from '../../stores/user.store'
import { ref } from 'vue';

const userStore = useUserStore()

const email = ref('quooctrangg@gmail.com')
const name = ref('Nguyen Quoc Trang')


</script>

<template>
    <fwb-modal v-if="userStore.isShow.updateProfile" @close="userStore.closeUpdateProfileModal" :size="'md'">
        <template #header>
            <div class="flex items-center text-xl gap-1">
                <i class="fa-solid fa-pen text-2xl"></i>
                Chỉnh sửa thông tin
            </div>
        </template>
        <template #body>
            <div class="w-full">
                <label for="email" class="text-lg mx-2">Email:</label>
                <input id="email" maxlength="50" type="email" placeholder="Nhập email" class="rounded-md w-full mb-3"
                    v-model="email" disabled>
                <label for="name" class="text-lg mx-2">Họ và tên:</label>
                <input id="name" maxlength="50" type="text" placeholder="Nhập họ và tên" class="rounded-md w-full mb-3"
                    v-model="name">
                <label for="school" class="text-lg mx-2">Trường / Khoa:</label>
                <select name="" id="school" class="rounded-md w-full mb-3">
                    <option value="">Công nghệ thông tin và truyền thông</option>
                    <option value="">Kinh tế</option>
                    <option value="">Nông nghiệp</option>
                    <option value="">Thủy sản</option>
                </select>
            </div>
        </template>
        <template #footer>
            <div class="flex justify-end gap-2">
                <fwb-button @click="userStore.closeUpdateProfileModal" color="alternative">
                    Hủy
                </fwb-button>
                <fwb-button @click="userStore.closeUpdateProfileModal" color="green">
                    Đổi
                </fwb-button>
            </div>
        </template>
    </fwb-modal>
</template>