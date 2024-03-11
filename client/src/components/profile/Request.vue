<script setup>
import { onMounted } from 'vue';
import { useRequestStore } from '../../stores/request.store'
import { ref } from 'vue';
import { useToast } from 'vue-toast-notification'
import Loading from '../common/Loading.vue';
import dayjs from 'dayjs';

const requestStore = useRequestStore()
const $toast = useToast()

const emit = defineEmits(['currentPage'])

const requests = ref([])

const getAllRequestsByUserId = async () => {
    await requestStore.getAllRequestsByUserId()
    if (requestStore.err) {
        return
    }
    requests.value = requestStore.result.data
}

const acceptRequest = async (id) => {
    const conFirm = confirm('Bạn có chắc chắn chấp nhận?')
    if (!conFirm) return
    await requestStore.acceptRequest({ idRequest: id })
    if (requestStore.err) {
        $toast.error(requestStore.err, { position: 'top-right' })
        return
    }
    $toast.success(requestStore.result.message, { position: 'top-right' })
    await getAllRequestsByUserId()
}

const rejectRequest = async (id) => {
    const conFirm = confirm('Bạn có chắc chắn từ chối?')
    if (!conFirm) return
    await requestStore.rejectRequest({ idRequest: id })
    if (requestStore.err) {
        $toast.error(requestStore.err, { position: 'top-right' })
        return
    }
    $toast.success(requestStore.result.message, { position: 'top-right' })
    await getAllRequestsByUserId()
}

onMounted(async () => {
    emit('currentPage', 'request')
    await getAllRequestsByUserId()
})
</script>

<template>
    <div v-if="requestStore.isLoading == false">
        <div v-if="requests.length" v-for="request in requests" :key="request.id"
            class="border bg-white rounded-md shadow p-2 my-2">
            <div class="border-b flex justify-between items-center">
                <div class="flex items-center gap-1">
                    <div class="h-12 w-12 rounded-full overflow-hidden flex items-center justify-center">
                        <img class="h-full w-full  object-cover" :src="request.User.image" alt="logo">
                    </div>
                    <div class="flex flex-col">
                        <p class="text-base font-semibold truncate">
                            {{ request.User.name }}
                        </p>
                        <span class="text-xs italic">
                            <i class=" fa-regular fa-clock"></i>
                            {{ dayjs(request.createdAt).fromNow() }}
                        </span>
                    </div>
                </div>
                <div class="flex gap-2 text-sm">
                    <button @click="async () => { await acceptRequest(request.id) }"
                        class="p-1 border-2 font-semibold border-blue-500 rounded-lg text-blue-500 hover:bg-blue-500 hover:text-white">
                        Chấp nhận
                    </button>
                    <button @click="async () => { await rejectRequest(request.id) }"
                        class="p-1 border-2 font-semibold border-red-500 rounded-lg text-red-500 hover:bg-red-500 hover:text-white">
                        Từ chối
                    </button>
                </div>
            </div>
            <div class="">
                <h1 class="font-semibold text-base py-2">
                    Yêu cầu cho bài viết:
                    <router-link :to="{ name: 'post-detail', params: { id: request.postId } }"
                        class="hover:underline hover:text-blue-600 font-normal">
                        {{ request.Post.description }}
                    </router-link>
                </h1>
                <h1 class="py-1">
                    <span class="font-medium">Nội dung yêu cầu: </span>
                    {{ request.description }}
                </h1>
            </div>
        </div>
        <div v-else class="text-xl text-center mt-5 text-red-600 italic">
            Không có yêu cầu.
        </div>
    </div>
    <div v-else class="">
        <Loading />
    </div>
</template>