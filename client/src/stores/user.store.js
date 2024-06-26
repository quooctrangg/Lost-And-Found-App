import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import { useAuthStore } from './auth.store'
import userService from '../services/user.service'

export const useUserStore = defineStore('user', () => {
    const authStore = useAuthStore()

    const user = ref(null)
    const users = ref(null)
    const err = ref(null)
    const result = ref(null)
    const totalPages = ref(1)
    const currentPage = ref(1)
    const totalCount = ref(0)
    const key = ref('')
    const isBan = ref(null)
    const majorId = ref(null)
    const schoolId = ref(null)
    const type = ref(null)
    const isShow = reactive({
        updatePassword: false,
        updateAvatar: false,
    })
    const isLoading = ref(false)
    const isLoadingUpdate = ref(false)
    const isLoadingFeedback = ref(false)
    const statusCreateUsers = reactive({
        userError: [],
        totalSuccess: 0,
        totalError: 0
    })

    const closeUpdatePasswordModal = () => { isShow.updatePassword = false }

    const showUpdatePasswordModal = () => { isShow.updatePassword = true }

    const closeUpdateAvatarModal = () => { isShow.updateAvatar = false }

    const showUpdateAvatarModal = () => { isShow.updateAvatar = true }

    const getMe = async () => {
        err.value = null
        result.value = null
        isLoading.value = true
        try {
            let res = await userService.me(authStore.token)
            if (res.statusCode !== 200) throw new Error(res.message)
            result.value = res
            user.value = result.value.data
        } catch (error) {
            err.value = error.message
        } finally {
            isLoading.value = false
        }
    }

    const getProfileUser = async id => {
        err.value = null
        result.value = null
        isLoading.value = true
        try {
            let res = await userService.getProfileUser(authStore.token, id)
            if (res.statusCode !== 200) throw new Error(res.message)
            result.value = res
        } catch (error) {
            err.value = error.message
        } finally {
            isLoading.value = false
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

    const getAllUsers = async (option) => {
        err.value = null
        result.value = null
        isLoading.value = true
        try {
            let res = await userService.getAllUsers(authStore.token, option)
            if (res.statusCode !== 200) throw new Error(res.message)
            result.value = res
            users.value = res.data.data
            totalPages.value = res.data.totalPages
            totalCount.value = res.data.totalCount
            if (currentPage.value > totalPages.value) currentPage.value = totalPages.value
        } catch (error) {
            err.value = error.message
        } finally {
            isLoading.value = false
        }
    }

    const createUser = async (data) => {
        err.value = null
        result.value = null
        isLoading.value = true
        try {
            let res = await userService.createUser(authStore.token, data)
            if (res.statusCode !== 200) throw new Error(res.message)
            result.value = res
        } catch (error) {
            err.value = error.message
        } finally {
            isLoading.value = false
        }
    }

    const createUsers = async (data) => {
        err.value = null
        result.value = null
        isLoading.value = true
        try {
            let res = await userService.createUsers(authStore.token, data)
            if (res.statusCode !== 200) throw new Error(res.message)
            result.value = res
            statusCreateUsers.userError = res.data.userError
            statusCreateUsers.totalSuccess = res.data.totalSuccess
            statusCreateUsers.totalError = res.data.totalError
        } catch (error) {
            err.value = error.message
        } finally {
            isLoading.value = false
        }
    }

    const banUser = async (id, data) => {
        err.value = null
        result.value = null
        isLoadingFeedback.value = true
        try {
            let res = await userService.banUser(authStore.token, id, data)
            if (res.statusCode !== 200) throw new Error(res.message)
            result.value = res
        } catch (error) {
            err.value = error.message
        } finally {
            isLoadingFeedback.value = false
        }
    }

    const unBanUser = async (id) => {
        err.value = null
        result.value = null
        isLoading.value = true
        try {
            let res = await userService.unBanUser(authStore.token, id)
            if (res.statusCode !== 200) throw new Error(res.message)
            result.value = res
        } catch (error) {
            err.value = error.message
        } finally {
            isLoading.value = false
        }
    }

    const updateUser = async (data, id) => {
        err.value = null
        result.value = null
        isLoadingUpdate.value = true
        try {
            let res = await userService.updateUser(authStore.token, id, data)
            if (res.statusCode !== 200) throw new Error(res.message)
            result.value = res
        } catch (error) {
            err.value = error.message
        } finally {
            isLoadingUpdate.value = false
        }
    }

    const forgotPassword = async (data) => {
        err.value = null
        result.value = null
        isLoading.value = true
        try {
            let res = await userService.forgotPassword(data)
            if (res.statusCode !== 200) throw new Error(res.message)
            result.value = res
        } catch (error) {
            err.value = error.message
        } finally {
            isLoading.value = false
        }
    }

    const sendVerifyCode = async (data) => {
        err.value = null
        result.value = null
        isLoading.value = true
        try {
            let res = await userService.sendVerifyCode(data)
            if (res.statusCode !== 200) throw new Error(res.message)
            result.value = res
        } catch (error) {
            err.value = error.message
        } finally {
            isLoading.value = false
        }
    }

    return {
        isShow, user, err, result, isLoading, users, totalPages, isLoadingUpdate, isLoadingFeedback, statusCreateUsers, type, totalCount,
        currentPage, key, isBan, majorId, schoolId, getMe, updateAvatar, getProfileUser,
        updatePassword, getAllUsers, createUser, createUsers,
        banUser, unBanUser, updateUser, forgotPassword, sendVerifyCode,
        closeUpdatePasswordModal, showUpdatePasswordModal,
        closeUpdateAvatarModal, showUpdateAvatarModal,
    }
},
    {
        persist: {
            key: 'user',
            paths: ['user'],
            storage: sessionStorage
        }
    })
