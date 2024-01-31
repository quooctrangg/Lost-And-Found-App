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
    path: '/post-detail/:id',
    name: 'post-detail',
    component: () => import('../views/PostDetail.vue'),
    meta: { title: 'Chi tiết bài đăng' }
  },
  {
    path: '/manage',
    name: 'manage',
    component: () => import('../views/ManageView.vue'),
    meta: { title: 'Quản lý' },
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