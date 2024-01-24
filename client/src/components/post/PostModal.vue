<script setup>
import { FwbModal } from 'flowbite-vue'
import { usePostStore } from '../../stores/post.store'
import { ref } from 'vue';

const postStore = usePostStore()

const maxAllowedFiles = 5
const selectedLocation = ref([])
const locatoins = ['Trường CNTT&TT', 'C1', 'B2', 'A3', 'Trường Nông nghệp']
const isShowLocation = ref(false)
const selectedFile = ref([])
const urls = ref([])

const onFileSelected = (e) => {
    const currentQuantity = selectedFile.value.length | 0
    if (e.target.files.length <= maxAllowedFiles - currentQuantity) {
        selectedFile.value.push(...e.target.files)
        previewImage()
    } else {
        confirm('Tối đa 5 ảnh')
    }
}

const previewImage = () => {
    urls.value = []
    for (let i = 0; i < selectedFile.value.length; i++) {
        urls.value.push(URL.createObjectURL(selectedFile.value[i]))
    }
}

const deleteImage = (i) => {
    selectedFile.value.splice(i, 1)
    previewImage()
}

const toggleShowLocation = () => {
    isShowLocation.value = !isShowLocation.value
}
</script>

<template>
    <fwb-modal v-if="postStore.isPostModal" @close="postStore.closePostModal" size="5xl">
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
                        <textarea maxlength="250" id="description" type="text" placeholder="Nhập mô tả ..." rows="4"
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
                                @click="toggleShowLocation">
                                {{
                                    selectedLocation.length > 0 ? selectedLocation.join(', ') : 'Chọn vị trí'
                                }}
                                <i class="fa-solid fa-chevron-down"></i>
                            </div>
                            <div v-if="isShowLocation" class="absolute z-10 bg-white border mt-2 p-2 w-full rounded-lg">
                                <label v-for="(option, index) in locatoins" :for="option" :key="index"
                                    class="flex items-center gap-1">
                                    <input :id="option" type="checkbox" :value="option" v-model="selectedLocation"
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
                                @click="deleteImage(i)"></i>
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
                <button @click="postStore.closePostModal" class="px-2 py-1 bg-blue-500 rounded-lg text-white">
                    <i class="fa-solid fa-plus"></i>
                    Đăng
                </button>
            </div>
        </template>
    </fwb-modal>
</template>