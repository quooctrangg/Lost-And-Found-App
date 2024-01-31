import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'

export const usePostStore = defineStore('post', () => {

    const isShow = reactive({
        filter: false,
        post: false,
        request: false
    })

    const closeFilterModal = () => { isShow.filter = false }

    const showFilterModal = () => { isShow.filter = true }

    const closePostModal = () => { isShow.post = false }

    const showPostModal = () => { isShow.post = true }

    const closeRequestModal = () => { isShow.request = false }

    const showRequestModal = () => { isShow.request = true }

    return {
        isShow,
        closeFilterModal, showFilterModal,
        closePostModal, showPostModal,
        closeRequestModal, showRequestModal
    }
})
