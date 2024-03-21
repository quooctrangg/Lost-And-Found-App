<script setup>
import { onMounted, ref } from 'vue';
import { useRequestStore } from '../../stores/request.store'
import { useUserStore } from '../../stores/user.store'
import dayjs from 'dayjs';
import Loading from '../common/Loading.vue';

const requestStore = useRequestStore()
const userStore = useUserStore()

const emit = defineEmits(['currentPage'])

const data = ref([])

const getRequestSuccess = async () => {
    await requestStore.getRequestsSuccessByUserId()
    data.value = requestStore.result.data
}

onMounted(async () => {
    emit('currentPage', 'success')
    await getRequestSuccess()
})
</script>

<template>
    <table class="table-auto border-collapse border border-slate-500 w-full mt-2">
        <thead>
            <tr>
                <th class="border border-slate-600 bg-blue-300 p-2">STT</th>
                <th class="border border-slate-600 bg-blue-300 p-2">Mô tả khi đồ vật</th>
                <th class="border border-slate-600 bg-blue-300 p-2">Trạng thái</th>
                <th class="border border-slate-600 bg-blue-300 p-2">Loại đồ</th>
                <th class="border border-slate-600 bg-blue-300 p-2">Thời gian</th>
            </tr>
        </thead>
        <tbody v-if="requestStore.isLoading == false">
            <tr v-if="data.length" v-for="(success, i) in data" class="even:bg-blue-100">
                <td class="border border-slate-700 p-2 text-center">
                    {{ i + 1 }}
                </td>
                <td class="border border-slate-700 p-2">
                    {{ success.description }}
                </td>
                <td v-if="userStore.user.id == success.User.id" class="border border-slate-700 p-2">
                    {{ success.Post.type == true ? `Nhận đồ từ ` : `Trả đồ cho ` }}
                    <router-link class="font-semibold italic hover:text-blue-600 hover:underline"
                        :to="{ name: 'profile', params: { id: success.Post.User.id } }">
                        {{ success.Post.User.name }}
                    </router-link>
                </td>
                <td v-else class="border border-slate-700 p-2">
                    {{ success.Post.type == true ? 'Trả đồ cho' : 'Nhận đồ từ' }}
                    <router-link class="font-semibold italic hover:text-blue-600 hover:underline"
                        :to="{ name: 'profile', params: { id: success.User.id } }">
                        {{ success.User.name }}
                    </router-link>
                </td>
                <td class="border border-slate-700 p-2">
                    {{ success.Post.Item.name }}
                </td>
                <td class="border border-slate-700 p-2 text-center">
                    {{ dayjs(success.updatedAt).format('LT L') }}
                </td>
            </tr>
            <tr v-else>
                <td colspan="6" class="text-center text-red-600 italic">
                    Danh sánh rỗng.
                </td>
            </tr>
        </tbody>
        <tbody v-else>
            <tr>
                <td colspan="5" class="w-full">
                    <Loading />
                </td>
            </tr>
        </tbody>
    </table>
</template>