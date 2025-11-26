import api from './axios' // 이미 있는 axios 인스턴스 재사용

export const fetchFeedList = (params = {}) => {
    return api.get('/feeds/list', { params })
}

export const createFeed = (payload) => {
    return api.post('/feeds/write', payload)
}

export const fetchFeedDetail = (id) => {
    return api.get(`/feeds/view/${id}`)
}

export const updateFeed = (id, payload) => {
    return api.put(`/feeds/modify/${id}`, payload)
}

export const deleteFeed = (id) => {
    return api.delete(`/feeds/delete/${id}`)
}

export const likeFeed = (id) => {
    return api.post(`/feeds/${id}/likes`)
}