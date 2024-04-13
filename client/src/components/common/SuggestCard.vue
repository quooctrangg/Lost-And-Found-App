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
    if (authStore.token != null) {
        await getSuggest()
    }
})
</script>

<template>
    <div>
        <h1 class="text-center font-semibold text-lg text-blue-500 italic border-b ">Gợi ý cho bạn</h1>
        <div v-if="!suggestSore.isLoading" v-for="suggest in suggestSore.suggests" :key="suggest.id">
            <router-link
                class="border-2 bg-white mt-2 rounded-md shadow-lg flex gap-2 cursor-pointer items-center overflow-hidden px-1 py-2"
                :to="{ name: 'post-detail', params: { id: suggest?.id } }">
                <div v-if="suggest?.Image.length"
                    class="w-[35%] max-h-20 rounded-sm overflow-hidden flex items-center justify-center">
                    <img :src="suggest?.Image[0]?.url" class="object-cover">
                </div>
                <div class="w-[50%] overflow-hidden flex-1 flex flex-col gap-1">
                    <h2 class="line-clamp-2 text-black text-justify" v-html="suggest?.description"></h2>
                    <h2 class="text-end text-sm italic text-blue-600 font-semibold px-2">
                        {{ '#' + suggest.Item.name }}
                    </h2>
                </div>
            </router-link>
        </div>
        <div v-else class="p-3">
            <Loading />
        </div>
    </div>
</template>