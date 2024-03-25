<script setup>
import { FwbModal, FwbButton } from 'flowbite-vue'
import { usePostStore } from '../../stores/post.store'
import { useItemStore } from '../../stores/item.store'
import { useLocationStore } from '../../stores/location.store'
import { onMounted, reactive, ref, watch } from 'vue';
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";
import { useToast } from 'vue-toast-notification'
import Loading from '../common/Loading.vue';

const postStore = usePostStore()
const itemStore = useItemStore()
const locationStore = useLocationStore()
const $toast = useToast()

const maxAllowedFiles = 5
const selectedFile = ref([])
const urls = ref([])
const data = reactive({
    description: '',
    type: '',
    itemId: '',
    locations: [],
    done: false
})

const formDataSchema = yup.object().shape({
    type: yup.string().required('Yêu cầu chọn loại bài viết.'),
    itemId: yup.string().required('Yêu cầu chọn loại đồ vật.'),
    description: yup.string().required("Miêu tả phải có giá trị.").min(10, 'Miêu tả phải ít nhất 10 ký tự.').max(1000, "Miêu tả có nhiều nhất 250 ký tự."),
    locations: yup.array().min(1, 'Chọn ít nhất 1 địa điểm')
})

const onFileSelected = (e) => {
    const currentQuantity = selectedFile.value.length | 0
    if (e.target.files.length <= maxAllowedFiles - currentQuantity) {
        selectedFile.value.push(...e.target.files)
        previewImage()
    } else {
        confirm('Tối đa 5 ảnh')
    }
}

const previewImage = () => {
    urls.value = []
    for (let i = 0; i < selectedFile.value.length; i++) {
        urls.value.push(URL.createObjectURL(selectedFile.value[i]))
    }
}

const deleteImage = (i) => {
    selectedFile.value.splice(i, 1)
    previewImage()
}

const submitPost = async () => {
    const dataForm = new FormData()
    dataForm.append('description', data.description)
    dataForm.append('itemId', data.itemId)
    dataForm.append('type', Number(data.type))
    if (data.done) {
        dataForm.append('done', -1)
    }
    if (data.locations.length > 1) {
        data.locations.forEach(e => {
            dataForm.append('locations', e)
        });
    } else {
        dataForm.append('locations', data.locations[0])
        dataForm.append('locations', data.locations[0])
    }
    if (selectedFile.value.length) {
        selectedFile.value.forEach(e => {
            dataForm.append('images', e)
        })
    }
    await postStore.createPost(dataForm)
    if (postStore.err) {
        $toast.error(postStore.err, { position: 'top-right' })
        return
    }
    $toast.success(postStore.result.message, { position: 'top-right' })
    reset()
    postStore.closePostModal()
}

const reset = () => {
    data.description = ''
    data.type = ''
    data.itemId = ''
    data.locations = []
    data.done = false
    selectedFile.value = []
    urls.value = []
}

onMounted(async () => {
    await itemStore.getItem({})
    await locationStore.getLocation({})
})
</script>

<template>
    <Form v-if="postStore.isShow.post" @submit="submitPost" :validation-schema="formDataSchema">
        <fwb-modal @close="postStore.closePostModal" size="5xl" :not-escapable="true">
            <template #header>
                <div class="flex items-center gap-2 font-semibold text-2xl">
                    <i class="fa-regular fa-clipboard"></i>
                    Đăng bài
                </div>
            </template>
            <template #body>
                <div class="flex flex-col gap-3" v-if="!postStore.isLoading">
                    <div class="grid grid-cols-2 gap-5">
                        <div class=" flex flex-col">
                            <label class="mt-2 mb-1" for="description">Mô tả</label>
                            <Field type="text" name="description" id="description" as="textarea"
                                class="w-full rounded-md" placeholder="Nhập mô tả ..." v-model="data.description"
                                rows="4" />
                            <ErrorMessage name="description" class="error" />
                            <label class="mt-2 mb-1" for="type">Loại bài viết</label>
                            <Field as="select" name="type" id="type" class="input-custom" v-model="data.type">
                                <option value="">Chọn loại bài viết</option>
                                <option :value="1">Tìm thấy</option>
                                <option :value="0">Thất lạc</option>
                            </Field>
                            <ErrorMessage name="type" class="error" />
                            <div v-if="data.type && data.type == 1"
                                class="flex gap-2 items-center mt-5 text-lg text-red-600 font-medium">
                                <input type="checkbox" name="sendProtection" id="sendProtection"
                                    class="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded cursor-pointer "
                                    v-model="data.done">
                                <label for="sendProtection">Đã gửi lại ban quản lý tòa nhà</label>
                            </div>
                        </div>
                        <div class="flex flex-col">
                            <label class="mt-2 mb-1" for="itemId">Loại đồ vật</label>
                            <Field as="select" name="itemId" id="itemId" class="input-custom" v-model="data.itemId">
                                <option value="">Chọn loại đồ vật</option>
                                <option v-if="itemStore.items?.length" v-for="item in itemStore.items" :key="item.id"
                                    :value="item.id">
                                    {{ item.name }}
                                </option>
                            </Field>
                            <ErrorMessage name="itemId" class="error" />
                            <label class="mt-2 mb-1">Vị trí</label>
                            <div class="text-sm flex flex-wrap-reverse gap-4 mb-2">
                                <label v-for="location in locationStore.locations" :key="location.id" :for="location.id"
                                    class="flex items-center gap-1">
                                    <Field name="locations" :id="location.id" type="checkbox" :value="location.id"
                                        v-model="data.locations"
                                        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded cursor-pointer" />
                                    {{ location.symbol }}
                                </label>
                            </div>
                            <ErrorMessage name="locations" class="error" />
                        </div>
                    </div>
                    <div class="flex flex-col gap-2">
                        <label>Hình ảnh</label>
                        <div class="grid grid-cols-5 gap-2 h-[100px]">
                            <label for="images" v-if="urls.length < 5"
                                class="mt-2 mb-1 border-dashed border-black border-2 rounded-lg p-5 flex items-center flex-col gap-1 cursor-pointer">
                                <i class="fa-solid fa-cloud-arrow-up text-2xl"></i>
                                Chọn hình ảnh
                            </label>
                            <div v-if="urls.length" v-for="(url, i) of urls"
                                class="border-2 border-black  rounded-lg overflow-hidden relative flex items-center justify-center">
                                <i class="fa-solid fa-xmark absolute top-0 text-lg right-2 cursor-pointer text-red-600 hover:text-red-700"
                                    @click="deleteImage(i)"></i>
                                <img :src="url" alt="" :key="i" class="object-cover">
                            </div>
                        </div>
                        <input type="file" multiple hidden id="images" accept="image/png, image/jpeg"
                            @change="onFileSelected">
                    </div>
                </div>
                <Loading v-else />
            </template>
            <template #footer>
                <div class="flex justify-end gap-2">
                    <fwb-button v-if="!postStore.isLoading" color="blue">
                        Đăng
                    </fwb-button>
                    <fwb-button v-else color="blue" disabled>
                        Đăng
                    </fwb-button>
                    <fwb-button v-if="!postStore.isLoading" @click="reset" color="alternative">
                        Đặt lại
                    </fwb-button>
                    <fwb-button v-else color="alternative" disabled>
                        Đặt lại
                    </fwb-button>
                </div>
            </template>
        </fwb-modal>
    </Form>
</template>