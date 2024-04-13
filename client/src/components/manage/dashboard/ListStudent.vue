<script setup>
import { useToast } from 'vue-toast-notification'
import { FwbButton } from 'flowbite-vue'
import { useDashboardtore } from '../../../stores/dashboard.store'
import { onMounted, ref, watch } from 'vue';
import { FwbPagination } from 'flowbite-vue'
import dayjs from 'dayjs';

const dashboardStore = useDashboardtore()
const $toast = useToast()

const props = defineProps(['option'])

const currentPage = ref(1)
const pageSize = 10
const totalPages = ref(1)
const data = ref([])
const sortType = ref(false)

const nextPage = (page) => {
    if (page < 1) page = 1
    if (page > totalPages.value) page = totalPages.value
    let start = (page - 1) * pageSize
    let end = start + pageSize
    data.value = dashboardStore.studentsList.slice(start, end)
}

const getListStudentRetureItemSuccessful = async (option) => {
    await dashboardStore.getListStudentRetureItemSuccessful(option)
    if (dashboardStore.err) {
        $toast.error(dashboardStore.err, { position: 'top-right' })
        return
    }
    sortType.value = false
    sortBy('day')
}

const setDate = (option) => {
    let result = ''
    switch (option.type) {
        case 'month':
            result = `Tháng ${option.month}-${option.year}`
            break;
        case 'year':
            result = `Năm ${option.year}`
            break;
        case 'any':
            result = `Từ ngày ${dayjs(option.to).format('DD-MM-YYYY')} đến ${dayjs(option.from).format('DD-MM-YYYY')}`
            break;
    }
    return result
}

const exportExcel = async () => {
    await dashboardStore.downloadExcel(props.option, setDate(props.option))
}

const sortBy = (name) => {
    switch (name) {
        case 'school':
            if (sortType.value) dashboardStore.studentsList = dashboardStore.studentsList.sort((a, b) => (a.school).localeCompare(b.school))
            else dashboardStore.studentsList = dashboardStore.studentsList.sort((a, b) => (b.school).localeCompare(a.school))
            nextPage(currentPage.value)
            break;

        case 'major':
            if (sortType.value) dashboardStore.studentsList = dashboardStore.studentsList.sort((a, b) => (a.major).localeCompare(b.major))
            else dashboardStore.studentsList = dashboardStore.studentsList.sort((a, b) => (b.major).localeCompare(a.major))
            nextPage(currentPage.value)
            break;

        case 'day':
            if (sortType.value) dashboardStore.studentsList = dashboardStore.studentsList.sort((a, b) => (a.day).localeCompare(b.day))
            else dashboardStore.studentsList = dashboardStore.studentsList.sort((a, b) => (b.day).localeCompare(a.day))
            nextPage(currentPage.value)
            break;
    }
    sortType.value = !sortType.value
}

watch(() => props.option, async (newval) => {
    await getListStudentRetureItemSuccessful(newval)
    currentPage.value = 1
    totalPages.value = Math.ceil(dashboardStore.studentsList.length / pageSize)
    nextPage(currentPage.value)
})

watch(() => currentPage.value, (newval) => {
    nextPage(newval)
})

onMounted(async () => {
    await getListStudentRetureItemSuccessful(props.option)
    totalPages.value = Math.ceil(dashboardStore.studentsList.length / pageSize)
    currentPage.value = 1
    nextPage(currentPage.value)
})
</script>

<template>
    <div class="p-2 bg-white rounded-lg shadow border-2">
        <div>
            <h1 class="text-center font-semibold text-2xl">
                Danh sách các sinh viên nhặt và trả lại thành công
            </h1>
            <h1 class="text-center italic">
                {{
                    setDate(props.option)
                }}
            </h1>
        </div>
        <div class="text-end">
            <fwb-button @click="exportExcel" color='blue' outline>
                Xuất file
                <i class="fa-solid fa-file-export"></i>
            </fwb-button>
        </div>
        <table class="table-auto border-collapse border border-slate-500 w-full mt-2">
            <thead>
                <tr>
                    <th class="border border-slate-600 bg-blue-300 p-2">
                        STT
                    </th>
                    <th class="border border-slate-600 bg-blue-300 p-2">
                        Người tìm thấy
                    </th>
                    <th class="border border-slate-600 bg-blue-300 p-2 cursor-pointer" @click="sortBy('school')">
                        Trường / khoa
                        <i class="fa-solid fa-sort"></i>
                    </th>
                    <th class="border border-slate-600 bg-blue-300 p-2 cursor-pointer" @click="sortBy('major')">
                        Chuyên ngành
                        <i class="fa-solid fa-sort"></i>
                    </th>
                    <th class="border border-slate-600 bg-blue-300 p-2">
                        Người thất lạc
                    </th>
                    <th class="border border-slate-600 bg-blue-300 p-2">
                        Loại đồ
                    </th>
                    <th class="border border-slate-600 bg-blue-300 p-2 cursor-pointer" @click="sortBy('day')">
                        Ngày
                        <i class="fa-solid fa-sort"></i>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="data.length" v-for="(student, i) in data" class="even:bg-blue-100">
                    <td class="border border-slate-700 p-2 text-center">
                        {{ (currentPage - 1) * 10 + i + 1 }}
                    </td>
                    <td class="border border-slate-700 p-2">
                        {{ student.found }}
                    </td>
                    <td class="border border-slate-700 p-2">
                        {{ student.school }}
                    </td>
                    <td class="border border-slate-700 p-2">
                        {{ student.major }}
                    </td>
                    <td class="border border-slate-700 p-2">
                        {{ student.lost }}
                    </td>
                    <td class="border border-slate-700 p-2">
                        {{ student.item }}
                    </td>
                    <td class="border border-slate-700 p-2">
                        {{ dayjs(student.day).format('L') }}
                    </td>
                </tr>
                <tr v-else>
                    <td colspan="6" class="text-center text-red-600 italic">
                        Danh sánh rỗng.
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="mt-2 flex justify-between items-center">
            <h1 class="font-medium text-red-500">
                Tổng cộng:
                {{ dashboardStore.studentsList.length }}
            </h1>
        </div>
        <div class="text-center" v-if="totalPages >= 2">
            <FwbPagination v-model="currentPage" :total-pages="totalPages" :show-icons="true" :show-labels="false" />
        </div>
    </div>
</template>