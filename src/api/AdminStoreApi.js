import http from "./axios";

export const AdminStoreApi = {

    // 관리자: 페이징 조회 (사용자용 API 재사용)
    getItems(page = 0, size = 10) {
        return http
            .get(`/store/items/page?page=${page}&size=${size}`)
            .then(res => res.data);
    },

    // 등록
    createItem(data) {
        return http
            .post(`/store/admin/items`, data)
            .then(res => res.data);
    },

    // 수정
    updateItem(itemId, data) {
        return http
            .patch(`/store/admin/items/${itemId}`, data)
            .then(res => res.data);
    },

    // 삭제
    deleteItem(itemId) {
        return http
            .delete(`/store/admin/items/${itemId}`)
            .then(res => res.data);
    }
};
