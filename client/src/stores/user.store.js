import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {

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

    return {
        isShow,
        closeUpdatePasswordModal, showUpdatePasswordModal,
        closeUpdateProfileModal, showUpdateProfileModal,
        closeUpdateAvatarModal, showUpdateAvatarModal
    }
})
