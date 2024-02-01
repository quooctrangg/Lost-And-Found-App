<script setup>
import { FwbButton, FwbModal } from 'flowbite-vue'
import { useUserStore } from '../../stores/user.store'
import { useSchoolStore } from '../../stores/school.store'
import { onMounted, reactive } from 'vue';
import { useToast } from 'vue-toast-notification'
import Loading from '../common/Loading.vue';

const userStore = useUserStore()
const schoolStore = useSchoolStore()
const $toast = useToast()

const email = userStore.user?.email
const profile = reactive({
    name: userStore.user?.name,
    schoolId: userStore.user?.School?.id
})

const submitUpdateProfile = async () => {
    if (profile.name == userStore.user?.name && profile.schoolId == userStore.user?.School?.id) return
    await userStore.updateProfile(profile)
    if (userStore.err) {
        $toast.error(userStore.err, { position: 'top-right' })
        return
    }
    $toast.success(userStore.result.message, { position: 'top-right' })
    userStore.user.name = profile.name
    userStore.user.School = schoolStore.schools[profile.schoolId]
    userStore.closeUpdateProfileModal()
}

onMounted(async () => {
    await schoolStore.getSchool()
})
</script>

<template>
    <fwb-modal v-if="userStore.isShow.updateProfile" @close="userStore.closeUpdateProfileModal" :size="'md'">
        <template #header>
            <div class="flex items-center text-xl gap-1">
                <i class="fa-solid fa-pen text-2xl"></i>
                Chỉnh sửa thông tin
            </div>
        </template>
        <template #body>
            <div v-if="userStore.isLoading == false" class="w-full">
                <label for="email" class="text-lg mx-2">Email:</label>
                <input id="email" maxlength="50" type="email" placeholder="Nhập email"
                    class="rounded-md w-full mb-3 bg-gray-200" v-model="email" disabled>
                <label for="name" class="text-lg mx-2">Họ và tên:</label>
                <input id="name" maxlength="50" type="text" placeholder="Nhập họ và tên" class="rounded-md w-full mb-3"
                    v-model="profile.name">
                <label for="school" class="text-lg mx-2">Trường / Khoa:</label>
                <select name="" id="school" class="rounded-md w-full mb-3" v-model="profile.schoolId">
                    <option v-for="school in schoolStore.schools" :key="school.id" :value="school.id">
                        {{
                            school.name
                        }}
                    </option>
                </select>
            </div>
            <div v-else>
                <Loading />
            </div>
        </template>
        <template #footer>
            <div class="flex justify-end gap-2">
                <fwb-button @click="userStore.closeUpdateProfileModal" color="alternative">
                    Hủy
                </fwb-button>
                <fwb-button @click="async () => { await submitUpdateProfile() }" color="green">
                    Đổi
                </fwb-button>
            </div>
        </template>
    </fwb-modal>
</template>