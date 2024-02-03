<script setup>
import { FwbButton, FwbModal } from 'flowbite-vue'
import { useManageStore } from '../../../stores/manage.store'
import { ref } from 'vue';

const manageStore = useManageStore()

const props = defineProps(['user'])
const emits = defineEmits(['user'])

const feedback = ref('')

const sumitFeedback = () => {
    emits('user', { user: props.user, feedback: feedback.value })
    feedback.value = ''
}
</script>

<template>
    <fwb-modal v-if="manageStore.isShow.feedback" @close="manageStore.closeFeedbackModal" :persistent="true">
        <template #header>
            <div class="flex items-center text-xl gap-2">
                Phản hồi
            </div>
        </template>
        <template #body>
            <form @submit.prevent="sumitFeedback">
                <div class="w-full">
                    <div class="flex gap-2 items-center">
                        <label for="email" class="label-custom">
                            Email:
                        </label>
                        <input type="email" maxlength="50" name="email" id="email" class="input-custom"
                            v-model="props.user.email" disabled>
                    </div>
                    <div class="mt-3">
                        <textarea maxlength="250" rows="5" class="w-full rounded-md" placeholder="Nhập lý do khóa"
                            v-model="feedback" required></textarea>
                    </div>
                    <button type="submit" hidden id="btn-submit"></button>
                </div>
            </form>
        </template>
        <template #footer>
            <div class="flex justify-end gap-2">
                <fwb-button @click="manageStore.closeFeedbackModal" color="alternative">
                    Hủy
                </fwb-button>
                <label for="btn-submit"
                    class="bg-green-500 rounded-lg text-sm px-5 py-3 text-center text-white font-semibold cursor-pointer hover:bg-green-600">
                    Khóa
                </label>
            </div>
        </template>
    </fwb-modal>
</template>