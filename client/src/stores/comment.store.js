import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import commentService from '@/services/comment.service'
import { useAuthStore } from './auth.store'

export const useCommentStore = defineStore('comment', () => {
    const authStore = useAuthStore()

    const err = ref(null)
    const result = ref(null)
    const isLoading = ref(false)
    const comments = ref([])
    const isReply = reactive({
        isShow: false,
        commentId: null
    })

    const getAllCommentsByPostId = async (postId) => {
        isLoading.value = true
        err.value = null
        result.value = null
        comments.value = []
        try {
            let res = await commentService.getAllCommentsByPostId(authStore.token, postId)
            if (res.statusCode !== 200) throw new Error(res.message)
            result.value = res
            comments.value = res.data
        } catch (error) {
            err.value = error.message
        } finally {
            isLoading.value = false
        }
    }

    const createComment = async (data) => {
        isLoading.value = true
        err.value = null
        result.value = null
        try {
            let res = await commentService.createComment(authStore.token, data)
            if (res.statusCode !== 200) throw new Error(res.message)
            result.value = res
            comments.value.push(res.data)
        } catch (error) {
            err.value = error.message
        } finally {
            isLoading.value = false
        }
    }

    const getReplies = (commentList, parentId) => {
        return commentList.filter((commentItem) => commentItem.parentId === parentId).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    }

    return {
        err, result, isLoading, comments, isReply, getAllCommentsByPostId, createComment, getReplies
    }
})
