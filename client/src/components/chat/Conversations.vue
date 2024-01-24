<script setup>

</script>

<template>
    <div class="mt-2 overflow-y-scroll no-scrollbar">
        <div v-for="i in 10" class="p-1 flex text-black mb-1 cursor-pointer gap-2 border-b-[1px] rounded    "
            :class="i == 2 ? 'bg-slate-200' : 'bg-white'">
            <div class="h-[45px] w-[45px] rounded-full overflow-hidden border shrink-0">
                <img alt="avatar" class="h-full w-full" src="/test.png">
            </div>
            <div class="flex flex-col w-[100%] justify-between py-1">
                <h2 class="text-sm font-semibold mb-[0.5px] truncate max-w-[150px]">
                    Nguyen Quoc Trang
                </h2>
                <div class="flex text-xs w-[100%] justify-between">
                    <div class="truncate w-[80%] max-w-[150px] basis-2/3">
                        You: Hello
                    </div>
                    <div>
                        20/01/2024
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>