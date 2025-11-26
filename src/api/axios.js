import axios from "axios";
import router from "@/router/index.js";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true
});

// 응답 인터셉터 (Response Interceptor)
axiosInstance.interceptors.response.use(
    (response) => {
        // 정상 응답은 그대로 반환
        return response;
    },
    (error) => {
        // 에러 응답 처리
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            alert('인증이 만료되었거나 접근 권한이 없습니다. 다시 로그인해주세요.');
            // 현재 경로가 로그인 페이지가 아닐 경우에만 리다이렉트
            if (router.currentRoute.value.path !== '/login') {
                router.push('/login');
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
