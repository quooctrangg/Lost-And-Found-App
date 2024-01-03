<script setup>
</script>
<template>
    <header class="bg-sky-300">
        <div class="w-[80%] mx-auto flex justify-between items-center">
            <div>
                <router-link :to="{ name: 'home' }">
                    <div class="flex items-center gap-2">
                        <img class="h-12 w-auto" src="/logo.png" alt="Logo">
                        <p class="text-sm break-words italic font-medium text-red-500">
                            Nơi chia sẽ đồ vật thất lạc
                        </p>
                    </div>
                </router-link>
            </div>
            <div class="w-[30%]">
                <div v-if="true" class="text-xs flex gap-2 justify-end">
                    <div class="hover:text-red-500">
                        <router-link :to="{ name: 'login' }">
                            <p>Đăng nhập</p>
                        </router-link>
                    </div>
                    <p>|</p>
                    <div class="hover:text-red-500">
                        <router-link :to="{ name: 'register' }">
                            <p>Đăng ký</p>
                        </router-link>
                    </div>
                </div>
                <div v-else class="flex gap-5 items-center">
                    <div>
                        <i class="fa-regular fa-bell"></i>
                    </div>
                    <div>
                        <i class="fa-regular fa-message"></i>
                    </div>
                    <div class="group relative cursor-pointer">
                        <div class="menu-hover flex items-center gap-1">
                            <img class="h-10 w-auto" src="/logo.png" alt="logo">
                            <p class="text-xs truncate">Nguyen Quoc Trang</p>
                        </div>
                        <div class="group-hover:visible invisible absolute bg-white w-full shadow-xl">
                            <a class="block border-b p-2 text-xs hover:text-gray-400">
                                Thông tin chi tiết
                            </a>
                            <a class="block border-b p-2 text-xs hover:text-gray-400">
                                Quản trị viên
                            </a>
                            <a class="block border-b p-2 text-xs hover:text-gray-400">
                                Đăng xuất
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </header>
</template>
