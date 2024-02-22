<script setup>
import { useNotificationStore } from '../../stores/notification.store'

const notificationStore = useNotificationStore()

const emit = defineEmits(['showNotifications'])
</script>

<template>
    <div class="shadow-xl border  overflow-hidden rounded-lg absolute w-[300px] mt-1 flex flex-col notification-container">
        <div class="flex justify-between items-center bg-blue-600 p-2 px-3">
            <h1 class=" text-white">Thông báo</h1>
            <button @click="emit('showNotifications', false)" class="hover:text-red-500 text-white">
                <i class="fa-solid fa-xmark"></i>
            </button>
        </div>
        <div class="p-2 bg-white max-h-[200px] overflow-y-scroll no-scrollbar">
            <div v-if="notificationStore.notifications?.length" v-for="notification in notificationStore.notifications"
                :key="notification.id" class="border-b-[1px] border-gray-400 text-sm p-2 flex items-center gap-1">
                <div class="h-10 w-10 overflow-hidden rounded-full flex items-center justify-center">
                    <img :src="notification?.Comment?.User?.image" class="h-full w-full object-cover">
                </div>
                <span class="">
                    <span class="font-medium">
                        {{
                            notification?.Comment?.User?.name
                        }}
                    </span>
                    <span v-if="notification?.Comment?.parentId"> đã trả lời bình luận </span>
                    <span v-else> đã bình luận bài viết </span>
                    <router-link :to="{ name: 'post-detail', params: { id: notification?.Comment?.Post?.id } }">
                        <span class="font-medium">
                            {{
                                notification?.Comment?.parentId ? notification?.Comment?.parent?.content :
                                notification?.Comment?.Post?.title
                            }}
                        </span>.
                    </router-link>
                </span>
            </div>
        </div>
    </div>
</template>