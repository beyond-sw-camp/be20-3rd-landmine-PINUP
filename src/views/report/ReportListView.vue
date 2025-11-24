<template>
  <div class="layout">
    <AdminSidebar />
    <main class="main">
      <div class="topbar">
        <div class="topbar-title">🚨 신고 관리</div>
        <button class="logout-btn" @click="adminLogout">로그아웃</button>
      </div>

      <!-- 통계 -->
      <section class="stats-grid">
        <div class="stat-card">
          <p>전체 신고 수</p>
          <h2>{{ stats.totalReports }}</h2>
        </div>
        <div class="stat-card">
          <p>처리완료 신고 수</p>
          <h2>{{ stats.completedReports }}</h2>
        </div>
        <div class="stat-card">
          <p>미처리 신고 수</p>
          <h2>{{ stats.pendingReports }}</h2>
        </div>
        <div class="stat-card">
          <p>정지된 회원 수</p>
          <h2>{{ stats.suspendedUsers }}</h2>
        </div>
      </section>

      <section class="table-card">
        <h3>📋 신고 내역</h3>
        <table>
          <thead>
          <tr>
            <th>ID</th>
            <th>신고 내용</th>
            <th>신고일</th>
            <th>처리 상태</th>
          </tr>
          </thead>
          <tbody>
            <tr v-for="report in reports" :key="report.reportId" @click="goToReportDetail(report.reportId)" style="cursor: pointer;">
              <td>{{ report.reportId }}</td>
              <td>{{ report.reason }}</td>
              <td>{{ formatDate(report.createdAt) }}</td>
              <td :class="formatStatus(report.status).class">{{ formatStatus(report.status).text }}</td>
            </tr>
          </tbody>
        </table>
      </section>
    </main>
  </div>
</template>

<script setup>
import AdminSidebar from "@/components/AdminSidebar.vue";
import { ref, onMounted } from "vue";
import { useRouter } from 'vue-router';
import * as reportApi from '@/api/report';

const router = useRouter();

const stats = ref({
  totalReports: 0,
  completedReports: 0,
  pendingReports: 0,
  suspendedUsers: 0,
});

const reports = ref([]);

async function loadReportMetadata() {
  try {
    const response = await reportApi.getReportMetadata();
    stats.value.totalReports = response.total;
    stats.value.completedReports = response.total - response.active;
    stats.value.pendingReports = response.active;
    stats.value.suspendedUsers = response.suspended;
  } catch (error) {
    console.error("신고 메타데이터를 불러오는 중 오류가 발생했습니다.", error);
  }
}

async function loadReports() {
  try {
    const responseData = await reportApi.getReports();
    reports.value = responseData; // Directly assign the array
  } catch (error) {
    console.error("신고 목록을 불러오는 중 오류가 발생했습니다.", error);
    reports.value = []; // Ensure reports is an empty array on error
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

function formatDate(timestamp) {
  return timestamp ? timestamp.split('T')[0] : '';
}

function goToReportDetail(id) {
  router.push(`/admin/reports/${id}`);
}

function adminLogout() {
  // Implement logout logic
  console.log("Logout clicked");
  router.push('/admin/login');
}

onMounted(() => {
  loadReportMetadata();
  loadReports();
});
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

/* 통계 카드 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
}

.stat-card {
  background: #FFFFFF;
  border-radius: 26px;
  box-shadow: 0 14px 40px rgba(0, 0, 0, 0.08);
  padding: 20px;
  text-align: center;
}

.stat-card p {
  margin: 0;
  font-size: 13px;
  color: #555555;
}

.stat-card h2 {
  font-size: 28px;
  color: #3AC45D;
  font-weight: 800;
}

h3 { margin-top: 0; }

.table-card {
  background: #ffffff;
  border-radius: 26px;
  box-shadow: 0 14px 40px rgba(0, 0, 0, 0.08);
  padding: 24px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
  text-align: center;
}

th, td {
  padding: 12px 14px;
  text-align: center;
  border-bottom: 1px solid #eee;
  font-size: 13px;
}

th {
  background: #f1f5ff;
  color: #555555;
  font-weight: 600;
}

tr:hover {
  background: #f9fbff;
}

.status-active {
  color: #555555; /* Neutral color for active/pending */
}

.status-suspended {
  color: #009900; /* Blue for suspended */
  font-weight: 600;
}

.status-deleted {
  color: #E74C3C; /* Red for deleted */
  font-weight: 600;
}

.manage-btn {
  padding: 7px 16px;
  border-radius: 999px;
  font-size: 12.5px;
  font-weight: 600;
  border: none;
  color: white;
  margin: 2px;
  cursor: pointer;
  transition: 0.2s;
  background: linear-gradient(135deg, #1A8CFF, #1274D9);
}
.manage-btn:hover {
  background: linear-gradient(135deg, #0F6DD0, #0D5BB3);
}
</style>
