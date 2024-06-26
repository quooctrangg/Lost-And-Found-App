<script setup>
import { onMounted, onUnmounted, ref, watch, watchEffect } from 'vue';
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../../stores/auth.store'
import { useUserStore } from '../../stores/user.store'
import { useMessageStore } from '../../stores/message.store'
import { useConversationStore } from '../../stores/conversation.store'
import { useNotificationStore } from '../../stores/notification.store'
import { useToast } from 'vue-toast-notification'
import Notification from '../common/Notification.vue'

const authStore = useAuthStore()
const userStore = useUserStore()
const conversationStore = useConversationStore()
const messageStore = useMessageStore()
const notificationStore = useNotificationStore()
const router = useRouter()
const route = useRoute()
const $toast = useToast()

const showNotifications = ref(false)
const isLoginPage = ref(false)

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

onMounted(() => {
    document.addEventListener('click', handleClickOutside);
})

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
})

watchEffect(async () => {
    if (authStore.token) {
        await userStore.getMe()
        await notificationStore.getAllNotificationsByUserId()
    }
    if (userStore.user !== null) {
        messageStore.setupSocket()
        await conversationStore.fetchConversations()
    }
})

watch(() => route.path, (newval) => {
    if (newval == '/login') {
        isLoginPage.value = true
    } else {
        isLoginPage.value = false
    }
})
</script>
<template>
    <header class="bg-[#045D86] sticky top-0 z-50 p-1">
        <div class="w-full lg:w-[80%] mx-auto flex justify-between items-center">
            <div class="">
                <router-link :to="{ name: 'home' }">
                    <div class="flex items-center gap-2">
                        <img class="h-12 w-auto" src="/logo.png" alt="Logo">
                        <p class="hidden md:block text-xl md:text-2xl break-words italic font-medium text-[#FCD360]">
                            Nơi chia sẽ đồ vật thất lạc
                        </p>
                    </div>
                </router-link>
            </div>
            <div v-if="!isLoginPage">
                <div v-if="authStore.token == null" class="text-base font-medium flex gap-2 justify-end">
                    <div class="hover:bg-[#07A6F0] text-white bg-[#0798DB] p-2 rounded-md">
                        <router-link :to="{ name: 'login' }">
                            <p>Đăng nhập</p>
                        </router-link>
                    </div>
                </div>
                <div v-else class="flex gap-2 lg:gap-5 items-center">
                    <router-link :to="{ name: 'home' }" class="text-2xl">
                        <div class="p-2 text-gray-100 hover:text-gray-300">
                            <i class="fa-solid fa-house"></i>
                        </div>
                    </router-link>
                    <router-link :to="{ name: 'chat' }" class="text-2xl relative">
                        <div v-if="conversationStore.totalReadMessage !== 0"
                            class="absolute right-0 top-0 bg-red-500 rounded-full w-4 h-4  flex justify-center items-center">
                            <span class="text-[10px] text-white">
                                {{ conversationStore.totalReadMessage !== 0 ? conversationStore.totalReadMessage : '' }}
                            </span>
                        </div>
                        <div class="p-2 text-gray-100 hover:text-gray-300">
                            <i class="fa-solid fa-message "></i>
                        </div>
                    </router-link>
                    <div class="relative text-2xl">
                        <div @click="showNotifications = !showNotifications"
                            class="cursor-pointer relative notification-header">
                            <div v-if="notificationStore.totalRead"
                                class="absolute right-0 top-0 bg-red-500 rounded-full w-4 h-4  flex justify-center items-center">
                                <span class="text-[10px] text-white">
                                    {{ notificationStore.totalRead }}
                                </span>
                            </div>
                            <div class="p-2 text-gray-100 hover:text-gray-300">
                                <i class="fa-solid fa-bell"></i>
                            </div>
                        </div>
                        <Notification v-if="showNotifications" @showNotifications="(e) => { showNotifications = e }" />
                    </div>
                    <div class="group relative cursor-pointer">
                        <div class="menu-hover flex items-center gap-1">
                            <div
                                class="h-10 w-10 overflow-hidden rounded-full flex items-center justify-center bg-white">
                                <img class="h-full w-full object-cover" :src="userStore.user?.image" alt="logo user">
                            </div>
                            <p class="text-md truncate font-semibold text-[#ffffff] min-w-[100px] md:min-w-[150px]">
                                {{ userStore.user?.name }}
                            </p>
                        </div>
                        <div class="group-hover:visible invisible absolute bg-white w-full shadow-xl rounded-md">
                            <router-link :to="{ name: 'post' }" class="block border-b p-2 text-sm hover:text-gray-400">
                                <i class="fa-regular fa-user"></i>
                                Thông tin cá nhân
                            </router-link>
                            <router-link :to="{ name: 'request' }"
                                class="block border-b p-2 text-sm hover:text-gray-400">
                                <i class="fa-regular fa-square-check"></i>
                                Yêu cầu
                            </router-link>
                            <router-link v-if="userStore.user?.type == 0" :to="{ name: 'dashboard' }"
                                class="block border-b p-2 text-sm hover:text-gray-400">
                                <i class="fa-solid fa-user-tie"></i>
                                Quản trị viên
                            </router-link>
                            <router-link v-if="userStore.user?.type == 1" :to="{ name: 'post-manage' }"
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
            <div v-else>
                <div class="text-base font-medium flex gap-2 justify-end">
                    <div class="hover:bg-[#07A6F0] text-white bg-[#0798DB] p-2 rounded-md">
                        <router-link :to="{ name: 'home' }">
                            <p>Trang chủ</p>
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
    </header>
</template>
