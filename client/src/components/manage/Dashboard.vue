<script setup>
import { onMounted, reactive, ref } from 'vue'
import ChartBar from '../chart/ChartBar.vue'
import ChartPie from '../chart/ChartPie.vue';
import ChartDoughnut from '../chart/ChartDoughnut.vue';

const emit = defineEmits(['currentPage'])

const titleBar = 'Biểu đồ thống kê số lượng hồ sơ được đăng theo tháng'
const dataBar = reactive({
    labels: ['11', '12', '01'],
    datasets: [
        {
            label: 'Tìm thấy',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            data: [6, 7, 2]
        },
        {
            label: 'Thất lạc',
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
            data: [11, 7, 9]
        }
    ]
})

const titleDoughnut = 'Biểu đồ thống kê các vị trí'
const dataDoughnut = reactive({
    labels: ['B1', 'C1', 'DI', 'NN', 'KT'],
    datasets: [{
        data: [1, 5, 7, 8, 5],
        backgroundColor: ['rgba(0, 102, 204, 0.7)', 'rgba(0, 204, 153, 0.7)', 'rgba(102, 255, 255, 0.7)', 'rgba(51, 102, 255, 0.7)', 'rgba(0, 204, 153, 0.7)', 'rgba(0, 204, 0, 0.7)', 'rgba(102, 255, 255, 0.7)', 'rgba(102, 102, 255, 0.7)', 'rgba(204, 51, 255, 0.7)', 'rgba(51, 204, 51, 0.7)'],
        hoverOffset: 4
    }]
})

const titlePie = 'Biểu đồ thống kê loại đồ'
const dataPie = reactive({
    labels: ['Điện thoại', 'Áo khoát', 'Chìa khóa', 'Cục sạc'],
    datasets: [{
        data: [1, 5, 7, 8],
        backgroundColor: ['rgba(255, 153, 0, 0.7)', 'rgba(255, 51, 0, 0.7)', 'rgba(255, 255, 0, 0.7)', 'rgba(255, 0, 102, 0.7)', 'rgba(255, 51, 204, 0.7)', 'rgba(204, 255, 51, 0.7)', 'rgba(204, 51, 0, 0.7)', 'rgba(204, 0, 0, 0.7)', 'rgba(102, 0, 51, 0.7)', 'rgba(153, 0, 153, 0.7)'],
        hoverOffset: 4
    }]
})

onMounted(() => {
    emit('currentPage', 'dashboard')
})
</script>

<template>
    <div class="flex flex-col w-full gap-4">
        <div class="flex items-center justify-between">
            <select name="" id="" class="rounded p-2 text-sm font-medium">
                <option value="">3 tháng gần nhất</option>
                <option value="">6 tháng gần nhất</option>
                <option value="">9 tháng gần nhất</option>
                <option value="">12 tháng gần nhất</option>
            </select>
            <div class="">

            </div>
        </div>
        <div class=" grid grid-cols-4 gap-4">
            <div class="flex flex-col gap-2 p-4 bg-white rounded-md shadow hover:bg-slate-100 text-lg border-2">
                <i class="fa-regular fa-user text-4xl text-red-500"></i>
                <span class="font-medium">10</span>
                <span class="text-gray-600">Người dùng</span>
            </div>
            <div class="flex flex-col gap-2 p-4 bg-white rounded-md shadow hover:bg-slate-100 text-lg border-2">
                <i class="fa-regular fa-clipboard text-4xl text-orange-500"></i>
                <span class="font-medium">15</span>
                <span class="text-gray-600">Bài viết</span>
            </div>
            <div class="flex flex-col gap-2 p-4 bg-white rounded-md shadow hover:bg-slate-100 text-lg border-2">
                <i class="fa-solid fa-person-circle-question text-4xl text-yellow-500"></i>
                <span class="font-medium">9</span>
                <span class="text-gray-600">Yêu cầu</span>
            </div>
            <div class="flex flex-col gap-2 p-4 bg-white rounded-md shadow hover:bg-slate-100 text-lg border-2">
                <i class="fa-solid fa-check text-4xl text-green-500"></i>
                <span class="font-medium">1</span>
                <span class="text-gray-600">Hoàn thành</span>
            </div>
        </div>
        <div class="grid grid-cols-3 gap-2 grid-rows-2 ">
            <ChartDoughnut :title="titleDoughnut" :data="dataDoughnut" class="border-2" />
            <ChartBar :title="titleBar" :data="dataBar" class="row-span-2 col-span-2 border-2" />
            <ChartPie :title="titlePie" :data="dataPie" class="border-2" />
        </div>
        <div class="p-2 bg-white rounded-lg shadow border-2">
            <h1 class="text-center font-semibold text-lg">Danh sách các sinh viên nhặt và trả lại thành công</h1>
            <h2 class="text-center font-semibold text-sm italic text-gray-600">Tháng: 01</h2>
            <table class="table-auto border-collapse border border-slate-500 w-full mt-2">
                <thead>
                    <tr>
                        <th class="border border-slate-600 p-2">STT</th>
                        <th class="border border-slate-600 p-2">Người tìm thấy</th>
                        <th class="border border-slate-600 p-2">Người thất lạc</th>
                        <th class="border border-slate-600 p-2">Trường / Khoa</th>
                        <th class="border border-slate-600 p-2">Loại đồ</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="border border-slate-700 p-2 text-center">1</td>
                        <td class="border border-slate-700 p-2">B2000000</td>
                        <td class="border border-slate-700 p-2">B2222222</td>
                        <td class="border border-slate-700 p-2">Nông nghiệp</td>
                        <td class="border border-slate-700 p-2">Điện thoại</td>
                    </tr>
                    <tr>
                        <td class="border border-slate-700 p-2 text-center">2</td>
                        <td class="border border-slate-700 p-2">B2299310</td>
                        <td class="border border-slate-700 p-2">B2212345</td>
                        <td class="border border-slate-700 p-2">Nông nghiệp</td>
                        <td class="border border-slate-700 p-2">Quần áo</td>
                    </tr>
                    <tr>
                        <td class="border border-slate-700 p-2 text-center">3</td>
                        <td class="border border-slate-700 p-2">B2234433</td>
                        <td class="border border-slate-700 p-2">B1900000</td>
                        <td class="border border-slate-700 p-2">Nông nghiệp</td>
                        <td class="border border-slate-700 p-2">Chìa khóa</td>
                    </tr>
                    <tr>
                        <td class="border border-slate-700 p-2 text-center">4</td>
                        <td class="border border-slate-700 p-2">B2234433</td>
                        <td class="border border-slate-700 p-2">B1900000</td>
                        <td class="border border-slate-700 p-2">Nông nghiệp</td>
                        <td class="border border-slate-700 p-2">Chìa khóa</td>
                    </tr>
                </tbody>
            </table>
            <div class="mt-2 flex justify-between items-center">
                <h1 class="font-medium">Tổng cộng: 10</h1>
                <button
                    class="text-sm p-1 border border-blue-500 text-blue-500 rounded-md hover:text-red-400 hover:border-red-400">
                    Xuất file
                    <i class="fa-solid fa-file-export"></i>
                </button>
            </div>
        </div>
    </div>
</template>