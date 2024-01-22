<script setup>
import { ref } from 'vue'
import { FwbModal } from 'flowbite-vue'
import PostCard from '../components/common/PostCard.vue';

const isShowSetting = ref(false)
const isShowPost = ref(false)
const selectedOptions = ref([])
const isOpen = ref(false)
const options = ['Trường CNTT&TT', 'C1', 'B2', 'A3', 'Trường Nông nghệp']
const selectedFile = ref([])
const urls = ref([])

const onFileSelected = (e) => {
    selectedFile.value = e.target.files
    for (let i = 0; i < selectedFile.value.length; i++) {
        urls.value.push(URL.createObjectURL(selectedFile.value[i]))
    }
}

const deleteImg = (i) => {
    urls.value.splice(i, 1)
}

const toggleDropdown = () => {
    isOpen.value = !isOpen.value
}

const closeModalPost = () => {
    isShowPost.value = false
}

const showModalPost = () => {
    isShowPost.value = true
}

const closeModalSetting = () => {
    isShowSetting.value = false
}

const showModalSetting = () => {
    isShowSetting.value = true
}
</script>

<template>
    <div class="w-[80%] mx-auto">
        <div class="flex gap-1 mt-1 justify-center p-2 bg-white rounded-md">
            <div class="px-2 bg-slate-100 rounded-lg flex items-center gap-2">
                <i class="fa-solid fa-magnifying-glass"></i>
                <input type="text" placeholder="Tìm kiếm ..." class="bg-gray-100 rounded border-0 flex-1 text-xs">
            </div>
            <button class="p-2 rounded-lg text-white bg-sky-400" @click="showModalSetting">
                <i class="fa-solid fa-sliders"></i>
                Lọc
            </button>
            <button class="p-2 bg-blue-500 rounded-lg hover:bg-blue-400 text-white" @click="showModalPost">
                <i class="fa-solid fa-plus"></i>
                Đăng
            </button>
        </div>
        <div>
            <PostCard />
        </div>
    </div>
    <fwb-modal v-if="isShowSetting" @close="closeModalSetting">
        <template #header>
            <div class="flex items-center gap-2 font-semibold text-2xl">
                <i class="fa-solid fa-sliders"></i>
                Lọc
            </div>
        </template>
        <template #body>
            <div class="flex flex-col gap-1 text-sm">
                <label class="italic">Loại:</label>
                <div class="flex gap-1 items-center">
                    <p class="border-2 border-teal-500 p-1 text-xs font-semibold text-teal-500 rounded">
                        TẤT CẢ
                    </p>
                    <p class="border-2 border-blue-500 p-1 text-xs font-semibold text-blue-500 rounded">
                        TÌM THẤY
                    </p>
                    <p class="border-2 border-orange-500 p-1 text-xs font-semibold text-orange-500 rounded">
                        THẤT LẠC
                    </p>
                </div>
                <label class="italic" for="item">Loại đồ:</label>
                <div class="flex gap-1 items-center">
                    <select name="item" id="item" class="rounded-lg p-1 w-full">
                        <option value="all">Tất cả</option>
                        <option value="">Áo khoác</option>
                        <option value="">Điện thoại</option>
                        <option value="">Khác</option>
                    </select>
                </div>
                <label class="italic" for="item">Vị trí:</label>
                <div class="relative">
                    <div class="border p-2 cursor-pointer rounded-lg border-black flex justify-between items-center"
                        @click="toggleDropdown">
                        {{
                            selectedOptions.length > 0 ? selectedOptions.join(', ') : 'Chọn vị trí'
                        }}
                        <i class="fa-solid fa-chevron-down"></i>
                    </div>
                    <div v-if="isOpen" class="absolute z-10 bg-white border mt-2 p-2 w-full rounded-lg">
                        <label v-for="(option, index) in options" :for="option" :key="index"
                            class="flex items-center gap-1">
                            <input :id="option" type="checkbox" :value="option" v-model="selectedOptions"
                                class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded" />
                            {{ option }}
                        </label>
                    </div>
                </div>
            </div>
        </template>
        <template #footer>
            <div class="flex justify-end gap-2">
                <button class="px-2 py-1 bg-red-500 rounded-lg text-white">
                    <i class="fa-solid fa-arrows-rotate"></i>
                    Đặt lại
                </button>
                <button @click="closeModalSetting" class="px-2 py-1 bg-blue-500 rounded-lg text-white">
                    <i class="fa-regular fa-circle-xmark"></i>
                    Đóng
                </button>
            </div>
        </template>
    </fwb-modal>
    <fwb-modal v-if="isShowPost" @close="closeModalPost" size="5xl">
        <template #header>
            <div class="flex items-center gap-2 font-semibold text-2xl">
                <i class="fa-regular fa-clipboard"></i>
                Soạn bài
            </div>
        </template>
        <template #body>
            <div class="flex flex-col gap-3">
                <div class="grid grid-cols-2 gap-5">
                    <div class=" flex flex-col">
                        <label for="title">Tiêu đề</label>
                        <input id="title" maxlength="50" type="text" placeholder="Nhập tiêu đề ..." class="rounded-md">
                        <label for="description">Mô tả</label>
                        <textarea maxlength="250" id="description" type="text" placeholder="Nhập mô tả ..."
                            class="rounded-md"></textarea>
                    </div>
                    <div class="flex flex-col">
                        <label for="type">Loại bài viết</label>
                        <select name="" id="type" class="rounded-md">
                            <option value="">Chọn loại bài viết</option>
                            <option value="">Tìm thấy</option>
                            <option value="">Thất lạc</option>
                        </select>
                        <label for="item">Loại đồ vật</label>
                        <select name="" id="item" class="rounded-md">
                            <option value="">Chọn loại đồ vật</option>
                            <option value="">Quần áo</option>
                            <option value="">Trang sức</option>
                            <option value="">Điện thoại</option>
                        </select>
                        <label for="item">Vị trí</label>
                        <div class="relative">
                            <div class="border p-2 cursor-pointer rounded-lg border-black flex justify-between items-center"
                                @click="toggleDropdown">
                                {{
                                    selectedOptions.length > 0 ? selectedOptions.join(', ') : 'Chọn vị trí'
                                }}
                                <i class="fa-solid fa-chevron-down"></i>
                            </div>
                            <div v-if="isOpen" class="absolute z-10 bg-white border mt-2 p-2 w-full rounded-lg">
                                <label v-for="(option, index) in options" :for="option" :key="index"
                                    class="flex items-center gap-1">
                                    <input :id="option" type="checkbox" :value="option" v-model="selectedOptions"
                                        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded" />
                                    {{ option }}
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="flex flex-col gap-2">
                    <label>Hình ảnh</label>
                    <div class="grid grid-cols-5 gap-2 h-[100px]">
                        <label for="images" v-if="urls.length < 5"
                            class="border-dashed border-black border-2 rounded-lg p-5 flex items-center flex-col gap-1 cursor-pointer">
                            <i class="fa-solid fa-cloud-arrow-up text-2xl"></i>
                            Chọn hình ảnh
                        </label>
                        <div v-if="urls.length" v-for="(url, i) of urls"
                            class="border border-black rounded-lg overflow-hidden relative flex items-center justify-center">
                            <i class="fa-solid fa-xmark absolute top-0 right-1 cursor-pointer hover:text-red-500"
                                @click="deleteImg(i)"></i>
                            <img :src="url" alt="" :key="i" class="object-cover">
                        </div>
                    </div>
                    <input type="file" multiple hidden id="images" accept="image/png, image/jpeg" @change="onFileSelected">
                </div>
            </div>
        </template>
        <template #footer>
            <div class="flex justify-end gap-2">
                <button class="px-2 py-1 bg-red-500 rounded-lg text-white">
                    <i class="fa-solid fa-arrows-rotate"></i>
                    Đặt lại
                </button>
                <button @click="closeModalPost" class="px-2 py-1 bg-blue-500 rounded-lg text-white">
                    <i class="fa-solid fa-plus"></i>
                    Đăng
                </button>
            </div>
        </template>
    </fwb-modal>
</template>
