<script setup>
import { FwbButton, FwbModal } from 'flowbite-vue'
import { useManageStore } from '../../../stores/manage.store'
import { useSchoolStore } from '../../../stores/school.store'
import { useToast } from 'vue-toast-notification'
import { ref, watchEffect } from 'vue';
import Loading from '../../common/Loading.vue';

const props = defineProps(['school'])

const manageStore = useManageStore()
const schoolStore = useSchoolStore()
const $toast = useToast()

const name = ref('')

const updateSchool = async () => {
    await schoolStore.updateSchool(props.school?.id, { name: name.value })
    if (schoolStore.err) {
        $toast.error(schoolStore.err, { position: 'top-right' })
        return
    }
    $toast.success(schoolStore.result.message, { position: 'top-right' })
    await schoolStore.getSchool({ key: schoolStore.key, page: schoolStore.currentPage })
    manageStore.closeEditSchoolModal()
}

watchEffect(async () => {
    if (props.school) {
        name.value = props.school.name
    }
})
</script>

<template>
    <fwb-modal v-if="manageStore.isShow.editSchool" @close="manageStore.closeEditSchoolModal" :size="'sm'">
        <template #header>
            <div class="flex items-center text-xl gap-2">
                <i class="fa-solid fa-plus"></i>
                Chỉnh sửa trường / khoa
            </div>
        </template>
        <template #body>
            <div class="w-full">
                <form @submit.prevent="updateSchool" v-if="schoolStore.isLoading == false">
                    <label for="name" class="text-lg mx-2">Tên trường / khoa:</label>
                    <input id="name" minlength="1" maxlength="50" required type="text" placeholder="Nhập tên trường / khoa"
                        class="rounded-md w-full" v-model="name">
                    <button type="submit" hidden id="btn-submit"></button>
                </form>
                <div v-else>
                    <Loading />
                </div>
            </div>
        </template>
        <template #footer>
            <div class="flex justify-end gap-2">
                <fwb-button @click="manageStore.closeEditSchoolModal" color="alternative">
                    Hủy
                </fwb-button>
                <label for="btn-submit"
                    class="bg-green-500 rounded-lg text-sm px-5 py-3 text-center text-white font-semibold cursor-pointer hover:bg-green-600">
                    Sửa
                </label>
            </div>
        </template>
    </fwb-modal>
</template>