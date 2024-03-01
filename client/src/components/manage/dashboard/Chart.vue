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
}

watch(() => props.option, async (newval) => {
    await getChart(newval)
})

onMounted(async () => {
    await getChart(props.option)
})
</script>

<template>
    <div class="grid grid-cols-3 gap-2">
        <Bar :option="props.option" :data="dashboardStore.chart.countType" class="row-span-2 col-span-2" />
        <Doughnut :data="dashboardStore.chart.conutLocation" />
        <Pie :data="dashboardStore.chart.countItem" />
    </div>
</template>