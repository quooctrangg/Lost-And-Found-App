import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useAuthStore } from './auth.store'
import suggestService from '../services/suggest.service'

export const useSuggestStore = defineStore('suggest', () => {
    const authStore = useAuthStore()

    const err = ref(null)
    const result = ref(null)
    const isLoading = ref(false)
    const suggests = ref([])
    const suggestsByImage = ref([])

    const getSuggest = async () => {
        err.value = null
        result.value = null
        isLoading.value = true
        suggests.value = []
        try {
            let res = await suggestService.getSuggest(authStore.token)
            if (res.statusCode !== 200) throw new Error(res.message)
            result.value = res
            suggests.value = res.data
        } catch (error) {
            err.value = error.message
        } finally {
            isLoading.value = false
        }
    }

    const getNearImage = async (data) => {
        err.value = null
        result.value = null
        isLoading.value = true
        suggestsByImage.value = []
        try {
            let res = await suggestService.getNearImage(authStore.token, data)
            if (res.statusCode !== 200) throw new Error(res.message)
            result.value = res
            suggestsByImage.value = res.data
        } catch (error) {
            err.value = error.message
        } finally {
            isLoading.value = false
        }
    }

    return { err, result, isLoading, suggests, suggestsByImage, getSuggest, getNearImage }
})
