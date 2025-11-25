<template>
  <main class="main">
    <div class="topbar">
      <div class="topbar-title">📢 공지사항 상세</div>
    </div>

    <section v-if="notice" class="table-card">
      <hr class="notice-top-divider">
      <div class="notice-detail-header">
        <h2 class="notice-title">{{ notice.noticeTitle }}</h2>
        <div class="notice-meta">
          <span>관리자 {{ notice.adminId }}</span> |
          <span>{{ notice.createdAt }}</span>
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
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from 'vue-router';
import noticeApi from '@/api/notice';

const route = useRoute();
const router = useRouter();
const notice = ref(null);

async function loadNoticeDetail() {
  const noticeId = route.params.id;
  try {
    const response = await noticeApi.getNoticeById(noticeId);
    notice.value = response.data;
  } catch (error) {
    console.error(`공지사항(id: ${noticeId})을 불러오는 중 오류가 발생했습니다.`, error);
    // Optionally, redirect to a not-found page or show an error message
  }
}

function goToNoticeList() {
  router.push('/notices');
}

onMounted(loadNoticeDetail);
</script>

<style scoped>
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
  margin-bottom: 20px;
}

.topbar-title {
  font-size: 24px;
  font-weight: 700;
}

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