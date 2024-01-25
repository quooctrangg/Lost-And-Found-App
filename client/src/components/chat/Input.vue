<script setup>

</script>

<template>
    <div class="flex justify-between items-center bg-white">
        <input type="text" placeholder="Nhập tin nhắn ..."
            class="p-2 w-full border-none outline-none border-transparent focus:border-transparent focus:ring-0">
        <div class="flex gap-3 mx-2">
            <span>
                <label for="images">
                    <i class="fa-regular fa-image"></i>
                    <input type="file" name="images" id="images" accept="image/png, image/jpeg" hidden multiple>
                </label>
            </span>
            <span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" class="w-6 h-6 cursor-pointer">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
            </span>
        </div>
    </div>
</template>