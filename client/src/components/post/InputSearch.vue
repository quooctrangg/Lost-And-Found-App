<script setup>
import { ref, watch, watchEffect } from 'vue';
import { useAuthStore } from '../../stores/auth.store'
import { useSearchHistoryStore } from '../../stores/search-history.store'

const searchHistoryStore = useSearchHistoryStore()
const authStore = useAuthStore()

const emits = defineEmits(['key'])

const key = ref('')
const isSuggestions = ref(false)

const create = async () => {
    if (key.value == '') {
        return
    }
    if (!authStore.token) {
        return
    }
    await searchHistoryStore.create({ content: key.value })
    if (searchHistoryStore.err) {
        return
    }
    await getAlls()
}

const getAlls = async () => {
    if (!authStore.token) {
        return
    }
    await searchHistoryStore.getAlls()
    if (searchHistoryStore.err) {
        return
    }
}

const deleteById = async (id) => {
    if (!authStore.token) {
        return
    }
    await searchHistoryStore.deleteById(id)
    if (searchHistoryStore.err) {
        return
    }
    await getAlls()
}

const showSuggestions = () => {
    isSuggestions.value = true
}

const closeSuggestions = async () => {
    await create()
    setTimeout(() => {
        isSuggestions.value = false
    }, 100)
}

watch(key, (newval, oldval) => {
    emits('key', key.value)
})

watchEffect(async () => {
    if (authStore.token) {
        await getAlls()
    }
})
</script>

<template>
    <div class="flex-1 relative">
        <label class="w-full border-2 border-blue-600 px-3 bg-white rounded-xl flex items-center gap-1 ">
            <i class="fa-solid fa-magnifying-glass"></i>
            <input type="text" placeholder="Tìm kiếm bài viết" list="items" v-model="key" @focus="showSuggestions"
                @blur="closeSuggestions"
                class="bg-white rounded-xl border-0 flex-1 text-sm border-transparent focus:border-transparent focus:ring-0">
        </label>
        <ul v-if="isSuggestions && authStore.token"
            class="absolute w-full bg-gray-100 z-50 mt-2 rounded-lg opacity-100 overflow-hidden">
            <li v-if="searchHistoryStore.searchs.length" v-for="search in searchHistoryStore.searchs"
                class="px-3 py-1 flex hover:bg-gray-200">
                <div class="flex-1 cursor-pointer" @click="() => { key = search.content }">
                    {{ search.content }}
                </div>
                <button @click="async () => { await deleteById(search.id) }" class="text-red-600 hover:text-red-800">
                    Xóa
                </button>
            </li>
        </ul>
    </div>
</template>