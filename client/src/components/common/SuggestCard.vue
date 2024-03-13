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
        class="p-3 border-[3px] border-blue-600 bg-sky-500 mt-2 rounded-lg shadow flex gap-2 cursor-pointer items-center">
        <div v-if="suggest?.Image.length"
            class="w-[35%] max-h-20 rounded-sm overflow-hidden flex items-center justify-center">
            <img :src="suggest?.Image[0]?.url" class="object-cover">
        </div>
        <div class="w-[50%] overflow-hidden flex-1 flex flex-col gap-1">
            <h2 class="line-clamp-2 text-black">
                {{ suggest?.description }}
            </h2>
            <router-link class="text-end text-sm text-white underline hover:text-slate-200"
                :to="{ name: 'post-detail', params: { id: suggest?.id } }">
                Xem chi tiết
            </router-link>
        </div>
    </div>
    <div v-else class="p-3">
        <Loading />
    </div>
</template>