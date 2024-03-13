import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useAuthStore } from './auth.store'
import searchHistoryService from '../services/search-history.service'

export const useSearchHistoryStore = defineStore('search-history', () => {
    const authStore = useAuthStore()

    const err = ref(null)
    const result = ref(null)
    const isLoading = ref(false)
    const searchs = ref([])

    const getAlls = async () => {
        err.value = null
        result.value = null
        isLoading.value = true
        searchs.value = []
        try {
            let res = await searchHistoryService.getAlls(authStore.token)
            if (res.statusCode !== 200) throw new Error(res.message)
            result.value = res
            searchs.value = res.data
        } catch (error) {
            err.value = error.message
        } finally {
            isLoading.value = false
        }
    }

    const create = async (data) => {
        err.value = null
        result.value = null
        isLoading.value = true
        try {
            let res = await searchHistoryService.create(authStore.token, data)
            if (res.statusCode !== 200) throw new Error(res.message)
            result.value = res
        } catch (error) {
            err.value = error.message
        } finally {
            isLoading.value = false
        }
    }

    const deleteById = async (id) => {
        err.value = null
        result.value = null
        isLoading.value = true
        try {
            let res = await searchHistoryService.delete(authStore.token, id)
            if (res.statusCode !== 200) throw new Error(res.message)
            result.value = res
        } catch (error) {
            err.value = error.message
        } finally {
            isLoading.value = false
        }
    }

    return { err, result, isLoading, searchs, getAlls, create, deleteById }
})
