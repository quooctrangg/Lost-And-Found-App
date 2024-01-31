<script setup>
import { FwbModal } from 'flowbite-vue'
import { usePostStore } from '../../stores/post.store'

const postStore = usePostStore()
</script>
<template>
    <fwb-modal v-if="postStore.isShow.request" @close="postStore.closeRequestModal">
        <template #header>
            <div class="flex items-center gap-2 font-semibold text-2xl">
                <i class="fa-regular fa-paper-plane"></i>
                Gửi yêu cầu
            </div>
        </template>
        <template #body>
            <h1 v-if="true" class="text-lg font-medium mb-2">Tôi muốn nhận đồ vật này</h1>
            <h1 v-else class="text-lg font-medium mb-2">Tôi muốn gửi trả đồ vật này</h1>
            <p class="text-sm">
                Vui lòng mô tả càng nhiều chi tiết về mặt hàng không hiển thị hoặc không được mô tả để công cụ tìm có thể
                nhận ra bạn là chủ sở hữu. Và nếu có thể, hãy cung cấp càng nhiều thông tin càng tốt về nơi bạn làm mất đồ
                (ví dụ: thời gian và địa điểm). Hãy cẩn thận khi chia sẻ thông tin cá nhân.
            </p>
            <textarea placeholder="Nhập mô tả ..." class="rounded-md w-full" maxlength="250"></textarea>
        </template>
        <template #footer>
            <div class="flex justify-end gap-2">
                <button @click="postStore.closeRequestModal" class="px-2 py-1 bg-red-500 rounded-lg text-white">
                    <i class="fa-solid fa-xmark"></i>
                    Hủy
                </button>
                <button @click="postStore.closeRequestModal" class="px-2 py-1 bg-blue-500 rounded-lg text-white">
                    <i class="fa-solid fa-check"></i>
                    Gửi
                </button>
            </div>
        </template>
    </fwb-modal>
</template>