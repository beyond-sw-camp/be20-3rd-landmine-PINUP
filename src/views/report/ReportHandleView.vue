<template>
  <div class="layout">
    <AdminSidebar />
    <main class="main">
      <div class="topbar">
        <div class="topbar-title">🚨 신고 처리</div>
        <button class="logout-btn" @click="adminLogout">로그아웃</button>
      </div>

      <div v-if="report">
        <div class="top-cards-container">
          <!-- 신고 정보 카드 -->
          <section class="table-card info-card">
            <h3>신고 정보</h3>
            <div class="inner-card">
              <span class="label">신고 ID</span>
              <p>{{ report.reportId }}</p>
            </div>
            <div class="inner-card">
              <span class="label">처리 상태</span>
              <p :class="formatStatus(report.status).class">{{ formatStatus(report.status).text }}</p>
            </div>
            <div class="inner-card">
              <span class="label">신고 시간</span>
              <p>{{ formatDateTime(report.createdAt) }}</p>
            </div>
          </section>

          <!-- 신고 상세 카드 -->
          <section class="table-card info-card">
            <h3>신고 상세</h3>
            <div class="inner-card">
              <span class="label">신고자 ID</span>
              <div class="value-with-button">
                <p>{{ report.reporterId }}</p>
                <button @click="goToUser(report.userId)" class="btn-small-approve">유저 정보로 이동</button>
              </div>
            </div>
            <div class="inner-card">
              <span class="label">피드 ID</span>
              <div class="value-with-button">
                <p>{{ report.feedId }}</p>
                <button @click="goToFeed(report.feedId)" class="btn-small-approve">피드로 이동</button>
              </div>
            </div>
            <div class="inner-card reason-card">
              <span class="label">신고 사유</span>
              <p>{{ report.reason }}</p>
            </div>
          </section>
        </div>

        <!-- 하단 카드 -->
        <section class="table-card bottom-card">
          <h3>관리자 처리</h3>
          <div class="form-group">
            <textarea v-model="reason" class="form-control" rows="3" placeholder="처리 사유를 입력하세요..."></textarea>
          </div>
          <div class="form-actions">
            <button class="btn btn-approve" @click="handleApprove">신고 승인</button>
            <button class="btn btn-reject" @click="handleReject">신고 반려</button>
            <button class="btn btn-cancel" @click="goToList">목록으로</button>
          </div>
        </section>
      </div>
      <div v-else>
        <p>신고 정보를 불러오는 중입니다...</p>
      </div>
    </main>
  </div>
</template>

<script setup>
import AdminSidebar from "@/components/AdminSidebar.vue";
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from 'vue-router';
import * as reportApi from '@/api/report';

const route = useRoute();
const router = useRouter();
const report = ref(null);
const reason = ref('');

async function loadReport() {
  const reportId = route.params.id;
  try {
    const response = await reportApi.getReportById(reportId);
    report.value = response;
    if (response.adminStatement) {
      reason.value = response.adminStatement;
    }
  } catch (error) {
    console.error(`신고(id: ${reportId}) 정보를 불러오는 중 오류가 발생했습니다.`, error);
  }
}

async function handleApprove() {
  try {
    await reportApi.updateReportStatus({
      reportId: report.value.reportId,
      reportStatus: 'SUSPENDED',
      adminStatement: reason.value
    });
    alert('신고가 승인되었습니다.');
    router.push('/admin/reports');
  } catch (error) {
    console.error('신고 승인 중 오류 발생:', error);
  }
}

async function handleReject() {
  try {
    await reportApi.updateReportStatus({
      reportId: report.value.reportId,
      reportStatus: 'DELETED',
      adminStatement: reason.value
    });
    alert('신고가 반려되었습니다.');
    router.push('/admin/reports');
  } catch (error) {
    console.error('신고 반려 중 오류 발생:', error);
  }
}

