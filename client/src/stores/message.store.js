import { ref } from 'vue'
import { defineStore } from 'pinia'
import messageService from '../services/message.service'
import { useAuthStore } from './auth.store'
import { useConversationStore } from './conversation.store'

export const useMessageStore = defineStore('message', () => {
    const authStore = useAuthStore()
    const conversationStore = useConversationStore()

    const activeIndex = ref(null)
    const err = ref(null)
    const result = ref(null)
    const isLoading = ref(false)
    const messages = ref([])
    const newMessage = ref(null)

    const getAllMessages = async conversationId => {
        isLoading.value = true
        messages.value = []
        err.value = null
        try {
            const res = await messageService.getAllMessages(authStore.token, conversationId)
            if (res.statusCode !== 200) throw new Error(res.message)
            messages.value = res.data
        } catch (error) {
            err.value = error.message
        } finally {
            isLoading.value = false
        }
    }

    const sendMessage = async data => {
        isLoading.value = true
        err.value = null
        newMessage.value = null
        try {
            const res = await messageService.sendMessage(authStore.token, data)
            if (res.statusCode !== 200) throw new Error(res.message)
            newMessage.value = res.data
            messages.value.push(res.data)
        } catch (error) {
            err.value = error.message
        } finally {
            isLoading.value = false
        }
    }

    const sendImage = async data => {
        isLoading.value = true
        err.value = null
        newMessage.value = null
        try {
            const res = await messageService.sendImage(authStore.token, data)
            if (res.statusCode !== 200) throw new Error(res.message)
            newMessage.value = res.data
            messages.value.push(...res.data)
        } catch (error) {
            err.value = error.message
        } finally {
            isLoading.value = false
        }
    }

    const readMessages = async conversationId => {
        isLoading.value = true
        err.value = null
        try {
            const res = await messageService.readMessages(authStore.token, conversationId)
            if (res.statusCode !== 200) throw new Error(res.message)
        } catch (error) {
            err.value = error.message
        } finally {
            isLoading.value = false
        }
    }

    return { activeIndex, err, result, isLoading, messages, newMessage, getAllMessages, sendMessage, sendImage, readMessages }
})
