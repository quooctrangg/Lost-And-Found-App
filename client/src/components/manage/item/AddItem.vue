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
    <Form v-if="manageStore.isShow.addItem" @submit="createItem" :validation-schema="formSchemaItem">
        <fwb-modal @close="manageStore.closeAddItemModal" :size="'xs'" :persistent="true">
            <template #header>
                <div class="flex items-center text-xl gap-2">
                    <i class="fa-solid fa-plus"></i>
                    Thêm danh mục
                </div>
            </template>
            <template #body>
                <div v-if="!itemStore.isLoading" class="w-full">
                    <label for="name" class="text-lg mx-2">Tên danh mục:</label>
                    <Field type="text" name="name" id="name" class="rounded-md w-full" v-model="name"
                        placeholder="Nhập tên danh mục" />
                    <ErrorMessage name="name" class="error" />
                </div>
                <div v-else>
                    <Loading />
                </div>
            </template>
            <template #footer>
                <div class="flex justify-end gap-2">
                    <fwb-button color="blue">
                        Thêm
                    </fwb-button>
                    <fwb-button @click="manageStore.closeAddItemModal" color="red">
                        Hủy
                    </fwb-button>
                </div>
            </template>
        </fwb-modal>
    </Form>
</template>