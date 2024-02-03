<script setup>
import { FwbButton, FwbModal } from 'flowbite-vue'
import { useManageStore } from '../../../stores/manage.store'
import dayjs from 'dayjs'

const manageStore = useManageStore()

const props = defineProps(['user'])
</script>

<template>
    <fwb-modal v-if="manageStore.isShow.history" @close="manageStore.closeHistoryModal" :persistent="true">
        <template #header>
            <div class="flex items-center text-xl gap-2">
                Lịch sử khóa
            </div>
        </template>
        <template #body>
            <div class="w-full max-h-60 overflow-y-scroll">
                <table class="table-auto w-full">
                    <thead class="border-b border-black font-medium">
                        <tr class="text-left">
                            <th class="px-6 py-4 w-[10%] border border-black">
                                STT
                            </th>
                            <th class="px-6 py-4 w-[20%] text-center border border-black">
                                Ngày
                            </th>
                            <th class="px-6 py-4 w-[70%] text-center border border-black">
                                Lý do
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="props.user?.Feedback.length" v-for="(feedback, i) in props.user?.Feedback" :key="i">
                            <td class="whitespace-nowrap px-6 py-4 w-[10%] border border-black text-center">
                                {{
                                    i + 1
                                }}
                            </td>
                            <td class="whitespace-nowrap px-6 py-4 w-[20%] border border-black">
                                {{
                                    dayjs(feedback.createdAt).format('LT L')
                                }}
                            </td>
                            <td class="whitespace-nowrap px-6 py-4 w-[70%] border border-black">
                                {{
                                    feedback.content
                                }}
                            </td>
                        </tr>
                        <tr v-else class="text-center text-red-500 text-xl">
                            <td colspan="3" class="border border-black p-2">
                                Không có.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>
        <template #footer>
            <div class="flex justify-end gap-2">
                <fwb-button @click="manageStore.closeHistoryModal" color="alternative">
                    Đóng
                </fwb-button>
            </div>
        </template>
    </fwb-modal>
</template>