<script setup>

</script>

<template>
    <div class="bg-white rounded-md p-2 w-[80%] mx-auto">
        <div class="flex justify-between items-center mb-3">
            <div class="flex items-center gap-1">
                <img class="h-12 w-auto" src="/logo.png" alt="logo">
                <div class="flex flex-col">
                    <p class="text-base truncate">Nguyen Quoc Trang</p>
                    <span class="text-xs italic">1 giờ trước</span>
                </div>
            </div>
            <div class="flex gap-5 items-center">
                <div>
                    <p v-if="false" class="border-2 border-blue-500 p-1 text-xs font-semibold text-blue-500 rounded">
                        TÌM THẤY
                    </p>
                    <p v-else class="border-2 border-orange-500 p-1 text-xs font-semibold text-orange-500 rounded">
                        THẤT LẠC
                    </p>
                </div>
                <div class="px-4">
                    <i class="fa-solid fa-ellipsis text-2xl"></i>
                </div>
            </div>
        </div>
        <div class="indent-4 border-b-2">
            <h1 class="font-semibold text-lg">Test 1234</h1>
            <h2 class="text-sm">Test 1234 Test 1234 Test 1234 Test 1234</h2>
        </div>
        <div class="flex">
            <div class="flex-shrink-0 w-1/4">
                <img src="/test.png" alt="Photo 1" class="w-full h-32 object-cover rounded-lg">
            </div>
            <div class="flex-shrink-0 w-1/4">
                <img src="/test.png" alt="Photo 1" class="w-full h-32 object-cover rounded-lg">
            </div>
            <div class="flex-shrink-0 w-1/4">
                <img src="/test.png" alt="Photo 1" class="w-full h-32 object-cover rounded-lg">
            </div>
            <div class="flex-shrink-0 w-1/4">
                <img src="/test.png" alt="Photo 1" class="w-full h-32 object-cover rounded-lg">
            </div>
        </div>
    </div>
</template>