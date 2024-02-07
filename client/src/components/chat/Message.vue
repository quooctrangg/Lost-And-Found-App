<script setup>
import { useUserStore } from '../../stores/user.store'
import dayjs from 'dayjs'

const userStore = useUserStore()

const props = defineProps(['message'])
</script>

<template>
    <div class="my-3 flex items-center p-3 w-full"
        :class="userStore.user.id === props.message.User.id ? 'flex-row-reverse' : 'flex-row'">
        <div class="h-10 w-10 rounded-full overflow-hidden border-indigo-600 border">
            <img class="h-full w-full" alt="logo" :src="props.message.User.image">
        </div>
        <div class="mx-4  text-black flex flex-col rounded-lg py-1 px-3 text max-w-[85%] break-all"
            :class="userStore.user.id === props.message.User.id ? 'message_right' : 'message_left'">
            <p v-if="!props.message.isImage" class="w-full"
                :class="userStore.user.id === props.message.User.id ? '' : 'text-left'">
                {{
                    props.message?.content
                }}
            </p>
            <p v-else class="w-full bg-white" :class="userStore.user.id === props.message.User.id ? '' : 'text-left'">
                <img class="w-[200px] object-cover" :src="props.message?.content">
            </p>
            <span class="text-xs ">
                {{
                    dayjs(props.message?.createdAt).fromNow()
                }}
            </span>
        </div>
    </div>
</template>