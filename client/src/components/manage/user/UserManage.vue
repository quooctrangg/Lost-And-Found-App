<script setup>
import { onMounted, ref, watchEffect } from 'vue'
import { FwbPagination } from 'flowbite-vue'
import { useManageStore } from '../../../stores/manage.store'
import { useUserStore } from '../../../stores/user.store'
import { useSchoolStore } from '../../../stores/school.store'
import { useToast } from 'vue-toast-notification'
import Seach from '../../common/Seach.vue';
import AddUserModal from './AddUserModal.vue';
import EditUserModal from './EditUserModal.vue';
import FeedbackModal from './FeedbackModal.vue';
import HistoryModal from './HistoryModal.vue'
import Loading from '@/components/common/Loading.vue';
import dayjs from 'dayjs'

const manageStore = useManageStore()
const userStore = useUserStore()
const schoolStore = useSchoolStore()
const $toast = useToast()

const emit = defineEmits(['currentPage'])

const currentUser = ref(null)

const toggleBanUser = async (user, feedback = null) => {
    const conFirm = confirm(`Bạn có chắc chắn ${user.isBan ? 'mở' : ''} khóa?`)
    if (conFirm) {
        await userStore.toggleBanUser(user.id, { feedback: feedback })
        if (userStore.err) {
            $toast.error(userStore.err, { position: 'top-right' })
            return
        }
        $toast.success(userStore.result.message, { position: 'top-right' })
        await userStore.getAllUsers({ page: userStore.currentPage, key: userStore.key, isBan: userStore.isBan, schoolId: userStore.schoolId })
        manageStore.closeFeedbackModal()
    }
}

watchEffect(async () => {
    await userStore.getAllUsers({ page: userStore.currentPage, key: userStore.key, isBan: userStore.isBan, schoolId: userStore.schoolId })
})

onMounted(async () => {
    emit('currentPage', 'user')
    await userStore.getAllUsers({ page: 1 })
    userStore.currentPage = 1
    userStore.key = ''
    userStore.schoolId = null
    userStore.isBan = null
    await schoolStore.getSchool({})
})
</script>

<template>
    <div class="flex flex-col gap-5">
        <div class="w-full">
            <div class="flex items-center justify-between w-full">
                <div class="flex gap-5">
                    <div class="border border-black rounded-xl">
                        <Seach :title="'Tìm kiếm người dùng'" @key="(e) => { userStore.key = e }" />
                    </div>
                    <div class="flex gap-1 items-center">
                        <label for="isban">Trạng thái: </label>
                        <select name="" id="isban" class="rounded-xl p-1" v-model="userStore.isBan">
                            <option value="null">Tất cả</option>
                            <option value="false">Hoạt động</option>
                            <option value="true">Khóa</option>
                        </select>
                    </div>
                    <div>
                        <label for="school">Trường / khoa: </label>
                        <select name="" id="school" class="rounded-xl p-1" v-model="userStore.schoolId">
                            <option value="null">Tất cả</option>
                            <option v-for="school in schoolStore.schools" :key="school.id" :value="school.id">
                                {{
                                    school.name
                                }}
                            </option>
                        </select>
                    </div>
                </div>
                <button class="p-2 text-blue-500 rounded font-medium hover:text-blue-400 text-xl"
                    @click="manageStore.showAddUserModal">
                    <i class="fa-solid fa-user-plus"></i>
                </button>
            </div>
            <table>
                <thead class="border-b border-black font-medium">
                    <tr class="text-left">
                        <th class="px-6 py-4 text-center">
                            ID
                        </th>
                        <th class="px-6 py-4">
                            Hình
                        </th>
                        <th class="px-6 py-4">
                            Tên
                        </th>
                        <th class="px-6 py-4">
                            Email
                        </th>
                        <th class="px-6 py-4 text-center">
                            Trạng thái
                        </th>
                        <th class="px-6 py-4 text-center">
                            Ngày tham gia
                        </th>
                        <th class="px-6 py-4 text-center">
                            Tùy chọn
                        </th>
                    </tr>
                </thead>
                <tbody v-if="userStore.isLoading == false">
                    <tr v-if="userStore.users?.length" v-for="user in userStore.users" :key="user.id"
                        class="border-b transition duration-300 ease-in-out hover:bg-gray-300">
                        <td class="whitespace-nowrap px-6 py-4 font-medium text-center">
                            {{
                                user.id
                            }}
                        </td>
                        <td class="whitespace-nowrap px-6 py-4">
                            <div class="w-20 h-20 overflow-hidden flex items-center justify-center rounded-full">
                                <img :src="user.image" alt="logo">
                            </div>
                        </td>
                        <td class="whitespace-nowrap px-6 py-4">
                            {{
                                user.name
                            }}
                        </td>
                        <td class="whitespace-nowrap px-6 py-4">
                            {{
                                user.email.split('@')[0]
                            }}
                        </td>
                        <td v-if="!user.isBan" class="whitespace-nowrap px-6 py-4 text-green-500 text-center">
                            Hoạt động
                        </td>
                        <td v-else class="whitespace-nowrap px-6 py-4 text-red-500 text-center">
                            Khóa
                        </td>
                        <td class="whitespace-nowrap px-6 py-4 text-center">
                            {{
                                dayjs(user.createdAt).format('LT L')
                            }}
                        </td>
                        <td class="whitespace-nowrap px-6 py-4 flex gap-2 items-center justify-center">
                            <button v-if="!user.isBan" class="p-2 text-red-600 hover:text-red-700 text-2xl" @click="() => {
                                manageStore.showFeedbackModal()
                                currentUser = user
                            }">
                                <i class="fa-solid fa-lock"></i>
                            </button>
                            <button v-else class="p-2 text-orange-400 hover:text-orange-500 text-2xl"
                                @click="async () => { await toggleBanUser(user) }">
                                <i class="fa-solid fa-unlock"></i>
                            </button>
                            <button class="p-2 text-yellow-300 hover:text-yellow-400 text-2xl" @click="() => {
                                manageStore.showEditUserModal()
                                currentUser = user
                            }">
                                <i class="fa-solid fa-pen"></i>
                            </button>
                            <button class="p-2 text-gray-500 hover:text-gray-600 text-2xl" @click="() => {
                                manageStore.showHistoryModal()
                                currentUser = user
                            }">
                                <i class="fa-regular fa-eye"></i>
                            </button>
                        </td>
                    </tr>
                    <tr v-else class="text-center text-red-500 text-xl">
                        <td colspan="7">
                            Không có.
                        </td>
                    </tr>
                </tbody>
                <tbody v-else>
                    <tr class="text-center text-red-500 text-xl">
                        <td colspan="7" class="p-6">
                            <Loading />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="w-full text-center" v-if="userStore.totalPages >= 2">
            <FwbPagination v-model="userStore.currentPage" :total-pages="userStore.totalPages" :show-icons="true"
                :show-labels="false" />
        </div>
        <AddUserModal />
        <EditUserModal :user="currentUser" />
        <FeedbackModal :user="currentUser" @user="async (e) => { await toggleBanUser(e.user, e.feedback) }" />
        <HistoryModal :user="currentUser" />
    </div>
</template>