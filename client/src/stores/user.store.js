import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import userService from '@/services/user.service'

export const useUserStore = defineStore('user', () => {

    const user = ref(null)
    const err = ref(null)
    const result = ref(null)
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

    const getMe = async token => {
        err.value = null
        result.value = null
        try {
            let res = await userService.me(token)
            if (res.statusCode !== 200) throw new Error(res.message)
            result.value = res
            user.value = result.value.data
        } catch (error) {
            console.log(error);
            err.value = error.message
        }
    }

    return {
        isShow, user, err, result, getMe,
        closeUpdatePasswordModal, showUpdatePasswordModal,
        closeUpdateProfileModal, showUpdateProfileModal,
        closeUpdateAvatarModal, showUpdateAvatarModal
    }
})
