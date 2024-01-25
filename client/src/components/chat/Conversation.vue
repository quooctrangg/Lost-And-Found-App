<script setup>
import Messages from './Messages.vue'
import Input from './Input.vue'
import { useConversationStore } from '../../stores/conversation.store'

const conversationStore = useConversationStore()
</script>

<template >
    <div class="basis-3/4 flex flex-col bg-slate-200 rounded-lg overflow-hidden">
        <div v-if="conversationStore.activeIndex !== null" class="h-full flex flex-col justify-between">
            <div class="bg-white py-2 px-4 flex justify-between items-center shadow-lg">
                <router-link to="/" class="hover:underline hover:text-blue-400">
                    <h2 class="font-medium">Quoc Trang {{ conversationStore.activeIndex }}</h2>
                </router-link>
                <button @click="conversationStore.activeIndex = null">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
            <Messages class="flex-1" />
            <Input />
        </div>
        <div v-else class="w-full h-full flex justify-center items-center font-semibold text-2xl text-gray-400">
            Mở một cuộc trò chuyện để bắt đầu.
        </div>
    </div>
</template>