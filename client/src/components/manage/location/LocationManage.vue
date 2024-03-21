<script setup>
import { onMounted, ref, watchEffect } from 'vue'
import { FwbPagination } from 'flowbite-vue'
import { useManageStore } from '../../../stores/manage.store'
import { useLocationStore } from '../../../stores/location.store'
import { useToast } from 'vue-toast-notification'
import Seach from '../../common/Seach.vue';
import EditLocation from './EditLocation.vue';
import AddLocation from './AddLocation.vue';
import Loading from '../../common/Loading.vue'

const manageStore = useManageStore()
const locationStore = useLocationStore()
const $toast = useToast()

const emit = defineEmits(['currentPage'])

const currentLocation = ref(null)

const deleteLocation = async (id) => {
    const conFirm = confirm('Bạn có chắc chắn muốn xóa?')
    if (conFirm) {
        await locationStore.deleteLocation(id)
        if (locationStore.err) {
            $toast.error(locationStore.err, { position: 'top-right' })
            return
        }
        $toast.success(locationStore.result.message, { position: 'top-right' })
        await locationStore.getLocation({ key: locationStore.key, page: locationStore.currentPage })
    }
}

watchEffect(async () => {
    await locationStore.getLocation({ key: locationStore.key, page: locationStore.currentPage })
})

onMounted(async () => {
    emit('currentPage', 'location')
    await locationStore.getLocation({ key: '', page: 1 })
    locationStore.key = ''
    locationStore.currentPage = 1
})
</script>

<template>
    <div class="flex flex-col gap-5">
        <div class="w-full">
            <div class="flex items-center justify-between w-full">
                <div class="flex gap-5">
                    <div class="border border-black rounded-xl">
                        <Seach :title="'Tìm kiếm địa điểm'" @key="(e) => { locationStore.key = e }" />
                    </div>
                    <div class="flex gap-1 items-center">

                    </div>
                </div>
                <button class="p-2 text-blue-500 rounded font-medium hover:text-blue-400 text-2xl"
                    @click="manageStore.showAddLocationModal">
                    <i class="fa-solid fa-plus"></i>
                </button>
            </div>
            <table class="table-auto w-full mt-5">
                <thead class="font-medium">
                    <tr class="text-left border-b border-black">
                        <th class="text-center pb-2 w-[10%]">
                            STT
                        </th>
                        <th class="pb-2 w-[50%]">
                            Tên vị trí
                        </th>
                        <th class="pb-2 w-[20%]">
                            Ký hiệu
                        </th>
                        <th class="text-center pb-2 w-[20%]">
                            Tùy chọn
                        </th>
                    </tr>
                </thead>
                <tbody v-if="locationStore.isLoading == false">
                    <tr v-if="locationStore.locations?.length" v-for="(location, i) in locationStore.locations"
                        :key="location.id" class="border-b transition duration-300 ease-in-out hover:bg-gray-300">
                        <td class="  font-medium text-center w-[10%]">
                            {{ (locationStore.currentPage - 1) * 10 + i + 1 }}
                        </td>
                        <td class="w-[50%]">
                            {{ location.name }}
                        </td>
                        <td class="w-[20%]">
                            {{ location.symbol }}
                        </td>
                        <td class="w-[20%]">
                            <div class="flex gap-2 items-center justify-center">
                                <button class="p-2 text-yellow-300 hover:text-yellow-200 text-2xl" @click="() => {
                            manageStore.showEditLocationModal()
                            currentLocation = location
                        }">
                                    <i class="fa-solid fa-pen"></i>
                                </button>
                                <button class="p-2 text-red-500 hover:text-red-400 text-2xl"
                                    @click="async () => { await deleteLocation(location.id) }">
                                    <i class="fa-solid fa-trash-can"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                    <tr v-else class="text-center text-red-500 text-xl">
                        <td colspan="4">
                            Không có.
                        </td>
                    </tr>
                </tbody>
                <tbody v-else>
                    <tr class="text-center text-red-500 text-xl">
                        <td colspan="3" class="h-screen">
                            <Loading />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="w-full text-center" v-if="locationStore.totalPages >= 2">
            <FwbPagination v-model="locationStore.currentPage" :total-pages="locationStore.totalPages"
                :show-icons="true" :show-labels="false" />
        </div>
        <AddLocation />
        <EditLocation :location="currentLocation" />
    </div>
</template>