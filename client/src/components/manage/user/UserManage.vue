<script setup>
import { onMounted, ref, watch, watchEffect } from 'vue'
import { FwbPagination } from 'flowbite-vue'
import { useManageStore } from '../../../stores/manage.store'
import { useUserStore } from '../../../stores/user.store'
import { useSchoolStore } from '../../../stores/school.store'
import { useMajorStore } from '../../../stores/major.store'
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
const majorStore = useMajorStore()
const $toast = useToast()

const emit = defineEmits(['currentPage'])

const currentUser = ref(null)

const banUser = async (user, feedback, time) => {
    const conFirm = confirm(`Bạn có chắc chắn khóa?`)
    if (conFirm) {
        await userStore.banUser(user.id, { feedback: feedback, time: time })
        if (userStore.err) {
            $toast.error(userStore.err, { position: 'top-right' })
            return
        }
        $toast.success(userStore.result.message, { position: 'top-right' })
        await userStore.getAllUsers({ page: userStore.currentPage, key: userStore.key, isBan: userStore.isBan, schoolId: userStore.schoolId, type: userStore.type })
        manageStore.closeFeedbackModal()
    }
}

const unBanUser = async (id) => {
    const conFirm = confirm(`Bạn có chắc chắn mở khóa?`)
    if (conFirm) {
        await userStore.unBanUser(id)
        if (userStore.err) {
            $toast.error(userStore.err, { position: 'top-right' })
            return
        }
        $toast.success(userStore.result.message, { position: 'top-right' })
        await userStore.getAllUsers({ page: userStore.currentPage, key: userStore.key, isBan: userStore.isBan, schoolId: userStore.schoolId, type: userStore.type })
    }
}

watchEffect(async () => {
    await userStore.getAllUsers({ page: userStore.currentPage, key: userStore.key, isBan: userStore.isBan, schoolId: userStore.schoolId, majorId: userStore.majorId, type: userStore.type })
})

watch(() => userStore.schoolId, async newval => {
    if (newval !== 'null' && newval !== null && newval !== '') {
        userStore.majorId = 'null'
        await majorStore.getAllsBySchoolId(newval)
    } else {
        userStore.majorId = 'null'
        majorStore.majors = []
    }
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
            <div class="flex items-center justify-between w-full gap-3">
                <div class="flex-1 flex gap-5 justify-between items-center">
                    <div class="flex flex-col gap-2">
                        <div class="border border-black rounded-xl">
                            <Seach :title="'Nhập tên hoặc mssv'" @key="(e) => { userStore.key = e }" />
                        </div>
                    </div>
                    <div class="flex flex-col gap-2">
                        <div class="flex gap-1 items-center">
                            <label for="isban">Trạng thái: </label>
                            <select name="" id="isban" class="rounded-xl p-1" v-model="userStore.isBan">
                                <option value="null">Tất cả</option>
                                <option value="false">Hoạt động</option>
                                <option value="true">Khóa</option>
                            </select>
                        </div>
                        <div class="flex gap-1 items-center">
                            <label for="isban">Quyền: </label>
                            <select name="" id="isban" class="rounded-xl p-1" v-model="userStore.type">
                                <option value="null">Tất cả</option>
                                <option :value="2">Người dùng</option>
                                <option :value="1">Quản lý bài viết</option>
                            </select>
                        </div>
                    </div>
                    <div class="flex flex-col gap-2">
                        <div class="flex items-center gap-1">
                            <label for="schoolId">Trường / khoa: </label>
                            <select name="" id="schoolId" class="rounded-xl p-1 flex-1" v-model="userStore.schoolId">
                                <option value="null">Tất cả</option>
                                <option v-for="school in schoolStore.schools" :key="school.id" :value="school.id">
                                    {{ school.name }}
                                </option>
                            </select>
                        </div>
                        <div class="flex items-center gap-1">
                            <label for="major">Chuyên ngành: </label>
                            <select name="" id="major" class="rounded-xl p-1 flex-1" v-model="userStore.majorId">
                                <option value="null">Tất cả</option>
                                <option v-for="major in majorStore.majors" :key="major.id" :value="major.id">
                                    {{ major.name }}
                                </option>
                            </select>
                        </div>
                    </div>
                </div>
                <button class="p-2 text-blue-500 rounded font-medium hover:text-blue-400 text-xl"
                    @click="manageStore.showAddUserModal">
                    <i class="fa-solid fa-user-plus"></i>
                </button>
            </div>
            <div class="text-red-600 mt-2">
                Tổng cộng: {{ userStore.totalCount }} tài khoản.
            </div>
            <table class="table-auto w-full">
                <thead class="border-b border-black font-medium">
                    <tr class="text-left">
                        <th class="p-2 text-center">
                            STT
                        </th>
                        <th class="p-2">
                            Hình
                        </th>
                        <th class="p-2">
                            Tên
                        </th>
                        <th class="p-2">
                            MSSV
                        </th>
                        <th class="p-2 text-center">
                            Trạng thái
                        </th>
                        <th class="p-2 text-center">
                            Ngày tham gia
                        </th>
                        <th class="p-2 text-center">
                            Tùy chọn
                        </th>
                    </tr>
                </thead>
                <tbody v-if="!userStore.isLoading">
                    <tr v-if="userStore.users?.length" v-for="(user, i) in userStore.users" :key="user.id"
                        class="border-b transition duration-300 ease-in-out hover:bg-gray-300">
                        <td class="whitespace-nowrap p-2 font-medium text-center">
                            {{ (userStore.currentPage - 1) * 10 + i + 1 }}
                        </td>
                        <td class="whitespace-nowrap p-2">
                            <div class="w-20 h-20 overflow-hidden flex items-center justify-center rounded-full">
                                <img :src="user.image" alt="logo">
                            </div>
                        </td>
                        <td class="whitespace-nowrap p-2 truncate">
                            <router-link :to="{ name: 'profile', params: { id: `${user.id}` } }"
                                class="text-lg text-blue-500 p-2 hover:text-blue-600">
                                {{ user.name }}
                            </router-link>
                        </td>
                        <td class="whitespace-nowrap p-2">
                            {{ user.studentId }}
                        </td>
                        <td v-if="!user.isBan" class="whitespace-nowrap p-2 text-green-500 text-center">
                            Hoạt động
                        </td>
                        <td v-else class="whitespace-nowrap p-2 text-red-500 text-center">
                            Khóa
                        </td>
                        <td class="p-2 text-center">
                            {{ dayjs(user.createdAt).format('LT L') }}
                        </td>
                        <td class="whitespace-nowrap p-2 flex gap-2 items-center justify-center">
                            <button v-if="!user.isBan" class="p-2 text-red-600 hover:text-red-700 text-2xl" @click="() => {
                                manageStore.showFeedbackModal()
                                currentUser = user
                            }">
                                <i class="fa-solid fa-lock"></i>
                            </button>
                            <button v-else class="p-2 text-orange-400 hover:text-orange-500 text-2xl"
                                @click="async () => { await unBanUser(user.id) }">
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
                        <td colspan="7" class="h-screen">
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
        <FeedbackModal :user="currentUser" @user="async (e) => { await banUser(e.user, e.feedback, e.time) }" />
        <HistoryModal :user="currentUser" />
    </div>
</template>