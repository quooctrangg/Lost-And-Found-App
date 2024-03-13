import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useAuthStore } from './auth.store'
import majorService from '@/services/major.service'

export const useMajorStore = defineStore('major', () => {
    const authStore = useAuthStore()

    const err = ref(null)
    const result = ref(null)
    const isLoading = ref(false)
    const majors = ref([])
    const totalPages = ref(1)
    const currentPage = ref(1)
    const key = ref('')
    const schoolId = ref(null)

    const getAlls = async (option) => {
        err.value = null
        result.value = null
        isLoading.value = true
        try {
            let res = await majorService.getAlls(authStore.token, option)
            if (res.statusCode !== 200) throw new Error(res.message)
            result.value = res
            majors.value = res.data.data
            totalPages.value = res.data.totalPages
            if (currentPage.value > totalPages.value) currentPage.value = totalPages.value
        } catch (error) {
            err.value = error.message
        } finally {
            isLoading.value = false
        }
    }

    const getAllsBySchoolId = async schoolId => {
        err.value = null
        result.value = null
        isLoading.value = true
        try {
            let res = await majorService.getAllsBySchoolId(schoolId)
            if (res.statusCode !== 200) throw new Error(res.message)
            result.value = res
            majors.value = res.data
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
            let res = await majorService.create(authStore.token, data)
            if (res.statusCode !== 200) throw new Error(res.message)
            result.value = res
        } catch (error) {
            err.value = error.message
        } finally {
            isLoading.value = false
        }
    }

    const updateMajor = async (id, data) => {
        err.value = null
        result.value = null
        isLoading.value = true
        try {
            let res = await majorService.updateMajor(authStore.token, data, id)
            if (res.statusCode !== 200) throw new Error(res.message)
            result.value = res
        } catch (error) {
            err.value = error.message
        } finally {
            isLoading.value = false
        }
    }

    const deleteMajor = async id => {
        err.value = null
        result.value = null
        isLoading.value = true
        try {
            let res = await majorService.deleteMajor(authStore.token, id)
            if (res.statusCode !== 200) throw new Error(res.message)
            result.value = res
        } catch (error) {
            err.value = error.message
        } finally {
            isLoading.value = false
        }
    }

    return { err, result, isLoading, majors, totalPages, currentPage, key, schoolId, getAlls, getAllsBySchoolId, create, updateMajor, deleteMajor }
})
