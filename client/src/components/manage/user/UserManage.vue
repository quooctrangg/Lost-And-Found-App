<script setup>
import { onMounted, ref } from 'vue'
import { FwbPagination } from 'flowbite-vue'
import { useManageStore } from '../../../stores/manage.store'
import Seach from '../../common/Seach.vue';
import AddUserModal from './AddUserModal.vue';
import EditUserModal from './EditUserModal.vue';
import FeedbackModal from './FeedbackModal.vue';

const manageStore = useManageStore()

const emit = defineEmits(['currentPage'])

const totalPages = ref(1)
const currentPage = ref(2)

const unBanUser = () => {
    confirm('Bạn có chắc chắn mở khóa?')
}

onMounted(() => {
    emit('currentPage', 'user')
})
</script>

<template>
    <div class="flex flex-col gap-5">
        <div class="w-full">
            <div class="flex items-center justify-between w-full">
                <div class="flex gap-5">
                    <div class="border border-black rounded-xl">
                        <Seach :title="'Tìm kiếm người dùng'" />
                    </div>
                    <div class="flex gap-1 items-center">
                        <h1>Trạng thái: </h1>
                        <select name="" id="" class="rounded-xl p-1">
                            <option value="">Tất cả</option>
                            <option value="">Hoạt động</option>
                            <option value="">Khóa</option>
                        </select>
                    </div>
                </div>
                <button class="p-2 text-blue-500 rounded font-medium hover:text-blue-400 text-xl"
                    @click="manageStore.showAddUserModal">
                    <i class="fa-solid fa-user-plus"></i>
                </button>
            </div>
            <table class="table-auto w-full">
                <thead class="border-b border-black font-medium">
                    <tr class="text-left">
                        <th class="px-6 py-4 text-center">
                            ID
                        </th>
                        <th class="px-6 py-4">
                            Tên
                        </th>
                        <th class="px-6 py-4">
                            Email
                        </th>
                        <th class="px-6 py-4 text-center">
                            Trạng thái
                        </th>
                        <th class="px-6 py-4 text-center">
                            Ngày tham gia
                        </th>
                        <th class="px-6 py-4 text-center">
                            Tùy chọn
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="border-b transition duration-300 ease-in-out hover:bg-gray-300">
                        <td class="whitespace-nowrap px-6 py-4 font-medium text-center">
                            1
                        </td>
                        <td class="whitespace-nowrap px-6 py-4">
                            Vo Van Kiet
                        </td>
                        <td class="whitespace-nowrap px-6 py-4">
                            kietb2000000
                        </td>
                        <td v-if="true" class="whitespace-nowrap px-6 py-4 text-green-500 text-center">
                            Hoạt động
                        </td>
                        <td v-else class="whitespace-nowrap px-6 py-4 text-red-500 text-center">
                            Khóa
                        </td>
                        <td class="whitespace-nowrap px-6 py-4 text-center">
                            01/01/2024
                        </td>
                        <td class="whitespace-nowrap px-6 py-4 flex gap-2 items-center justify-center">
                            <button v-if="true" class="p-2 text-red-600 hover:text-red-400 text-2xl"
                                @click="manageStore.showFeedbackModal">
                                <i class="fa-solid fa-lock"></i>
                            </button>
                            <button v-else class="p-2 text-orange-400 hover:text-orange-300 text-2xl" @click="unBanUser">
                                <i class="fa-solid fa-unlock"></i>
                            </button>
                            <button class="p-2 text-yellow-300 hover:text-yellow-200 text-2xl"
                                @click="manageStore.showEditUserModal">
                                <i class="fa-solid fa-pen"></i>
                            </button>
                        </td>
                    </tr>
                    <tr class="border-b transition duration-300 ease-in-out hover:bg-gray-300">
                        <td class="whitespace-nowrap px-6 py-4 font-medium text-center">
                            2
                        </td>
                        <td class="whitespace-nowrap px-6 py-4">
                            Nguyen Quoc Trang
                        </td>
                        <td class="whitespace-nowrap px-6 py-4">
                            trangb2000011
                        </td>
                        <td v-if="false" class="whitespace-nowrap px-6 py-4 text-green-500 text-center">
                            Hoạt động
                        </td>
                        <td v-else class="whitespace-nowrap px-6 py-4 text-red-500 text-center">
                            Khóa
                        </td>
                        <td class="whitespace-nowrap px-6 py-4 text-center">
                            03/01/2024
                        </td>
                        <td class="whitespace-nowrap px-6 py-4 flex gap-2 items-center justify-center">
                            <button v-if="false" class="p-2 text-red-600 hover:text-red-400 text-2xl">
                                <i class="fa-solid fa-lock"></i>
                            </button>
                            <button v-else class="p-2 text-orange-400 hover:text-orange-300 text-2xl">
                                <i class="fa-solid fa-unlock"></i>
                            </button>
                            <button class="p-2 text-yellow-300 hover:text-yellow-200 text-2xl">
                                <i class="fa-solid fa-pen"></i>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="w-full text-center" v-if="totalPages >= 2">
            <FwbPagination v-model="currentPage" :total-pages="totalPages" :show-icons="true" :show-labels="false" />
        </div>
        <AddUserModal />
        <EditUserModal />
        <FeedbackModal />
    </div>
</template>