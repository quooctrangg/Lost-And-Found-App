<script setup>
import { FwbButton, FwbModal } from 'flowbite-vue'
import { useManageStore } from '../../../stores/manage.store'
import { useItemStore } from '../../../stores/item.store'
import { ref, watchEffect } from 'vue';
import { useToast } from 'vue-toast-notification'
import Loading from '../../common/Loading.vue';
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";

const props = defineProps(['item'])

const manageStore = useManageStore()
const itemStore = useItemStore()
const $toast = useToast()

const name = ref('')
const formSchemaItem = yup.object().shape({
    name: yup.string().required('Tên phải có giá trị.').min(1, 'Tên phải ít nhất 1 ký tự.').max(50, "Tên có nhiều nhất 50 ký tự.")
})

const updateItem = async () => {
    if (name.value == props.item?.name) return
    await itemStore.updateItem(props.item?.id, { name: name.value })
    if (itemStore.err) {
        $toast.error(itemStore.err, { position: 'top-right' })
        return
    }
    $toast.success(itemStore.result.message, { position: 'top-right' })
    await itemStore.getItem({ key: itemStore.key, page: itemStore.currentPage })
    manageStore.closeEditItemModal()
}

watchEffect(async () => {
    if (props.item) {
        name.value = props.item.name
    }
})
</script>

<template>
    <Form v-if="manageStore.isShow.editItem" @submit="updateItem" :validation-schema="formSchemaItem">
        <fwb-modal @close="manageStore.closeEditItemModal" :size="'xs'" :persistent="true">
            <template #header>
                <div class="flex items-center text-xl gap-2">
                    <i class="fa-solid fa-plus"></i>
                    Chỉnh sửa danh mục
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
                    <fwb-button v-if="!itemStore.isLoading" color="blue">
                        Sửa
                    </fwb-button>
                    <fwb-button v-else color="blue" disabled>
                        Sửa
                    </fwb-button>
                    <fwb-button v-if="!itemStore.isLoading" @click="manageStore.closeEditItemModal" color="red">
                        Hủy
                    </fwb-button>
                    <fwb-button v-else color="red" disabled>
                        Hủy
                    </fwb-button>
                </div>
            </template>
        </fwb-modal>
    </Form>
</template>