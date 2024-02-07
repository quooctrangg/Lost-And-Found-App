<script setup>
import SideBar from '../components/chat/SideBar.vue'
import Conversation from '../components/chat/Conversation.vue'
import Footer from '../components/common/Footer.vue';
import { useConversationStore } from '../stores/conversation.store'
import { onMounted } from 'vue';

const conversationStore = useConversationStore()

onMounted(() => {
    conversationStore.activeIndex = null
})
</script>

<template>
    <div class="w-[90%] mx-auto pt-2 flex overflow-hidden gap-2 h-[80vh]">
        <SideBar />
        <Conversation />
    </div>
    <Footer />
</template>