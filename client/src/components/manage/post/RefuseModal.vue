<script setup>
import { FwbButton, FwbModal } from 'flowbite-vue'
import { useManageStore } from '../../../stores/manage.store'

const manageStore = useManageStore()
</script>

<template>
    <fwb-modal v-if="manageStore.isShow.refuse" @close="manageStore.closeRefuseModal" :size="'xs'">
        <template #header>
            <div class="flex items-center text-xl gap-2">
                Phản hồi
            </div>
        </template>
        <template #body>
            <div class="w-full">

            </div>
        </template>
        <template #footer>
            <div class="flex justify-end gap-2">
                <fwb-button @click="manageStore.closeRefuseModal" color="alternative">
                    Hủy
                </fwb-button>
                <fwb-button @click="manageStore.closeRefuseModal" color="green">
                    Đổi
                </fwb-button>
            </div>
        </template>
    </fwb-modal>
</template>