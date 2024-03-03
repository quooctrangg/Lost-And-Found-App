<script setup>
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJs, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js'
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useLocationStore } from '../../../../stores/location.store'
import Loading from '@/components/common/Loading.vue';

ChartJs.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement)

const props = defineProps(['data'])

const locationStore = useLocationStore()

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
    labels: [],
    datasets: [{
        data: [],
        backgroundColor: ['rgba(0, 102, 204, 0.7)', 'rgba(0, 204, 153, 0.7)', 'rgba(102, 255, 255, 0.7)', 'rgba(51, 102, 255, 0.7)', 'rgba(0, 204, 153, 0.7)', 'rgba(0, 204, 0, 0.7)', 'rgba(102, 255, 255, 0.7)', 'rgba(102, 102, 255, 0.7)', 'rgba(204, 51, 255, 0.7)', 'rgba(51, 204, 51, 0.7)'],
        hoverOffset: 4
    }]
})
const isLoading = ref(false)

const setData = (data) => {
    dataDoughnut.labels = []
    dataDoughnut.datasets[0].data = []
    data.forEach(item => {
        locationStore.locations.forEach(element => {
            if (item.id == element.id) {
                dataDoughnut.labels.push(element.name)
                dataDoughnut.datasets[0].data.push(item._count)
            }
        });
    })
}

onMounted(async () => {
    await locationStore.getLocation({})
})

watch(() => props.data, (newVal) => {
    isLoading.value = true
    setData(newVal)
    setTimeout(() => {
        isLoading.value = false
    }, 500)
})

const chartIncomes = computed(() => { return { ...dataDoughnut } })
</script>

<template>
    <div v-if="isLoading == false" class="p-1 bg-white rounded-lg shadow">
        <Doughnut :data="chartIncomes" :options="options" class="w-full h-full" />
    </div>
    <Loading v-else />
</template>