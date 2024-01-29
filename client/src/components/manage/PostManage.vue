<script setup>
import { onMounted, ref } from 'vue'
import { FwbPagination } from 'flowbite-vue'
import Seach from '../common/Seach.vue';

const emit = defineEmits(['currentPage'])

const totalPages = ref(1)
const currentPage = ref(2)

onMounted(() => {
    emit('currentPage', 'post')
})
</script>

<template>
    <div class="flex flex-col gap-5">
        <div class="w-full">
            <div class="flex items-center justify-between w-full">
                <div class="flex gap-5">
                    <div class="border border-black rounded-xl">
                        <Seach :title="'Tìm kiếm bài viết'" />
                    </div>
                    <div class="flex gap-1 items-center">
                        <h1>Trạng thái: </h1>
                        <select name="" id="" class="p-1 rounded-xl">
                            <option value="">Tất cả</option>
                            <option value="">Đã duyệt</option>
                            <option value="">Từ chối</option>
                            <option value="">Chờ duyệt</option>
                        </select>
                    </div>
                </div>
                <!-- <button class="p-2 text-blue-500 rounded font-medium hover:text-blue-400 text-2xl">
                    <i class="fa-solid fa-plus"></i>
                </button> -->
            </div>
            <table class="table-fixed w-full mt-5">
                <thead class="font-medium">
                    <tr class="text-left border-b border-black">
                        <th class="text-center w-[5%] pb-2">
                            ID
                        </th>
                        <th class="w-[10%] text-center pb-2">
                            Hình
                        </th>
                        <th class="w-[15%] text-center pb-2">
                            Tiêu đề
                        </th>
                        <th class="w-[30%] text-center pb-2">
                            Nội dung
                        </th>
                        <th class="text-center pb-2">
                            Trạng thái
                        </th>
                        <th class="text-center pb-2">
                            Ngày đăng
                        </th>
                        <th class=" text-center pb-2">
                            Tùy chọn
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="border-b transition duration-300 ease-in-out hover:bg-gray-300">
                        <td class="  font-medium text-center w-[10%]">
                            <router-link :to="{ name: 'post-detail', params: { id: 1 } }"
                                class="hover:text-blue-500 hover:underline p-2">
                                1
                            </router-link>
                        </td>
                        <td class=" overflow-hidden p-1">
                            <img class="w-[100px]" src="/test.png" alt="">
                        </td>
                        <td class="">
                            <div class="font-medium line-clamp-2 p-2">
                                Toi tim thay 1 cai non
                            </div>
                        </td>
                        <td>
                            <div class="line-clamp-2 text-sm">
                                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum maiores iure voluptas quidem
                                tempore neque, nulla corporis provident? Incidunt quae accusantium quisquam enim corporis
                                expedita blanditiis, perferendis molestias similique illo!
                            </div>
                        </td>
                        <td v-if="0 == 0" class=" text-yellow-300 text-center">
                            Chờ duyệt
                        </td>
                        <td v-else-if="0 == 1" class=" text-blue-500 text-center">
                            Đã duyệt
                        </td>
                        <td v-else class=" text-red-500 text-center">
                            Từ chối
                        </td>
                        <td class="text-center text-sm">
                            01/01/2024
                        </td>
                        <td class="">
                            <div class="flex gap-2 items-center justify-center">
                                <div v-if="true">
                                    <button class="p-2 text-blue-500 hover:text-blue-400 text-2xl">
                                        <i class="fa-solid fa-check"></i>
                                    </button>
                                    <button class="p-2 text-red-500 hover:text-red-300 text-2xl">
                                        <i class="fa-solid fa-ban"></i>
                                    </button>
                                </div>
                                <button class="p-2 text-yellow-300 hover:text-yellow-200 text-2xl">
                                    <i class="fa-solid fa-trash-can"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                    <tr class="border-b transition duration-300 ease-in-out hover:bg-gray-300">
                        <td class="font-medium text-center w-[10%]">
                            <router-link :to="{ name: 'post-detail', params: { id: 2 } }"
                                class="hover:text-blue-500 hover:underline p-2">
                                2
                            </router-link>
                        </td>
                        <td class="overflow-hidden p-1">
                            <img class="w-[100px]" src="/logo.png" alt="">
                        </td>
                        <td class="">
                            <div class="font-medium line-clamp-2 p-2">
                                Toi tim thay 1 cai non
                            </div>
                        </td>
                        <td>
                            <div class="line-clamp-2 text-sm">
                                Toi nhat duoc 1 cai non mau xanh nhu hinh.
                            </div>
                        </td>
                        <td v-if="1 == 0" class=" text-yellow-300 text-center">
                            Chờ duyệt
                        </td>
                        <td v-else-if="1 == 1" class=" text-blue-500 text-center">
                            Đã duyệt
                        </td>
                        <td v-else class=" text-red-500 text-center">
                            Từ chối
                        </td>
                        <td class="text-center text-sm">
                            01/01/2024
                        </td>
                        <td class="">
                            <div class="flex gap-2 items-center justify-center">
                                <div v-if="false">
                                    <button class="p-2 text-blue-500 hover:text-blue-400 text-2xl">
                                        <i class="fa-solid fa-check"></i>
                                    </button>
                                    <button class="p-2 text-red-500 hover:text-red-300 text-2xl">
                                        <i class="fa-solid fa-ban"></i>
                                    </button>
                                </div>
                                <button class="p-2 text-yellow-300 hover:text-yellow-200 text-2xl">
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
    </div>
</template>