<script setup>
import { ref, onMounted, reactive, onUnmounted, watch } from 'vue';
import { usePostStore } from '../stores/post.store'
import { useUserStore } from '../stores/user.store'
import PostCard from '../components/common/PostCard.vue';
import FilterModal from '../components/post/FilterModal.vue'
import PostModal from '../components/post/PostModal.vue'
import ScrollToTop from '../components/common/ScrollToTop.vue'
import SuggestCard from '../components/common/SuggestCard.vue';
import InputSearch from '../components/post/InputSearch.vue';
import Footer from '../components/common/Footer.vue';
import Loading from '../components/common/Loading.vue';

const postStore = usePostStore()
const userStore = useUserStore()

const posts = ref([])
const option = reactive({
    locations: [],
    type: null,
    itemId: null,
    page: 1,
    key: ''
})
const scrollComponent = ref(null)
const totalPage = ref(1)
const image = ref(null)

const setOption = (value) => {
    option.locations = value.locations
    option.type = value.type
    option.itemId = value.itemId
}

const getAllPostsForUser = async () => {
    await postStore.getAllPostsForUser(option)
    if (postStore.err) return
    posts.value.push(...postStore.posts)
    totalPage.value = postStore.totalPages
}

const loadMore = async () => {
    if (image.value != null) return
    let element = scrollComponent.value
    let triggerBottom = element.getBoundingClientRect().bottom;
    let viewportHeight = window.innerHeight;
    if (triggerBottom <= viewportHeight && !postStore.isLoading) {
        if (option.page < totalPage.value) {
            option.page++
            await getAllPostsForUser()
        }
    }
}

const searchPostsByImage = async image => {
    const dataForm = new FormData()
    dataForm.append('image', image)
    await postStore.searchPostsByImage(dataForm)
    posts.value = postStore.posts
}

const getFilter = async () => {
    posts.value = []
    await getAllPostsForUser()
}

watch(() => option.key, async newval => {
    await getFilter()
})

watch(() => image.value, async newval => {
    if (image.value != null) {
        await searchPostsByImage(image.value)
    } else {
        await getFilter()
    }
})

onMounted(async () => {
    window.addEventListener('scroll', loadMore)
    await getAllPostsForUser()
})

onUnmounted(() => {
    window.removeEventListener('scroll', loadMore)
})
</script>

<template>
    <div class="p-2 md:p-0 lg:w-[80%] mx-auto">
        <div class="flex gap-2 justify-center mt-3">
            <InputSearch @key="e => option.key = e" @image="e => image = e" />
            <button v-if="userStore.user?.id"
                class="px-3 py-2 bg-blue-500 rounded-xl hover:bg-blue-700 text-white font-semibold"
                @click="postStore.showPostModal">
                <i class="fa-solid fa-plus"></i>
                <span class="hidden md:inline">
                    Đăng bài
                </span>
            </button>
        </div>
        <button class="p-2 rounded-xl mt-2" @click="postStore.showFilterModal">
            <i class="fa-solid fa-sliders"></i>
            Lọc
        </button>
        <div class="w-full flex gap-2 justify-center">
            <div class="w-full md:w-[70%]" ref="scrollComponent">
                <PostCard v-if="posts.length" v-for="post in posts " :post="post" />
            </div>
            <div v-if="userStore.user?.id"
                class="hidden md:block w-[30%] bg-white rounded-md shadow border-2 border-blue-500 h-fit p-2 sticky top-16">
                <SuggestCard />
            </div>
        </div>
        <div class="py-10">
            <Loading v-if="postStore.isLoading" />
        </div>
    </div>
    <Footer />
    <ScrollToTop />
    <FilterModal @option="(e) => { setOption(e) }" @btnSubmit="getFilter" />
    <PostModal />
</template>
