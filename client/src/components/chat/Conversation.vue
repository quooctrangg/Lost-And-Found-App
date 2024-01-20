<script setup>
import Messages from './Messages.vue'
import Input from './Input.vue'
</script>

<template >
    <div class="basis-3/4 flex flex-col bg-slate-200 rounded-lg overflow-hidden">
        <div v-if="true" class="h-full flex flex-col justify-between">
            <Messages class="flex-1" />
            <Input />
        </div>
        <div v-else class="w-full h-full flex justify-center items-center font-semibold text-2xl text-gray-400">
            Mở một cuộc trò chuyện để bắt đầu.
        </div>
    </div>
</template>