<script setup>
import { FwbButton, FwbModal } from 'flowbite-vue'
import { useManageStore } from '../../../stores/manage.store'
import { useSchoolStore } from '../../../stores/school.store'
import { ref } from 'vue';
import { useToast } from 'vue-toast-notification'
import Loading from '../../common/Loading.vue';

const manageStore = useManageStore()
const schoolStore = useSchoolStore()
const $toast = useToast()

const name = ref('')

const createSchool = async () => {
    await schoolStore.createSchool({ name: name.value })
    if (schoolStore.err) {
        $toast.error(schoolStore.err, { position: 'top-right' })
        return
    }
    $toast.success(schoolStore.result.message, { position: 'top-right' })
    name.value = ''
    await schoolStore.getSchool({ key: '', page: schoolStore.currentPage })
    manageStore.closeAddSchoolModal()
}
</script>

<template>
    <fwb-modal v-if="manageStore.isShow.addSchool" @close="manageStore.closeAddSchoolModal" :size="'xs'">
        <template #header>
            <div class="flex items-center text-xl gap-2">
                <i class="fa-solid fa-plus"></i>
                Thêm trường / khoa
            </div>
        </template>
        <template #body>
            <div class="w-full">
                <form @submit.prevent="createSchool" v-if="schoolStore.isLoading == false">
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
                <fwb-button @click="manageStore.closeAddSchoolModal" color="alternative">
                    Hủy
                </fwb-button>
                <label for="btn-submit"
                    class="bg-green-500 rounded-lg text-sm px-5 py-3 text-center text-white font-semibold cursor-pointer hover:bg-green-600">
                    Thêm
                </label>
            </div>
        </template>
    </fwb-modal>
</template>