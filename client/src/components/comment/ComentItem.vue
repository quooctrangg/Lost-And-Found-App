<script setup>
import CommentItem from './ComentItem.vue'
import CommentInput from './CommentInput.vue';
import { useCommentStore } from '../../stores/comment.store'
import { useToast } from 'vue-toast-notification'
import dayjs from 'dayjs';

const props = defineProps(['comment', 'replies', 'userReply'])

const commentStore = useCommentStore()
const $toast = useToast()

const handleReply = async (content) => {
    await commentStore.createComment({ content: content, postId: props.comment.postId, parentId: props.comment.id })
    if (commentStore.err) {
        $toast.error(commentStore.err, { position: 'top-right' })
        return
    }
    $toast.success(commentStore.result.message, { position: 'top-right' })
    commentStore.isReply.isShow = false
    commentStore.isReply.commentId = null
}
</script>

<template>
    <div class="flex gap-2 mt-2">
        <img class="h-8 w-auto rounded-full" :src="comment.User?.image" alt="logo">
        <div>
            <div class="bg-gray-100 rounded-lg shadow p-1">
                <router-link :to="{ name: 'profile', params: { id: comment.User.id } }">
                    <h1 class="text-sm font-medium">
                        {{
                            comment.User?.name
                        }}
                    </h1>
                </router-link>
                <div class="text-sm mt-1">
                    <span class="font-semibold text-blue-500">
                        <router-link :to="{ name: 'profile', params: { id: userReply?.id } }">
                            {{
                                userReply?.name
                            }}
                        </router-link>
                    </span>
                    {{
                        comment.content
                    }}
                </div>
            </div>
            <div class="flex gap-2 text-xs indent-2">
                <h1 class="text-gray-600">
                    {{
                        dayjs(comment.createdAt).fromNow()
                    }}
                </h1>
                <h1 v-if="commentStore.isReply.commentId !== comment.id" class="cursor-pointer hover:text-red-500" @click="() => {
                    commentStore.isReply.isShow = true
                    commentStore.isReply.commentId = comment.id
                }">
                    Phản hồi
                </h1>
            </div>
        </div>
    </div>
    <CommentInput v-if="commentStore.isReply.isShow == true && commentStore.isReply.commentId == comment.id"
        :currentReply="comment.User" :handleSendComment="handleReply" />
    <div class="ml-10">
        <CommentItem v-if="replies?.length" v-for="reply in replies" :key="reply.id" :comment="reply"
            :userReply="comment.User" :replies="commentStore.getReplies(commentStore.comments, reply.id)" />
    </div>
</template>