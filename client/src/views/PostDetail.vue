<script setup>
import { useRoute, useRouter } from 'vue-router'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Pagination } from 'swiper/modules'
import Footer from '../components/common/Footer.vue';
import SuggestCard from '../components/common/SuggestCard.vue';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const route = useRoute()
const router = useRouter()


const goBack = () => {
    router.back()
}
</script>

<template>
    <div class="w-[80%] mx-auto flex gap-2 mt-2">
        <div class="w-[70%] bg-white rounded-md p-2 shadow">
            <div class="mb-3 grid grid-cols-3">
                <div class="cursor-pointer hover:text-red-500 p-1" @click="goBack">
                    <i class="fa-solid fa-arrow-left"></i>
                </div>
                <h1 class="text-base truncate font-semibold text-center">Nguyen Quoc Trang</h1>
            </div>
            <div>
                <swiper :centeredSlides="true" :spaceBetween="20" :pagination="{ type: 'fraction' }" :navigation="true"
                    :modules="[Navigation, Pagination]" class="mySwiper">
                    <swiper-slide>
                        <div class="bg-slate-400 rounded overflow-hidden flex justify-center items-center">
                            <img class="h-[300px]" src="/test.png" alt="">
                        </div>
                    </swiper-slide>
                    <swiper-slide>
                        <div class="bg-slate-400 rounded overflow-hidden flex justify-center items-center">
                            <img class="h-[300px]" src="/logo.png" alt="">
                        </div>
                    </swiper-slide>
                    <swiper-slide>
                        <div class="bg-slate-400 rounded overflow-hidden flex justify-center items-center">
                            <img class="h-[300px]" src="/test.png" alt="">
                        </div>
                    </swiper-slide>
                    <swiper-slide>
                        <div class="bg-slate-400 rounded overflow-hidden flex justify-center items-center">
                            <img class="h-[300px]" src="/logo.png" alt="">
                        </div>
                    </swiper-slide>
                </swiper>
            </div>
            <div class="flex flex-col gap-2">
                <div class="flex justify-between items-center my-1 border-b-[1px]">
                    <div class="flex items-center gap-1">
                        <img class="h-12 w-auto rounded-full" src="/logo.png" alt="logo">
                        <div class="flex flex-col">
                            <p class="text-base truncate font-semibold">Nguyen Quoc Trang</p>
                            <span class="text-xs italic">
                                <i class=" fa-regular fa-clock"></i>
                                1 giờ trước
                            </span>
                        </div>
                    </div>
                    <div class="flex gap-3 items-center">
                        <div>
                            <div v-if="true" class="flex gap-1">
                                <p class="border-2 border-blue-500 p-1 text-xs font-semibold text-blue-500 rounded">
                                    TÌM THẤY
                                </p>
                                <p v-if="true"
                                    class="border-2 border-red-500 p-1 text-xs font-semibold text-red-500 rounded">
                                    GỬI LẠI BAN QUẢN LÝ TÒA NHÀ
                                </p>
                            </div>
                            <p v-else class="border-2 border-orange-500 p-1 text-xs font-semibold text-orange-500 rounded">
                                THẤT LẠC
                            </p>
                        </div>
                        <div class="">
                            <div class="px-2 cursor-pointer text-2xl hover:text-red-600 text-blue-500">
                                <i class="fa-brands fa-facebook-messenger"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="flex flex-col gap-3">
                    <h1 class="font-semibold text-lg">
                        Toi tim thay 1 cai non
                    </h1>
                    <h2 class="text-gray-500 flex gap-1 items-center text-sm">
                        <i class="fa-solid fa-location-dot"></i>
                        Trung tâm học liệu
                    </h2>
                    <div>
                        <h2 class="font-semibold text-sm">Mô tả:</h2>
                        <p class="text-sm indent-2">
                            Toi nhat duoc 1 cai non mau xanh nhu hinh.
                        </p>
                    </div>
                    <h3 class="text-blue-600 text-sm font-semibold hover:underline cursor-pointer">
                        #Dụng cụ học tập
                    </h3>
                </div>
            </div>
        </div>
        <div class="w-[30%] bg-white rounded-md p-2 shadow">
            <h1 class="text-center font-semibold text-xl italic border-b">Gợi ý</h1>
            <SuggestCard />
        </div>
    </div>
    <div class="w-[80%] mx-auto mt-2">
        <div class="w-[70%] bg-white rounded-md p-2 shadow">
            <div class="p-2 text-sm text-gray-700 underline">
                4 bình luận
            </div>
            <div class="p-2">
                <div class="flex gap-2 mt-2">
                    <img class="h-8 w-auto rounded-full" src="/logo.png" alt="logo">
                    <div>
                        <div class="bg-gray-100 rounded-lg shadow p-1">
                            <h1 class="text-sm font-medium">Vo Van Kiet</h1>
                            <div class="text-xs">
                                Bạn nhặt nó ở phòng họp 201/B1 đúng không
                            </div>
                        </div>
                        <div class="flex gap-2 text-xs indent-2">
                            <h1 class="text-gray-600">1 ngày trước</h1>
                            <h1 class="cursor-pointer hover:text-red-500">Phản hồi</h1>
                        </div>
                    </div>
                </div>
                <div class="">
                    <div class="flex gap-2 mt-2">
                        <img class="h-8 w-auto rounded-full" src="/logo.png" alt="logo">
                        <div>
                            <div class="bg-gray-100 rounded-lg shadow p-1">
                                <h1 class="text-sm font-medium">Nguyen Van A</h1>
                                <div class="text-xs">
                                    Tôi muốn xem chi tiết
                                </div>
                            </div>
                            <div class="flex gap-2 text-xs indent-2">
                                <h1 class="text-gray-600">Vài giây trước</h1>
                                <h1 class="cursor-pointer hover:text-red-500">Phản hồi</h1>
                            </div>
                        </div>
                    </div>
                    <div class="ml-8">
                        <div class="flex gap-2 mt-2">
                            <img class="h-8 w-auto rounded-full" src="/test.png" alt="logo">
                            <div>
                                <div class="bg-gray-100 rounded-lg shadow p-1">
                                    <h1 class="text-sm font-medium">Nguyen Van C</h1>
                                    <div class="text-xs">
                                        <span class="font-semibold">Nguyen Van A</span> Hãy nhắn tin cho tôi
                                    </div>
                                </div>
                                <div class="flex gap-2 text-xs indent-2">
                                    <h1 class="text-gray-600">Vài giây trước</h1>
                                    <h1 class="cursor-pointer hover:text-red-500">Phản hồi</h1>
                                </div>
                            </div>
                        </div>
                        <div class="flex gap-2 mt-2">
                            <img class="h-8 w-auto rounded-full" src="/logo.png" alt="logo">
                            <div>
                                <div class="bg-gray-100 rounded-lg shadow p-1">
                                    <h1 class="text-sm font-medium">Nguyen Van A</h1>
                                    <div class="text-xs">
                                        <span class="font-semibold">Nguyen Van B</span> Ok
                                    </div>
                                </div>
                                <div class="flex gap-2 text-xs indent-2">
                                    <h1 class="text-gray-600">Vài giây trước</h1>
                                    <h1 class="cursor-pointer hover:text-red-500">Phản hồi</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <div v-if="false" class="text-xs text-gray-700 flex gap-2 p-1">
                    <p>Đang phản hồi <span class="font-semibold">Vo Van Kiet</span></p>
                    <button class="text-red-600 hover:text-red-400">Hủy</button>
                </div>
                <div class="flex justify-between items-center bg-gray-200 p-1 rounded shadow">
                    <input type="text" placeholder="Nhập bình luận..."
                        class="p-1 w-full border-none outline-none border-transparent focus:border-transparent focus:ring-0 bg-gray-200">
                    <div class="flex gap-3 mx-2 hover:text-blue-500">
                        <span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                stroke="currentColor" class="w-6 h-6 cursor-pointer">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                            </svg>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <Footer />
</template>