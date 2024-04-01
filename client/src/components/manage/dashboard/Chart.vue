<script setup>
import { useToast } from 'vue-toast-notification'
import { useDashboardtore } from '../../../stores/dashboard.store'
import { onMounted, watch } from 'vue';
import Bar from './chart/Bar.vue'
import Pie from './chart/Pie.vue';
import Doughnut from './chart/Doughnut.vue';

const dashboardStore = useDashboardtore()
const $toast = useToast()

const props = defineProps(['option'])

const getChart = async (option) => {
    await dashboardStore.getChart(option)
    if (dashboardStore.err) {
        $toast.error(dashboardStore.err, { position: 'top-right' })
        return
    }
    console.log(dashboardStore.chart);
}

watch(() => props.option, async (newval) => {
    await getChart(newval)
})

onMounted(async () => {
    await getChart(props.option)
})
</script>

<template>
    <div class="flex flex-col gap-2 items-center">
        <div class="w-full max-w-[700px]">
            <Bar :option="props.option" :data="dashboardStore.chart.countType" />
        </div>
        <div class="grid grid-cols-2 gap-2 w-full min-h-[500px]">
            <Doughnut :data="dashboardStore.chart.countLocation" />
            <Pie :data="dashboardStore.chart.countItem" />
        </div>
    </div>
</template>