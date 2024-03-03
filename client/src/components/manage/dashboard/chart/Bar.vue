<script setup>
import { Bar } from 'vue-chartjs'
import { Chart as ChartJs, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, elements } from 'chart.js/auto'
import { computed, reactive, watch, onMounted, ref } from 'vue';
import dayjs from 'dayjs';
import Loading from '@/components/common/Loading.vue';

ChartJs.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement)

const props = defineProps(['option', 'data'])

const options = {
    responsive: true,
    aspectRatio: 2,
    plugins: {
        title: {
            text: 'Biểu đồ thống kê số lượng bài viết được đăng',
            display: true,
        }
    }
}
const dataBar = reactive({
    labels: [],
    datasets: [
        {
            label: 'Tìm thấy',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            data: []
        },
        {
            label: 'Thất lạc',
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
            data: []
        }
    ]
})
const isLoading = ref(false)

const setDate = (option) => {
    dataBar.labels = []
    switch (option.type) {
        case 'month':
            dataBar.labels.push(`Tháng ${option.month}-${option.year}`)
            break;
        case 'year':
            dataBar.labels.push(`Năm ${option.year}`)
            break;
        case 'any':
            dataBar.labels.push(`Từ ngày ${dayjs(option.to).format('DD-MM-YYYY')} đến ${dayjs(option.from).format('DD-MM-YYYY')}`)
            break;
    }
}

const setData = (data) => {
    dataBar.datasets[0].data = []
    dataBar.datasets[1].data = []
    data.forEach((element) => {
        if (element.type == true) {
            dataBar.datasets[0].data.push(element._count)
        } else if (element.type == false) {
            dataBar.datasets[1].data.push(element._count)
        }
    })
}

watch(() => props.option, async newval => {
    setDate(newval)
})

watch(() => props.data, newval => {
    isLoading.value = true
    setData(newval);
    setTimeout(() => {
        isLoading.value = false
    }, 500)
})

onMounted(() => {
    setDate(props.option)
})

const chartData = computed(() => { return { ...dataBar } })
</script>

<template>
    <div v-if="isLoading == false" class="p-1 bg-white rounded-lg shadow">
        <Bar :data="chartData" :options="options" />
    </div>
    <Loading v-else />
</template>