import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import relativeTime from 'dayjs/plugin/relativeTime'
import MasonryWall from '@yeger/vue-masonry-wall'

import 'dayjs/locale/vi'
import 'vue-toast-notification/dist/theme-sugar.css';
import "@fortawesome/fontawesome-free/css/all.min.css"
import './assets/main.css'
import './assets/index.css'

dayjs.extend(localizedFormat)
dayjs.extend(relativeTime)
dayjs.locale('vi')

const pinia = createPinia()

pinia.use(piniaPluginPersistedstate)

createApp(App).use(pinia).use(router).use(MasonryWall).mount('#app')