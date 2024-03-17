<script setup>
import { watchEffect } from 'vue';
import { useAuthStore } from '../../stores/auth.store'
import { useSuggestStore } from '../../stores/suggest.store'
import Loading from './Loading.vue';

const authStore = useAuthStore()
const suggestSore = useSuggestStore()

const getSuggest = async () => {
    await suggestSore.getSuggest()
    if (suggestSore.err) {
        return
    }
}

watchEffect(async () => {
    if (authStore.token != '') {
        await getSuggest()
    }
})
</script>

<template>
    <div v-if="suggestSore.isLoading == false" v-for="suggest in suggestSore.suggests"
        class="border-2 border-blue-600 bg-white mt-2 rounded-md shadow flex gap-2 cursor-pointer items-center overflow-hidden">
        <div v-if="suggest?.Image.length"
            class="w-[35%] max-h-20 rounded-sm overflow-hidden flex items-center justify-center">
            <img :src="suggest?.Image[0]?.url" class="object-cover">
        </div>
        <div class="w-[50%] overflow-hidden flex-1 flex flex-col gap-1">
            <h2 class="line-clamp-2 text-black">
                {{ suggest?.description }}
            </h2>
            <router-link class="text-end text-sm text-red-500 underline hover:text-red-600 px-2 italic"
                :to="{ name: 'post-detail', params: { id: suggest?.id } }">
                Xem chi tiết
                <i class="fa-solid fa-arrow-right"></i>
            </router-link>
        </div>
    </div>
    <div v-else class="p-3">
        <Loading />
    </div>
</template>