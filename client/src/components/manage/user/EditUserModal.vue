<script setup>
import { FwbButton, FwbModal } from 'flowbite-vue'
import { useManageStore } from '../../../stores/manage.store'

const manageStore = useManageStore()
</script>

<template>
    <fwb-modal v-if="manageStore.isShow.editUser" @close="manageStore.closeEditUserModal" :size="'xs'">
        <template #header>
            <div class="flex items-center text-xl gap-2">
                <i class="fa-solid fa-pen"></i>
                Cập nhật tài khoản
            </div>
        </template>
        <template #body>
            <div class="w-full">

            </div>
        </template>
        <template #footer>
            <div class="flex justify-end gap-2">
                <fwb-button @click="manageStore.closeEditUserModal" color="alternative">
                    Hủy
                </fwb-button>
                <fwb-button @click="manageStore.closeEditUserModal" color="green">
                    Đổi
                </fwb-button>
            </div>
        </template>
    </fwb-modal>
</template>