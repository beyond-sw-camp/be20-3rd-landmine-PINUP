import http from "./axios";

export const StoreApi = {
    // 홈 화면 4 + 4
    getHighlights(limitedSize = 4, latestSize = 4) {
        return http
            .get(`/store/items/highlights?limitedSize=${limitedSize}&latestSize=${latestSize}`)
            .then(res => res.data);
    },

    // 전체 아이템 페이지네이션
    getPagedItems(page = 0, size = 6) {
        return http
            .get(`/store/items/page?page=${page}&size=${size}`)
            .then(res => res.data);
    },

    // 아이템 구매
    buyItem(itemId) {
        return http
            .post(`/store/items/${itemId}/purchase`)
            .then(res => res.data);
    }
};