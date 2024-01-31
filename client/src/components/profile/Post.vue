<script setup>
import { onMounted } from 'vue';
import PostCard from '../common/PostCard.vue'

const emit = defineEmits(['currentPage'])

onMounted(() => {
    emit('currentPage', 'post')
})
</script>

<template>
    <div class="w-[70%] mx-auto">
        <PostCard />
    </div>
</template>