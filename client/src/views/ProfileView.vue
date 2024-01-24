<script setup>
import { ref } from 'vue';

const currentPage = ref('post')
</script>

<template>
    <div class="w-[80%] mx-auto">
        <div class="bg-white rounded p-4 my-4 flex gap-5">
            <div class="relative">
                <img class="w-32 h-32 border-2 rounded-full object-cover hover:border-sky-300" src="/test.png" alt="logo">
                <div
                    class="absolute bottom-0 right-3 mb-2 mr-2 bg-gray-300 rounded-full h-6 w-6 flex justify-center items-center text-lg hover:bg-gray-50">
                    <i class="fa-solid fa-camera"></i>
                </div>
            </div>
            <div class="flex flex-col gap-2 flex-1">
                <h1 class="font-bold text-lg">Nguyen Quoc Trang</h1>
                <h2 class="text-sm text-gray-400 indent-3">Trường/Khoa: Công nghệ thông tin và truyền thông</h2>
                <h2 class="text-sm text-gray-400 indent-3">Email: quuoctrangg@gmail.com</h2>
                <h2 class="text-sm text-gray-400 indent-3">Tham gia vào ngày 1 tháng 1 năm 2024</h2>
                <h2 class="text-sm">Số lượng bài viết: 10</h2>
            </div>
            <div class="flex flex-col gap-1 justify-end">
                <button class="bg-sky-200 rounded-lg text-sm p-2 text-center text-slate-700 font-semibold hover:bg-sky-300">
                    <i class="fa-solid fa-pen"></i>
                    Chỉnh sửa thông tin
                </button>
                <button class="bg-sky-200 rounded-lg text-sm p-2 text-center text-slate-700 font-semibold hover:bg-sky-300">
                    <i class="fa-solid fa-key"></i>
                    Đổi mật khẩu
                </button>
            </div>
        </div>
        <div>
            <div class="flex gap-5 font-semibold text-gray-500">
                <router-link class="p-2" :class="currentPage == 'post' ? 'text-blue-500 border-b-4 border-blue-500' : ''"
                    :to="{ name: 'post' }">
                    Bài viết
                </router-link>
                <router-link class="p-2" :class="currentPage == 'request' ? 'text-blue-500 border-b-4 border-blue-500' : ''"
                    :to="{ name: 'request' }">
                    Yêu cầu
                </router-link>
            </div>
            <router-view @currentPage="(e) => { currentPage = e }" />
        </div>
    </div>
</template>