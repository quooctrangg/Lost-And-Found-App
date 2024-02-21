<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.store'
import { useToast } from 'vue-toast-notification'
import Loading from '@/components/common/Loading.vue';
import { ref } from 'vue';
import { onMounted } from 'vue';

const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()
const $toast = useToast()

const status = ref('')

const confirmUser = async () => {
    await authStore.confirmUser({ token: route.query.token })
    if (authStore.err) {
        $toast.error(authStore.err, { position: 'top-right' })
        status.value = authStore.err
        setTimeout(() => {
            router.push('register')
        }, 1000)
        return
    }
    $toast.success(authStore.result.message, { position: 'top-right' })
    status.value = authStore.result.message
    setTimeout(() => {
        router.push('login')
    }, 1000)
}

onMounted(async () => {
    await confirmUser()
})
</script>
<template>
    <h1 v-if="status !== ''" class="text-center p-2 text-xl text-red-600 italic">
        {{ status }}
    </h1>
    <div v-else class="p-2">
        <Loading />
    </div>
</template>