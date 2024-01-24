<script setup>
import { FwbModal } from 'flowbite-vue'
import { ref } from 'vue';
import { usePostStore } from '../../stores/post.store'

const postStore = usePostStore()

const locatoins = ['Trường CNTT&TT', 'C1', 'B2', 'A3', 'Trường Nông nghệp']
const selectedLocation = ref([])
const isShowLocation = ref(false)

const toggleLocation = () => {
    isShowLocation.value = !isShowLocation.value
}
</script>
<template>
    <fwb-modal v-if="postStore.isFilterModal" @close="postStore.closeFilterModal">
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
                        @click="toggleLocation">
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
        </template>
        <template #footer>
            <div class="flex justify-end gap-2">
                <button class="px-2 py-1 bg-red-500 rounded-lg text-white">
                    <i class="fa-solid fa-arrows-rotate"></i>
                    Đặt lại
                </button>
                <button @click="postStore.closeFilterModal" class="px-2 py-1 bg-blue-500 rounded-lg text-white">
                    <i class="fa-regular fa-circle-xmark"></i>
                    Đóng
                </button>
            </div>
        </template>
    </fwb-modal>
</template>