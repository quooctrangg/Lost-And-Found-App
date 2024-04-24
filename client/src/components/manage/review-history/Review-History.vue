<script setup>
import { onMounted, watchEffect } from 'vue';
import { usePostStore } from '../../../stores/post.store'
import Loading from '@/components/common/Loading.vue';
import { FwbPagination } from 'flowbite-vue'
import dayjs from 'dayjs'

const postStore = usePostStore()

const emits = defineEmits(['currentPage'])

const getAllPostForAdmin = async () => {
    await postStore.reviewHistory({ page: postStore.currentPage })
}

watchEffect(async () => {
    await postStore.reviewHistory({ page: postStore.currentPage })
})

onMounted(async () => {
    emits('currentPage', 'review-history')
    postStore.currentPage = 1
    await getAllPostForAdmin()
})
</script>

<template>
    <div class="flex flex-col gap-5">
        <div class="w-full">
            <div class="text-red-600 mt-2">
                Tổng cộng: {{ postStore.totalCount }} bài viết.
            </div>
            <table class="table-fixed w-full mt-5">
                <thead class="font-medium">
                    <tr class="text-left border-b border-black">
                        <th class="text-center w-[5%] pb-2">
                            STT
                        </th>
                        <th class="w-[25%] pb-2">
                            Mô tả
                        </th>
                        <th class="text-center pb-2">
                            Trạng thái
                        </th>
                        <th class="text-center pb-2">
                            Ngày đăng
                        </th>
                        <th class="text-center pb-2">
                            Ngày duyệt
                        </th>
                    </tr>
                </thead>
                <tbody v-if="!postStore.isLoading">
                    <tr v-if="postStore.posts.length" v-for="(post, i) in postStore.posts" :key="post.id"
                        class="border-b transition duration-300 ease-in-out hover:bg-gray-300">
                        <td class="  font-medium text-center w-[10%]">
                            <router-link :to="{ name: 'post-detail', params: { id: post.id } }"
                                class="hover:text-blue-500 hover:underline p-2">
                                {{ (postStore.currentPage - 1) * 10 + i + 1 }}
                            </router-link>
                        </td>
                        <td>
                            <div class="line-clamp-2 text-sm" v-html="post.description"></div>
                        </td>
                        <td v-if="post.verify == 0" class=" text-yellow-300 text-center">
                            Chờ duyệt
                        </td>
                        <td v-else-if="post.verify == 1" class=" text-blue-500 text-center">
                            Đã duyệt
                        </td>
                        <td v-else class=" text-red-500 text-center">
                            Từ chối
                        </td>
                        <td class="text-center text-sm">
                            {{ dayjs(post.createdAt).format('LT DD/MM/YYYY') }}
                        </td>
                        <td class="text-center text-sm">
                            {{ dayjs(post.updatedAt).format('LT DD/MM/YYYY') }}
                        </td>
                    </tr>
                    <tr v-else class="text-center text-red-500 text-xl">
                        <td colspan="5">
                            Danh sách trống.
                        </td>
                    </tr>
                </tbody>
                <tbody v-else>
                    <tr>
                        <td colspan="5" class="h-screen">
                            <Loading />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="w-full text-center" v-if="postStore.totalPages >= 2">
            <FwbPagination v-model="postStore.currentPage" :total-pages="postStore.totalPages" :show-icons="true"
                :show-labels="false" />
        </div>
    </div>
</template>