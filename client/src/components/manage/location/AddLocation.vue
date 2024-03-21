<script setup>
import { FwbButton, FwbModal } from 'flowbite-vue'
import { useManageStore } from '../../../stores/manage.store'
import { useLocationStore } from '../../../stores/location.store'
import { useToast } from 'vue-toast-notification'
import { reactive } from 'vue'
import Loading from '../../common/Loading.vue'
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";

const manageStore = useManageStore()
const locationStore = useLocationStore()
const $toast = useToast()

const data = reactive({
    name: '',
    symbol: ''
})
const formSchemaLocation = yup.object().shape({
    name: yup.string().required('Tên phải có giá trị.').min(1, 'Tên phải ít nhất 1 ký tự.').max(50, "Tên có nhiều nhất 50 ký tự."),
    symbol: yup.string().required('Ký hiệu phải có giá trị.').min(1, 'Tên phải ít nhất 1 ký tự.').max(10, "Tên có nhiều nhất 10 ký tự.")
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
    <fwb-modal v-if="manageStore.isShow.addLocation" @close="manageStore.closeAddLocationModal" :size="'xs'"
        :persistent="true">
        <template #header>
            <div class="flex items-center text-xl gap-2">
                <i class="fa-solid fa-plus"></i>
                Thêm vị trí
            </div>
        </template>
        <template #body>
            <div class="w-full">
                <Form @submit="createLocation" v-if="locationStore.isLoading == false"
                    :validation-schema="formSchemaLocation">
                    <label for="name" class="text-lg">Tên vị trí:</label>
                    <div class="mb-3">
                        <Field type="text" name="name" id="name" class="rounded-md w-full" v-model="data.name"
                            placeholder="Nhập tên vị trí" />
                        <ErrorMessage name="name" class="error" />
                    </div>
                    <label for="symbol" class="text-lg">Ký hiệu:</label>
                    <div class="mb-3">
                        <Field type="text" name="symbol" id="symbol" class="rounded-md w-full" v-model="data.symbol"
                            placeholder="Nhập tên ký hiệu" />
                        <ErrorMessage name="symbol" class="error" />
                    </div>
                    <button type="submit" hidden id="btn-submit"></button>
                </Form>
                <div v-else>
                    <Loading />
                </div>
            </div>
        </template>
        <template #footer>
            <div class="flex justify-end gap-2">
                <fwb-button @click="manageStore.closeAddLocationModal" color="red">
                    Hủy
                </fwb-button>
                <label for="btn-submit" class="btn-submit">
                    Thêm
                </label>
            </div>
        </template>
    </fwb-modal>
</template>