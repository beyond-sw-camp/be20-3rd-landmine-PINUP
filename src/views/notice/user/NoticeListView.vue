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
          <th>작성자</th>
          <th>작성일</th>
        </tr>
        </thead>

        <tbody>
        <tr v-for="notice in notices" :key="notice.id" @click="goToNoticeDetail(notice.id)">
          <td>{{ notice.id }}</td>
          <td>{{ notice.title }}</td>
          <td>{{ notice.author }}</td>
          <td>{{ notice.createdAt }}</td>
        </tr>
        </tbody>
      </table>
    </section>
  </main>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from 'vue-router';

const router = useRouter();

// Mock 데이터 (API 연결 전)
const notices = ref([
  { id: 3, title: "서버 점검 안내 (11/25)", author: "관리자", createdAt: "2025-11-24" },
  { id: 2, title: "v1.1 업데이트 안내", author: "관리자", createdAt: "2025-11-20" },
  { id: 1, title: "PINUP 서비스 정식 오픈!", author: "관리자", createdAt: "2025-11-15" },
]);

function goToNoticeDetail(id) {
  router.push(`/notices/${id}`);
}
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