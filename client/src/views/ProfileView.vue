<script setup>
import { onMounted, ref } from 'vue';
import { useUserStore } from '../stores/user.store'
import { useConversationStore } from '../stores/conversation.store'
import { usePostStore } from '../stores/post.store'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toast-notification'
import Footer from '../components/common/Footer.vue';
import Loading from '@/components/common/Loading.vue';
import ScrollToTop from '@/components/common/ScrollToTop.vue';
import dayjs from 'dayjs'

const userStore = useUserStore()
const conversationStore = useConversationStore()
const postStore = usePostStore()
const route = useRoute()
const router = useRouter()
const $toast = useToast()

const profile = ref(null)
const posts = ref([])

const getProfileUser = async () => {
    await userStore.getProfileUser(route.params.id)
    profile.value = userStore.result?.data
    if (!profile.value) {
        router.back()
        return
    }
    if (route.params.id == userStore.user.id) {
        router.push({ name: 'post' })
        return
    }
}

const getAllPostsByUserId = async () => {
    await postStore.getAllPostsByUserId(route.params.id)
    posts.value = postStore.result.data
}

const goBack = () => {
    router.back()
}

const goMessage = async () => {
    await conversationStore.accessConversation({ userId: profile.value?.id })
    if (conversationStore.err) {
        $toast.error(conversationStore.err, { position: 'top-right' })
        return
    }
    $toast.success(conversationStore.result.message, { position: 'top-right' })
    router.push({ name: 'chat' })
}

onMounted(async () => {
    await getProfileUser()
    await getAllPostsByUserId()
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
                    <span class="text-gray-400 text-lg">
                        {{
                            `#${route.params.id}`
                        }}
                    </span>
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
                <button class="border-2 border-blue-600 rounded-lg text-sm p-2 text-center text-blue-600 font-semibold"
                    @click="goMessage">
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
        <div class="mx-auto">
            <div v-for="(post, i) in posts" :key="post.id"
                class="border-2 w-full border-blue-600 p-2 rounded-lg flex gap-4 items-center mt-2">
                <div v-if="post.Image.length" class="w-20%">
                    <img :src="post.Image[0].url" class="w-48 h-48 border-2 rounded-3xl object-cover">
                </div>
                <div class="flex-1 flex flex-col gap-2">
                    <div class="flex justify-between items-center">
                        <h1 class="text-xl font-semibold flex-1">
                            {{
                                post.title
                            }}
                        </h1>
                        <h1 class="flex gap-1">
                            <div v-if="post.type == true" class="flex gap-1">
                                <p v-if="post.sendProtection"
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
                            <p v-if="post.done"
                                class="border-2 border-green-600 p-1 text-xs font-semibold text-green-600 rounded">
                                HOÀN THÀNH
                            </p>
                        </h1>
                    </div>
                    <h2 class="text-sm">
                        {{ dayjs(post.createdAt).fromNow() }}
                    </h2>
                    <h1 class="">
                        <h2 class="font-semibold text-sm">Mô tả:</h2>
                        <p class="text-sm indent-2 text-justify  ">
                            {{
                                post.description
                            }}
                        </p>
                    </h1>
                    <h2 class="text-gray-500 flex gap-1 items-center text-sm">
                        <i class="fa-solid fa-location-dot"></i>
                        <div v-for="(location, i) in post.Location">
                            {{ location.name }} {{ post.Location.length - 1 !== i ? '-' : '' }}
                        </div>
                    </h2>
                    <h3 class="text-blue-600 text-sm font-semibold hover:underline cursor-pointer">
                        #{{ post.Item.name }}
                    </h3>
                </div>
            </div>
        </div>
    </div>
    <div v-else class="w-[80%] mx-auto min-h-[100vh] flex items-center">
        <Loading />
    </div>
    <Footer />
    <ScrollToTop />
</template>