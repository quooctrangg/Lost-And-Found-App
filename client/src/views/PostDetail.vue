<script setup>
import { useRouter, useRoute } from 'vue-router'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Pagination } from 'swiper/modules'
import { usePostStore } from '../stores/post.store'
import { useToast } from 'vue-toast-notification'
import { useConversationStore } from '../stores/conversation.store'
import { useUserStore } from '../stores/user.store'
import Footer from '../components/common/Footer.vue';
import SuggestCard from '../components/common/SuggestCard.vue';
import RequestModal from '../components/post/RequestModal.vue';
import Loading from '@/components/common/Loading.vue'
import dayjs from 'dayjs';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { ref } from 'vue';
import { onMounted } from 'vue';

const router = useRouter()
const route = useRoute()
const conversationStore = useConversationStore()
const postStore = usePostStore()
const userStore = useUserStore()
const $toast = useToast()

const post = ref(null)

const goBack = () => {
    router.back()
}

const getPostById = async () => {
    await postStore.getPostById(route.params.id)
    if (postStore.err) {
        goBack()
    }
    post.value = postStore.result.data
}

const goMessage = async (userId) => {
    await conversationStore.accessConversation({ userId: userId })
    if (conversationStore.err) {
        $toast.error(conversationStore.err, { position: 'top-right' })
        return
    }
    $toast.success(conversationStore.result.message, { position: 'top-right' })
    router.push({ name: 'chat' })
}

onMounted(async () => {
    await getPostById()
})
</script>

