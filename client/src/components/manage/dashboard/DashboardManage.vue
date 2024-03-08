<script setup>
import { onMounted, reactive, computed } from 'vue'
import dayjs from 'dayjs';
import Statistical from './Statistical.vue';
import ListStudent from './ListStudent.vue';
import Chart from './Chart.vue';

const emit = defineEmits(['currentPage'])

const curentDate = dayjs()
const option = reactive({
    type: 'month',
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    to: curentDate.subtract(1, 'month').format('YYYY-MM-DD'),
    from: dayjs(new Date()).format('YYYY-MM-DD')
})

onMounted(async () => {
    emit('currentPage', 'dashboard')
})

const select = computed(() => { return { ...option } })

</script>

<template>
    <div class="flex flex-col w-full gap-4">
        <div class="flex items-center gap-1">
            <div>Theo: </div>
            <select class="rounded p-2 text-sm font-medium" v-model="option.type">
                <option value="month">Tháng</option>
                <option value="year">Năm</option>
                <option value="any">Tùy chọn</option>
            </select>
            <div class="flex gap-1">
                <div v-if="option.type !== 'any'" class="flex gap-1">
                    <select v-if="option.type == 'month'" class="rounded p-2 text-sm font-medium"
                        v-model="option.month">
                        <option value="1">01</option>
                        <option value="2">02</option>
                        <option value="3">03</option>
                        <option value="4">04</option>
                        <option value="5">05</option>
                        <option value="6">06</option>
                        <option value="7">07</option>
                        <option value="8">08</option>
                        <option value="9">09</option>
                        <option value="10">10</option>
                        <option value="11">11</option>
                        <option value="12">12</option>
                    </select>
                    <input type="number" class="rounded p-2 text-sm font-medium w-auto" v-model="option.year">
                </div>
                <div v-else class="flex gap-1 items-center">
                    Từ ngày:
                    <input type="date" class="rounded p-2 text-sm font-medium" v-model="option.to">
                    đến ngày:
                    <input type="date" class="rounded p-2 text-sm font-medium" v-model="option.from">
                </div>
            </div>
        </div>
        <Statistical :option="select" />
        <Chart :option="select" />
        <ListStudent :option="select" />
    </div>
</template>