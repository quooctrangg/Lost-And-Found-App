<script setup>
import { FwbButton, FwbModal } from 'flowbite-vue'
import { useManageStore } from '../../../stores/manage.store'

const manageStore = useManageStore()
</script>

<template>
    <fwb-modal v-if="manageStore.isShow.editLocation" @close="manageStore.closeEditLocationModal" :size="'xs'">
        <template #header>
            <div class="flex items-center text-xl gap-2">
                <i class="fa-solid fa-plus"></i>
                Chỉnh sửa vị trí
            </div>
        </template>
        <template #body>
            <div class="w-full">

            </div>
        </template>
        <template #footer>
            <div class="flex justify-end gap-2">
                <fwb-button @click="manageStore.closeEditLocationModal" color="alternative">
                    Hủy
                </fwb-button>
                <fwb-button @click="manageStore.closeEditLocationModal" color="green">
                    Thêm
                </fwb-button>
            </div>
        </template>
    </fwb-modal>
</template>