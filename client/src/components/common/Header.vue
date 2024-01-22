<script setup>
import { ref } from 'vue';
import Notification from '../common/Notification.vue'

const showNofications = ref(false)
</script>
<template>
    <header class="bg-sky-300">
        <div class="w-[80%] mx-auto flex justify-between items-center">
            <div>
                <router-link :to="{ name: 'home' }">
                    <div class="flex items-center gap-2">
                        <img class="h-12 w-auto" src="/logo.png" alt="Logo">
                        <p class="text-sm break-words italic font-medium text-red-500">
                            Nơi chia sẽ đồ vật thất lạc
                        </p>
                    </div>
                </router-link>
            </div>
            <div class="w-[30%]">
                <div v-if="false" class="text-xs flex gap-2 justify-end">
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
                <div v-else class="flex gap-4 items-center">
                    <router-link :to="{ name: 'home' }" class="text-lg">
                        <i class="fa-solid fa-house"></i>
                    </router-link>
                    <router-link :to="{ name: 'chat' }" class="text-lg relative">
                        <div
                            class="absolute right-0 top-0 bg-red-500 rounded-full w-4 h-4  flex justify-center items-center">
                            <span class="text-[10px] text-white">5</span>
                        </div>
                        <div class="p-2">
                            <i class="fa-solid fa-message"></i>
                        </div>
                    </router-link>
                    <div class="relative text-lg">
                        <div @click="showNofications = !showNofications" class="cursor-pointer relative">
                            <div
                                class="absolute right-0 top-0 bg-red-500 rounded-full w-4 h-4  flex justify-center items-center">
                                <span class="text-[10px] text-white">10</span>
                            </div>
                            <div class="p-2">
                                <i class="fa-solid fa-bell"></i>
                            </div>
                        </div>
                        <div v-if="showNofications"
                            class="absolute rounded-lg w-[300px] overflow-hidden mt-3 flex flex-col">
                            <Notification @showNofications="(e) => { showNofications = e }" />
                        </div>
                    </div>
                    <div class="group relative cursor-pointer">
                        <div class="menu-hover flex items-center gap-1">
                            <img class="h-10 w-auto rounded-full" src="/test.png" alt="logo">
                            <p class="text-xs truncate">Nguyen Quoc Trang</p>
                        </div>
                        <div class="group-hover:visible invisible absolute bg-white w-full shadow-xl">
                            <router-link :to="{ name: 'post' }" class="block border-b p-2 text-xs hover:text-gray-400">
                                Thông tin cá nhân
                            </router-link>
                            <router-link :to="{ name: 'request' }" class="block border-b p-2 text-xs hover:text-gray-400">
                                Yêu cầu
                            </router-link>
                            <router-link :to="{ name: 'manage' }" class="block border-b p-2 text-xs hover:text-gray-400">
                                Quản trị viên
                            </router-link>
                            <router-link :to="{ name: 'login' }" class="block border-b p-2 text-xs hover:text-gray-400">
                                Đăng xuất
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </header>
</template>
