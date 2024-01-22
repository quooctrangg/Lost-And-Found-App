<script setup>
import { onMounted } from 'vue';
import PostCard from '../common/PostCard.vue'

const emit = defineEmits(['currentPage'])

onMounted(() => {
    emit('currentPage', 'post')
})
</script>

<template>
    <PostCard class="mt-2" />
</template>