import { createRouter, createWebHistory } from 'vue-router'
import { useUserDataStore } from '@/stores/userDataStore'

// 로그인 페이지들
import LoginView from '@/views/login/LoginView.vue'
import AdminLoginView from '@/views/login/AdminLoginView.vue'

// 사용자 영역 레이아웃 + 페이지
import AppLayout from '@/components/layouts/AppLayout.vue'
import HomeView from '@/views/user/HomeView.vue'
import MyPageView from '@/views/user/MyPageView.vue'

// 관리자 영역
import AdminDashboardView from '@/views/admin/AdminDashboardView.vue'
import AdminUsersView from '@/views/admin/AdminUsersView.vue'
import NoticeListView from '@/views/notice/user/NoticeListView.vue'
import NoticeDetailView from '@/views/notice/user/NoticeDetailView.vue'
import NoticeManageView from '@/views/notice/admin/NoticeManageView.vue'
import NoticePostView from '@/views/notice/admin/NoticePostView.vue'
import NoticeEditView from '@/views/notice/admin/NoticeEditView.vue'
import AdminNoticeDetailView from '@/views/notice/admin/AdminNoticeDetailView.vue'

// 포인트 영역
import PointHistoryView from '@/views/user/PointHistoryView.vue'

// feeds 영역
import FeedsHomeView from '@/views/feeds/FeedsHomeView.vue'
import FeedsWriteView from '@/views/feeds/FeedsWriteView.vue'

const routes = [
    // 사용자 로그인
    {
        path: '/login',
        component: LoginView,
    },

    // 관리자 로그인
    {
        path: '/admin/login',
        component: AdminLoginView,
    },

    // 사용자 레이아웃
    {
        path: '/',
        component: AppLayout,
        children: [
            { path: 'home', component: HomeView },
            { path: 'mypage', component: MyPageView },
            { path: 'notices', component: NoticeListView },
            { path: 'notices/:id', component: NoticeDetailView },
            { path: 'points', name: 'points', component: PointHistoryView },

            // feeds
            {
                path: 'feeds',
                name: 'feeds',
                component: FeedsHomeView,
            },
            {
                path: 'feeds/write',
                name: 'feeds-write',
                component: FeedsWriteView,
                meta: { requiresAuth: true },
            },
            {
                path: 'feeds/:feedId',
                name: 'feed-detail',
                component: () => import('@/views/feeds/FeedDetailView.vue'),
                props: true,
                meta: { requiresAuth: true },
            },
            {
                path: 'feeds/:feedId/edit',
                name: 'feed-edit',
                component: () => import('@/views/feeds/FeedsEditView.vue'),
                props: true,
                meta: { requiresAuth: true },
            },
        ],
    },

    // 관리자 전용
    {
        path: '/admin',
        children: [
            { path: 'dashboard', component: AdminDashboardView },
            { path: 'users', component: AdminUsersView },
            { path: 'notices', component: NoticeManageView },
            { path: 'notices/post', component: NoticePostView },
            { path: 'notices/edit/:id', component: NoticeEditView },
            { path: 'notices/:id', component: AdminNoticeDetailView },
        ],
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

// 전역 라우터 가드
router.beforeEach(async (to, from, next) => {
    const userStore = useUserDataStore()

    // 1) 인증 필요 없는 라우트면 통과
    if (!to.meta.requiresAuth) {
        return next()
    }

    // 2) 이미 Pinia에 유저 있으면 통과
    if (userStore.user?.id) {
        return next()
    }

    // 3) 없으면 서버 기준으로 한 번 확인
    let ok = false
    try {
        ok = await userStore.ensureLoggedIn()
    } catch (e) {
        console.error('router ensureLoggedIn 에러:', e)
        ok = false
    }

    // 4) 그래도 로그인 안 되어 있으면 로그인 페이지로
    if (!ok || !userStore.user?.id) {
        return next({
            path: '/login',
            query: { redirect: to.fullPath },
        })
    }

    // 5) 최종 통과
    next()
})

export default router


