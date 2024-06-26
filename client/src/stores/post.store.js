import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import { useAuthStore } from './auth.store'
import postService from '../services/post.service'

export const usePostStore = defineStore('post', () => {
    const authStore = useAuthStore()

    const err = ref(null)
    const result = ref(null)
    const isLoading = ref(false)
    const totalPages = ref(1)
    const currentPage = ref(1)
    const totalCount = ref(0)
    const key = ref('')
    const posts = ref([])
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

    const createPost = async data => {
        err.value = null
        result.value = null
        isLoading.value = true
        try {
            let res = await postService.createPost(authStore.token, data)
            if (res.statusCode !== 200) throw new Error(res.message)
            result.value = res
        } catch (error) {
            err.value = error.message
        } finally {
            isLoading.value = false
        }
    }

    const getAllPostsForAdmin = async option => {
        err.value = null
        result.value = null
        isLoading.value = true
        posts.value = []
        totalPages.value = 1
        try {
            let res = await postService.getAllPostsForAdmin(authStore.token, option)
            if (res.statusCode !== 200) throw new Error(res.message)
            result.value = res
            totalPages.value = res.data.totalPages
            posts.value = res.data.data
            totalCount.value = res.data.totalCount
            if (currentPage.value > totalPages.value) currentPage.value = totalPages.value
        } catch (error) {
            err.value = error.message
        } finally {
            isLoading.value = false
        }
    }

    const verifyPost = async (id, data) => {
        err.value = null
        result.value = null
        isLoading.value = true
        try {
            let res = await postService.verifyPost(authStore.token, id, data)
            if (res.statusCode !== 200) throw new Error(res.message)
            result.value = res
        } catch (error) {
            err.value = error.message
        } finally {
            isLoading.value = false
        }
    }

    const deletePost = async id => {
        err.value = null
        result.value = null
        isLoading.value = true
        try {
            let res = await postService.deletePost(authStore.token, id)
            if (res.statusCode !== 200) throw new Error(res.message)
            result.value = res
        } catch (error) {
            err.value = error.message
        } finally {
            isLoading.value = false
        }
    }

    const getAllPostsByUserId = async userId => {
        err.value = null
        result.value = null
        isLoading.value = true
        try {
            let res = await postService.getAllPostsByUserId(authStore.token, userId)
            if (res.statusCode !== 200) throw new Error(res.message)
            result.value = res
        } catch (error) {
            err.value = error.message
        } finally {
            isLoading.value = false
        }
    }

    const getAllPostsForUser = async option => {
        err.value = null
        result.value = null
        isLoading.value = true
        posts.value = []
        totalPages.value = 1
        try {
            let res = await postService.getAllPostsForUser(option)
            if (res.statusCode !== 200) throw new Error(res.message)
            result.value = res
            totalPages.value = res.data.totalPages
            posts.value = res.data.data
            if (currentPage.value > totalPages.value) currentPage.value = totalPages.value
        } catch (error) {
            err.value = error.message
        } finally {
            isLoading.value = false
        }
    }

    const getPostById = async id => {
        err.value = null
        result.value = null
        isLoading.value = true
        try {
            let res = await postService.getPostById(authStore.token, id)
            if (res.statusCode !== 200) throw new Error(res.message)
            result.value = res
        } catch (error) {
            err.value = error.message
        } finally {
            isLoading.value = false
        }
    }

    const searchPostsByImage = async data => {
        err.value = null
        result.value = null
        isLoading.value = true
        posts.value = []
        try {
            let res = await postService.searchPostsByImage(data)
            if (res.statusCode !== 200) throw new Error(res.message)
            result.value = res
            posts.value = res.data
        } catch (error) {
            err.value = error.message
        } finally {
            isLoading.value = false
        }
    }

    const reviewHistory = async option => {
        err.value = null
        result.value = null
        isLoading.value = true
        posts.value = []
        try {
            let res = await postService.reviewHistory(authStore.token, option)
            if (res.statusCode !== 200) throw new Error(res.message)
            result.value = res
            totalPages.value = res.data.totalPages
            posts.value = res.data.data
            totalCount.value = res.data.totalCount
            if (currentPage.value > totalPages.value) currentPage.value = totalPages.value
        } catch (error) {
            err.value = error.message
        } finally {
            isLoading.value = false
        }
    }

    return {
        isShow, err, result, isLoading, totalPages, currentPage, key, posts, totalCount,
        createPost, getAllPostsForAdmin, verifyPost, deletePost, searchPostsByImage,
        getAllPostsByUserId, getAllPostsForUser, getPostById, reviewHistory,
        closeFilterModal, showFilterModal,
        closePostModal, showPostModal,
        closeRequestModal, showRequestModal
    }
})
