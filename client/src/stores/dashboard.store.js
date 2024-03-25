import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import { useAuthStore } from './auth.store'
import dashboardService from '../services/dashboard.service'

export const useDashboardtore = defineStore('dashboard', () => {
    const authStore = useAuthStore()

    const err = ref(null)
    const result = ref(null)
    const isLoading = ref(false)
    const studentsList = ref([])
    const statistical = reactive({
        user: 0,
        done: 0,
        request: 0,
        post: 0
    })
    const chart = reactive({
        countItem: [],
        countLocation: [],
        countType: []
    })

    const getStatistical = async (option) => {
        err.value = null
        isLoading.value = true
        try {
            let res = await dashboardService.getStatistical(authStore.token, option)
            if (res.statusCode !== 200) throw new Error(res.message)
            statistical.user = res.data.user
            statistical.done = res.data.done
            statistical.request = res.data.request
            statistical.post = res.data.post
        } catch (error) {
            err.value = error.message
        } finally {
            isLoading.value = false
        }
    }

    const getChart = async (option) => {
        err.value = null
        isLoading.value = true
        try {
            let res = await dashboardService.getChart(authStore.token, option)
            if (res.statusCode !== 200) throw new Error(res.message)
            chart.countItem = res.data.countItem
            chart.countLocation = res.data.countLocation
            chart.countType = res.data.countType
        } catch (error) {
            err.value = error.message
        } finally {
            isLoading.value = false
        }
    }

    const getListStudentRetureItemSuccessful = async (option) => {
        err.value = null
        isLoading.value = true
        try {
            let res = await dashboardService.getListStudentRetureItemSuccessful(authStore.token, option)
            if (res.statusCode !== 200) throw new Error(res.message)
            studentsList.value = res.data
        } catch (error) {
            err.value = error.message
        } finally {
            isLoading.value = false
        }
    }

    const downloadExcel = async option => {
        return await dashboardService.downloadExcel(authStore.token, option)
    }

    return { err, result, isLoading, studentsList, statistical, chart, getStatistical, getChart, getListStudentRetureItemSuccessful, downloadExcel }
})