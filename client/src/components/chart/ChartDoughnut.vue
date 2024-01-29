<script setup>
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJs, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js'
import { computed } from 'vue';

ChartJs.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement)

const props = defineProps(['title', 'data'])

const options = {
    responsive: true,
    aspectRatio: 2,
    maintainAspectRatio: false,
    plugins: {
        title: {
            text: props.title,
            display: true,
        }
    }
}
const chartIncomes = computed(() => { return { ...props.data } })
</script>

<template>
    <div class="p-1 bg-white rounded-lg shadow">
        <Doughnut :data="chartIncomes" :options="options" class="w-full h-full" />
    </div>
</template>