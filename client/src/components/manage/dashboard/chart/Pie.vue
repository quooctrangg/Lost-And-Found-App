<script setup>
import { Pie } from 'vue-chartjs'
import { Chart as ChartJs, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js'
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useItemStore } from '../../../../stores/item.store'
import Loading from '@/components/common/Loading.vue';

ChartJs.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement)

const props = defineProps(['data'])

const itemStore = useItemStore()

const options = {
    responsive: true,
    aspectRatio: 2,
    maintainAspectRatio: false,
    plugins: {
        title: {
            text: 'Biểu đồ thống kê số lượt bài viết theo loại đồ',
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
const isLoading = ref(false)

const setData = (data) => {
    dataPie.labels = []
    dataPie.datasets[0].data = []
    data.forEach(item => {
        itemStore.items.forEach(element => {
            if (item.itemId == element.id) {
                dataPie.labels.push(element.name)
                dataPie.datasets[0].data.push(item._count)
            }
        });
    })
}

onMounted(async () => {
    await itemStore.getItem({})
})

watch(() => props.data, (newVal) => {
    isLoading.value = true
    setData(newVal)
    setTimeout(() => {
        isLoading.value = false
    }, 500)
})

const chartIncomes = computed(() => { return { ...dataPie } })
</script>

<template>
    <div v-if="isLoading == false" class="p-1 bg-white rounded-lg shadow">
        <Pie :data="chartIncomes" :options="options" class="w-full h-full" />
    </div>
    <Loading v-else />
</template>