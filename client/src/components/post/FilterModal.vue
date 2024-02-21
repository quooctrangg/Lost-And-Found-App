<script setup>
import { FwbModal } from 'flowbite-vue'
import { ref } from 'vue';
import { usePostStore } from '../../stores/post.store'
import { useItemStore } from '../../stores/item.store'
import { useLocationStore } from '../../stores/location.store'
import { onMounted } from 'vue';
import { watch } from 'vue';

const emits = defineEmits(['option'])

const postStore = usePostStore()
const itemStore = useItemStore()
const locationStore = useLocationStore()

const type = ref(null)
const locations = ref([])
const itemId = ref(null)

const reset = () => {
    type.value = null
    locations.value = []
    itemId.value = null
}

watch(type, () => {
    emits('option', { locations: locations.value, itemId: itemId.value, type: type.value })
})

watch(locations, () => {
    emits('option', { locations: locations.value, itemId: itemId.value, type: type.value })
})

watch(itemId, () => {
    emits('option', { locations: locations.value, itemId: itemId.value, type: type.value })
})

onMounted(async () => {
    await itemStore.getItem({})
    await locationStore.getLocation({})
})
</script>
<template>
    <fwb-modal v-if="postStore.isShow.filter" @close="postStore.closeFilterModal" persistent>
        <template #header>
            <div class="flex items-center gap-2 font-semibold text-2xl">
                <i class="fa-solid fa-sliders"></i>
                Lọc
            </div>
        </template>
        <template #body>
            <div class="flex flex-col gap-1 text-sm">
                <label class="italic">Loại bài viết:</label>
                <div class="flex gap-1 items-center">
                    <button class="border-2 border-teal-500 p-1 text-xs font-semibold text-teal-500 rounded"
                        :class="type == null ? 'bg-teal-400 text-white' : ''" @click="type = null">
                        TẤT CẢ
                    </button>
                    <button class="border-2 border-blue-500 p-1 text-xs font-semibold text-blue-500 rounded"
                        :class="type == true ? 'bg-blue-400 text-white' : ''" @click="type = true">
                        TÌM THẤY
                    </button>
                    <button class="border-2 border-orange-500 p-1 text-xs font-semibold text-orange-500 rounded"
                        :class="type == false ? 'bg-orange-400 text-white' : ''" @click="type = false">
                        THẤT LẠC
                    </button>
                </div>
                <label class="italic" for="item">Loại đồ:</label>
                <div class="flex gap-1 items-center">
                    <select name="item" id="item" class="rounded-lg  w-full" v-model="itemId">
                        <option value="null">Tất cả</option>
                        <option v-if="itemStore.items?.length" v-for="item in itemStore.items" :value="item.id">
                            {{
                                item.name
                            }}
                        </option>
                    </select>
                </div>
                <label class="italic" for="item">Vị trí:</label>
                <div class="flex flex-wrap gap-3">
                    <label v-for="location in locationStore.locations" :key="location.id" :for="location.id"
                        class="flex items-center gap-1">
                        <input type="checkbox" :name="location.id" :id="location.id" :value="location.id"
                            v-model="locations"
                            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded cursor-pointer" />
                        {{
                            location.name
                        }}
                    </label>
                </div>
            </div>
        </template>
        <template #footer>
            <div class="flex justify-end gap-2">
                <button class="px-3 py-2 bg-red-500 rounded-lg text-white" @click="reset">
                    <i class="fa-solid fa-arrows-rotate"></i>
                    Đặt lại
                </button>
                <button @click="postStore.closeFilterModal" class="px-3 py-2 bg-blue-500 rounded-lg text-white">
                    <i class="fa-regular fa-circle-xmark"></i>
                    Hoàn tất
                </button>
            </div>
        </template>
    </fwb-modal>
</template>