function formatStatus(status) {
  switch (status) {
    case 'ACTIVE':
      return { text: '대기중', class: 'status-active' };
    case 'SUSPENDED':
      return { text: '처리됨(정지)', class: 'status-suspended' };
    case 'DELETED':
      return { text: '처리됨(반려)', class: 'status-deleted' };
    default:
      return { text: status, class: '' };
  }
}

function formatDateTime(timestamp) {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleString('ko-KR');
}

function goToList() {
  router.push('/admin/reports');
}

function goToUser(userId) {
  alert(`유저 정보 페이지로 이동: ${userId}`);
}

function goToFeed(feedId) {
  alert(`피드 페이지로 이동: ${feedId}`);
}

function adminLogout() {
  console.log("Logout clicked");
  router.push('/admin/login');
}

onMounted(loadReport);
</script>

<style scoped>
* { box-sizing: border-box; }

.layout {
  display: flex;
  min-height: 100vh;
}

.main {
  flex: 1;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 26px;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.topbar-title {
  font-size: 24px;
  font-weight: 700;
}

.logout-btn {
  background: #E74C3C;
  color: #fff;
  border: none;
  border-radius: 999px;
  padding: 10px 18px;
  cursor: pointer;
  transition: 0.2s;
  font-weight: 600;
}
.logout-btn:hover { background: #c0392b; }

h3 { margin-top: 0; }

.top-cards-container {
  display: flex;
  gap: 26px;
}

.info-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.table-card {
  background: #ffffff;
  border-radius: 26px;
  box-shadow: 0 14px 40px rgba(0, 0, 0, 0.08);
  padding: 24px;
}

.bottom-card {
  margin-top: 20px;
}

.inner-card {
  background-color: #e6f7ff;
  border-radius: 16px;
  padding: 16px;
  font-size: 14px;
}

.inner-card .label {
  font-size: 12px;
  color: #555;
  opacity: 0.7;
  margin-bottom: 4px;
  display: block;
}

.inner-card p {
  margin: 0;
  font-weight: 600;
}

.reason-card {
  background-color: #ffe6e6;
}

.status-active {
  color: #555555;
}

.status-suspended {
  color: #009900;
  font-weight: 600;
}

.status-deleted {
  color: #E74C3C;
  font-weight: 600;
}

.value-with-button {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.form-group {
  margin-bottom: 15px;
}

.form-control {
  width: 100%;
  padding: 10px 15px;
  margin-top: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.form-control::placeholder {
  font-family: 'Noto Sans KR', sans-serif;
  font-style: italic;
  color: #aaa;
}

.form-control:focus {
  border-color: #1A8CFF;
  outline: none;
}

.form-actions {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
}

.btn {
  padding: 10px 22px;
  border: none;
  border-radius: 999px;
  font-weight: 600;
  cursor: pointer;
  color: #fff;
  font-size: 14px;
  transition: all 0.25s ease;
  box-shadow: 0 4px 14px rgba(0,0,0,0.08);
}

.btn-approve {
  background: linear-gradient(135deg, #3AC45D, #2FA84E);
}
.btn-approve:hover {
  background: linear-gradient(135deg, #319C4A, #27823F);
}

.btn-small-approve {
  padding: 6px 14px;
  font-size: 12px;
  border-radius: 999px;
  font-weight: 600;
  cursor: pointer;
  color: #fff;
  transition: all 0.25s ease;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  background: linear-gradient(135deg, #3AC45D, #2FA84E);
  border: none;
}

.btn-small-approve:hover {
  background: linear-gradient(135deg, #319C4A, #27823F);
}

.btn-reject {
  background: linear-gradient(135deg, #E74C3C, #C0392B);
}
.btn-reject:hover {
  background: linear-gradient(135deg, #C0392B, #A93226);
}

.btn-cancel {
  background: linear-gradient(135deg, #888, #666);
}
.btn-cancel:hover {
  background: linear-gradient(135deg, #777, #555);
}
</style>
