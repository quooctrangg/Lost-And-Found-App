<script setup>
import { onMounted, ref, watch, watchEffect } from 'vue'
import { FwbPagination } from 'flowbite-vue'
import { useManageStore } from '../../../stores/manage.store'
import { usePostStore } from '../../../stores/post.store'
import { useToast } from 'vue-toast-notification'
import Seach from '../../common/Seach.vue';
import RefuseModal from './RefuseModal.vue';
import HistoryModal from './HistoryModal.vue'
import Loading from '@/components/common/Loading.vue';
import dayjs from 'dayjs'

const manageStore = useManageStore()
const postStore = usePostStore()
const $toast = useToast()

const emit = defineEmits(['currentPage'])

const curentDate = dayjs()
const currentPostId = ref(null)
const currentFeedback = ref(null)
const isShow = ref(false)
const verify = ref(null)
const key = ref('')
const sortByDate = ref(null)
const to = ref(curentDate.subtract(1, 'month').format('YYYY-MM-DD'),)
const from = ref(dayjs(new Date()).format('YYYY-MM-DD'))

const verifyPost = async (id, data) => {
    const conFirm = confirm('Bạn có chắc chắn xác nhận bài viết này?')
    if (conFirm) {
        await postStore.verifyPost(id, data)
        if (postStore.err) {
            $toast.error(postStore.err, { position: 'top-right' })
            return
        }
        $toast.success(postStore.result.message, { position: 'top-right' })
        await getAllPostForAdmin()
    }
}

const deletePost = async (id) => {
    const conFirm = confirm('Bạn có chắc chắn xóa bài viết này?')
    if (conFirm) {
        await postStore.deletePost(id)
        if (postStore.err) {
            $toast.error(postStore.err, { position: 'top-right' })
            return
        }
        $toast.success(postStore.result.message, { position: 'top-right' })
        await getAllPostForAdmin()
    }
}

const getAllPostForAdmin = async () => {
    await postStore.getAllPostsForAdmin({ page: postStore.currentPage, verify: verify.value, key: key.value, to: to.value, from: from.value })
}

const showHistory = () => {
    isShow.value = true
}

const closeHistory = () => {
    isShow.value = false
}

watchEffect(async () => {
    if (!sortByDate.value) {
        await postStore.getAllPostsForAdmin({ page: postStore.currentPage, verify: verify.value, key: key.value })
    } else {
        await postStore.getAllPostsForAdmin({ page: postStore.currentPage, verify: verify.value, key: key.value, to: to.value, from: from.value })
    }
})

onMounted(async () => {
    emit('currentPage', 'post')
    await getAllPostForAdmin()
})
</script>

<template>
    <div class="flex flex-col gap-5">
        <div class="w-full">
            <div class="flex gap-2 items-center w-full justify-between">
                <div class="border border-black rounded-xl">
                    <Seach :title="'Tìm kiếm bài viết'" @key="(e) => { key = e }" />
                </div>
                <div class="flex gap-1 items-center">
                    <label for="type">Trạng thái:</label>
                    <select name="" id="type" class="p-2 rounded cursor-pointer" v-model="verify">
                        <option :value="null">Tất cả</option>
                        <option :value="1">Đã duyệt</option>
                        <option :value="-1">Từ chối</option>
                        <option :value="0">Chờ duyệt</option>
                    </select>
                </div>
            </div>
            <div class="flex items-center gap-1 mt-2">
                <label for="sortByDate">
                    Thời gian:
                </label>
                <select id="sortByDate" class="rounded p-2 cursor-pointer" v-model="sortByDate">
                    <option :value="null">Tất cả</option>
                    <option value="any">Tùy chọn</option>
                </select>
                <div v-if="sortByDate" class="flex gap-1 items-center">
                    <label for="to">
                        Từ ngày:
                    </label>
                    <input id="to" type="date" class="rounded p-2 text-sm font-medium cursor-pointer" v-model="to">
                    <label for="from">
                        đến ngày:
                    </label>
                    <input id="from" type="date" class="rounded p-2 text-sm font-medium cursor-pointer" v-model="from">
                </div>
            </div>
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
                        <th colspan="3" class="text-center pb-2 w-[15%]">
                            Tùy chọn
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
                        <td v-if="post.verify !== -1">
                            <div class="" v-if="post.verify == 0">
                                <button class="p-2 text-blue-500 hover:text-blue-400 text-2xl"
                                    @click="async () => { await verifyPost(post.id, { verify: 1 }) }">
                                    <i class="fa-solid fa-check"></i>
                                </button>
                            </div>
                        </td>
                        <td v-if="post.verify !== -1">
                            <div class="" v-if="post.verify == 0">
                                <button class="p-2 text-red-500 hover:text-red-300 text-2xl" @click="() => {
                                    manageStore.showRefuseModal()
                                    currentPostId = post.id
                                }">
                                    <i class="fa-solid fa-ban"></i>
                                </button>
                            </div>
                        </td>
                        <td colspan="2" v-if="post.verify == -1" class="">
                            <div class="text-center text-2xl text-orange-500 cursor-pointer" @click="() => {
                                currentFeedback = post.feedback
                                showHistory()
                            }">
                                <i class="fa-regular fa-eye"></i>
                            </div>
                        </td>
                        <td class="">
                            <div class="">
                                <button class="p-2 text-yellow-300 hover:text-yellow-200 text-2xl"
                                    @click="async () => { await deletePost(post.id) }">
                                    <i class="fa-solid fa-trash-can"></i>
                                </button>
                            </div>
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
        <RefuseModal @submitFeedback="async (e) => {
            await verifyPost(currentPostId, { verify: -1, feedback: e })
            manageStore.closeRefuseModal()
        }" />
        <HistoryModal :isShow="isShow" :currentFeedback="currentFeedback" @closeHistory="closeHistory" />
    </div>
</template>