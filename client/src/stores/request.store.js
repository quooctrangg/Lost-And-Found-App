import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useAuthStore } from './auth.store'
import requestService from '../services/request.service'

export const useRequestStore = defineStore('request', () => {
    const authStore = useAuthStore()

    const err = ref(null)
    const result = ref(null)
    const isLoading = ref(false)

    const createRequest = async (data) => {
        err.value = null
        result.value = null
        isLoading.value = true
        try {
            let res = await requestService.createRequest(authStore.token, data)
            if (res.statusCode !== 200) throw new Error(res.message)
            result.value = res
        } catch (error) {
            err.value = error.message
        } finally {
            isLoading.value = false
        }
    }

    const acceptRequest = async (data) => {
        err.value = null
        result.value = null
        isLoading.value = true
        try {
            let res = await requestService.acceptRequest(authStore.token, data)
            if (res.statusCode !== 200) throw new Error(res.message)
            result.value = res
        } catch (error) {
            err.value = error.message
        } finally {
            isLoading.value = false
        }
    }

    const rejectRequest = async (data) => {
        err.value = null
        result.value = null
        isLoading.value = true
        try {
            let res = await requestService.rejectRequest(authStore.token, data)
            if (res.statusCode !== 200) throw new Error(res.message)
            result.value = res
        } catch (error) {
            err.value = error.message
        } finally {
            isLoading.value = false
        }
    }

    const getAllRequestsByUserId = async () => {
        err.value = null
        result.value = null
        isLoading.value = true
        try {
            let res = await requestService.getAllRequestsByUser(authStore.token)
            if (res.statusCode !== 200) throw new Error(res.message)
            result.value = res
        } catch (error) {
            err.value = error.message
        } finally {
            isLoading.value = false
        }
    }

    const getRequestsSuccessByUserId = async () => {
        err.value = null
        result.value = null
        isLoading.value = true
        try {
            let res = await requestService.getRequestsSuccessByUserId(authStore.token)
            if (res.statusCode !== 200) throw new Error(res.message)
            result.value = res
        } catch (error) {
            err.value = error.message
        } finally {
            isLoading.value = false
        }
    }

    return { err, result, isLoading, createRequest, acceptRequest, rejectRequest, getAllRequestsByUserId, getRequestsSuccessByUserId }
})
