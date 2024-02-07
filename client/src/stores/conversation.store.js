import { ref } from 'vue'
import { defineStore } from 'pinia'
import conversationService from '../services/conversation.service'
import { useAuthStore } from './auth.store'

export const useConversationStore = defineStore('conversation', () => {
    const authStore = useAuthStore()

    const activeIndex = ref(null)
    const err = ref(null)
    const result = ref(null)
    const isLoading = ref(false)
    const conversations = ref(null)

    const fetchConversations = async () => {
        isLoading.value = true
        err.value = null
        try {
            const res = await conversationService.fetchConversations(authStore.token)
            if (res.statusCode !== 200) throw new Error(res.message)
            conversations.value = res.data
        } catch (error) {
            err.value = error.message
        } finally {
            isLoading.value = false
        }
    }

    const accessConversation = async data => {
        isLoading.value = true
        err.value = null
        try {
            const res = await conversationService.accessConversation(authStore.token, data)
            if (res.statusCode !== 200) throw new Error(res.message)
            const isExist = conversations.value.findIndex(tes => tes.id === res.data.id)
            if (isExist === -1) {
                conversations.value.push(res.data)
                activeIndex.value = conversations.value.length - 1
            } else {
                activeIndex.value = isExist
            }
        } catch (error) {
            err.value = error.message
        } finally {
            isLoading.value = false
        }
    }

    return { activeIndex, err, result, isLoading, conversations, fetchConversations, accessConversation }
})
