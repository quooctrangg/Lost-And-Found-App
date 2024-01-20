<script setup>

</script>

<template>
    <div class="my-3 flex items-center p-3 w-full" :class="true ? 'flex-row-reverse' : 'flex-row'">
        <div class="h-10 w-10 rounded-full overflow-hidden border-indigo-600 border-2">
            <img src="/test.png" class="h-full w-full">
        </div>
        <div class="mx-4  text-black flex flex-col rounded-lg py-1 px-3 text max-w-[85%] break-all"
            :class="true ? 'message_right' : 'message_left'">
            <p v-if="true" class="w-full" :class="true ? '' : 'text-left'">
                Hello
            </p>
            <p v-else class="w-full bg-white" :class="true ? '' : 'text-left'">
                <img class="w-[200px] object-cover" src="/test.png">
            </p>
            <span class="text-xs ">10:20</span>
        </div>
    </div>
    <div class="my-3 flex items-center p-3 w-full" :class="false ? 'flex-row-reverse' : 'flex-row'">
        <div class="h-10 w-10 rounded-full overflow-hidden border-indigo-600 border-2">
            <img src="/test.png" class="h-full w-full">
        </div>
        <div class="mx-4  text-black flex flex-col rounded-lg py-1 px-3 text max-w-[85%] break-all"
            :class="false ? 'message_right' : 'message_left'">
            <p v-if="true" class="w-full" :class="false ? '' : 'text-left'">
                Hello 1
            </p>
            <p v-else class="w-full bg-white" :class="false ? '' : 'text-left'">
                <img class="w-[200px] object-cover" src="/test.png">
            </p>
            <span class="text-xs ">10:20</span>
        </div>
    </div>
    <div class="my-3 flex items-center p-3 w-full" :class="true ? 'flex-row-reverse' : 'flex-row'">
        <div class="h-10 w-10 rounded-full overflow-hidden border-indigo-600 border-2">
            <img src="/test.png" class="h-full w-full">
        </div>
        <div class="mx-4  text-black flex flex-col rounded-lg py-1 px-3 text max-w-[85%] break-all"
            :class="true ? 'message_right' : 'message_left'">
            <p v-if="true" class="w-full" :class="true ? '' : 'text-left'">
                Hello
            </p>
            <p v-else class="w-full bg-white" :class="true ? '' : 'text-left'">
                <img class="w-[200px] object-cover" src="/test.png">
            </p>
            <span class="text-xs ">10:20</span>
        </div>
    </div>
    <div class="my-3 flex items-center p-3 w-full" :class="false ? 'flex-row-reverse' : 'flex-row'">
        <div class="h-10 w-10 rounded-full overflow-hidden border-indigo-600 border-2">
            <img src="/test.png" class="h-full w-full">
        </div>
        <div class="mx-4  text-black flex flex-col rounded-lg py-1 px-3 text max-w-[85%] break-all"
            :class="false ? 'message_right' : 'message_left'">
            <p v-if="true" class="w-full" :class="false ? '' : 'text-left'">
                Hello 1
            </p>
            <p v-else class="w-full bg-white" :class="false ? '' : 'text-left'">
                <img class="w-[200px] object-cover" src="/test.png">
            </p>
            <span class="text-xs ">10:20</span>
        </div>
    </div>
    <div class="my-3 flex items-center p-3 w-full" :class="true ? 'flex-row-reverse' : 'flex-row'">
        <div class="h-10 w-10 rounded-full overflow-hidden border-indigo-600 border-2">
            <img src="/test.png" class="h-full w-full">
        </div>
        <div class="mx-4  text-black flex flex-col rounded-lg py-1 px-3 text max-w-[85%] break-all"
            :class="true ? 'message_right' : 'message_left'">
            <p v-if="true" class="w-full" :class="true ? '' : 'text-left'">
                Hello
            </p>
            <p v-else class="w-full bg-white" :class="true ? '' : 'text-left'">
                <img class="w-[200px] object-cover" src="/test.png">
            </p>
            <span class="text-xs ">10:20</span>
        </div>
    </div>
    <div class="my-3 flex items-center p-3 w-full" :class="false ? 'flex-row-reverse' : 'flex-row'">
        <div class="h-10 w-10 rounded-full overflow-hidden border-indigo-600 border-2">
            <img src="/test.png" class="h-full w-full">
        </div>
        <div class="mx-4  text-black flex flex-col rounded-lg py-1 px-3 text max-w-[85%] break-all"
            :class="false ? 'message_right' : 'message_left'">
            <p v-if="true" class="w-full" :class="false ? '' : 'text-left'">
                Hello 1
            </p>
            <p v-else class="w-full bg-white" :class="false ? '' : 'text-left'">
                <img class="w-[200px] object-cover" src="/test.png">
            </p>
            <span class="text-xs ">10:20</span>
        </div>
    </div>
</template>