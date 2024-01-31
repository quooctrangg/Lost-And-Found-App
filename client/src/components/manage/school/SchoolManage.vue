<script setup>
import { onMounted, ref } from 'vue'
import { FwbPagination } from 'flowbite-vue'
import { useManageStore } from '../../../stores/manage.store'
import Seach from '../../common/Seach.vue';
import AddSchool from './AddSchool.vue';
import EditSchool from './EditSchool.vue';

const manageStore = useManageStore()

const emit = defineEmits(['currentPage'])

const totalPages = ref(1)
const currentPage = ref(2)

const deleteSchool = () => {
    confirm('Bạn có chắc chắn muốn xóa?')
}

onMounted(() => {
    emit('currentPage', 'school')
})
</script>

<template>
    <div class="flex flex-col gap-5">
        <div class="w-full">
            <div class="flex items-center justify-between w-full">
                <div class="flex gap-5">
                    <div class="border border-black rounded-xl">
                        <Seach :title="'Tìm kiếm trường'" />
                    </div>
                    <div class="flex gap-1 items-center">

                    </div>
                </div>
                <button class="p-2 text-blue-500 rounded font-medium hover:text-blue-400 text-2xl"
                    @click="manageStore.showAddSchoolModal">
                    <i class="fa-solid fa-plus"></i>
                </button>
            </div>
            <table class="table-auto w-full mt-5">
                <thead class="font-medium">
                    <tr class="text-left border-b border-black">
                        <th class="text-center pb-2">
                            STT
                        </th>
                        <th class="pb-2 w-full">
                            Tên trường / khoa
                        </th>
                        <th class="text-center pb-2">
                            Tùy chọn
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="border-b transition duration-300 ease-in-out hover:bg-gray-300">
                        <td class="  font-medium text-center w-[10%]">
                            1
                        </td>
                        <td class="">
                            Công nghệ thông tin và truyền thông
                        </td>
                        <td class="">
                            <div class="flex gap-2 items-center justify-center">
                                <button class="p-2 text-yellow-300 hover:text-yellow-200 text-2xl"
                                    @click="manageStore.showEditSchoolModal">
                                    <i class="fa-solid fa-pen"></i>
                                </button>
                                <button class="p-2 text-red-500 hover:text-red-400 text-2xl" @click="deleteSchool">
                                    <i class="fa-solid fa-trash-can"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                    <tr class="border-b transition duration-300 ease-in-out hover:bg-gray-300">
                        <td class="  font-medium text-center w-[10%]">
                            2
                        </td>
                        <td class="">
                            Nông nghiệp
                        </td>
                        <td class="">
                            <div class="flex gap-2 items-center justify-center">
                                <button class="p-2 text-yellow-300 hover:text-yellow-200 text-2xl">
                                    <i class="fa-solid fa-pen"></i>
                                </button>
                                <button class="p-2 text-red-500 hover:text-red-400 text-2xl">
                                    <i class="fa-solid fa-trash-can"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                    <tr class="border-b transition duration-300 ease-in-out hover:bg-gray-300">
                        <td class="  font-medium text-center w-[10%]">
                            3
                        </td>
                        <td class="">
                            Thủy sản
                        </td>
                        <td class="">
                            <div class="flex gap-2 items-center justify-center">
                                <button class="p-2 text-yellow-300 hover:text-yellow-200 text-2xl">
                                    <i class="fa-solid fa-pen"></i>
                                </button>
                                <button class="p-2 text-red-500 hover:text-red-400 text-2xl">
                                    <i class="fa-solid fa-trash-can"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                    <tr class="border-b transition duration-300 ease-in-out hover:bg-gray-300">
                        <td class="  font-medium text-center w-[10%]">
                            4
                        </td>
                        <td class="">
                            Kinh tế
                        </td>
                        <td class="">
                            <div class="flex gap-2 items-center justify-center">
                                <button class="p-2 text-yellow-300 hover:text-yellow-200 text-2xl">
                                    <i class="fa-solid fa-pen"></i>
                                </button>
                                <button class="p-2 text-red-500 hover:text-red-400 text-2xl">
                                    <i class="fa-solid fa-trash-can"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="w-full text-center" v-if="totalPages >= 2">
            <FwbPagination v-model="currentPage" :total-pages="totalPages" :show-icons="true" :show-labels="false" />
        </div>
        <AddSchool />
        <EditSchool />
    </div>
</template>