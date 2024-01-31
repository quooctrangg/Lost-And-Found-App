<script setup>
import { FwbButton, FwbModal } from 'flowbite-vue'
import { useManageStore } from '../../../stores/manage.store'

const manageStore = useManageStore()
</script>

<template>
    <fwb-modal v-if="manageStore.isShow.editItem" @close="manageStore.closeEditItemModal" :size="'xs'">
        <template #header>
            <div class="flex items-center text-xl gap-2">
                <i class="fa-solid fa-plus"></i>
                Chỉnh sửa danh mục
            </div>
        </template>
        <template #body>
            <div class="w-full">

            </div>
        </template>
        <template #footer>
            <div class="flex justify-end gap-2">
                <fwb-button @click="manageStore.closeEditItemModal" color="alternative">
                    Hủy
                </fwb-button>
                <fwb-button @click="manageStore.closeEditItemModal" color="green">
                    Thêm
                </fwb-button>
            </div>
        </template>
    </fwb-modal>
</template>