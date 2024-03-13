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

    return { err, result, isLoading, suggests, getSuggest }
})
