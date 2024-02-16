<script setup>
import { ref } from 'vue';
import { useUserStore } from '../stores/user.store'
import Footer from '../components/common/Footer.vue';
import UpdatePassword from '../components/profile/UpdatePassword.vue';
import UpdateProfileModal from '../components/profile/UpdateProfileModal.vue';
import UpdateAvatarModal from '../components/profile/UpdateAvatarModal.vue';
import ScrollToTop from '@/components/common/ScrollToTop.vue';
import dayjs from 'dayjs'
import { onMounted } from 'vue';

const userStore = useUserStore()

const total = ref(0)
const currentPage = ref('post')

const totalPost = (posts) => {
    posts?.forEach(e => {
        if (e.verify == 1) {
            total.value = total.value + 1
        }
    })
}

onMounted(() => {
    totalPost(userStore.user.Post)
})
</script>

<template>
    <div class="w-[80%] mx-auto min-h-[100vh]">
        <div class="bg-gray-50 rounded p-4 flex gap-5 shadow">
            <div class="relative">
                <img class="w-32 h-32 border-2 rounded-full object-cover hover:border-sky-300" :src="userStore.user?.image"
                    alt="logo">
                <div @click="userStore.showUpdateAvatarModal"
                    class="absolute bottom-4 right-4 mb-2 mr-2 bg-gray-300 rounded-full h-6 w-6 flex justify-center items-center text-lg hover:bg-gray-50 cursor-pointer">
                    <i class="fa-solid fa-camera"></i>
                </div>
            </div>
            <div class="flex flex-col gap-2 flex-1">
                <h1 class="font-bold text-xl">
                    {{
                        userStore.user?.name
                    }}
                </h1>
                <h2 class="text-base text-gray-600 indent-3">
                    Trường/Khoa:
                    {{
                        userStore.user?.School?.name
                    }}
                </h2>
                <h2 class="text-base text-gray-600 indent-3">
                    Email:
                    {{
                        userStore.user?.email
                    }}
                </h2>
                <h2 class="text-base text-gray-600 indent-3">
                    Tham gia vào ngày
                    {{
                        dayjs(userStore.user?.createAt).format('DD, MMMM, YYYY')
                    }}
                </h2>
                <h2 class="text-base">
                    Số lượng bài viết:
                    {{
                        total
                    }}
                </h2>
            </div>
            <div class="flex flex-col gap-1 justify-end">
                <button class="bg-sky-400 rounded-lg text-sm p-2 text-center text-slate-700 font-semibold hover:bg-sky-500"
                    @click="userStore.showUpdateProfileModal">
                    <i class="fa-solid fa-pen"></i>
                    Chỉnh sửa thông tin
                </button>
                <button class="bg-sky-400 rounded-lg text-sm p-2 text-center text-slate-700 font-semibold hover:bg-sky-500"
                    @click="userStore.showUpdatePasswordModal">
                    <i class="fa-solid fa-key"></i>
                    Đổi mật khẩu
                </button>
            </div>
        </div>
        <div>
            <div class="flex gap-5 font-semibold text-gray-500 mb-4">
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
    <Footer />
    <UpdatePassword />
    <UpdateProfileModal />
    <UpdateAvatarModal />
    <ScrollToTop />
</template>