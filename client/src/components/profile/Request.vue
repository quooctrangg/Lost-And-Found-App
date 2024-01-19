<script setup>
import { onMounted } from 'vue';

const emit = defineEmits(['currentPage'])

onMounted(() => {
    emit('currentPage', 'request')
})
</script>

<template>
    request
</template>