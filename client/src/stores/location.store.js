import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useAuthStore } from './auth.store'
import locationService from '../services/location.service'

export const useLocationStore = defineStore('location', () => {
    const authStore = useAuthStore()

    const err = ref(null)
    const result = ref(null)
    const isLoading = ref(false)
    const locations = ref(null)
    const totalPages = ref(1)
    const currentPage = ref(1)
    const key = ref('')

    const getLocation = async (option) => {
        err.value = null
        result.value = null
        isLoading.value = true
        try {
            let res = await locationService.getLocation(option)
            if (res.statusCode !== 200) throw new Error(res.message)
            result.value = res
            locations.value = result.value.data.data
            totalPages.value = result.value.data.totalPages
            if (currentPage.value > totalPages.value) currentPage.value = totalPages.value
        } catch (error) {
            err.value = error.message
        } finally {
            isLoading.value = false
        }
    }

    const createLocation = async data => {
        err.value = null
        result.value = null
        isLoading.value = true
        try {
            let res = await locationService.createLocation(authStore.token, data)
            if (res.statusCode !== 200) throw new Error(res.message)
            result.value = res
        } catch (error) {
            err.value = error.message
        } finally {
            isLoading.value = false
        }
    }

    const updateLocation = async (id, data) => {
        err.value = null
        result.value = null
        isLoading.value = true
        try {
            let res = await locationService.updateLocation(authStore.token, id, data)
            if (res.statusCode !== 200) throw new Error(res.message)
            result.value = res
        } catch (error) {
            err.value = error.message
        } finally {
            isLoading.value = false
        }
    }

    const deleteLocation = async id => {
        err.value = null
        result.value = null
        isLoading.value = true
        try {
            let res = await locationService.deleteLocation(authStore.token, id)
            if (res.statusCode !== 200) throw new Error(res.message)
            result.value = res
        } catch (error) {
            err.value = error.message
        } finally {
            isLoading.value = false
        }
    }

    return { err, result, isLoading, locations, totalPages, currentPage, key, getLocation, createLocation, updateLocation, deleteLocation }
})
