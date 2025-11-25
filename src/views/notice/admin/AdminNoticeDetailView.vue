<template>
  <div class="layout">
    <AdminSidebar />
    <main class="main">
      <div class="topbar">
        <div class="topbar-title">📢 공지사항 상세</div>
        <button class="logout-btn" @click="logout">로그아웃</button>
      </div>

      <section v-if="notice" class="table-card">
        <hr class="notice-top-divider">
        <div class="notice-detail-header">
          <h2 class="notice-title">{{ notice.noticeTitle }}</h2>
          <div class="notice-meta">
            <span>관리자 {{ notice.adminId }}</span> |
            <span>{{ formatDateTime(notice.createdAt) }}</span>
          </div>
        </div>
        <hr class="notice-bottom-divider">
        <div class="notice-content">
          <p>{{ notice.noticeContent }}</p>
        </div>

        <div class="form-actions">
          <button class="btn btn-cancel" @click="goToNoticeList">목록으로</button>
        </div>
      </section>
      <div v-else>
        공지사항을 불러오는 중입니다...
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from 'vue-router';
import AdminSidebar from "@/components/AdminSidebar.vue";
import noticeApi from '@/api/notice';

const route = useRoute();
const router = useRouter();
const notice = ref(null);

function formatDateTime(datetimeString) {
  if (!datetimeString) return '';
  const date = new Date(datetimeString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

async function loadNoticeDetail() {
  const noticeId = route.params.id;
  try {
    const response = await noticeApi.getNoticeById(noticeId);
    notice.value = response.data;
  } catch (error) {
    console.error(`공지사항(id: ${noticeId})을 불러오는 중 오류가 발생했습니다.`, error);
  }
}

function goToNoticeList() {
  router.push('/admin/notices');
}

function logout() {
  window.location.href = "/logout";
}

onMounted(loadNoticeDetail);
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

.table-card {
  background: #ffffff;
  border-radius: 26px;
  box-shadow: 0 14px 40px rgba(0, 0, 0, 0.08);
  padding: 24px;
  min-height: 400px;
  display: flex;
  flex-direction: column;
}

.notice-detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.notice-title {
  font-size: 22px;
  font-weight: 700;
  color: #333;
}

.notice-meta {
  font-size: 13px;
  color: #777;
}

.notice-top-divider {
  border: none;
  border-top: 3px solid #000;
  margin: 5px 0;
}

.notice-bottom-divider {
  border: none;
  border-top: 1px solid #000;
  margin: 5px 0;
}

.notice-content {
  flex-grow: 1;
  font-size: 15px;
  line-height: 1.6;
  color: #444;
  word-break: break-all;
  white-space: pre-wrap;
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

.btn-cancel {
  background: linear-gradient(135deg, #888, #666);
}
.btn-cancel:hover {
  background: linear-gradient(135deg, #777, #555);
}
</style>
