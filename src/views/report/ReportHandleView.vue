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
              <span class="label">신고유저 ID</span>
              <div class="value-with-button">
                <p>{{ report.userId }}</p>
                <button @click="showUserModal(report.userId)" class="btn-small-approve">유저 정보 보기</button>
              </div>
            </div>
            <div class="inner-card">
              <span class="label">피드 ID</span>
              <div class="value-with-button">
                <p>{{ report.feedId }}</p>
                <button @click="showFeedModal(report.feedId)" class="btn-small-approve">피드 보기</button>
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

      <!-- 피드 상세 정보 모달 -->
      <el-dialog v-model="isFeedModalVisible" title="피드 상세 정보" width="500px" @closed="selectedFeed = null">
        <div v-if="selectedFeed" class="feed-modal-content">
          <h4>{{ selectedFeed.title }}</h4>
          <img v-if="selectedFeed.imageUrl" :src="selectedFeed.imageUrl" alt="피드 이미지" class="feed-image" />
          <p class="feed-content">{{ selectedFeed.content }}</p>
          <div class="feed-meta">
            <span>작성자: {{ selectedFeed.authorName }}</span>
            <span>좋아요: {{ selectedFeed.likeCount }}</span>
          </div>
        </div>
        <div v-else>
          <p>피드 정보를 불러오는 중...</p>
        </div>
        <template #footer>
          <el-button @click="isFeedModalVisible = false">닫기</el-button>
        </template>
      </el-dialog>

      <!-- 유저 상세 정보 모달 -->
      <el-dialog v-model="isUserModalVisible" title="신고 유저 정보" width="500px" @closed="selectedUser = null">
        <div v-if="selectedUser" class="user-modal-content">
          <div class="info-row"><span class="info-label">이름:</span> <span>{{ selectedUser.name }}</span></div>
          <div class="info-row"><span class="info-label">닉네임:</span> <span>{{ selectedUser.nickname }}</span></div>
          <div class="info-row"><span class="info-label">이메일:</span> <span>{{ selectedUser.email }}</span></div>
          <div class="info-row"><span class="info-label">로그인 타입:</span> <span>{{ selectedUser.loginType }}</span></div>
        </div>
        <div v-else>
          <p>유저 정보를 불러오는 중...</p>
        </div>
        <template #footer>
          <div class="modal-footer-actions">
            <el-button type="danger" class="btn-suspend" @click="handleSuspendUser">회원 정지하기</el-button>
            <el-button @click="isUserModalVisible = false">닫기</el-button>
          </div>
        </template>
      </el-dialog>
    </main>
  </div>
</template>

<script setup>
import AdminSidebar from "@/components/AdminSidebar.vue";
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from 'vue-router';
import * as reportApi from '@/api/report';
import { fetchFeedDetail } from "@/api/feeds.js";
import { getUserById, suspendUser } from "@/api/UserAdminApi.js";
import { ElMessage } from "element-plus";

const route = useRoute();
const router = useRouter();
const report = ref(null);
const reason = ref('');

// 피드 모달 관련 상태
const isFeedModalVisible = ref(false);
const selectedFeed = ref(null);

// 유저 모달 관련 상태
const isUserModalVisible = ref(false);
const selectedUser = ref(null);


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

async function showFeedModal(feedId) {
  if (!feedId) return;
  try {
    const response = await fetchFeedDetail(feedId);
    if (response.data && response.data.data) {
      selectedFeed.value = response.data.data;
      isFeedModalVisible.value = true;
    } else {
      throw new Error("유효하지 않은 피드 데이터 형식입니다.");
    }
  } catch (error) {
    console.error(`피드(id: ${feedId}) 정보를 불러오는 중 오류 발생:`, error);
    ElMessage.error("피드 정보를 불러오는 데 실패했습니다.");
  }
}

async function showUserModal(userId) {
  if (!userId) return;
  try {
    const response = await getUserById(userId);
    if (response.data) {
      selectedUser.value = response.data;
      isUserModalVisible.value = true;
    } else {
      throw new Error("유효하지 않은 사용자 데이터 형식입니다.");
    }
  } catch (error) {
    console.error(`사용자(id: ${userId}) 정보를 불러오는 중 오류 발생:`, error);
    ElMessage.error("사용자 정보를 불러오는 데 실패했습니다.");
  }
}

async function handleSuspendUser() {
  if (!selectedUser.value || !selectedUser.value.userId) {
    ElMessage.error("정지할 사용자 정보가 올바르지 않습니다.");
    return;
  }
  try {
    await suspendUser(selectedUser.value.userId);
    ElMessage.success(`사용자(ID: ${selectedUser.value.userId})가 성공적으로 정지되었습니다.`);
    isUserModalVisible.value = false;
  } catch (error) {
    console.error("사용자 정지 처리 중 오류 발생:", error);
    ElMessage.error("사용자 정지 처리 중 오류가 발생했습니다.");
  }
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

.feed-modal-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.feed-modal-content h4 {
  margin: 0;
  font-size: 18px;
}

.feed-image {
  width: 100%;
  max-height: 300px;
  object-fit: cover;
  border-radius: 8px;
}

.feed-content {
  font-size: 14px;
  white-space: pre-wrap; /* Preserve line breaks */
}

.feed-meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #666;
}

.user-modal-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
  font-size: 15px;
}

.info-row {
  display: flex;
  gap: 10px;
}

.info-label {
  font-weight: 600;
  color: #333;
  width: 100px;
}

.modal-footer-actions {
  display: flex;
  justify-content: space-between;
  width: 100%;
}
</style>
