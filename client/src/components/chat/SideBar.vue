<script setup>
import Conversations from '../chat/Conversations.vue'
import Search from '../common/Seach.vue'

</script>

<template>
    <div class="baiss-1/4 flex flex-col">
        <Search class="border-sky-300 border" :title="`Tìm kiếm cuộc trò chuyện`" />
        <Conversations />
    </div>
</template>