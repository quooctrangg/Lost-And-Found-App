import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useAuthStore } from './auth.store'
import schoolService from '../services/school.service'

export const useSchoolStore = defineStore('school', () => {
    const authStore = useAuthStore()

    const err = ref(null)
    const result = ref(null)
    const isLoading = ref(false)
    const schools = ref(null)
    const totalPages = ref(1)
    const currentPage = ref(1)

    const getSchool = async (option) => {
        err.value = null
        result.value = null
        isLoading.value = true
        try {
            let res = await schoolService.getSchool(option)
            if (res.statusCode !== 200) throw new Error(res.message)
            result.value = res
            schools.value = result.value.data.data
            totalPages.value = result.value.data.totalPages
            if (currentPage.value > totalPages.value) currentPage.value = totalPages.value
        } catch (error) {
            err.value = error.message
        } finally {
            isLoading.value = false
        }
    }

    const createSchool = async data => {
        err.value = null
        result.value = null
        isLoading.value = true
        try {
            let res = await schoolService.createSchool(authStore.token, data)
            if (res.statusCode !== 200) throw new Error(res.message)
            result.value = res
        } catch (error) {
            err.value = error.message
        } finally {
            isLoading.value = false
        }
    }

    const updateSchool = async (id, data) => {
        err.value = null
        result.value = null
        isLoading.value = true
        try {
            let res = await schoolService.updateSchool(authStore.token, id, data)
            if (res.statusCode !== 200) throw new Error(res.message)
            result.value = res
        } catch (error) {
            err.value = error.message
        } finally {
            isLoading.value = false
        }
    }

    const deleteSchool = async id => {
        err.value = null
        result.value = null
        isLoading.value = true
        try {
            let res = await schoolService.deleteSchool(authStore.token, id)
            if (res.statusCode !== 200) throw new Error(res.message)
            result.value = res
        } catch (error) {
            err.value = error.message
        } finally {
            isLoading.value = false
        }
    }

    return { err, result, isLoading, schools, totalPages, currentPage, getSchool, createSchool, updateSchool, deleteSchool }
})
