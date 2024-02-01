<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth.store'
import { useUserStore } from '../../stores/user.store'
import Notification from '../common/Notification.vue'
import { useToast } from 'vue-toast-notification'

const authStore = useAuthStore()
const userStore = useUserStore()
const router = useRouter()
const $toast = useToast()

const showNotifications = ref(false)

const handleClickOutside = (event) => {
    const notificationContainer = document.querySelector('.notification-container');
    const notificationHeader = document.querySelector('.notification-header');
    if (notificationContainer && !notificationContainer.contains(event.target) && !notificationHeader.contains(event.target)) {
        showNotifications.value = false;
    }
}

const logout = () => {
    authStore.token = null
    userStore.user = null
    $toast.success('Đăng xuất thành công.', { position: 'top-right' })
    router.push({ name: 'home' })
}

onMounted(async () => {
    document.addEventListener('click', handleClickOutside);
    if (authStore.token) {
        userStore.getMe()
    }
})

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
})
</script>
<template>
    <header class="bg-sky-500 sticky top-0 z-50">
        <div class="w-[80%] mx-auto flex justify-between items-center">
            <div class="">
                <router-link :to="{ name: 'home' }">
                    <div class="flex items-center gap-2">
                        <img class="h-12 w-auto" src="/logo.png" alt="Logo">
                        <p class="text-xl break-words italic font-medium text-amber-300">
                            Nơi chia sẽ đồ vật thất lạc
                        </p>
                    </div>
                </router-link>
            </div>
            <div class="">
                <div v-if="authStore.token == null" class="text-xs flex gap-2 justify-end">
                    <div class="hover:text-red-500">
                        <router-link :to="{ name: 'login' }">
                            <p>Đăng nhập</p>
                        </router-link>
                    </div>
                    <p>|</p>
                    <div class="hover:text-red-500">
                        <router-link :to="{ name: 'register' }">
                            <p>Đăng ký</p>
                        </router-link>
                    </div>
                </div>
                <div v-else class="flex gap-5 items-center">
                    <router-link :to="{ name: 'home' }" class="text-xl">
                        <div class="p-2 text-gray-100 hover:text-gray-300">
                            <i class="fa-solid fa-house "></i>
                        </div>
                    </router-link>
                    <router-link :to="{ name: 'chat' }" class="text-xl relative">
                        <div
                            class="absolute right-0 top-0 bg-red-500 rounded-full w-4 h-4  flex justify-center items-center">
                            <span class="text-[10px] text-white">5</span>
                        </div>
                        <div class="p-2 text-gray-100 hover:text-gray-300">
                            <i class="fa-solid fa-message "></i>
                        </div>
                    </router-link>
                    <div class="relative text-xl">
                        <div @click="showNotifications = !showNotifications"
                            class="cursor-pointer relative notification-header">
                            <div
                                class="absolute right-0 top-0 bg-red-500 rounded-full w-4 h-4  flex justify-center items-center">
                                <span class="text-[10px] text-white">10</span>
                            </div>
                            <div class="p-2 text-gray-100 hover:text-gray-300">
                                <i class="fa-solid fa-bell"></i>
                            </div>
                        </div>
                        <Notification v-if="showNotifications" @showNotifications="(e) => { showNotifications = e }" />
                    </div>
                    <div class="group relative cursor-pointer">
                        <div class="menu-hover flex items-center gap-1">
                            <img class="h-10 w-auto rounded-full" :src="userStore.user?.image" alt="logo user">
                            <p class="text-md truncate">
                                {{ userStore.user?.name }}
                            </p>
                        </div>
                        <div class="group-hover:visible invisible absolute bg-white w-full shadow-xl rounded-md">
                            <router-link :to="{ name: 'post' }" class="block border-b p-2 text-sm hover:text-gray-400">
                                <i class="fa-regular fa-user"></i>
                                Thông tin cá nhân
                            </router-link>
                            <router-link :to="{ name: 'request' }" class="block border-b p-2 text-sm hover:text-gray-400">
                                <i class="fa-regular fa-square-check"></i>
                                Yêu cầu
                            </router-link>
                            <router-link v-if="userStore.user?.type == 0" :to="{ name: 'dashboard' }"
                                class="block border-b p-2 text-sm hover:text-gray-400">
                                <i class="fa-solid fa-user-tie"></i>
                                Quản trị viên
                            </router-link>
                            <button @click="logout" class="block border-b p-2 text-sm hover:text-gray-400">
                                <i class="fa-solid fa-arrow-right-from-bracket"></i>
                                Đăng xuất
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </header>
</template>
