<template>
  <div class="layout">
    <AdminSidebar />
    <!-- Main -->
    <main class="main">
      <div class="topbar">
        <div class="topbar-title">👩‍💻 관리자 대시보드</div>
        <button class="logout-btn" @click="adminLogout">로그아웃</button>
      </div>

      <!-- 통계 -->
      <section class="stats-grid">
        <div class="stat-card">
          <p>전체 회원 수</p>
          <h2>{{ stats.userCount }}</h2>
        </div>
        <div class="stat-card">
          <p>오늘 가입한 회원</p>
          <h2>{{ stats.newUsersToday }}</h2>
        </div>
        <div class="stat-card">
          <p>전체 피드 수</p>
          <h2>{{ stats.feedCount }}</h2>
        </div>
        <div class="stat-card">
          <p>미처리 신고</p>
          <h2>{{ stats.reportPending }}</h2>
        </div>
      </section>

      <!-- 회원 리스트 -->
      <section class="table-card">
        <h3>📋 최근 가입 회원</h3>

        <table>
          <thead>
          <tr>
            <th>이름</th>
            <th>닉네임</th>
            <th>이메일</th>
            <th>가입일</th>
          </tr>
          </thead>

          <tbody>
          <tr v-for="user in recentUsers" :key="user.email">
            <td>{{ user.name }}</td>
            <td>{{ user.nickname }}</td>
            <td>{{ user.email }}</td>
            <td>{{ formatDate(user.createdAt) }}</td>
          </tr>
          </tbody>
        </table>

      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import AdminSidebar from "@/components/AdminSidebar.vue";
import router from "@/router/index.js";
import axios from "axios";

// 통계 데이터
const stats = ref({
  userCount: 0,
  newUsersToday: 0,
  feedCount: 0,
  reportPending: 0,
});

// 최근 가입 회원
const recentUsers = ref([]);

function formatDate(date) {
  return new Date(date).toISOString().slice(0, 10);
}

// API 호출 (연결 전이므로 임시 데이터 삽입 가능)
onMounted(() => {
  // API 미연결 → 임시 데이터
  stats.value = {
    userCount: 1280,
    newUsersToday: 12,
    feedCount: 5400,
    reportPending: 3,
  };

  recentUsers.value = [
    {
      name: "홍길동",
      nickname: "gildong",
      email: "test1@example.com",
      createdAt: "2025-11-01",
    },
    {
      name: "김영희",
      nickname: "yeong",
      email: "test2@example.com",
      createdAt: "2025-11-01",
    },
    {
      name: "박철수",
      nickname: "철수맨",
      email: "test3@example.com",
      createdAt: "2025-10-31",
    },
  ];
});

// 관리자 로그아웃
async function adminLogout() {
  await axios.post("http://localhost:8080/admin/logout");

  localStorage.removeItem("adminToken");

  window.location.href = "/admin/login";
}

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

/* 표 */
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

</style>