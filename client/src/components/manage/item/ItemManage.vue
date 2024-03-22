<script setup>
import { onMounted, ref, watchEffect } from 'vue'
import { FwbPagination } from 'flowbite-vue'
import { useManageStore } from '../../../stores/manage.store'
import { useItemStore } from '../../../stores/item.store'
import { useToast } from 'vue-toast-notification'
import Seach from '../../common/Seach.vue';
import AddItem from './AddItem.vue';
import EditItem from './EditItem.vue';
import Loading from '@/components/common/Loading.vue'

const manageStore = useManageStore()
const itemStore = useItemStore()
const $toast = useToast()

const emit = defineEmits(['currentPage'])

const currentItem = ref(null)

const deleteItem = async (id) => {
    const conFirm = confirm('Bạn có chắc chắn muốn xóa?')
    if (conFirm) {
        await itemStore.deleteItem(id)
        if (itemStore.err) {
            $toast.error(itemStore.err, { position: 'top-right' })
            return
        }
        $toast.success(itemStore.result.message, { position: 'top-right' })
        await itemStore.getItem({ key: itemStore.key, page: itemStore.currentPage })
    }
}

watchEffect(async () => {
    await itemStore.getItem({ key: itemStore.key, page: itemStore.currentPage })
})


onMounted(async () => {
    emit('currentPage', 'item')
    await itemStore.getItem({ key: '', page: 1 })
    itemStore.key = ''
    itemStore.currentPage = 1
})
</script>

<template>
    <div class="flex flex-col gap-5">
        <div class="w-full">
            <div class="flex items-center justify-between w-full">
                <div class="flex gap-5">
                    <div class="border border-black rounded-xl">
                        <Seach :title="'Tìm kiếm danh mục'" @key="(e) => { itemStore.key = e }" />
                    </div>
                    <div class="flex gap-1 items-center">

                    </div>
                </div>
                <button class="p-2 text-blue-500 rounded font-medium hover:text-blue-400 text-2xl"
                    @click="manageStore.showAddItemModal">
                    <i class="fa-solid fa-plus"></i>
                </button>
            </div>
            <table class="table-auto w-full mt-5">
                <thead class="font-medium">
                    <tr class="text-left border-b border-black">
                        <th class="text-center pb-2 w-[10%]">
                            STT
                        </th>
                        <th class="pb-2 w-[70%]">
                            Tên danh mục
                        </th>
                        <th class="text-center pb-2 w-[20%]">
                            Tùy chọn
                        </th>
                    </tr>
                </thead>
                <tbody v-if="!itemStore.isLoading">
                    <tr v-if="itemStore.items?.length" v-for="(item, i) in itemStore.items" :key="item.id"
                        class="border-b transition duration-300 ease-in-out hover:bg-gray-300">
                        <td class="  font-medium text-center w-[10%]">
                            {{ (itemStore.currentPage - 1) * 10 + i + 1 }}
                        </td>
                        <td class="">
                            {{ item.name }}
                        </td>
                        <td class="w-[20%]">
                            <div class="flex gap-2 items-center justify-center">
                                <button class="p-2 text-yellow-300 hover:text-yellow-200 text-2xl" @click="() => {
                            manageStore.showEditItemModal()
                            currentItem = item
                        }">
                                    <i class="fa-solid fa-pen"></i>
                                </button>
                                <button class="p-2 text-red-500 hover:text-red-400 text-2xl"
                                    @click="async () => { await deleteItem(item.id) }">
                                    <i class="fa-solid fa-trash-can"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                    <tr v-else class="text-center text-red-500 text-xl">
                        <td colspan="3">
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
        <div class="w-full text-center" v-if="itemStore.totalPages >= 2">
            <FwbPagination v-model="itemStore.currentPage" :total-pages="itemStore.totalPages" :show-icons="true"
                :show-labels="false" />
        </div>
        <AddItem />
        <EditItem :item="currentItem" />
    </div>
</template>