<script setup>
import { FwbButton, FwbModal } from 'flowbite-vue'

const props = defineProps(['isShow', 'currentFeedback'])
const emits = defineEmits(['closeHistory'])
</script>

<template>
    <fwb-modal v-if="props.isShow" @close="" :persistent="true">
        <template #header>
            <div class="flex items-center text-xl gap-2">
                Lý do từ chối
            </div>
        </template>
        <template #body>
            <div class="w-full max-h-60">
                {{
                    props.currentFeedback
                }}
            </div>
        </template>
        <template #footer>
            <div class="flex justify-end gap-2">
                <fwb-button @click="() => { emits('closeHistory') }" color="alternative">
                    Đóng
                </fwb-button>
            </div>
        </template>
    </fwb-modal>
</template>