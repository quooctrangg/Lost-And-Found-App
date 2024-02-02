<script setup>
import { FwbButton, FwbModal } from 'flowbite-vue'
import { useManageStore } from '../../../stores/manage.store'
import { useLocationStore } from '../../../stores/location.store'
import { useToast } from 'vue-toast-notification'
import { reactive } from 'vue'
import Loading from '../../common/Loading.vue'

const manageStore = useManageStore()
const locationStore = useLocationStore()
const $toast = useToast()

const data = reactive({
    name: '',
    symbol: ''
})

const createLocation = async () => {
    await locationStore.createLocation(data)
    if (locationStore.err) {
        $toast.error(locationStore.err, { position: 'top-right' })
        return
    }
    $toast.success(locationStore.result.message, { position: 'top-right' })
    data.name = ''
    data.symbol = ''
    await locationStore.getLocation({ key: locationStore.key, page: locationStore.currentPage })
    manageStore.closeAddLocationModal()
}
</script>

<template>
    <fwb-modal v-if="manageStore.isShow.addLocation" @close="manageStore.closeAddLocationModal" :size="'xs'">
        <template #header>
            <div class="flex items-center text-xl gap-2">
                <i class="fa-solid fa-plus"></i>
                Thêm vị trí
            </div>
        </template>
        <template #body>
            <div class="w-full">
                <form @submit.prevent="createLocation" v-if="locationStore.isLoading == false">
                    <label for="name" class="text-lg mx-2">Tên vị trí:</label>
                    <input id="name" minlength="1" maxlength="50" required type="text" placeholder="Nhập tên vị trí"
                        class="rounded-md w-full mb-2" v-model="data.name">
                    <label for="symbol" class="text-lg mx-2">Ký hiệu:</label>
                    <input id="symbol" minlength="1" maxlength="50" required type="text" placeholder="Nhập tên ký hiệu"
                        class="rounded-md w-full" v-model="data.symbol">
                    <button type="submit" hidden id="btn-submit"></button>
                </form>
                <div v-else>
                    <Loading />
                </div>
            </div>
        </template>
        <template #footer>
            <div class="flex justify-end gap-2">
                <fwb-button @click="manageStore.closeAddLocationModal" color="alternative">
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