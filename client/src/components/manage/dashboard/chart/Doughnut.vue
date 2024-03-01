<script setup>
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJs, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js'
import { computed, reactive } from 'vue';

ChartJs.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement)

const props = defineProps(['data'])

const options = {
    responsive: true,
    aspectRatio: 2,
    maintainAspectRatio: false,
    plugins: {
        title: {
            text: 'Biểu đồ thống kê theo vị trí',
            display: true,
        }
    }
}
const dataDoughnut = reactive({
    labels: ['B1', 'C1', 'DI', 'NN', 'KT'],
    datasets: [{
        data: [1, 5, 7, 8, 5],
        backgroundColor: ['rgba(0, 102, 204, 0.7)', 'rgba(0, 204, 153, 0.7)', 'rgba(102, 255, 255, 0.7)', 'rgba(51, 102, 255, 0.7)', 'rgba(0, 204, 153, 0.7)', 'rgba(0, 204, 0, 0.7)', 'rgba(102, 255, 255, 0.7)', 'rgba(102, 102, 255, 0.7)', 'rgba(204, 51, 255, 0.7)', 'rgba(51, 204, 51, 0.7)'],
        hoverOffset: 4
    }]
})

const chartIncomes = computed(() => { return { ...dataDoughnut } })
</script>

<template>
    <div class="p-1 bg-white rounded-lg shadow">
        <Doughnut :data="chartIncomes" :options="options" class="w-full h-full" />
    </div>
</template>