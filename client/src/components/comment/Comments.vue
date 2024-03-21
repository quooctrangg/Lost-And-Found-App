<script setup>
import { ref } from 'vue'
import { useCommentStore } from '../../stores/comment.store'
import Loading from '../common/Loading.vue';
import CommentInput from '../comment/CommentInput.vue'
import CommentItem from '../../components/comment/ComentItem.vue'
import { useToast } from 'vue-toast-notification'

const commentStore = useCommentStore()
const $toast = useToast()

const props = defineProps(['postId'])

const handleSendComment = async (content) => {
    await commentStore.createComment({ content: content, postId: props.postId })
    if (commentStore.err) {
        $toast.error(commentStore.err, { position: 'top-right' })
        return
    }
    $toast.success(commentStore.result.message, { position: 'top-right' })
}
</script>

<template>
    <div class="w-full bg-white rounded-md p-2 shadow border-2">
        <div class="p-2 text-sm text-gray-700 underline">
            {{ commentStore.comments.length }} bình luận
        </div>
        <div v-if="commentStore.isLoading == false" class="p-2">
            <CommentItem v-if="commentStore.parentComments.length" v-for="parentComment in commentStore.parentComments"
                :key="parentComment.id" :comment="parentComment"
                :replies="commentStore.getReplies(commentStore.comments, parentComment.id)" />
            <div v-else class="text-base text-gray-700 italic text-center">
                Không có bình luận.
            </div>
        </div>
        <div v-else class="p-5">
            <Loading />
        </div>
        <CommentInput :handleSendComment="handleSendComment" />
    </div>
</template>