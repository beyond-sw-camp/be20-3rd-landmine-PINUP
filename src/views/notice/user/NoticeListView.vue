<template>
  <main class="main">
    <div class="topbar">
      <div class="topbar-title">📢 공지사항</div>
    </div>

    <section class="table-card">
      <table>
        <thead>
        <tr>
          <th>ID</th>
          <th>제목</th>
          <th>작성일</th>
        </tr>
        </thead>

        <tbody>
        <tr v-for="notice in notices" :key="notice.noticeId" @click="goToNoticeDetail(notice.noticeId)">
          <td>{{ notice.noticeId }}</td>
          <td>{{ notice.noticeTitle }}</td>
          <td>{{ notice.createdAt }}</td>
        </tr>
        </tbody>
      </table>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from 'vue-router';
import noticeApi from '@/api/notice';

const router = useRouter();
const notices = ref([]);

async function loadNotices() {
  try {
    const response = await noticeApi.getNotices();
    notices.value = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch (error) {
    console.error("공지사항을 불러오는 중 오류가 발생했습니다.", error);
  }
}

function goToNoticeDetail(id) {
  router.push(`/notices/${id}`);
}

onMounted(loadNotices);
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
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 12px 14px;
  text-align: center;
  border-bottom: 1px solid #eee;
  font-size: 13px;
}

th {
  background: #f1f5ff;
  color: #555;
  font-weight: 600;
}

tr {
    cursor: pointer;
}

tr:hover { background: #f9fbff; }
</style>