import { useRouter } from 'vue-router'

export function useBack(defaultRoute = { name: 'home' }) {
    const router = useRouter()

    const back = () => {
        // 브라우저 히스토리가 있을 때만 뒤로가기
        if (window.history.length > 1) {
            router.back()
        } else {
            // 히스토리 없으면 지정한 기본 라우트로 이동
            router.push(defaultRoute)
        }
    }

    return { back }
}