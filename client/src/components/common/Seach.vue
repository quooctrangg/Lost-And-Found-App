<script setup>
const props = defineProps(['title'])
</script>

<template>
    <div class="px-3 bg-slate-100 rounded-xl flex items-center gap-1">
        <i class="fa-solid fa-magnifying-glass"></i>
        <input type="text" :placeholder="props.title"
            class="bg-gray-100 rounded-xl border-0 flex-1 text-sm border-transparent focus:border-transparent focus:ring-0">
    </div>
</template>