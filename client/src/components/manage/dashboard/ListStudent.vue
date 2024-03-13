<script setup>
import { useToast } from 'vue-toast-notification'
import { useDashboardtore } from '../../../stores/dashboard.store'
import { onMounted, ref, watch } from 'vue';
import { FwbPagination } from 'flowbite-vue'
import xlsx from 'xlsx/dist/xlsx.full.min'

const dashboardStore = useDashboardtore()
const $toast = useToast()

const props = defineProps(['option'])

const currentPage = ref(1)
const pageSize = 20
const totalPages = ref(1)
const data = ref([])

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
}

const getMSSV = (email) => {
    const regex = /B\d{7}/i;
    const match = email.match(regex);
    return match ? match[0] : null;
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

const objectsToArray = (objects) => {
    const newArray = [];
    let index = 1
    for (let obj of objects) {
        if (obj.sendProtection == true) obj.sendProtection = 'X'
        let objArray = Object.values(obj);
        objArray.unshift(index)
        index++
        newArray.push(objArray);
    }
    return newArray;
}

const exportExcel = () => {
    const date = setDate(props.option);
    const title = 'Danh sách các sinh viên nhặt và trả lại thành công'
    const XLSX = xlsx
    const workbook = XLSX.utils.book_new()
    const worksheet = XLSX.utils.aoa_to_sheet(
        [
            [title],
            [date],
            [],
            [],
            ['STT', 'Người tìm thấy', 'Chuyên ngành', 'Người thất lạc', 'Loại đồ', 'Gửi lại bảo vệ'],
            ...objectsToArray(dashboardStore.studentsList)
        ]
    )
    const columnWidths = [
        { wch: 5 },
        { wch: 50 },
        { wch: 50 },
        { wch: 50 },
        { wch: 25 },
        { wch: 20 }
    ];
    worksheet['!cols'] = columnWidths;
    worksheet['!merges'] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 5 } },
        { s: { r: 1, c: 0 }, e: { r: 1, c: 5 } }
    ];
    XLSX.utils.book_append_sheet(workbook, worksheet, `${setDate(props.option)}`)
    XLSX.writeFile(workbook, `${setDate(props.option)}.xlsx`)
}

watch(() => props.option, async (newval) => {
    await getListStudentRetureItemSuccessful(newval)
    currentPage.value = 1
    nextPage(currentPage.value)
})

watch(() => currentPage.value, (newval) => {
    nextPage(newval)
})

onMounted(async () => {
    await getListStudentRetureItemSuccessful(props.option)
    totalPages.value = Math.ceil(dashboardStore.studentsList.length / 20)
    currentPage.value = 1
    nextPage(currentPage.value)
})
</script>

<template>
    <div class="p-2 bg-white rounded-lg shadow border-2">
        <div>
            <h1 class="text-center font-semibold text-2xl">Danh sách các sinh viên nhặt và trả lại thành công</h1>
            <h1 class="text-center italic">
                {{
                    setDate(props.option)
                }}
            </h1>
        </div>
        <div class="text-end">
            <button @click="exportExcel"
                class="text-sm p-1 border border-blue-600 text-blue-500 rounded-md hover:text-red-400 hover:border-red-400">
                Xuất file
                <i class="fa-solid fa-file-export"></i>
            </button>
        </div>
        <table class="table-auto border-collapse border border-slate-500 w-full mt-2">
            <thead>
                <tr>
                    <th class="border border-slate-600 bg-blue-300 p-2">STT</th>
                    <th class="border border-slate-600 bg-blue-300 p-2">Người tìm thấy</th>
                    <th class="border border-slate-600 bg-blue-300 p-2">Chuyên ngành</th>
                    <th class="border border-slate-600 bg-blue-300 p-2">Người thất lạc</th>
                    <th class="border border-slate-600 bg-blue-300 p-2">Loại đồ</th>
                    <th class="border border-slate-600 bg-blue-300 p-2">Gửi lại bảo vệ</th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="data.length" v-for="(student, i) in data" class="even:bg-blue-100">
                    <td class="border border-slate-700 p-2 text-center">
                        {{ i + 1 }}
                    </td>
                    <td class="border border-slate-700 p-2">
                        {{ getMSSV(student.found) }}
                    </td>
                    <td class="border border-slate-700 p-2">
                        {{ student.school }}
                    </td>
                    <td class="border border-slate-700 p-2">
                        {{ getMSSV(student.lost) }}
                    </td>
                    <td class="border border-slate-700 p-2">
                        {{ student.item }}
                    </td>
                    <td class="border border-slate-700 p-2 text-center">
                        {{ student.sendProtection ? 'X' : '' }}
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
        <div class="text-center" v-if="totalPages > 1">
            <FwbPagination v-model="currentPage" :total-pages="totalPages" :show-icons="true" :show-labels="false" />
        </div>
    </div>
</template>