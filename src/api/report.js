import api from './axios';

/**
 * 신고 내역 목록 조회
 * GET /api/admin/reports
 */
export async function getReports() {
    const res = await api.get('http://localhost:8080/report');
    return res.data;
}

/**
 * 신고 상세 정보 조회
 * GET /api/admin/reports/{id}
 */
export async function getReportById(id) {
    const res = await api.get(`http://localhost:8080/report/${id}`);
    return res.data;
}

/**
 * 신고 메타데이터 조회 (전체 신고 수, 미처리 신고 수 등)
 * GET /api/admin/reports/metadata
 */
export async function getReportMetadata() {
    const res = await api.get('http://localhost:8080/report/info');
    return res.data;
}

/**
 * 신고 상태 변경 (승인/반려)
 * PATCH /report
 */
export async function updateReportStatus({ reportId, reportStatus, adminStatement }) {
    const res = await api.patch(`http://localhost:8080/report`, { reportId, reportStatus, adminStatement });
    return res.data;
}

/**
 * 피드를 신고합니다.
 * POST /report
 * @param {object} reportData - 신고 데이터
 * @param {number} reportData.userId - 신고하는 사용자 ID
 * @param {number} reportData.feedId - 신고할 피드 ID
 * @param {string} reportData.reason - 신고 사유
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export async function submitReport(reportData) {
  const res = await api.post('http://localhost:8080/report', reportData);
  return res.data;
}
