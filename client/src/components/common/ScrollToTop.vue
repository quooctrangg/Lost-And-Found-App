<script setup>
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}
</script>

<template>
    <div class="fixed text-2xl bottom-10 right-10 px-3 py-1 rounded-full bg-green-200 cursor-pointer"
        @click="scrollToTop">
        <i class="fa-solid fa-arrow-up"></i>
    </div>
</template>