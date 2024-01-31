<script setup>
import { FwbButton, FwbModal } from 'flowbite-vue'
import { useUserStore } from '../../stores/user.store'
import { ref } from 'vue';

const userStore = useUserStore()
const url = ref(null)
const selectedFile = ref(null)

const onFileSelected = (e) => {
    selectedFile.value = e.target.files[0]
    url.value = URL.createObjectURL(selectedFile.value)
}
</script>

<template>
    <fwb-modal v-if="userStore.isShow.updateAvatar" @close="userStore.closeUpdateAvatarModal" :size="'xs'">
        <template #header>
            <div class="flex items-center text-xl gap-2">
                <i class="fa-solid fa-camera"></i>
                Đổi ảnh đại diện
            </div>
        </template>
        <template #body>
            <div class="w-full flex justify-center">
                <div class="h-36 w-36 border-dashed border-black border-2 rounded-full overflow-hidden">
                    <label for="images" class="cursor-pointer h-full w-full flex justify-center items-center">
                        <div v-if="url == null" class="flex flex-col items-center gap-2">
                            <i class="fa-solid fa-cloud-arrow-up text-2xl"></i>
                            Chọn hình ảnh
                        </div>
                        <img v-else :src="url" alt="" class="object-cover">
                    </label>
                </div>
                <input type="file" hidden id="images" accept="image/png, image/jpeg" @change="onFileSelected">
            </div>
        </template>
        <template #footer>
            <div class="flex justify-end gap-2">
                <fwb-button @click="userStore.closeUpdateAvatarModal" color="alternative">
                    Hủy
                </fwb-button>
                <fwb-button @click="userStore.closeUpdateAvatarModal" color="green">
                    Đổi
                </fwb-button>
            </div>
        </template>
    </fwb-modal>
</template>