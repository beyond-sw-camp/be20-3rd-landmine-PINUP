import api from './axios';

/**
 * 전체 회원 조회
 * GET /api/admin/users
 */
export async function fetchUsers({ page = 1, size = 20, keyword = '' } = {}) {
    const params = { page, size, keyword };

    const res = await api.get('/admin/users', { params });
    return res.data;
}

/**
 * 특정 사용자의 상세 정보를 조회합니다.
 * GET /api/user/{id}
 * @param {number} userId - 조회할 사용자 ID
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const getUserById = (userId) => {
  return api.get(`/api/admin/user/${userId}`);
};

/**
 * 회원 정지
 * POST /api/admin/users/{id}/suspend
 */
export async function suspendUser(id) {
    const res = await api.post(`/admin/users/${id}/suspend`);
    return res.data.data;
}

/**
 * 회원 활성화
 * POST /api/admin/users/{id}/activate
 */
export async function activateUser(id) {
    const res = await api.post(`/admin/users/${id}/activate`);
    return res.data.data;
}

/**
 * 회원 삭제
 * DELETE /api/admin/users/{id}
 */
export async function deleteUser(id) {
    const res = await api.delete(`/admin/users/${id}`);
    return res.data.data;
}
