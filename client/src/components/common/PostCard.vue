<script setup>
import dayjs from 'dayjs';
import Image from 'primevue/image';

const props = defineProps(['post'])
</script>

<template>
    <div class="bg-white rounded-md p-2 mx-auto shadow border-2 border-blue-500 mb-3">
        <div class="flex justify-between items-center mb-3 border-b p-1">
            <div class="flex items-center gap-1">
                <div class="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-500">
                    <img class="h-full w-full object-cover" :src="props.post?.User?.image" alt="logo">
                </div>
                <div class="flex flex-col">
                    <router-link :to="{ name: 'profile', params: { id: props.post?.User?.id } }">
                        <p class="text-base truncate">
                            {{ props.post?.User?.name }}
                        </p>
                    </router-link>
                    <span class="text-xs italic">
                        <i class=" fa-regular fa-clock"></i>
                        {{ dayjs().diff(dayjs(props.post?.updatedAt), 'day') > 0 ?
                            dayjs(props.post?.updatedAt).format('LT L')
                            : dayjs(props.post?.updatedAt).fromNow() }}
                    </span>
                </div>
            </div>
            <div class="flex gap-5 items-center">
                <div>
                    <div v-if="props.post?.type === true" class="flex gap-1">
                        <p class="card-found">
                            TÌM THẤY
                        </p>
                        <p v-if="props.post?.done == -1" class="card-send">
                            GỬI TẠI BAN QUẢN LÝ TÒA NHÀ
                        </p>
                        <p v-else-if="props.post?.done == -2" class="card-send">
                            GỬI TẠI ĐOÀN THANH NIÊN
                        </p>
                    </div>
                    <p v-else class="card-lost">
                        THẤT LẠC
                    </p>
                </div>
            </div>
        </div>
        <router-link :to="{ name: 'post-detail', params: { id: props.post?.id } }">
            <div class="flex flex-col gap-2 mb-3 p-2">
                <h2 class="text-base" v-html="props.post?.description"></h2>
            </div>
        </router-link>
        <div v-if="props.post?.Image.length" class="grid gap-2 test overflow-hidden"
            :class="props.post.Image.length ? `grid-cols-${props.post?.Image.length}` : ''">
            <div v-for="image in post.Image" :key="image.id"
                class="w-full break-inside-avoid flex items-center justify-center">
                <Image :src="image.url" :alt="image.id" width="250" preview :pt="{ icon: 'p-image-action' }" />
            </div>
        </div>
    </div>
</template>