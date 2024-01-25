<script setup>
import { usePostStore } from '../stores/post.store'
import PostCard from '../components/common/PostCard.vue';
import FilterModal from '../components/post/FilterModal.vue'
import PostModal from '../components/post/PostModal.vue'
import ScrollToTop from '../components/common/ScrollToTop.vue'
import Search from '../components/common/Seach.vue'
import SuggestCard from '../components/common/SuggestCard.vue';

const postStore = usePostStore()
</script>

<template>
    <div class="w-[80%] mx-auto">
        <div class="flex gap-2 justify-center p-2 bg-white rounded-xl mt-3 shadow">
            <Search class="flex-1" :title="`Tìm kiếm bài viết`" />
            <button class="p-2 rounded-xl text-white bg-sky-400 hover:bg-sky-300" @click="postStore.showFilterModal">
                <i class="fa-solid fa-sliders"></i>
                Lọc
            </button>
            <button class="p-2 bg-blue-500 rounded-xl hover:bg-blue-400 text-white" @click="postStore.showPostModal">
                <i class="fa-solid fa-plus"></i>
                Đăng
            </button>
        </div>
        <div class="w-full flex gap-2">
            <div class="w-[70%]">
                <PostCard />
            </div>
            <div class="w-[30%] mt-5 bg-white rounded-md shadow h-[100vh] p-2 sticky top-11">
                <h1 class="text-center font-semibold text-xl italic border-b py-2">Gợi ý</h1>
                <SuggestCard />
            </div>
        </div>
    </div>
    <ScrollToTop />
    <FilterModal />
    <PostModal />
</template>
