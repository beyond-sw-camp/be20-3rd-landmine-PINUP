import { createRouter, createWebHistory } from 'vue-router'

// 로그인 페이지들
import LoginView from '@/views/login/LoginView.vue'
import AdminLoginView from '@/views/login/AdminLoginView.vue'

// 사용자 영역
import AppLayout from '@/components/layouts/AppLayout.vue'
import HomeView from '@/views/user/HomeView.vue'
import MyPageView from '@/views/user/MyPageView.vue'

// 관리자 영역
import AdminDashboardView from '@/views/admin/AdminDashboardView.vue'
import AdminUsersView from "@/views/admin/AdminUsersView.vue";

// feeds
import FeedsHomeView from "@/views/feeds/FeedsHomeView.vue";
import FeedsWriteView from "@/views/feeds/FeedsWriteView.vue";

const routes = [
    // 사용자 로그인
    {
        path: '/login',
        component: LoginView
    },

    // 관리자 로그인
    {
        path: '/admin/login',
        component: AdminLoginView
    },

    // 사용자 전용 레이아웃
    {
        path: '/',
        component: AppLayout,
        children: [
            { path: 'home', component: HomeView },
            { path: 'mypage', component: MyPageView },
            // feeds
            {
                path: '/feeds',
                name : 'feeds',
                component : FeedsHomeView
            },
            {
                path: 'feeds/write',
                name: 'feeds-write',
                component: FeedsWriteView
            },
        ]
    },

    // 관리자 전용 라우트
    {
        path: '/admin',
        children: [
            { path: 'dashboard', component: AdminDashboardView },
            { path: 'users', component: AdminUsersView }
        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
