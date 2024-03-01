<script setup>
import { Pie } from 'vue-chartjs'
import { Chart as ChartJs, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js'
import { computed, onMounted, reactive, watch } from 'vue';
import { useItemStore } from '../../../../stores/item.store'

ChartJs.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement)

const props = defineProps(['data'])

const itemStore = useItemStore()

const options = {
    responsive: true,
    aspectRatio: 2,
    maintainAspectRatio: false,
    plugins: {
        title: {
            text: 'Biểu đồ thống kê theo loại đồ',
            display: true,
        }
    }
}
const dataPie = reactive({
    labels: [],
    datasets: [{
        data: [],
        backgroundColor: ['rgba(255, 153, 0, 0.7)', 'rgba(255, 51, 0, 0.7)', 'rgba(255, 255, 0, 0.7)', 'rgba(255, 0, 102, 0.7)', 'rgba(255, 51, 204, 0.7)', 'rgba(204, 255, 51, 0.7)', 'rgba(204, 51, 0, 0.7)', 'rgba(204, 0, 0, 0.7)', 'rgba(102, 0, 51, 0.7)', 'rgba(153, 0, 153, 0.7)'],
        hoverOffset: 4
    }]
})

const setLabels = () => {
    dataPie.labels = []
    itemStore.items.forEach(element => {
        dataPie.labels.push(element.name)
    });
}

const setData = (data) => {
    data.forEach(item => {
        itemStore.items.forEach(element => {

        });
    })
}

onMounted(async () => {
    await itemStore.getItem({})
    setLabels()
})

watch(() => props.data, (newVal) => {
    setData(newVal)
})

const chartIncomes = computed(() => { return { ...dataPie } })
</script>

<template>
    <div class="p-1 bg-white rounded-lg shadow">
        <Pie :data="chartIncomes" :options="options" class="w-full h-full" />
    </div>
</template>