<template>
    <div v-if="postStore.isLoading == false" class="w-[80%] mx-auto flex gap-2 mt-2">
        <div class="w-[70%] bg-white rounded-md p-4 shadow border-2">
            <div class="mb-3 grid grid-cols-3">
                <div class="cursor-pointer hover:text-red-500 p-1" @click="goBack">
                    <i class="fa-solid fa-arrow-left"></i>
                </div>
                <router-link v-if="userStore?.user.id !== post?.User?.id"
                    :to="{ name: 'profile', params: { id: post?.User?.id } }">
                    <h1 class="text-base truncate font-semibold text-center hover:underline">
                        {{
                            post?.User?.name
                        }}
                    </h1>
                </router-link>
                <h1 v-else class="text-base truncate font-semibold text-center">
                    {{
                        post?.User?.name
                    }}
                </h1>
                <div v-if="post?.verify == 0" class="flex justify-end items-center">
                    <h1 class="p-1 border-yellow-200 border-2 rounded font-medium text-yellow-300">Đang chờ duyệt</h1>
                </div>
            </div>
            <div v-if="post?.Image.length">
                <swiper :centeredSlides="true" :spaceBetween="20" :pagination="{ type: 'fraction' }" :navigation="true"
                    :modules="[Navigation, Pagination]" class="mySwiper">
                    <swiper-slide v-for="image in post?.Image">
                        <div class="bg-slate-400 rounded overflow-hidden flex justify-center items-center">
                            <img class="h-[300px]" :src="image.url" :alt="image.id">
                        </div>
                    </swiper-slide>
                </swiper>
            </div>
            <div class="flex flex-col gap-2">
                <div class="flex justify-between items-center my-1 border-b-[1px]">
                    <div class="flex items-center gap-1">
                        <img class="h-12 w-auto rounded-full" :src="post?.User?.image" alt="logo">
                        <div class="flex flex-col">
                            <router-link v-if="userStore?.user.id !== post?.User?.id"
                                :to="{ name: 'profile', params: { id: post?.User?.id } }">
                                <p class="text-base truncate font-semibold hover:underline">
                                    {{
                                        post?.User?.name
                                    }}
                                </p>
                            </router-link>
                            <p v-else class="text-base truncate font-semibold">
                                {{
                                    post?.User?.name
                                }}
                            </p>
                            <span class="text-xs italic">
                                <i class=" fa-regular fa-clock"></i>
                                {{
                                    dayjs(post?.createdAt).fromNow()
                                }}
                            </span>
                        </div>
                        <div v-if="userStore?.user.id !== post?.User?.id"
                            class="px-2 cursor-pointer text-2xl hover:text-red-600 text-blue-500" @click="async () => {
                                await goMessage(post?.User?.id)
                            }">
                            <i class="fa-brands fa-facebook-messenger"></i>
                        </div>
                    </div>
                    <div class="flex gap-3 items-center">
                        <button v-if="userStore?.user.id !== post?.User?.id && post?.sendProtection == false"
                            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            @click="postStore.showRequestModal">
                            <i class="fa-regular fa-paper-plane mr-1"></i>
                            {{
                                post?.type == true ? `Nhận lại đồ vật` : 'Trả lại đồ vật'
                            }}
                        </button>
                    </div>
                </div>
                <div class="">
                    <div class="grid grid-cols-3">
                        <h1 class="font-semibold text-lg col-span-2">
                            {{
                                post?.title
                            }}
                        </h1>
                        <div class="flex justify-end items-center">
                            <div v-if="post?.type" class="flex gap-1">
                                <p v-if="post?.sendProtection"
                                    class="border-2 border-red-500 p-1 text-xs font-semibold text-red-500 rounded">
                                    GỬI LẠI BAN QUẢN LÝ TÒA NHÀ
                                </p>
                                <p class="border-2 border-blue-500 p-1 text-xs font-semibold text-blue-500 rounded">
                                    TÌM THẤY
                                </p>
                            </div>
                            <p v-else class="border-2 border-orange-500 p-1 text-xs font-semibold text-orange-500 rounded">
                                THẤT LẠC
                            </p>
                        </div>

                    </div>
                    <h2 class="text-gray-500 flex gap-1 items-center text-sm">
                        <i class="fa-solid fa-location-dot"></i>
                        <div v-for="(location, i) in post?.Location">
                            {{ location.name }} {{ post?.Location.length - 1 !== i ? '-' : '' }}
                        </div>
                    </h2>
                    <div>
                        <h2 class="font-semibold text-sm">Mô tả:</h2>
                        <p class="text-sm indent-2 text-justify  ">
                            {{
                                post?.description
                            }}
                        </p>
                    </div>
                    <h3 class="text-blue-600 text-sm font-semibold hover:underline cursor-pointer">
                        {{
                            `#${post?.Item?.name}`
                        }}
                    </h3>
                </div>
            </div>
        </div>
        <div class="w-[30%] bg-white rounded-md p-2 shadow">
            <h1 class="text-center font-semibold text-xl italic border-b">Gợi ý</h1>
            <SuggestCard v-if="userStore?.user.id !== post?.User?.id" />
        </div>
    </div>
    <div v-else class="h-screen">
        <Loading />
    </div>
    <div class="w-[80%] mx-auto mt-2">
        <div class="w-[70%] bg-white rounded-md p-2 shadow">
            <div class="p-2 text-sm text-gray-700 underline">
                4 bình luận
            </div>
            <div class="p-2">
                <div class="flex gap-2 mt-2">
                    <img class="h-8 w-auto rounded-full" src="/logo.png" alt="logo">
                    <div>
                        <div class="bg-gray-100 rounded-lg shadow p-1">
                            <h1 class="text-sm font-medium">Vo Van Kiet</h1>
                            <div class="text-xs">
                                Bạn nhặt nó ở phòng họp 201/B1 đúng không
                            </div>
                        </div>
                        <div class="flex gap-2 text-xs indent-2">
                            <h1 class="text-gray-600">1 ngày trước</h1>
                            <h1 class="cursor-pointer hover:text-red-500">Phản hồi</h1>
                        </div>
                    </div>
                </div>
                <div class="">
                    <div class="flex gap-2 mt-2">
                        <img class="h-8 w-auto rounded-full" src="/logo.png" alt="logo">
                        <div>
                            <div class="bg-gray-100 rounded-lg shadow p-1">
                                <h1 class="text-sm font-medium">Nguyen Van A</h1>
                                <div class="text-xs">
                                    Tôi muốn xem chi tiết
                                </div>
                            </div>
                            <div class="flex gap-2 text-xs indent-2">
                                <h1 class="text-gray-600">Vài giây trước</h1>
                                <h1 class="cursor-pointer hover:text-red-500">Phản hồi</h1>
                            </div>
                        </div>
                    </div>
                    <div class="ml-8">
                        <div class="flex gap-2 mt-2">
                            <img class="h-8 w-auto rounded-full" src="/test.png" alt="logo">
                            <div>
                                <div class="bg-gray-100 rounded-lg shadow p-1">
                                    <h1 class="text-sm font-medium">Nguyen Van C</h1>
                                    <div class="text-xs">
                                        <span class="font-semibold text-blue-500">Nguyen Van A</span> Hãy nhắn tin cho tôi
                                    </div>
                                </div>
                                <div class="flex gap-2 text-xs indent-2">
                                    <h1 class="text-gray-600">Vài giây trước</h1>
                                    <h1 class="cursor-pointer hover:text-red-500">Phản hồi</h1>
                                </div>
                            </div>
                        </div>
                        <div class="flex gap-2 mt-2">
                            <img class="h-8 w-auto rounded-full" src="/logo.png" alt="logo">
                            <div>
                                <div class="bg-gray-100 rounded-lg shadow p-1">
                                    <h1 class="text-sm font-medium">Nguyen Van A</h1>
                                    <div class="text-xs">
                                        <span class="font-semibold">Nguyen Van B</span> Ok
                                    </div>
                                </div>
                                <div class="flex gap-2 text-xs indent-2">
                                    <h1 class="text-gray-600">Vài giây trước</h1>
                                    <h1 class="cursor-pointer hover:text-red-500">Phản hồi</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <div v-if="false" class="text-xs text-gray-700 flex gap-2 p-1">
                    <p>Đang phản hồi <span class="font-semibold">Vo Van Kiet</span></p>
                    <button class="text-red-600 hover:text-red-400">Hủy</button>
                </div>
                <div class="flex justify-between items-center bg-gray-200 p-1 rounded shadow">
                    <input type="text" placeholder="Nhập bình luận..."
                        class="p-1 w-full border-none outline-none border-transparent focus:border-transparent focus:ring-0 bg-gray-200">
                    <div class="flex gap-3 mx-2 hover:text-blue-500">
                        <span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                stroke="currentColor" class="w-6 h-6 cursor-pointer">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                            </svg>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <RequestModal :request="post?.type" :postId="post?.id" />
    <Footer />
</template>