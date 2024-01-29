<script setup>
import { ref } from 'vue';

const currentPage = ref('dashboard')
</script>

<template>
    <div class="w-[90%] mx-auto flex flex-col gap-2">
        <h1 class="text-2xl font-semibold text-center p-2">QUẢN LÝ</h1>
        <div class="grid grid-cols-5 gap-3">
            <div class=" flex flex-col gap-2 ">
                <router-link :to="{ name: 'dashboard' }" class="rounded-lg shadow p-2 font-medium"
                    :class="currentPage == 'dashboard' ? 'bg-white text-sky-400 border-2 border-blue-400' : 'text-white  bg-sky-400 hover:bg-sky-500'">
                    <i class="fa-solid fa-chart-pie"></i>
                    Thống kê
                </router-link>
                <router-link :to="{ name: 'user-manage' }" class="rounded-lg shadow p-2 font-medium"
                    :class="currentPage == 'user' ? 'bg-white text-sky-400 border-2 border-blue-400' : 'text-white  bg-sky-400 hover:bg-sky-500'">
                    <i class="fa-solid fa-user-gear"></i>
                    Tài khoản
                </router-link>
                <router-link :to="{ name: 'post-manage' }" class="rounded-lg shadow p-2 font-medium"
                    :class="currentPage == 'post' ? 'bg-white text-sky-400 border-2 border-blue-400' : 'text-white  bg-sky-400 hover:bg-sky-500'">
                    <i class="fa-regular fa-clipboard"></i>
                    BÀI VIẾT
                </router-link>
                <router-link :to="{ name: 'item-manage' }" class="rounded-lg shadow p-2 font-medium"
                    :class="currentPage == 'item' ? 'bg-white text-sky-400 border-2 border-blue-400' : 'text-white  bg-sky-400 hover:bg-sky-500'">
                    <i class="fa-solid fa-folder-minus"></i>
                    DANH MỤC
                </router-link>
                <router-link :to="{ name: 'location-manage' }" class="rounded-lg shadow p-2 font-medium"
                    :class="currentPage == 'location' ? 'bg-white text-sky-400 border-2 border-blue-400' : 'text-white  bg-sky-400 hover:bg-sky-500'">
                    <i class="fa-solid fa-location-dot"></i>
                    VỊ TRÍ
                </router-link>
                <router-link :to="{ name: 'school-manage' }" class="rounded-lg shadow p-2 font-medium"
                    :class="currentPage == 'school' ? 'bg-white text-sky-400 border-2 border-blue-400' : 'text-white  bg-sky-400 hover:bg-sky-500'">
                    <i class="fa-solid fa-house"></i>
                    TRƯỜNG / KHOA
                </router-link>
            </div>

            <div class="border-2 border-blue-400 p-4 rounded-lg shadow col-span-4">
                <router-view @currentPage="(e) => { currentPage = e }" />
            </div>
        </div>
    </div>
</template>