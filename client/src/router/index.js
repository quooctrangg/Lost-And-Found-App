import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/user.store'

const routes = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
    meta: { title: 'Trang Chủ' }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue'),
    meta: { title: 'Đăng Nhập' }
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/RegisterView.vue'),
    meta: { title: 'Đăng Ký' }
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: () => import('../views/ForgotPasswordView.vue'),
    meta: { title: 'Quên Mật Khẩu' }
  },
  {
    path: '/me',
    name: 'me',
    component: () => import('../views/MeView.vue'),
    meta: { title: 'Thông tin cá nhân' },
    beforeEnter: (to, from, next) => {
      const userStore = useUserStore()
      if (!userStore.user?.id) next('login')
      else next()
    },
    children: [
      {
        path: '',
        name: 'post',
        component: () => import('../components/profile/Post.vue')
      },
      {
        path: 'request',
        name: 'request',
        component: () => import('../components/profile/Request.vue')
      }
    ]
  },
  {
    path: '/profile/:id',
    name: 'profile',
    component: () => import('../views/ProfileView.vue'),
    meta: { title: 'Thông tin cá nhân' },
    beforeEnter: (to, from, next) => {
      const userStore = useUserStore()
      if (!userStore.user?.id) next('login')
      else next()
    },
  },
  {
    path: '/chat',
    name: 'chat',
    component: () => import('../views/ChatView.vue'),
    meta: { title: 'Nhắn tin' },
    beforeEnter: (to, from, next) => {
      const userStore = useUserStore()
      if (!userStore.user?.id) next('login')
      else next()
    },
  },
  {
    path: '/post-detail/:id',
    name: 'post-detail',
    component: () => import('../views/PostDetail.vue'),
    meta: { title: 'Chi tiết bài đăng' },
    beforeEnter: (to, from, next) => {
      const userStore = useUserStore()
      if (!userStore.user?.id) next('login')
      else next()
    },
  },
  {
    path: '/manage',
    name: 'manage',
    component: () => import('../views/ManageView.vue'),
    meta: { title: 'Quản lý' },
    beforeEnter: (to, from, next) => {
      const userStore = useUserStore()
      if (!userStore.user?.id && userStore.user?.type != 0) next('login')
      else next()
    },
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('../components/manage/dashboard/DashboardManage.vue')
      },
      {
        path: 'users',
        name: 'user-manage',
        component: () => import('../components/manage/user/UserManage.vue')
      },
      {
        path: 'post',
        name: 'post-manage',
        component: () => import('../components/manage/post/PostManage.vue')
      },
      {
        path: 'item',
        name: 'item-manage',
        component: () => import('../components/manage/item/ItemManage.vue')
      },
      {
        path: 'location',
        name: 'location-manage',
        component: () => import('../components/manage/location/LocationManage.vue')
      },
      {
        path: 'school',
        name: 'school-manage',
        component: () => import('../components/manage/school/SchoolManage.vue')
      }
    ]
  },
  {
    path: '/confirm',
    component: () => import('../views/ConfirmUser.vue'),
    meta: { title: 'Xác nhận tài khoản' },
    beforeEnter: (to, from, next) => {
      const userStore = useUserStore()
      if (!userStore.user?.id) next('login')
      else next()
    },
  },
  {
    path: "/:pathMatch(.*)",
    name: "notfound",
    component: () => import("../views/NotFound.vue"),
    meta: { title: 'Không tìm thấy trang' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title;
  next();
});

export default router