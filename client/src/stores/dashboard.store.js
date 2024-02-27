import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useAuthStore } from './auth.store'
import dashboardService from '@/services/dashboard.service'

export const useDashboardtore = defineStore('dashboard', () => {
    const authStore = useAuthStore()

    const err = ref(null)
    const result = ref(null)
    const isLoading = ref(false)

    const getStatistical = async (option) => {
        err.value = null
        result.value = null
        isLoading.value = true
        try {
            let res = await dashboardService.getStatistical(authStore.token, option)
            if (res.statusCode !== 200) throw new Error(res.message)
            result.value = res
        } catch (error) {
            err.value = error.message
        } finally {
            isLoading.value = false
        }
    }

    const getChart = async (option) => {
        err.value = null
        result.value = null
        isLoading.value = true
        try {
            let res = await dashboardService.getChart(authStore.token, option)
            if (res.statusCode !== 200) throw new Error(res.message)
            result.value = res
        } catch (error) {
            err.value = error.message
        } finally {
            isLoading.value = false
        }
    }

    const getListStudentRetureItemSuccessful = async (option) => {
        err.value = null
        result.value = null
        isLoading.value = true
        try {
            let res = await dashboardService.getListStudentRetureItemSuccessful(authStore.token, option)
            if (res.statusCode !== 200) throw new Error(res.message)
            result.value = res
        } catch (error) {
            err.value = error.message
        } finally {
            isLoading.value = false
        }
    }

    return { err, result, isLoading, getStatistical, getChart, getListStudentRetureItemSuccessful }
})