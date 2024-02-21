<script setup>
import { usePostStore } from '../stores/post.store'
import PostCard from '../components/common/PostCard.vue';
import FilterModal from '../components/post/FilterModal.vue'
import PostModal from '../components/post/PostModal.vue'
import ScrollToTop from '../components/common/ScrollToTop.vue'
import Search from '../components/common/Seach.vue'
import SuggestCard from '../components/common/SuggestCard.vue';
import { ref } from 'vue';
import { onMounted } from 'vue';
import { reactive } from 'vue';
import { watch } from 'vue';

const postStore = usePostStore()

const posts = ref([])
const option = reactive({
    locations: [],
    type: null,
    itemId: null
})

const setOption = (value) => {
    option.locations = value.locations
    option.type = value.type
    option.itemId = value.itemId
}

const getAllPostsForUser = async () => {
    await postStore.getAllPostsForUser(option)
    if (postStore.err) return
    posts.value = [...postStore.posts]
}

watch(option, async () => {
    posts.value = []
    await getAllPostsForUser()
})

onMounted(async () => {
    await getAllPostsForUser()
})
</script>

<template>
    <div class="w-[80%] mx-auto">
        <div class="flex gap-2 justify-center  mt-3">
            <Search class="flex-1  border-2 border-blue-600" :title="`Tìm kiếm bài viết`" />
            <button class="px-3 py-2 bg-blue-500 rounded-xl hover:bg-blue-400 text-white" @click="postStore.showPostModal">
                <i class="fa-solid fa-plus"></i>
                Đăng bài
            </button>
        </div>
        <button class="p-2 rounded-xl mt-2" @click="postStore.showFilterModal">
            <i class="fa-solid fa-sliders"></i>
            Lọc
        </button>
        <div class="w-full flex gap-2">
            <div class="w-[70%]">
                <PostCard v-if="posts.length" v-for="post in posts" :post="post" />
            </div>
            <div class="w-[30%] bg-white rounded-md shadow border-2 border-green-400 h-fit p-2 sticky top-11">
                <h1 class="text-center font-semibold text-lg text-green-500 italic border-b ">Gợi ý cho bạn</h1>
                <SuggestCard />
            </div>
        </div>
    </div>
    <ScrollToTop />
    <FilterModal @option="(e) => { setOption(e) }" />
    <PostModal />
</template>
