<script setup>
import { Bar } from 'vue-chartjs'
import { Chart as ChartJs, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js/auto'
import { computed, reactive } from 'vue';

ChartJs.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement)

const props = defineProps(['title', 'data'])

const options = {
    responsive: true,
    aspectRatio: 2,
    plugins: {
        title: {
            text: props.title,
            display: true,
        }
    }
}

const chartData = computed(() => { return { ...props.data } })
</script>

<template>
    <div class="p-1 bg-white rounded-lg shadow">
        <Bar :data="chartData" :options="options" />
    </div>
</template>