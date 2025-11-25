import { defineStore } from 'pinia'
import api from '@/api/axios'

const STORAGE_KEY = 'pinupUser'

export const useUserDataStore = defineStore('userData', {
    state: () => ({
        user: null, // { id, username, nickname, profileImageUrl }
    }),

    getters: {
        isLoggedIn: (state) => !!state.user,
        userId: (state) => state.user?.id ?? null,
    },

    actions: {
        setUser(user) {
            this.user = user
            localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
        },

        clearUser() {
            this.user = null
            localStorage.removeItem(STORAGE_KEY)
        },

        loadFromLocalStorage() {
            if (this.user) return

            const raw = localStorage.getItem(STORAGE_KEY)
            if (!raw) return

            try {
                const parsed = JSON.parse(raw)
                if (parsed && parsed.id) {
                    this.user = parsed
                }
            } catch (e) {
                console.warn('pinupUser 파싱 실패, localStorage 정리', e)
                localStorage.removeItem(STORAGE_KEY)
            }
        },

        async fetchFromSession() {
            try {
                // 기존에 알고 있던 유저 ID (메모리 or localStorage)
                let prevId = this.user?.id ?? null
                if (!prevId) {
                    const raw = localStorage.getItem(STORAGE_KEY)
                    if (raw) {
                        try {
                            const parsed = JSON.parse(raw)
                            prevId = parsed?.id ?? null
                        } catch {
                            // 무시
                        }
                    }
                }

                const res = await api.get('/api/users/me', {
                    withCredentials: true,
                })

                const current = res.data

                // ⚠ 세션 유저와 로컬에 알고 있던 유저가 다르면 위험 상태로 보고 싹 비움
                if (prevId && prevId !== current.id) {
                    console.warn('세션 유저와 로컬 유저 불일치 → 강제 로그아웃 처리')
                    this.clearUser()
                    return false
                }

                this.setUser(current)
                return true
            } catch (e) {
                // 세션이 없거나 만료된 경우
                this.clearUser()
                return false
            }
        },

        /**
         * 로그인 필요 액션 전에 호출하는 통합 체크
         * 1) Pinia 상태
         * 2) localStorage
         * 3) /api/users/me (세션)
         */
        async ensureLoggedIn() {
            if (this.isLoggedIn) return true

            this.loadFromLocalStorage()
            if (this.isLoggedIn) return true

            const ok = await this.fetchFromSession()
            return ok
        },
    },
})