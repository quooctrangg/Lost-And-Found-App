import { ref } from 'vue'
import { defineStore } from 'pinia'

export const usePostStore = defineStore('post', () => {

    const isFilterModal = ref(false)
    const isPostModal = ref(false)

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

    return { isFilterModal, isPostModal, closeFilterModal, showFilterModal, closePostModal, showPostModal }
})
