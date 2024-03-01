<script setup>
import { useToast } from 'vue-toast-notification'
import { useDashboardtore } from '../../../stores/dashboard.store'
import { onMounted, watch } from 'vue';

const dashboardStore = useDashboardtore()
const $toast = useToast()

const props = defineProps(['option'])

const getStatistical = async (option) => {
    await dashboardStore.getStatistical(option)
    if (dashboardStore.err) {
        $toast.error(dashboardStore.err, { position: 'top-right' })
        return
    }
}

watch(() => props.option, async (newval) => {
    await getStatistical(newval)
})

onMounted(async () => {
    await getStatistical(props.option)
})
</script>

<template>
    <div class=" grid grid-cols-4 gap-4">
        <div class="flex flex-col gap-2 p-4 bg-white rounded-md shadow hover:bg-slate-100 text-lg border-2">
            <i class="fa-regular fa-user text-4xl text-red-500"></i>
            <span class="font-medium">
                {{
                    dashboardStore.statistical?.user
                }}
            </span>
            <span class="text-gray-600">Người dùng</span>
        </div>
        <div class="flex flex-col gap-2 p-4 bg-white rounded-md shadow hover:bg-slate-100 text-lg border-2">
            <i class="fa-regular fa-clipboard text-4xl text-orange-500"></i>
            <span class="font-medium">
                {{
                    dashboardStore.statistical?.post
                }}
            </span>
            <span class="text-gray-600">Bài viết</span>
        </div>
        <div class="flex flex-col gap-2 p-4 bg-white rounded-md shadow hover:bg-slate-100 text-lg border-2">
            <i class="fa-solid fa-person-circle-question text-4xl text-yellow-500"></i>
            <span class="font-medium">
                {{
                    dashboardStore.statistical?.request
                }}
            </span>
            <span class="text-gray-600">Yêu cầu</span>
        </div>
        <div class="flex flex-col gap-2 p-4 bg-white rounded-md shadow hover:bg-slate-100 text-lg border-2">
            <i class="fa-solid fa-check text-4xl text-green-500"></i>
            <span class="font-medium">
                {{
                    dashboardStore.statistical?.done
                }}
            </span>
            <span class="text-gray-600">Hoàn thành</span>
        </div>
    </div>
</template>