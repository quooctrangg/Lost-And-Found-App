<script setup>
import { useNotificationStore } from '../../stores/notification.store'

const notificationStore = useNotificationStore()

const emit = defineEmits(['showNotifications'])

const gotoPost = async (index) => {
    await notificationStore.readNotification(notificationStore.notifications[index].id)
    if (notificationStore.err) {
        return
    }
    notificationStore.notifications[index].read = true
    notificationStore.totalRead = notificationStore.totalRead - 1
}
</script>

<template>
    <div
        class="shadow-xl border overflow-hidden rounded-lg absolute w-[200px] lg:w-[300px] mt-1 flex flex-col notification-container">
        <div class="flex justify-between items-center bg-blue-600 p-2 px-3">
            <h1 class=" text-white text-base lg:text-lg">Thông báo</h1>
            <button @click="emit('showNotifications', false)" class="hover:text-red-500 text-white">
                <i class="fa-solid fa-xmark"></i>
            </button>
        </div>
        <div class="bg-white max-h-[200px] overflow-y-scroll no-scrollbar">
            <div v-if="notificationStore.notifications?.length"
                v-for="(notification, index) in notificationStore.notifications" :key="notification.id"
                :class="notification.read ? 'bg-slate-200' : ''" @click="async () => { await gotoPost(index) }">
                <router-link :to="{ name: 'post-detail', params: { id: notification.Comment.postId }, replace: true }">
                    <div
                        class="border-b border-slate-200 text-sm p-2 grid grid-cols-6 cursor-pointer hover:bg-slate-100">
                        <div class="h-10 w-10 overflow-hidden rounded-full flex items-center justify-center">
                            <img :src="notification?.Comment?.User?.image" class="h-full w-full object-cover">
                        </div>
                        <span class="col-span-5">
                            <span class="font-medium text-wrap">
                                {{ notification?.Comment?.User?.name }}
                            </span>
                            <span v-if="notification?.Comment?.parentId" class="text-wrap"> đã trả lời bình luận </span>
                            <span v-else class="text-wrap"> đã bình luận bài viết </span>
                            <span class="font-medium text-wrap">
                                {{ notification?.Comment?.parentId ? notification?.Comment?.parent?.content :
                                    notification?.Comment?.Post?.title }}
                            </span>.
                        </span>
                    </div>
                </router-link>
            </div>
            <div v-else class="text-sm text-center p-2 text-red-500 italic">
                Không có thông báo.
            </div>
        </div>
    </div>
</template>