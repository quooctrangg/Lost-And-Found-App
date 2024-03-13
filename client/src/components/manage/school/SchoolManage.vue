<script setup>
import { onMounted, ref, watchEffect } from 'vue'
import { FwbPagination } from 'flowbite-vue'
import { useManageStore } from '../../../stores/manage.store'
import { useSchoolStore } from '../../../stores/school.store'
import { useToast } from 'vue-toast-notification'
import Seach from '../../common/Seach.vue';
import AddSchool from './AddSchool.vue';
import EditSchool from './EditSchool.vue';
import Loading from '../../common/Loading.vue'

const manageStore = useManageStore()
const schoolStore = useSchoolStore()
const $toast = useToast()

const emit = defineEmits(['currentPage'])

const currentSchool = ref(null)

const deleteSchool = async (id) => {
    const conFirm = confirm('Bạn có chắc chắn muốn xóa?')
    if (conFirm) {
        await schoolStore.deleteSchool(id)
        if (schoolStore.err) {
            $toast.error(schoolStore.err, { position: 'top-right' })
            return
        }
        $toast.success(schoolStore.result.message, { position: 'top-right' })
        await schoolStore.getSchool({ key: schoolStore.key, page: schoolStore.currentPage })
    }
}

watchEffect(async () => {
    await schoolStore.getSchool({ key: schoolStore.key, page: schoolStore.currentPage })
})

onMounted(async () => {
    emit('currentPage', 'school')
    await schoolStore.getSchool({ key: '', page: 1 })
    schoolStore.key = ''
    schoolStore.currentPage = 1
})
</script>

<template>
    <div class="flex flex-col gap-5">
        <div class="w-full">
            <div class="flex items-center justify-between w-full">
                <div class="flex gap-5">
                    <div class="border border-black rounded-xl">
                        <Seach :title="'Tìm kiếm trường'" @key="(e) => { schoolStore.key = e }" />
                    </div>
                    <div class="flex gap-1 items-center">

                    </div>
                </div>
                <button class="p-2 text-blue-500 rounded font-medium hover:text-blue-400 text-2xl"
                    @click="manageStore.showAddSchoolModal">
                    <i class="fa-solid fa-plus"></i>
                </button>
            </div>
            <table class="table-auto w-full mt-5">
                <thead class="font-medium w-full">
                    <tr class="text-left border-b border-black">
                        <th class="text-center pb-2 w-[10%]">
                            STT
                        </th>
                        <th class="pb-2 w-[70%]">
                            Tên trường / khoa
                        </th>
                        <th class="text-center pb-2 w-[20%]">
                            Tùy chọn
                        </th>
                    </tr>
                </thead>
                <tbody v-if="schoolStore.isLoading == false">
                    <tr v-if="schoolStore.schools?.length" v-for="(school, i) in schoolStore.schools" :key="school.id"
                        class="border-b transition duration-300 ease-in-out hover:bg-gray-300">
                        <td class="font-medium text-center w-[10%]">
                            {{ (schoolStore.currentPage - 1) * 10 + i + 1 }}
                        </td>
                        <td class="">
                            {{
                            school.name
                        }}
                        </td>
                        <td class="w-[20%]">
                            <div class="flex gap-2 items-center justify-center">
                                <button class="p-2 text-yellow-300 hover:text-yellow-200 text-2xl" @click="() => {
                                manageStore.showEditSchoolModal()
                                currentSchool = school
                            }">
                                    <i class="fa-solid fa-pen"></i>
                                </button>
                                <button class="p-2 text-red-500 hover:text-red-400 text-2xl"
                                    @click="async () => { await deleteSchool(school.id) }">
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
        <div class="w-full text-center" v-if="schoolStore.totalPages >= 2">
            <FwbPagination v-model="schoolStore.currentPage" :total-pages="schoolStore.totalPages" :show-icons="true"
                :show-labels="false" />
        </div>
        <AddSchool />
        <EditSchool :school="currentSchool" />
    </div>
</template>