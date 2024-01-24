<script setup>
const emit = defineEmits(['showNofications'])
</script>

<template>
    <div class="flex justify-between items-center bg-red-400 p-2">
        <h1>Thông báo</h1>
        <button @click="emit('showNofications', false)" class="hover:text-red-500">
            <i class="fa-solid fa-xmark"></i>
        </button>
    </div>
    <div class="p-2 bg-red-200 max-h-[200px] overflow-y-scroll  no-scrollbar">
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
</template>