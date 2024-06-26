<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Pagination } from 'swiper/modules'
import { usePostStore } from '../stores/post.store'
import { useToast } from 'vue-toast-notification'
import { useConversationStore } from '../stores/conversation.store'
import { useUserStore } from '../stores/user.store'
import { useCommentStore } from '../stores/comment.store'
import Footer from '../components/common/Footer.vue';
import SuggestCard from '../components/common/SuggestCard.vue';
import RequestModal from '../components/post/RequestModal.vue';
import Loading from '../components/common/Loading.vue'
import Comments from '../components/comment/Comments.vue'
import Image from 'primevue/image';
import dayjs from 'dayjs';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const router = useRouter()
const route = useRoute()
const conversationStore = useConversationStore()
const postStore = usePostStore()
const userStore = useUserStore()
const commentStore = useCommentStore()
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

const getAllCommentsByPostId = async () => {
    await commentStore.getAllCommentsByPostId(route.params.id)
    if (commentStore.err) {
        return
    }
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
    await getAllCommentsByPostId()
})
</script>

<template>
    <div class="w-full p-1 lg:p-0 lg:w-[80%] mx-auto flex mt-2 justify-center gap-2">
        <div class="w-full md:w-[80%]">
            <div v-if="!postStore.isLoading" class="bg-white rounded-md p-4 shadow border-2">
                <div class="mb-3 grid grid-cols-3">
                    <div class="cursor-pointer hover:text-red-500 p-1" @click="goBack">
                        <i class="fa-solid fa-arrow-left"></i>
                    </div>
                    <router-link v-if="userStore?.user.id !== post?.User?.id"
                        :to="{ name: 'profile', params: { id: post?.User?.id } }">
                        <h1 class="text-base truncate font-semibold text-center hover:underline">
                            {{ post?.User?.name }}
                        </h1>
                    </router-link>
                    <h1 v-else class="text-base truncate font-semibold text-center">
                        {{ post?.User?.name }}
                    </h1>
                    <div v-if="post?.verify == 0" class="flex justify-end items-center">
                        <h1 class="p-1 border-yellow-200 border-2 rounded font-medium text-yellow-300">
                            Đang chờ duyệt
                        </h1>
                    </div>
                    <div v-else-if="post?.verify == -1" class="flex justify-end items-center">
                        <h1 class="p-1 border-red-600 border-2 rounded font-medium text-red-600">
                            Từ chối
                        </h1>
                    </div>
                    <div v-if="post?.done == 1" class="flex justify-end items-center">
                        <h1 class="p-1 border-blue-600 border-2 rounded font-medium text-blue-600">ĐÃ HOÀN THÀNH</h1>
                    </div>
                </div>
                <div v-if="post?.Image.length">
                    <swiper :centeredSlides="true" :spaceBetween="20" :pagination="{ type: 'fraction' }"
                        :navigation="true" :modules="[Navigation, Pagination]" class="mySwiper">
                        <swiper-slide v-for="image in post?.Image">
                            <div class="bg-slate-400 rounded overflow-hidden flex justify-center items-center">
                                <Image :src="image.url" :alt="image.id" width="300" preview
                                    :pt="{ icon: 'p-image-action' }" />
                            </div>
                        </swiper-slide>
                    </swiper>
                </div>
                <div class="flex flex-col gap-2">
                    <div class="flex justify-between items-center my-1 border-b-[1px]">
                        <div class="flex items-center gap-1">
                            <div
                                class="h-12 w-12 rounded-full overflow-hidden flex items-center justify-center border-2 border-blue-600">
                                <img class="h-full w-full object-cover" :src="post?.User?.image" alt="logo">
                            </div>
                            <div class="flex flex-col">
                                <router-link v-if="userStore?.user.id !== post?.User?.id"
                                    :to="{ name: 'profile', params: { id: post?.User?.id } }">
                                    <p class="text-base truncate font-semibold hover:underline">
                                        {{ post?.User?.name }}
                                    </p>
                                </router-link>
                                <p v-else class="text-base truncate font-semibold">
                                    {{ post?.User?.name }}
                                </p>
                                <span class="text-xs italic">
                                    <i class=" fa-regular fa-clock"></i>
                                    {{ dayjs().diff(dayjs(post?.updatedAt), 'day') > 0
                                        ? dayjs(post?.updatedAt).format('LT L') : dayjs(post?.updatedAt).fromNow() }}
                                </span>
                            </div>
                            <div v-if="userStore?.user.id !== post?.User?.id"
                                class="px-2 cursor-pointer text-2xl hover:text-red-600 text-blue-500"
                                @click="async () => { await goMessage(post?.User?.id) }">
                                <i class="fa-brands fa-facebook-messenger"></i>
                            </div>
                        </div>
                        <div class="flex gap-3 items-center">
                            <div class="flex justify-end items-center">
                                <div v-if="post?.type" class="flex gap-1">
                                    <p class="card-found">
                                        TÌM THẤY
                                    </p>
                                    <p v-if="post?.done == -1" class="card-send">
                                        GỬI TẠI BAN QUẢN LÝ TÒA NHÀ
                                    </p>
                                    <p v-else-if="post?.done == -2" class="card-send">
                                        GỬI TẠI ĐOÀN THANH NIÊN
                                    </p>
                                </div>
                                <p v-else class="card-lost">
                                    THẤT LẠC
                                </p>
                                <p v-if="post?.done == 1" class="card-send">
                                    ĐÃ HOÀN THÀNH
                                </p>
                            </div>
                            <button
                                v-if="userStore?.user.id !== post?.User?.id && post?.done == 0 && post?.verify === 1"
                                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                @click="postStore.showRequestModal">
                                <i class="fa-regular fa-paper-plane mr-1"></i>
                                <span class="hidden md:inline">
                                    {{ post?.type == true ? `Nhận lại đồ vật` : 'Trả lại đồ vật' }}
                                </span>
                            </button>
                        </div>
                    </div>
                    <div>
                        <p class="text-base indent-2 text-justify" v-html="post?.description"></p>
                        <hr class="border-t m-2">
                        <h2 class="text-gray-500 flex gap-1 items-center text-sm">
                            <i class="fa-solid fa-location-dot"></i>
                            <div v-for="(location, i) in post?.Location">
                                {{ location.name }} {{ post?.Location.length - 1 !== i ? '-' : '' }}
                            </div>
                        </h2>
                        <h3 class="text-blue-600 text-sm font-semibold hover:underline cursor-pointer">
                            {{ `#${post?.Item?.name}` }}
                        </h3>
                    </div>
                </div>
            </div>
            <div v-else class="h-screen">
                <Loading />
            </div>
            <div class="my-2" v-if="post?.verify === 1">
                <Comments :postId="route.params.id" />
            </div>
        </div>
    </div>
    <RequestModal :request="post?.type" :postId="post?.id" />
    <Footer />
</template>

<style>
.p-image-action {
    color: white;
}
</style>