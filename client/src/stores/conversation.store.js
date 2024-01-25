import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useConversationStore = defineStore('conversation', () => {
    const activeIndex = ref(null)

    return { activeIndex }
})
