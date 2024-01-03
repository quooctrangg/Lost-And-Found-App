<template>
    <div class="h-[500px] flex flex-col justify-center items-center">
        <h1 class="text-xl font-semibold text-red-600">404 - Không tìm thấy trang.</h1>
        <router-link class="text-xl pt-5 text-sky-600" :to="{ name: 'home' }">Trở về trang chủ.</router-link>
    </div>
</template>