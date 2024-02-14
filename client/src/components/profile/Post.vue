<script setup>
import { onMounted, ref } from 'vue';
import { usePostStore } from '../../stores/post.store'
import { useUserStore } from '../../stores/user.store'
import dayjs from 'dayjs'

const userStore = useUserStore()
const postStore = usePostStore()

const emit = defineEmits(['currentPage'])

const posts = ref([])

const getAllPostsByUserId = async () => {
    await postStore.getAllPostsByUserId(userStore.user.id)
    posts.value = postStore.result.data
    console.log(posts.value);
}

onMounted(async () => {
    emit('currentPage', 'post')
    await getAllPostsByUserId()
})
</script>

<template>
    <div class="">
        <div v-for="(post, i) in posts" :key="post.id"
            class="border-2 w-full border-blue-600 p-2 rounded-lg flex gap-4 items-center mt-2">
            <div v-if="post.Image.length" class="w-20%">
                <img :src="post.Image[0].url" class="w-48 h-48 border-2 rounded-3xl object-cover">
            </div>
            <div class="flex-1 flex flex-col gap-2">
                <div class="flex justify-between items-center">
                    <h1 class="text-xl font-semibold flex-1 hover:underline hover:text-blue-600">
                        <router-link :to="{ name: 'post-detail', params: { id: post.id } }">
                            {{
                                post.title
                            }}
                        </router-link>
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
                <h3>
                    Trạng thái:
                    <span v-if="post.verify == 0" class="text-yellow-400">
                        Đang chờ
                    </span>
                    <span v-if="post.verify == 1" class="text-green-600">
                        Đã duyệt
                    </span>
                    <span v-if="post.verify == -1" class="text-red-600">
                        Từ chối
                        <span class="text-black text-sm">
                            - Lý do:
                            {{
                                post.feedback
                            }}
                        </span>
                    </span>
                </h3>
                <h3 class="flex gap-3 items-center">
                    Tùy chọn:
                    <i v-if="post.verify == 0" class="fa-solid fa-pen text-green-400 cursor-pointer text-2xl"></i>
                    <i class="fa-solid fa-trash text-red-500 cursor-pointer text-2xl"></i>
                </h3>
            </div>
        </div>
    </div>
</template>