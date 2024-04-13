<script setup>
import { ref } from 'vue';
import { useUserStore } from '../stores/user.store'
import Footer from '@/components/common/Footer.vue';

const userStore = useUserStore()

const currentPage = ref('dashboard')

const name = {
    'dashboard': 'THỐNG KÊ',
    'user': 'TÀI KHOẢN',
    'post': 'BÀI VIẾT',
    'item': 'DANH MỤC',
    'location': 'VỊ TRÍ',
    'school': 'TRƯỜNG',
    'major': 'CHUYÊN NGÀNH'
}
</script>

<template>
    <div class="w-[90%] mx-auto flex flex-col gap-2">
        <h1 class="text-2xl font-semibold text-center p-2">QUẢN LÝ {{ name[currentPage] }}</h1>
        <div class="flex gap-2">
            <div class=" flex flex-col gap-2 w-[15%]">
                <router-link :to="{ name: 'dashboard' }" class="rounded-lg shadow p-2 font-medium"
                    v-if="userStore.user?.type == 0"
                    :class="currentPage == 'dashboard' ? 'bg-white text-sky-400 border-2 border-blue-400' : 'text-white  bg-sky-400 hover:bg-sky-500'">
                    <i class="fa-solid fa-chart-pie"></i>
                    Thống kê
                </router-link>
                <router-link :to="{ name: 'post-manage' }" class="rounded-lg shadow p-2 font-medium"
                    v-if="userStore.user?.type == 0 || userStore.user?.type == 1"
                    :class="currentPage == 'post' ? 'bg-white text-sky-400 border-2 border-blue-400' : 'text-white  bg-sky-400 hover:bg-sky-500'">
                    <i class="fa-regular fa-clipboard"></i>
                    Bài viết
                </router-link>
                <router-link :to="{ name: 'user-manage' }" class="rounded-lg shadow p-2 font-medium"
                    v-if="userStore.user?.type == 0"
                    :class="currentPage == 'user' ? 'bg-white text-sky-400 border-2 border-blue-400' : 'text-white  bg-sky-400 hover:bg-sky-500'">
                    <i class="fa-solid fa-user-gear"></i>
                    Tài khoản
                </router-link>
                <router-link :to="{ name: 'item-manage' }" class="rounded-lg shadow p-2 font-medium"
                    v-if="userStore.user?.type == 0"
                    :class="currentPage == 'item' ? 'bg-white text-sky-400 border-2 border-blue-400' : 'text-white  bg-sky-400 hover:bg-sky-500'">
                    <i class="fa-solid fa-folder-minus"></i>
                    Danh mục
                </router-link>
                <router-link :to="{ name: 'location-manage' }" class="rounded-lg shadow p-2 font-medium"
                    v-if="userStore.user?.type == 0"
                    :class="currentPage == 'location' ? 'bg-white text-sky-400 border-2 border-blue-400' : 'text-white  bg-sky-400 hover:bg-sky-500'">
                    <i class="fa-solid fa-location-dot"></i>
                    Vị trí
                </router-link>
                <router-link :to="{ name: 'school-manage' }" class="rounded-lg shadow p-2 font-medium"
                    v-if="userStore.user?.type == 0"
                    :class="currentPage == 'school' ? 'bg-white text-sky-400 border-2 border-blue-400' : 'text-white  bg-sky-400 hover:bg-sky-500'">
                    <i class="fa-solid fa-house"></i>
                    Trường / Khoa
                </router-link>
                <router-link :to="{ name: 'major-manage' }" class="rounded-lg shadow p-2 font-medium"
                    v-if="userStore.user?.type == 0"
                    :class="currentPage == 'major' ? 'bg-white text-sky-400 border-2 border-blue-400' : 'text-white  bg-sky-400 hover:bg-sky-500'">
                    <i class="fa-solid fa-book"></i>
                    Chuyên ngành
                </router-link>
            </div>
            <div class="border-2 border-blue-400 p-4 rounded-lg shadow flex-1">
                <router-view @currentPage="(e) => { currentPage = e }" />
            </div>
        </div>
        <Footer />
    </div>
</template>