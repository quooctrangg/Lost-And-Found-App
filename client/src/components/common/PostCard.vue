<script setup>
import dayjs from 'dayjs';

const props = defineProps(['post'])
</script>

<template>
    <div class="bg-white rounded-md p-2 mx-auto shadow border-2 border-blue-500 mb-3">
        <router-link :to="{ name: 'post-detail', params: { id: props.post?.id } }">
            <div class="flex justify-between items-center mb-3 border-b p-1">
                <div class="flex items-center gap-1">
                    <div class="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-500">
                        <img class="h-full w-full object-cover" :src="props.post?.User?.image" alt="logo">
                    </div>
                    <div class="flex flex-col">
                        <p class="text-base truncate">
                            {{ props.post?.User?.name }}
                        </p>
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
            <div class="flex flex-col gap-2 mb-3 p-2">
                <h2 class="text-base">
                    {{ props.post?.description }}
                </h2>
            </div>
            <div v-if="props.post?.Image.length" class="grid gap-2 test overflow-hidden"
                :class="props.post.Image.length ? `grid-cols-${props.post?.Image.length}` : ''">
                <div v-for="image in post.Image" :key="image.id"
                    class="w-full break-inside-avoid flex items-center justify-center">
                    <img :src="image.url" alt="" class="max-w-[300px] rounded-md object-cover">
                </div>
            </div>
        </router-link>
    </div>
</template>