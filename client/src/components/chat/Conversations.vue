<script setup>
import { onMounted } from 'vue';
import { useConversationStore } from '../../stores/conversation.store'
import { useUserStore } from '../../stores/user.store'
import { getSender } from '../../untils'
import dayjs from 'dayjs'

const conversationStore = useConversationStore()
const userStore = useUserStore()

onMounted(async () => {
    await conversationStore.fetchConversations()
})
</script>

<template>
    <div class="flex-1 mt-2 overflow-y-scroll no-scrollbar border-2 rounded-md p-2">
        <div v-for="(conversation, index) in conversationStore.conversations" :key="conversation.id"
            class="p-1 flex text-black mb-1 cursor-pointer gap-2 bg-white rounded items-center"
            @click="conversationStore.activeIndex = index"
            :class="conversationStore.activeIndex == index ? ' border-2 border-blue-600 ' : ' border-b-[1px]'">
            <div class="h-[45px] w-[45px] rounded-full overflow-hidden border shrink-0">
                <img alt="avatar" class="h-full w-full" :src="getSender(userStore.user, conversation.User)?.image">
            </div>
            <div class="flex flex-col w-[100%] gap-2 justify-between py-1">
                <h2 class="text-base font-semibold truncate max-w-[150px]">
                    {{
                        getSender(userStore.user, conversation.User)?.name
                    }}
                </h2>
                <div class="flex text-sm w-[100%] justify-between" v-if="conversation.Message?.length">
                    <div class="truncate w-[80%] basis-2/3"
                        :class="userStore.user.id === conversation.Message[0].userId ? '' : 'text-yellow-400'">
                        {{
                            userStore.user.id === conversation.Message[0].userId ? 'Bạn: ' : ''
                        }}
                        {{
                            conversation.Message[0].isImage ? '[Hình ảnh]' : conversation.Message[0].content
                        }}
                    </div>
                    <div>
                        {{
                            dayjs(conversation.Message[0].createdAt).fromNow()
                        }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>