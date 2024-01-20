import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
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
    path: '/profile',
    name: 'profile',
    component: () => import('../views/ProfileView.vue'),
    meta: { title: 'Thông tin cá nhân' },
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
    path: '/chat',
    name: 'chat',
    component: () => import('../views/ChatView.vue'),
    meta: { title: 'Nhắn tin' }
  },
  {
    path: "/:pathMatch(.*)",
    name: "notfound",
    component: () => import("../views/NotFound.vue")
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