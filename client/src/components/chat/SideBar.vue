<script setup>
import { useConversationStore } from '../../stores/conversation.store'
import { useUserStore } from '../../stores/user.store'
import Conversations from '../chat/Conversations.vue'
import Search from '../common/Seach.vue'

const conversationStore = useConversationStore()
const userStore = useUserStore()

const getOther = (loggedUser, users) => {
    return users[0]?.id == loggedUser?.id ? 1 : 0
};

const handleSearch = (key) => {
    conversationStore.activeIndex = null
    if (key == '') {
        conversationStore.searchResult = conversationStore.conversations
    } else {
        conversationStore.searchResult = conversationStore.conversations.filter((conversation => {
            const indexUser = getOther(userStore.user, conversation.User)
            return conversation.User[indexUser].name.toLowerCase().includes(key.toLowerCase())
        }))
    }
}

</script>

<template>
    <div class="w-[25%] flex flex-col overflow-hidden">
        <Search class="border-sky-300 border" :title="`Tìm kiếm cuộc trò chuyện`" @key="(e) => handleSearch(e)" />
        <Conversations />
    </div>
</template>