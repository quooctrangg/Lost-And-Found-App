import { ref } from 'vue'
import { defineStore } from 'pinia'

export const usePostStore = defineStore('post', () => {

    const isFilterModal = ref(false)
    const isPostModal = ref(false)
    const isRequestModal = ref(false)

    const closeFilterModal = () => {
        isFilterModal.value = false
    }

    const showFilterModal = () => {
        isFilterModal.value = true
    }

    const closePostModal = () => {
        isPostModal.value = false
    }

    const showPostModal = () => {
        isPostModal.value = true
    }

    const closeRequestModal = () => {
        isRequestModal.value = false
    }

    const showRequestModal = () => {
        isRequestModal.value = true
    }

    return { isFilterModal, isPostModal, isRequestModal, closeFilterModal, showFilterModal, closePostModal, showPostModal, closeRequestModal, showRequestModal }
})
