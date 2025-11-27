import http from "./axios.js";

export const DecorateApi = {
  fetchRegionItems(sidoName, params = {}) {
    if (!sidoName) {
      return Promise.reject(new Error("시/도 정보가 없어 아이템을 불러올 수 없습니다."));
    }

    return http
      .get(`/decorate/regions/${encodeURIComponent(sidoName)}/items`, { params })
      .then((res) => res.data);
  },

  equipItem(itemId, coordinates) {
    return http.patch(`/decorate/${itemId}/add`, coordinates).then((res) => res.data);
  },

  removeItem(itemId) {
    return http.patch(`/decorate/${itemId}/delete`).then((res) => res.data);
  }
};

export default DecorateApi;
