import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useAuthStore } from './auth.store'
import itemService from '../services/item.service'

export const useItemStore = defineStore('item', () => {
    const authStore = useAuthStore()

    const err = ref(null)
    const result = ref(null)
    const isLoading = ref(false)
    const items = ref(null)
    const totalPages = ref(1)
    const currentPage = ref(1)
    const totalCount = ref(0)
    const key = ref('')

    const getItem = async (option) => {
        err.value = null
        result.value = null
        isLoading.value = true
        try {
            let res = await itemService.getItem(option)
            if (res.statusCode !== 200) throw new Error(res.message)
            result.value = res
            items.value = res.data.data
            totalPages.value = res.data.totalPages
            totalCount.value = res.data.totalCount
            if (currentPage.value > totalPages.value) currentPage.value = totalPages.value
        } catch (error) {
            err.value = error.message
        } finally {
            isLoading.value = false
        }
    }

    const createItem = async data => {
        err.value = null
        result.value = null
        isLoading.value = true
        try {
            let res = await itemService.createItem(authStore.token, data)
            if (res.statusCode !== 200) throw new Error(res.message)
            result.value = res
        } catch (error) {
            err.value = error.message
        } finally {
            isLoading.value = false
        }
    }

    const updateItem = async (id, data) => {
        err.value = null
        result.value = null
        isLoading.value = true
        try {
            let res = await itemService.updateItem(authStore.token, id, data)
            if (res.statusCode !== 200) throw new Error(res.message)
            result.value = res
        } catch (error) {
            err.value = error.message
        } finally {
            isLoading.value = false
        }
    }

    const deleteItem = async id => {
        err.value = null
        result.value = null
        isLoading.value = true
        try {
            let res = await itemService.deleteItem(authStore.token, id)
            if (res.statusCode !== 200) throw new Error(res.message)
            result.value = res
        } catch (error) {
            err.value = error.message
        } finally {
            isLoading.value = false
        }
    }

    return { err, result, isLoading, items, totalPages, currentPage, key, totalCount, getItem, createItem, updateItem, deleteItem }
})
