// src/stores/userDataStore.js
import { defineStore } from 'pinia'
import api from '@/api/axios'

const LOCAL_KEY = 'pinup_user'

export const useUserDataStore = defineStore('userData', {
    state: () => ({
        user: null,   // { id, username, nickname, profileImageUrl }
    }),

    getters: {
        userId: (state) => state.user?.id ?? null,
    },

    actions: {
        // 로그인 직후 등에서 호출
        setUser(user) {
            this.user = user
            try {
                localStorage.setItem(LOCAL_KEY, JSON.stringify(user))
            } catch (e) {
                console.error('localStorage set 실패:', e)
            }
        },

        // 앱 시작 시 main.js에서 한 번 호출해두면 좋음
        loadFromLocalStorage() {
            try {
                const raw = localStorage.getItem(LOCAL_KEY)
                if (!raw) return
                this.user = JSON.parse(raw)
            } catch (e) {
                console.error('loadFromLocalStorage 실패:', e)
                this.user = null
            }
        },

        clearUserAndStorage() {
            this.user = null
            try {
                localStorage.clear()
            } catch (e) {
                console.error('localStorage clear 실패:', e)
            }
        },

        /**
         * 세션 기준으로 현재 로그인 상태 확인
         * - GET /api/users/me
         * - 200 + { id, username, nickname, profileImageUrl } → 로그인 O
         * - 401 → 로그인 X
         */
        async ensureLoggedIn() {
            try {
                const res = await api.get('/api/users/me', {
                    withCredentials: true,   // 세션 쿠키 포함
                })

                // 서버는 바로 CurrentUserResponse JSON을 반환
                const serverUser = res.data
                console.log('ME RESPONSE:', serverUser)

                if (!serverUser || !serverUser.id) {
                    this.clearUserAndStorage()
                    return false
                }

                const localUser = this.user

                // 로컬에 없거나 / id 불일치면 서버 기준으로 갈아끼우기
                if (!localUser || localUser.id !== serverUser.id) {
                    try {
                        localStorage.clear()
                    } catch (e) {
                        console.error('localStorage clear 실패:', e)
                    }

                    this.user = serverUser
                    try {
                        localStorage.setItem(LOCAL_KEY, JSON.stringify(serverUser))
                    } catch (e) {
                        console.error('localStorage set 실패:', e)
                    }
                }

                return true
            } catch (e) {
                console.error('ensureLoggedIn 에러:', e)

                // 세션 끊긴 상태
                if (e.response?.status === 401) {
                    this.clearUserAndStorage()
                    return false
                }

                this.clearUserAndStorage()
                return false
            }
        },
    },
})

