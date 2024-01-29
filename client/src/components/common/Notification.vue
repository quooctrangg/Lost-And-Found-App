<script setup>
const emit = defineEmits(['showNotifications'])
</script>

<template>
    <div class="shadow-xl border  overflow-hidden rounded-lg absolute w-[300px] mt-1 flex flex-col notification-container">
        <div class="flex justify-between items-center bg-blue-600 p-2 px-3">
            <h1 class=" text-white">Thông báo</h1>
            <button @click="emit('showNotifications', false)" class="hover:text-red-500 text-white">
                <i class="fa-solid fa-xmark"></i>
            </button>
        </div>
        <div class="p-2 bg-white max-h-[200px] overflow-y-scroll  no-scrollbar">
            <div class="border-b-[1px] border-gray-400 text-sm p-2 flex items-center gap-1">
                <div class="h-8 w-8 rounded-full overflow-hidden">
                    <img src="/test.png" class="h-full w-full">
                </div>
                <span class="text-wrap">
                    <span class="font-medium">Quoc Trang</span>
                    <span> đã bình luận bài viết </span>
                    <span class="font-medium">Test</span>.
                </span>
            </div>
            <div class="border-b-[1px] border-gray-400 text-sm p-2 flex items-center gap-1">
                <div class="h-8 w-8 rounded-full overflow-hidden">
                    <img src="/test.png" class="h-full w-full">
                </div>
                <span class="text-wrap">
                    <span class="font-medium">Quoc Trang</span>
                    <span> đã trả lời bình luận </span>
                    <span class="font-medium">Test</span>.
                </span>
            </div>
        </div>
    </div>
</template>