import { ref, reactive } from 'vue'
import { defineStore } from 'pinia'
import authService from '../services/auth.service'

export const useAuthStore = defineStore('auth', () => {

    const err = ref(null)
    const result = ref(null)
    const isLoading = ref(false)
    const token = ref(null)
    const isShow = reactive({
        feedback: false
    })

    const login = async data => {
        err.value = null
        result.value = null
        isLoading.value = true
        try {
            let res = await authService.login(data)
            if (res.statusCode !== 200) {
                result.value = res
                throw new Error(res.message)
            }
            result.value = res
            token.value = result.value.data?.accessToken
        } catch (error) {
            err.value = error.message
        } finally {
            isLoading.value = false
        }
    }

    // const register = async data => {
    //     err.value = null
    //     result.value = null
    //     isLoading.value = true
    //     try {
    //         let res = await authService.register(data)
    //         if (res.statusCode !== 200) throw new Error(res.message)
    //         result.value = res
    //     } catch (error) {
    //         err.value = error.message
    //     } finally {
    //         isLoading.value = false
    //     }
    // }

    // const confirmUser = async data => {
    //     err.value = null
    //     result.value = null
    //     isLoading.value = true
    //     try {
    //         let res = await authService.confirmUser(data)
    //         if (res.statusCode !== 200) throw new Error(res.message)
    //         result.value = res
    //     } catch (error) {
    //         err.value = error.message
    //     } finally {
    //         isLoading.value = false
    //     }
    // }

    const closeFeedbackModal = () => { isShow.feedback = false }

    const showFeedbackModal = () => { isShow.feedback = true }

    return { err, result, isLoading, token, isShow, login, closeFeedbackModal, showFeedbackModal }
}, {
    persist: {
        key: 'auth',
        paths: ['token'],
        storage: sessionStorage
    }
})
