import axiosInstance from './axios'; // Assuming axiosInstance is exported from axios.js

const noticeApi = {
  // 공지사항 목록 조회
  getNotices() {
    return axiosInstance.get('http://localhost:8080/api/notices');
  },

  // 특정 공지사항 상세 조회
  getNoticeById(id) {
    return axiosInstance.get(`http://localhost:8080/api/notices/${id}`);
  },

  // 새 공지사항 생성 (관리자용)
  createNotice(noticeData) {
    return axiosInstance.post('http://localhost:8080/notices', noticeData);
  },

  // 공지사항 수정 (관리자용)
  updateNotice(noticeData) {
    return axiosInstance.patch('http://localhost:8080/notices', noticeData);
  },

  // 공지사항 삭제 (관리자용)
  deleteNotice(id) {
    return axiosInstance.delete(`http://localhost:8080/notices/${id}`);
  },
};

export default noticeApi;
