import { createRouter, createWebHistory } from 'vue-router'

// 로그인 페이지들
import LoginView from '@/views/login/LoginView.vue'
import AdminLoginView from '@/views/login/AdminLoginView.vue'

// 사용자 영역
import AppLayout from '@/components/layouts/AppLayout.vue'
import HomeView from '@/views/user/HomeView.vue'
import MyPageView from '@/views/user/MyPageView.vue'

// 점령 및 지도꾸미기 영역
import DecorateHomeView from "@/views/deco/DecorateHomeView.vue";
import DecorateProvinceView from "@/views/deco/DecorateProvinceView.vue";
import ConquerView from "@/views/conquer/ConquerView.vue";

// 관리자 영역
import AdminDashboardView from '@/views/admin/AdminDashboardView.vue'
import AdminUsersView from "@/views/admin/AdminUsersView.vue";
import UserProfileView from "@/views/user/UserProfileView.vue";
import NoticeListView from '@/views/notice/user/NoticeListView.vue'
import NoticeDetailView from '@/views/notice/user/NoticeDetailView.vue'
import NoticeManageView from '@/views/notice/admin/NoticeManageView.vue'
import NoticePostView from '@/views/notice/admin/NoticePostView.vue'
import NoticeEditView from '@/views/notice/admin/NoticeEditView.vue'
import AdminNoticeDetailView from '@/views/notice/admin/AdminNoticeDetailView.vue'

// 포인트 영역
import PointHistoryView from "@/views/user/PointHistoryView.vue";
// 랭킹 영역
import MonthlyRankingView from "@/views/user/MonthlyRankingView.vue";

// feeds 영역
import FeedsHomeView from "@/views/feeds/FeedsHomeView.vue";
import FeedsWriteView from "@/views/feeds/FeedsWriteView.vue";
import ReportListView from '@/views/report/ReportListView.vue'
import ReportHandleView from '@/views/report/ReportHandleView.vue'
import StoreAllView from "@/views/store/StoreAllView.vue";
import StoreHomeView from "@/views/store/StoreHomeView.vue";


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
            { path: 'decorate', component: DecorateHomeView },
            { path: 'decorate/:provinceId', component: DecorateProvinceView, props: true, meta: { hideSidebar: true } },
            { path: 'conquer', component: ConquerView },
            { path: 'users/:userId', component: UserProfileView, props: true },
            { path: 'notices', component: NoticeListView },
            { path: 'notices/:id', component: NoticeDetailView },
            { path: 'points', name: 'points', component: PointHistoryView },
            { path: 'ranking', name: 'ranking', component: MonthlyRankingView},
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

            { path: 'store', name: 'store-home', component: StoreHomeView
            },

            { path: 'store/all', name: 'store-all', component: StoreAllView
            }


        ]
    },

    // 관리자 전용 라우트
    {
        path: '/admin',
        children: [
            { path: 'dashboard', component: AdminDashboardView },
            { path: 'users', component: AdminUsersView },
            { path: 'notices', component: NoticeManageView },
            { path: 'notices/post', component: NoticePostView },
            { path: 'notices/edit/:id', component: NoticeEditView },
            { path: 'notices/:id', component: AdminNoticeDetailView },
            { path: 'reports', component: ReportListView },
            { path: 'reports/:id', component: ReportHandleView },
            //{ path: 'store', component: AdminStoreView },
        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

import axiosInstance from "@/api/axios.js";
//import AdminStoreView from "@/views/admin/AdminStoreView.vue";

async function checkSession() {
    try {
        const res = await axiosInstance.get("/api/user/me");
        return res.data?.authenticated === true;
    } catch (e) {
        return false;
    }
}

router.beforeEach(async (to, from, next) => {

    // 루트 기본 접근 처리 > 로그인 상태에 따라 페이지 분기
    if (to.path === "/") {
        const isLogin = await checkSession();
        return isLogin ? next("/home") : next("/login");
    }

    // 관리자 페이지는 세션 체크하지 않고 통과
    if (to.path.startsWith("/admin")) {
        return next();
    }

    // 로그인 페이지는 무조건 허용
    if (to.path === "/login") {
        return next();
    }

    // 세션 없는 상태면 로그인 페이지로
    const userValid = await checkSession();
    return userValid ? next() : next("/login");
});

export default router
