<script setup>
import { useToast } from 'vue-toast-notification'
import { useDashboardtore } from '../../../stores/dashboard.store'
import { onMounted, watch } from 'vue';

const dashboardStore = useDashboardtore()
const $toast = useToast()

const props = defineProps(['option'])

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

watch(() => props.option, async (newval) => {
    await getListStudentRetureItemSuccessful(newval)
})

onMounted(async () => {
    await getListStudentRetureItemSuccessful(props.option)
})
</script>

<template>
    <div class="p-2 bg-white rounded-lg shadow border-2">
        <h1 class="text-center font-semibold text-lg">Danh sách các sinh viên nhặt và trả lại thành công</h1>
        <table class="table-auto border-collapse border border-slate-500 w-full mt-2">
            <thead>
                <tr>
                    <th class="border border-slate-600 p-2">STT</th>
                    <th class="border border-slate-600 p-2">Người tìm thấy</th>
                    <th class="border border-slate-600 p-2">Trường / Khoa</th>
                    <th class="border border-slate-600 p-2">Người thất lạc</th>
                    <th class="border border-slate-600 p-2">Loại đồ</th>
                    <th class="border border-slate-600 p-2">Gửi lại bảo vệ</th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="dashboardStore.studentsList.length" v-for="(student, i) in dashboardStore.studentsList">
                    <td class="border border-slate-700 p-2 text-center">
                        {{
                            i + 1
                        }}
                    </td>
                    <td class="border border-slate-700 p-2">
                        {{
                            getMSSV(student.found)
                        }}
                    </td>
                    <td class="border border-slate-700 p-2">
                        {{
                            student.school
                        }}
                    </td>
                    <td class="border border-slate-700 p-2">
                        {{
                            getMSSV(student.lost)
                        }}
                    </td>
                    <td class="border border-slate-700 p-2">
                        {{
                            student.item
                        }}
                    </td>
                    <td class="border border-slate-700 p-2 text-center">
                        {{
                            student.sendProtection ? 'X' : ''
                        }}
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
            <h1 class="font-medium">
                Tổng cộng:
                {{ dashboardStore.studentsList.length }}
            </h1>
            <button
                class="text-sm p-1 border border-blue-500 text-blue-500 rounded-md hover:text-red-400 hover:border-red-400">
                Xuất file
                <i class="fa-solid fa-file-export"></i>
            </button>
        </div>
    </div>
</template>