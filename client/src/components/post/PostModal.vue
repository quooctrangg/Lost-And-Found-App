<script setup>
import { FwbModal, FwbButton } from 'flowbite-vue'
import { usePostStore } from '../../stores/post.store'
import { useItemStore } from '../../stores/item.store'
import { useLocationStore } from '../../stores/location.store'
import { onMounted, reactive, ref, watch, watchEffect } from 'vue';
import { Form, Field, ErrorMessage } from "vee-validate";
import { useToast } from 'vue-toast-notification'
import * as yup from "yup";
import Loading from '../common/Loading.vue';
// import Editor from 'primevue/editor';

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
    description: yup.string().required("Miêu tả phải có giá trị."),
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
    if (data.done != 0 && Number(data.type) == 1) {
        dataForm.append('done', data.done)
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

const getSuggest = async () => {
    await postStore.suggestPost({ key: data.description, type: data.type, itemId: data.itemId, locations: data.locations })
    if (postStore.err) {
        return
    }
}

const reset = () => {
    data.description = ''
    data.type = ''
    data.itemId = ''
    data.locations = []
    data.done = 0
    selectedFile.value = []
    urls.value = []
}

const unCheckRadio = (e) => {
    if (data.done != 0 && e == data.done) {
        data.done = 0
    }
}

watchEffect(async () => {
    if (data.type !== '' && data.itemId !== '' && data.locations.length > 0) {
        await getSuggest()
    }
})

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
                            <!-- <Editor v-model="data.description" editorStyle="height: 200px" name="description"
                                id="description">
                                <template v-slot:toolbar>
                                    <span class="ql-formats">
                                        <button v-tooltip.bottom="'Bold'" class="ql-bold"></button>
                                        <button v-tooltip.bottom="'Italic'" class="ql-italic"></button>
                                        <button v-tooltip.bottom="'Underline'" class="ql-underline"></button>
                                        <select v-tooltip.bottom="'Color'" class="ql-color"></select>
                                    </span>
                                </template>
</Editor> -->
                            <ErrorMessage name="description" class="error" />
                            <label class="mt-2 mb-1" for="type">Loại bài viết</label>
                            <Field as="select" name="type" id="type" class="input-custom" v-model="data.type">
                                <option value="">Chọn loại bài viết</option>
                                <option :value="1">Tìm thấy</option>
                                <option :value="0">Thất lạc</option>
                            </Field>
                            <ErrorMessage name="type" class="error" />
                            <div v-if="data.type && data.type == 1"
                                class="flex flex-col gap-2 mt-5 text-lg text-red-600 font-medium">
                                <div class="flex gap-2 items-center">
                                    <input type="radio" name="send" id="sendProtection" :value="-1"
                                        @click="unCheckRadio(-1)"
                                        class="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 cursor-pointer"
                                        v-model="data.done">
                                    <label for="sendProtection" class="cursor-pointer">
                                        Đã gửi tại Ban quản lý tòa nhà
                                    </label>
                                </div>
                                <div class="flex gap-2 items-center">
                                    <input type="radio" name="send" id="sendYouthGroup" :value="-2"
                                        @click="unCheckRadio(-2)"
                                        class="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 cursor-pointer"
                                        v-model="data.done">
                                    <label for="sendYouthGroup" class="cursor-pointer">
                                        Đã gửi tại Đoàn thanh niên
                                    </label>
                                </div>
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
                            <div class="text-sm grid grid-cols-3 md:grid-cols-4 gap-2">
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
                        <div class="grid grid-cols-5 gap-2 md:h-[100px]">
                            <label for="images" v-if="urls.length < 5"
                                class="mt-2 mb-1 border-dashed border-black border-2 rounded-lg p-5 flex items-center flex-col gap-1 cursor-pointer text-xs md:text-base">
                                <i class="fa-solid fa-cloud-arrow-up md:text-2xl"></i>
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
                    <div v-if="postStore.suggest" class="w-full flex flex-col justify-center items-center mt-3">
                        <div class="w-[70%] text-sm italic text-blue-500">
                            Gợi ý:
                        </div>
                        <router-link :to="{ name: 'post-detail', params: { id: postStore.suggest?.id } }"
                            class="w-[70%] border-2 bg-white mt-2 rounded-md flex gap-2 cursor-pointer items-center overflow-hidden p-2 shadow">
                            <div v-if="postStore.suggest?.Image.length"
                                class="w-[20%] max-h-20 rounded-sm overflow-hidden flex items-center justify-center">
                                <img :src="postStore.suggest?.Image[0]?.url" alt="">
                            </div>
                            <div class="w-[50%] overflow-hidden flex-1">
                                <h2 class="line-clamp-2 text-black text-justify"
                                    v-html="postStore.suggest?.description"></h2>
                            </div>
                        </router-link>
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