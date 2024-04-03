<script setup>
import { onMounted, ref } from 'vue';
import { usePostStore } from '../../stores/post.store'
import { useUserStore } from '../../stores/user.store'
import { useToast } from 'vue-toast-notification'
import dayjs from 'dayjs'
import Loading from '../common/Loading.vue';

const userStore = useUserStore()
const postStore = usePostStore()
const $toast = useToast()

const emit = defineEmits(['currentPage'])

const posts = ref([])

const getAllPostsByUserId = async () => {
    await postStore.getAllPostsByUserId(userStore.user.id)
    if (postStore.err) {
        return
    }
    posts.value = postStore.result.data
}

const btnDeletePost = async (id) => {
    const conFirm = confirm('Bạn có chắc chắn xóa bài viết này?')
    if (conFirm) {
        await postStore.deletePost(id)
        if (postStore.err) {
            $toast.error(postStore.err, { position: 'top-right' })
            return
        }
        $toast.success(postStore.result.message, { position: 'top-right' })
        await getAllPostsByUserId()
    }
}

onMounted(async () => {
    emit('currentPage', 'post')
    await getAllPostsByUserId()
})
</script>

<template>
    <div v-if="!postStore.isLoading">
        <div v-if="posts.length" v-for="(post, i) in posts" :key="post.id"
            class="border-2 w-full border-blue-600 p-2 rounded-lg mt-2">
            <div class="flex gap-2 w-full">
                <div v-if="post.Image.length" class="w-20%">
                    <img :src="post.Image[0].url" class="w-48 h-48 border-2 rounded-3xl object-cover">
                </div>
                <div class="flex-1 flex flex-col gap-2">
                    <h1 class="">
                        <router-link :to="{ name: 'post-detail', params: { id: post.id } }">
                            <p class="text-base text-justify" v-html="post.description"></p>
                        </router-link>
                    </h1>
                    <hr class="border-t">
                    <div class="flex justify-between items-center">
                        <h2 class="text-sm italic">
                            <i class=" fa-regular fa-clock"></i>
                            {{ dayjs().diff(dayjs(post.updatedAt), 'day') > 0
        ? dayjs(post.updatedAt).format('DD/MM/YYYY') : dayjs(post.updatedAt).fromNow() }}
                        </h2>
                        <h1 class="flex gap-1">
                            <div v-if="post.type == true" class="flex gap-1">
                                <p class="card-found">
                                    TÌM THẤY
                                </p>
                                <p v-if="post.done == -1" class="card-send">
                                    GỬI TẠI BAN QUẢN LÝ TÒA NHÀ
                                </p>
                                <p v-else-if="post?.done == -2" class="card-send">
                                    GỬI TẠI ĐOÀN THANH NIÊN
                                </p>
                            </div>
                            <p v-else class="card-lost">
                                THẤT LẠC
                            </p>
                            <p v-if="post.done == 1" class="card-send">
                                ĐÃ HOÀN THÀNH
                            </p>
                        </h1>
                    </div>
                    <h3 class="">
                        Loại đồ: {{ post.Item.name }}
                    </h3>
                    <h3 class="flex gap-1">
                        Trạng thái:
                        <div>
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
                                    {{ post.feedback }}
                                </span>
                            </span>
                        </div>
                    </h3>
                    <h3 class="flex gap-3 items-center">
                        Tùy chọn:
                        <button @click="async () => { await btnDeletePost(post.id) }">
                            <i class="fa-solid fa-trash text-red-500 cursor-pointer text-xl"></i>
                        </button>
                    </h3>
                </div>
            </div>
        </div>
        <div v-else class="text-xl text-center mt-5 text-red-600 italic">
            Không có bài viết.
        </div>
    </div>
    <div v-else class="py-5">
        <Loading />
    </div>
</template>