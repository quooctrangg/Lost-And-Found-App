<script setup>
import { onMounted, ref, watch, watchEffect } from 'vue';
import { useAuthStore } from '../../stores/auth.store'
import { useSearchHistoryStore } from '../../stores/search-history.store'

const searchHistoryStore = useSearchHistoryStore()
const authStore = useAuthStore()

const emits = defineEmits(['key', 'image'])

const key = ref('')
const isSpeaking = ref(false)
const selectedFile = ref(null)
const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition
const sr = new Recognition()

const create = async () => {
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

watch(key, (newval, oldval) => {
    if (key.value == '') {
        emits('key', key.value)
    }
})

watch(() => selectedFile.value, newval => {
    if (selectedFile.value === null) {
        emits('image', null)
    }
})

const submitSearch = async () => {
    if (key.value !== '') {
        emits('key', key.value)
        await create()
    }
}

const speechToText = () => {
    selectedFile.value = null
    if (isSpeaking.value) {
        sr.stop()
    } else {
        sr.start()
    }
}

onMounted(() => {
    sr.continuous = true
    sr.interimResults = true
    sr.lang = 'vi-VN'
    sr.onstart = () => {
        isSpeaking.value = true
    }
    sr.onend = () => {
        isSpeaking.value = false
    }
    sr.onresult = (evt) => {
        const t = Array.from(evt.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join('')

        key.value = t
    }
})

const clearKey = () => {
    key.value = ''
    selectedFile.value = null
}

const onFileSelected = (event) => {
    selectedFile.value = event.target.files
    emits('image', selectedFile.value[0])
}

watchEffect(async () => {
    if (authStore.token) {
        await getAlls()
    }
})
</script>

<template>
    <div class="flex-1 relative">
        <div class="w-full border-2 border-blue-600 pl-3 bg-white rounded-xl flex items-center gap-2 overflow-hidden">
            <i class="fa-solid fa-magnifying-glass"></i>
            <input type="text" placeholder="Tìm kiếm bài viết" list="items" v-model="key" @keyup.enter="submitSearch"
                class="bg-white rounded-xl border-0 flex-1 text-sm border-transparent focus:border-transparent focus:ring-0"
                v-if="selectedFile == null">
            <div v-else class="bg-white rounded-xl border-0 flex-1 text-sm border-transparent">
                <span>
                    [Hình] {{ selectedFile[0].name }}
                </span>
            </div>
            <datalist id="items" v-if="authStore.token">
                <option v-for="search in searchHistoryStore.searchs" :value="search.content">
                    {{ search.content }}
                </option>
            </datalist>
            <button v-if="key.length || selectedFile != null" class="text-xl px-1 hover:text-red-600" @click="clearKey">
                <i class="fa-solid fa-xmark"></i>
            </button>
            <label for="image" class="text-xl px-1 hover:text-red-600 cursor-pointer">
                <i class="fa-regular fa-image"></i>
                <input @change="onFileSelected" type="file" name="image" id="image" accept="image/png, image/jpeg"
                    hidden>
            </label>
            <button class="text-xl px-1 hover:text-red-600" @click="speechToText">
                <i v-if="!isSpeaking" class="fa-solid fa-microphone"></i>
                <i v-else class="fa-solid fa-stop"></i>
            </button>
            <button class="bg-blue-600 hover:bg-blue-700 p-2 text-white font-medium text-sm" @click="submitSearch">
                Tìm kiếm
            </button>
        </div>
    </div>
</template>