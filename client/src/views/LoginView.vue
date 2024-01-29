<script setup>

</script>

<template>
    <section class="bg-slate-100 h-screen w-screen flex items-center">
        <div class="flex items-center justify-center m-auto w-[25%]">
            <div class="w-full shadow p-6 bg-white rounded-lg">
                <h1 class="h1-custom">
                    ĐĂNG NHẬP
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
                            Mật khẩu:
                        </label>
                        <input type="password" name="password" id="password" class="input-custom">
                        <span v-if="false" class="error">
                            Tối thiểu 6 ký tự!
                        </span>
                    </div>
                    <div class="flex items-center justify-between">
                        <router-link
                            class="text-xs font-medium text-primary-600 hover:underline hover:text-red-600 text-gray-500"
                            :to="{ name: 'forgot-password' }">
                            Quên mật khẩu?
                        </router-link>
                    </div>
                    <button type="submit" class="btn-custom">
                        Đăng nhập
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