<script setup>
import { FwbModal } from 'flowbite-vue'
import { usePostStore } from '../../stores/post.store'
import { useRequestStore } from '../../stores/request.store'
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import { useToast } from 'vue-toast-notification'
import { ref } from 'vue';

const postStore = usePostStore()
const requestStore = useRequestStore()
const $toast = useToast()

const props = defineProps(['request', 'postId'])

const description = ref('')
const formDataSchema = yup.object().shape({
    description: yup.string().required("Miêu tả phải có giá trị.").min(1, 'Miêu tả phải ít nhất 1 ký tự.').max(250, "Miêu tả có nhiều nhất 250 ký tự."),
})


const btnSubmit = async () => {
    const conFirm = confirm('Bạn chắc chắn muốn gửi?')
    if (conFirm) {
        await requestStore.createRequest({ postId: props.postId, description: description.value })
        if (requestStore.err) {
            $toast.error(requestStore.err, { position: 'top-right' })
            return
        }
        $toast.success(requestStore.result.message, { position: 'top-right' })
        postStore.closeRequestModal()
        description.value = ''
    }
}
</script>

<template>
    <fwb-modal v-if="postStore.isShow.request" @close="postStore.closeRequestModal" :persistent="true">
        <template #header>
            <div class="flex items-center gap-2 font-semibold text-2xl">
                <i class="fa-regular fa-paper-plane"></i>
                Gửi yêu cầu
            </div>
        </template>
        <template #body>
            <h1 v-if="props.request" class="text-lg font-medium mb-2">Tôi muốn nhận đồ vật này</h1>
            <h1 v-else class="text-lg font-medium mb-2">Tôi muốn gửi trả đồ vật này</h1>
            <p v-if="props.request" class="text-sm">
                Vui lòng mô tả càng nhiều chi tiết về mặt hàng không hiển thị hoặc không được mô tả để công cụ tìm có thể
                nhận ra bạn là chủ sở hữu. Và nếu có thể, hãy cung cấp càng nhiều thông tin càng tốt về nơi bạn làm mất đồ
                (ví dụ: thời gian và địa điểm). Hãy cẩn thận khi chia sẻ thông tin cá nhân.
            </p>
            <Form @submit="btnSubmit" :validation-schema="formDataSchema">
                <Field type="text" name="description" id="description" as="textarea" class="w-full rounded-md"
                    placeholder="Nhập mô tả ..." v-model="description" rows="4" />
                <ErrorMessage name="description" class="error" />
                <button type="submit" hidden id="btn-submit"></button>
            </Form>
        </template>
        <template #footer>
            <div class="flex justify-end gap-2">
                <button @click="postStore.closeRequestModal" class="px-2 py-1 bg-red-500 rounded-lg text-white">
                    <i class="fa-solid fa-xmark"></i>
                    Hủy
                </button>
                <label for="btn-submit"
                    class="bg-green-500 rounded-lg text-sm px-5 py-3 text-center text-white font-semibold cursor-pointer hover:bg-green-600">
                    Gửi
                </label>
            </div>
        </template>
    </fwb-modal>
</template>