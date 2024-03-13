<script setup>
import { onMounted, ref, watchEffect } from 'vue';
import { useToast } from 'vue-toast-notification'
import { useManageStore } from '../../../stores/manage.store'
import { useMajorStore } from '../../../stores/major.store'
import { useSchoolStore } from '../../../stores/school.store'
import { FwbPagination } from 'flowbite-vue'
import Seach from '../../common/Seach.vue';
import Loading from '../../common/Loading.vue'
import AddMajor from './AddMajor.vue'
import EditMajor from './EditMajor.vue'

const manageStore = useManageStore()
const majorStore = useMajorStore()
const schoolStore = useSchoolStore()
const $toast = useToast()

const emit = defineEmits(['currentPage'])

const currentMajor = ref(null)

const deleteMajor = async (id) => {
    const conFirm = confirm('Bạn có chắc chắn muốn xóa?')
    if (conFirm) {
        await majorStore.deleteMajor(id)
        if (majorStore.err) {
            $toast.error(majorStore.err, { position: 'top-right' })
            return
        }
        $toast.success(majorStore.result.message, { position: 'top-right' })
        await majorStore.getAlls({ key: majorStore.key, page: majorStore.currentPage })
    }
}

watchEffect(async () => {
    await majorStore.getAlls({ key: majorStore.key, page: majorStore.currentPage, schoolId: majorStore.schoolId })
})

onMounted(async () => {
    emit('currentPage', 'major')
    await majorStore.getAlls({ key: '', page: 1 })
    await schoolStore.getSchool({})
    majorStore.key = ''
    majorStore.currentPage = 1
    majorStore.schoolId = null
})
</script>

<template>
    <div class="flex flex-col gap-5">
        <div class="w-full">
            <div class="flex items-center justify-between w-full">
                <div class="flex gap-5">
                    <div class="border border-black rounded-xl">
                        <Seach :title="'Tìm kiếm chuyên ngành'" @key="(e) => { majorStore.key = e }" />
                    </div>
                    <div class="flex gap-1 items-center">
                        <label for="schoolId">Trường / khoa: </label>
                        <select name="schoolId" id="schoolId" class="rounded-xl p-1" v-model="majorStore.schoolId">
                            <option value="null">Tất cả</option>
                            <option v-for="school in schoolStore.schools" :value="school.id">
                                {{ school.name }}
                            </option>
                        </select>
                    </div>
                </div>
                <button class="p-2 text-blue-500 rounded font-medium hover:text-blue-400 text-2xl"
                    @click="manageStore.showAddMajorModal">
                    <i class="fa-solid fa-plus"></i>
                </button>
            </div>
            <table class="table-auto w-full mt-5">
                <thead class="font-medium w-full">
                    <tr class="text-left border-b border-black">
                        <th class="text-center pb-2 w-[10%]">
                            STT
                        </th>
                        <th class="pb-2 w-[35%]">
                            Chuyên ngành
                        </th>
                        <th class="pb-2 w-[35%]">
                            Trường / khoa
                        </th>
                        <th class="text-center pb-2 w-[20%]">
                            Tùy chọn
                        </th>
                    </tr>
                </thead>
                <tbody v-if="majorStore.isLoading == false">
                    <tr v-if="majorStore.majors?.length" v-for="(major, i) in majorStore.majors" :key="major.id"
                        class="border-b transition duration-300 ease-in-out hover:bg-gray-300">
                        <td class="font-medium text-center w-[10%]">
                            {{ (majorStore.currentPage - 1) * 10 + i + 1 }}
                        </td>
                        <td class="">
                            {{ major.name }}
                        </td>
                        <td class="">
                            {{ major.School.name }}
                        </td>
                        <td class="w-[20%]">
                            <div class="flex gap-2 items-center justify-center">
                                <button class="p-2 text-yellow-300 hover:text-yellow-200 text-2xl" @click="() => {
                            manageStore.showEditMajorModal()
                            currentMajor = major
                        }">
                                    <i class="fa-solid fa-pen"></i>
                                </button>
                                <button class="p-2 text-red-500 hover:text-red-400 text-2xl"
                                    @click="async () => { await deleteMajor(major.id) }">
                                    <i class="fa-solid fa-trash-can"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                    <tr v-else class="text-center text-red-500 text-xl">
                        <td colspan="3">
                            Không có.
                        </td>
                    </tr>
                </tbody>
                <tbody v-else>
                    <tr class="text-center text-red-500 text-xl">
                        <td colspan="3" class="p-6">
                            <Loading />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="w-full text-center" v-if="majorStore.totalPages >= 2">
            <FwbPagination v-model="majorStore.currentPage" :total-pages="majorStore.totalPages" :show-icons="true"
                :show-labels="false" />
        </div>
        <AddMajor />
        <EditMajor :major="currentMajor" />
    </div>
</template>