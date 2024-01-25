<script setup>
import { onMounted } from 'vue';

const emit = defineEmits(['currentPage'])

onMounted(() => {
    emit('currentPage', 'request')
})
</script>

<template>
    <div>
        <div class="bg-white rounded-md shadow p-2 my-2">
            <div class="border-b flex justify-between items-center">
                <div class="flex items-center gap-1">
                    <img class="h-12 w-auto rounded-full" src="/logo.png" alt="logo">
                    <div class="flex flex-col">
                        <p class="text-base truncate">Nguyen Quoc Trang</p>
                        <span class="text-xs italic">
                            <i class=" fa-regular fa-clock"></i>
                            1 giờ trước
                        </span>
                    </div>
                </div>
                <div class="flex gap-2 text-sm">
                    <button
                        class="p-1 border-2 border-blue-500 rounded-lg text-blue-500 hover:bg-blue-500 hover:text-white">
                        Chấp nhận
                    </button>
                    <button class="p-1 border-2 border-red-500 rounded-lg text-red-500 hover:bg-red-500 hover:text-white">
                        Từ chối
                    </button>
                </div>
            </div>
            <div class="">
                <h1 class="font-semibold text-base py-2">
                    Yêu cầu cho bài viết: Toi tim thay 1 cai non
                </h1>
                <h1 class="text-sm py-2">
                    <span class="font-medium">Nội dung:</span> Tôi đã bỏ quên chiếc nón này sau giờ học tiết 4 phòng 201/B1
                </h1>
            </div>
        </div>
        <div class="bg-white rounded-md shadow p-2 my-2">
            <div class="border-b flex justify-between items-center">
                <div class="flex items-center gap-1">
                    <img class="h-12 w-auto rounded-full" src="/logo.png" alt="logo">
                    <div class="flex flex-col">
                        <p class="text-base truncate">Nguyen Quoc Trang</p>
                        <span class="text-xs italic">
                            <i class=" fa-regular fa-clock"></i>
                            1 giờ trước
                        </span>
                    </div>
                </div>
                <div class="flex gap-2 text-sm">
                    <button
                        class="p-1 border-2 border-blue-500 rounded-lg text-blue-500 hover:bg-blue-500 hover:text-white">
                        Chấp nhận
                    </button>
                    <button class="p-1 border-2 border-red-500 rounded-lg text-red-500 hover:bg-red-500 hover:text-white">
                        Từ chối
                    </button>
                </div>
            </div>
            <div class="">
                <h1 class="font-semibold text-base py-2">
                    Yêu cầu cho bài viết: Toi tim thay 1 cai non
                </h1>
                <h1 class="text-sm py-2">
                    <span class="font-medium">Nội dung:</span> Tôi đã bỏ quên chiếc nón này sau giờ học tiết 4 phòng 201/B1
                </h1>
            </div>
        </div>
        <div class="bg-white rounded-md shadow p-2 my-2">
            <div class="border-b flex justify-between items-center">
                <div class="flex items-center gap-1">
                    <img class="h-12 w-auto rounded-full" src="/logo.png" alt="logo">
                    <div class="flex flex-col">
                        <p class="text-base truncate">Nguyen Quoc Trang</p>
                        <span class="text-xs italic">
                            <i class=" fa-regular fa-clock"></i>
                            1 giờ trước
                        </span>
                    </div>
                </div>
                <div class="flex gap-2 text-sm">
                    <button
                        class="p-1 border-2 border-blue-500 rounded-lg text-blue-500 hover:bg-blue-500 hover:text-white">
                        Chấp nhận
                    </button>
                    <button class="p-1 border-2 border-red-500 rounded-lg text-red-500 hover:bg-red-500 hover:text-white">
                        Từ chối
                    </button>
                </div>
            </div>
            <div class="">
                <h1 class="font-semibold text-base py-2">
                    Yêu cầu cho bài viết: Toi tim thay 1 cai non
                </h1>
                <h1 class="text-sm py-2">
                    <span class="font-medium">Nội dung:</span> Tôi đã bỏ quên chiếc nón này sau giờ học tiết 4 phòng 201/B1
                </h1>
            </div>
        </div>
    </div>
</template>