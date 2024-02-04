<script setup>
import { FwbButton, FwbModal } from 'flowbite-vue'
import { useManageStore } from '../../../stores/manage.store'
import { useItemStore } from '../../../stores/item.store'
import { ref } from 'vue';
import { useToast } from 'vue-toast-notification'
import Loading from '../../common/Loading.vue';
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";

const manageStore = useManageStore()
const itemStore = useItemStore()
const $toast = useToast()

const name = ref('')
const formSchemaItem = yup.object().shape({
    name: yup.string().required('Tên phải có giá trị.').min(1, 'Tên phải ít nhất 1 ký tự.').max(50, "Tên có nhiều nhất 50 ký tự.")
})

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
    <fwb-modal v-if="manageStore.isShow.addItem" @close="manageStore.closeAddItemModal" :size="'xs'" :persistent="true">
        <template #header>
            <div class="flex items-center text-xl gap-2">
                <i class="fa-solid fa-plus"></i>
                Thêm danh mục
            </div>
        </template>
        <template #body>
            <div class="w-full">
                <Form @submit="createItem" v-if="itemStore.isLoading == false" :validation-schema="formSchemaItem">
                    <label for="name" class="text-lg mx-2">Tên danh mục:</label>
                    <Field type="text" name="name" id="name" class="rounded-md w-full" v-model="name"
                        placeholder="Nhập tên danh mục" />
                    <ErrorMessage name="name" class="error" />
                    <button type="submit" hidden id="btn-submit"></button>
                </Form>
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