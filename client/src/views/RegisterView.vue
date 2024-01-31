<script setup>

</script>

<template>
    <section class="bg-slate-100 h-screen w-screen flex items-center">
        <div class="flex items-center justify-center m-auto w-[30%]">
            <div class="w-full shadow p-6 bg-white rounded-lg">
                <h1 class="h1-custom">
                    ĐĂNG KÝ
                </h1>
                <form class="flex flex-col gap-3">
                    <div>
                        <label for="firstname" class="label-custom">
                            Họ và tên:
                        </label>
                        <input type="text" name="firstname" id="firstname" class="input-custom">
                        <span v-if="false" class="error">
                            Họ và tên không hợp lệ!
                        </span>
                    </div>
                    <div>
                        <label for="email" class="label-custom">
                            Email:
                        </label>
                        <input type="email" name="email" id="email" class="input-custom">
                        <span v-if="false" class="error">
                            Email không hợp lệ!
                        </span>
                    </div>
                    <div class="grid grid-cols-2 gap-2">
                        <div>
                            <label for="password" class="label-custom">
                                Mật khẩu:
                            </label>
                            <input type="password" name="password" id="password" class="input-custom">
                            <span v-if="false" class="error">
                                Mật khẩu phải từ 6 ký tự trở lên!
                            </span>
                        </div>
                        <div>
                            <label for="confirm-password" class="label-custom">
                                Nhập lại mật khẩu:
                            </label>
                            <input type="password" name="confirm-password" id="confirm-password" class="input-custom">
                            <span v-if="false" class="error">
                                Không khớp mật khẩu!
                            </span>
                        </div>
                    </div>
                    <div>
                        <label for="school" class="label-custom">
                            Trường / Khoa:
                        </label>
                        <select name="school" id="school" class="input-custom">
                            <option value="">Chọn trường / khoa</option>
                            <option value="">Trường Công nghệ thông tin và truyền thông</option>
                            <option value="">Nông nghiệp</option>
                            <option value="">Kinh tế</option>
                        </select>
                        <span v-if="false" class="error">
                            Hãy chọn trường / khoa!
                        </span>
                    </div>
                    <div class="grid grid-cols-3 items-end gap-2">
                        <div class="col-span-2">
                            <label for="code" class="label-custom">
                                Nhập mã xác nhận:
                            </label>
                            <input type="number" name="code" id="code" class="input-custom">
                            <span v-if="false" class="error">
                                Hãy nhập mã xác nhận!
                            </span>
                        </div>
                        <div>
                            <button
                                class="w-full rounded-lg text-sm px-5 py-3 text-center text-white font-semibold bg-green-500 hover:bg-green-600">
                                Gửi mã
                            </button>
                        </div>
                    </div>
                    <div class="flex items-start">
                        <div class="flex items-center h-5">
                            <input id="terms" type="checkbox" class="checkbox-custom">
                        </div>
                        <div class="ml-3 text-xs">
                            <label for="terms" class="font-light text-sky-600">
                                Tôi chấp nhận các
                                <router-link class="font-medium hover:underline hover:text-red-600" :to="{ name: 'home' }">
                                    Điều khoản và điều kiện
                                </router-link>
                            </label>
                        </div>
                    </div>
                    <button type="submit" class="btn-custom">
                        Tạo tài khoản
                    </button>
                    <p class="text-xs font-light text-gray-500">
                        Đã có tài khoản?
                        <router-link class="font-medium text-primary-600 hover:underline hover:text-red-600"
                            :to="{ name: 'login' }">
                            Đăng nhập tại đây.
                        </router-link>
                    </p>
                </form>
            </div>
        </div>
    </section>
</template>