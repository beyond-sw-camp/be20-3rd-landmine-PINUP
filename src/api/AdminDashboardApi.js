import axiosInstance from "@/api/axios.js";

// 관리자 대시보드 통계 조회 API
export async function fetchAdminStats() {
    const res = await axiosInstance.get("/admin/dashboard/stats");
    return res.data;
}

// 최근 가입 회원 조회 API
export async function fetchRecentUsers() {
    const res = await axiosInstance.get("/admin/dashboard/recent-users");
    return res.data;
}
