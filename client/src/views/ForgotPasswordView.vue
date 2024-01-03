<script setup>

</script>

<template>
    <section class="bg-slate-100 w-[30%] mx-auto px-6 py-8">
        <div class="flex items-center justify-center">
            <div class="w-full shadow p-6 bg-white rounded-lg">
                <h1 class="h1-custom">
                    QUÊN MẬT KHẨU
                </h1>
                <form class="flex flex-col gap-3">
                    <div>
                        <label for="email" class="label-custom">
                            Email:
                        </label>
                        <input type="email" name="email" id="email" class="input-custom">
                        <span v-if="false" class="error">
                            Email không hợp lệ!
                        </span>
                    </div>
                    <div>
                        <label for="password" class="label-custom">
                            Mật khẩu mới:
                        </label>
                        <input type="password" name="password" id="password" class="input-custom">
                        <span v-if="false" class="error">
                            Tối thiểu 6 ký tự!
                        </span>
                    </div>
                    <div>
                        <label for="confirm-password" class="label-custom">
                            Nhập lại mật khẩu mới:
                        </label>
                        <input type="password" name="confirm-password" id="confirm-password" class="input-custom">
                        <span v-if="false" class="error">
                            Tối thiểu 6 ký tự!
                        </span>
                    </div>
                    <div class="flex flex-row gap-2 w-full mb-4">
                        <input type="number" placeholder="XXXXXX"
                            class="w-2/3 shrink border-b-2 outline-none border-slate-400 px-2">
                        <button type="button"
                            class="grow shrink-0 bg-sky-400 text-white text-sm font-semibold rounded-md p-2 hover:bg-sky-300">
                            Gửi mã
                        </button>
                    </div>
                    <button type="submit" class="btn-custom">
                        Đổi mật khẩu
                    </button>
                    <p class="text-xs font-light text-gray-500">
                        Bạn chưa có tài khoản?
                        <router-link class="font-medium text-primary-600 hover:underline hover:text-red-600"
                            :to="{ name: 'register' }">
                            Đăng ký.
                        </router-link>
                    </p>
                </form>
            </div>
        </div>
    </section>
</template>