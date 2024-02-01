import { ref } from 'vue'
import { defineStore } from 'pinia'
import authService from '../services/auth.service'

export const useAuthStore = defineStore('auth', () => {

    const err = ref(null)
    const result = ref(null)
    const token = ref(null)

    const login = async data => {
        err.value = null
        result.value = null
        try {
            let res = await authService.login(data)
            if (res.statusCode !== 200) throw new Error(res.message)
            result.value = res
            token.value = result.value.data.accessToken
        } catch (error) {
            err.value = error.message
        }
    }

    return { err, result, token, login }
}, {
    persist: {
        key: 'auth',
        paths: ['token'],
        storage: localStorage
    }
})
