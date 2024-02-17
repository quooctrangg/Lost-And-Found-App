<script setup>
import { ref } from 'vue';
import { useCommentStore } from '../../stores/comment.store'

const props = defineProps(['handleSendComment', 'currentReply'])

const commentStore = useCommentStore()

const content = ref('')

const handleSubmit = () => {
    if (content.value.trim() == '') return
    props.handleSendComment(content.value)
    content.value = ''
}
</script>

<template>
    <div class="my-2">
        <div v-if="currentReply" class="text-xs text-gray-700 flex gap-2 p-1">
            <p>
                Đang phản hồi
                <span class="font-semibold">
                    {{
                        currentReply.name
                    }}
                </span>
            </p>
            <button class="text-red-600 hover:text-red-400" @click="() => {
                        commentStore.isReply.isShow = false
                        commentStore.isReply.commentId = null
                    }">
                Hủy
            </button>
        </div>
        <div class="flex justify-between items-center bg-gray-200 p-1 rounded shadow">
            <input type="text" placeholder="Nhập bình luận..." @keyup.enter="handleSubmit" v-model="content"
                class="p-1 w-full border-none outline-none border-transparent focus:border-transparent focus:ring-0 bg-gray-200">
            <div class="flex gap-3 mx-2 hover:text-blue-500" @click="handleSubmit">
                <span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="w-6 h-6 cursor-pointer">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                    </svg>
                </span>
            </div>
        </div>
    </div>
</template>