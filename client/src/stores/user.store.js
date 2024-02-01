import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import { useAuthStore } from '../stores/auth.store'
import userService from '@/services/user.service'

export const useUserStore = defineStore('user', () => {
    const authStore = useAuthStore()

    const user = ref(null)
    const err = ref(null)
    const result = ref(null)
    const isLoading = ref(false)
    const isShow = reactive({
        updatePassword: false,
        updateProfile: false,
        updateAvatar: false
    })

    const closeUpdatePasswordModal = () => { isShow.updatePassword = false }

    const showUpdatePasswordModal = () => { isShow.updatePassword = true }

    const closeUpdateProfileModal = () => { isShow.updateProfile = false }

    const showUpdateProfileModal = () => { isShow.updateProfile = true }

    const closeUpdateAvatarModal = () => { isShow.updateAvatar = false }

    const showUpdateAvatarModal = () => { isShow.updateAvatar = true }

    const getMe = async () => {
        err.value = null
        result.value = null
        try {
            let res = await userService.me(authStore.token)
            if (res.statusCode !== 200) throw new Error(res.message)
            result.value = res
            user.value = result.value.data
        } catch (error) {
            err.value = error.message
        }
    }

    const updateAvatar = async (data) => {
        err.value = null
        result.value = null
        isLoading.value = true
        try {
            let res = await userService.updateAvatar(authStore.token, data)
            if (res.statusCode !== 200) throw new Error(res.message)
            result.value = res
        } catch (error) {
            err.value = error.message
        } finally {
            isLoading.value = false
        }
    }

    const updateProfile = async (data) => {
        err.value = null
        result.value = null
        isLoading.value = true
        try {
            let res = await userService.updateProfile(authStore.token, data)
            if (res.statusCode !== 200) throw new Error(res.message)
            result.value = res
        } catch (error) {
            err.value = error.message
        } finally {
            isLoading.value = false
        }
    }

    const updatePassword = async (data) => {
        err.value = null
        result.value = null
        isLoading.value = true
        try {
            let res = await userService.updatePassword(authStore.token, data)
            if (res.statusCode !== 200) throw new Error(res.message)
            result.value = res
        } catch (error) {
            err.value = error.message
        } finally {
            isLoading.value = false
        }
    }

    return {
        isShow, user, err, result, isLoading, getMe, updateAvatar, updateProfile, updatePassword,
        closeUpdatePasswordModal, showUpdatePasswordModal,
        closeUpdateProfileModal, showUpdateProfileModal,
        closeUpdateAvatarModal, showUpdateAvatarModal
    }
})
