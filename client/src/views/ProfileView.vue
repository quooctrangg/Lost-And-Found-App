<script setup>
import { onMounted, ref } from 'vue';
import { useUserStore } from '../stores/user.store'
import { useRoute, useRouter } from 'vue-router'
import Footer from '../components/common/Footer.vue';
import Loading from '@/components/common/Loading.vue';
import PostCard from '@/components/common/PostCard.vue';
import ScrollToTop from '@/components/common/ScrollToTop.vue';
import dayjs from 'dayjs'

const userStore = useUserStore()
const route = useRoute()
const router = useRouter()

const profile = ref(null)

const getProfileUser = async () => {
    if (route.params.id == profile?.id) {
        router.push({ name: 'post' })
        return
    }
    await userStore.getProfileUser(route.params.id)
    profile.value = userStore.result?.data
    if (!profile.value) {
        router.back()
        return
    }
}

const goBack = () => {
    router.back()
}

onMounted(async () => {
    await getProfileUser()
})
</script>

<template>
    <div v-if="userStore.isLoading == false" class="w-[80%] mx-auto min-h-[100vh]">
        <div class="bg-gray-50 rounded p-4 flex gap-5 shadow">
            <div class="cursor-pointer hover:text-red-500 p-1 text-xl" @click="goBack">
                <i class="fa-solid fa-arrow-left"></i>
            </div>
            <div>
                <img class="w-32 h-32 border-2 rounded-full object-cover" :src="profile?.image" alt="logo">
            </div>
            <div class="flex flex-col gap-2 flex-1">
                <h1 class="font-bold text-xl">
                    {{
                        profile?.name
                    }}
                </h1>
                <h2 class="text-base text-gray-600 indent-3">
                    Trường/Khoa: {{ profile?.School?.name }}
                </h2>
                <h2 class="text-base text-gray-600 indent-3">
                    Tham gia vào ngày {{ dayjs(profile?.createAt).format('DD, MMMM, YYYY') }}
                </h2>
                <h2 class="text-base">
                    Số lượng bài viết: {{ profile?.Post.length || 0 }}
                </h2>
            </div>
            <div class="flex flex-col gap-1 justify-end">
                <button class="border-2 border-blue-600 rounded-lg text-sm p-2 text-center text-blue-600 font-semibold">
                    <i class="fa-brands fa-facebook-messenger"></i>
                    Nhắn tin
                </button>
            </div>
        </div>
        <div>
            <div class="flex gap-5 font-semibold text-gray-500 mb-4">
                <div class="text-blue-500 border-b-4 border-blue-500 p-2">
                    Bài viết
                </div>
            </div>
        </div>
        <div class="w-[70%] mx-auto">
            <PostCard />
        </div>
    </div>
    <div v-else class="w-[80%] mx-auto min-h-[100vh] flex items-center">
        <Loading />
    </div>
    <Footer />
    <ScrollToTop />
</template>