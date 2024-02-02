<script setup>
import { FwbButton, FwbModal } from 'flowbite-vue'
import { useManageStore } from '../../../stores/manage.store'
import { useItemStore } from '../../../stores/item.store'
import { ref } from 'vue';
import { useToast } from 'vue-toast-notification'
import Loading from '../../common/Loading.vue';

const manageStore = useManageStore()
const itemStore = useItemStore()
const $toast = useToast()

const name = ref('')

const createItem = async () => {
    await itemStore.createItem({ name: name.value })
    if (itemStore.err) {
        $toast.error(itemStore.err, { position: 'top-right' })
        return
    }
    $toast.success(itemStore.result.message, { position: 'top-right' })
    name.value = ''
    await itemStore.getItem({ key: itemStore.key, page: itemStore.currentPage })
    manageStore.closeAddItemModal()
}
</script>

<template>
    <fwb-modal v-if="manageStore.isShow.addItem" @close="manageStore.closeAddItemModal" :size="'xs'">
        <template #header>
            <div class="flex items-center text-xl gap-2">
                <i class="fa-solid fa-plus"></i>
                Thêm danh mục
            </div>
        </template>
        <template #body>
            <div class="w-full">
                <form @submit.prevent="createItem" v-if="itemStore.isLoading == false">
                    <label for="name" class="text-lg mx-2">Tên danh mục:</label>
                    <input id="name" minlength="1" maxlength="50" required type="text" placeholder="Nhập tên danh mục"
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
                <fwb-button @click="manageStore.closeAddItemModal" color="alternative">
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