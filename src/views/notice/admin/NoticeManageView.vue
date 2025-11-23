<template>
  <div class="layout">
    <AdminSidebar />
    <main class="main">
      <div class="topbar">
        <div class="topbar-title">📢 공지사항 관리</div>
        <button class="logout-btn" @click="logout">로그아웃</button>
      </div>

      <section class="table-card">
        <div class="action-buttons">
          <button class="btn btn-new" @click="goToCreateNotice">새 공지 등록</button>
          <button class="btn btn-dashboard" @click="goToDashboard">대시보드로 돌아가기</button>
        </div>
        
        <table>
          <thead>
          <tr>
            <th>ID</th>
            <th>제목</th>
            <th>작성자</th>
            <th>작성일</th>
            <th>관리</th>
          </tr>
          </thead>

          <tbody>
          <tr v-for="notice in notices" :key="notice.id">
            <td>{{ notice.id }}</td>
            <td>{{ notice.title }}</td>
            <td>{{ notice.author }}</td>
            <td>{{ notice.createdAt }}</td>
            <td>
              <button class="manage-btn edit" @click="editNotice(notice.id)">수정</button>
              <button class="manage-btn delete" @click="deleteNotice(notice.id)">삭제</button>
            </td>
          </tr>
          </tbody>
        </table>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from 'vue-router';
import AdminSidebar from "@/components/AdminSidebar.vue";

const router = useRouter();

// Mock 데이터 (API 연결 전)
const notices = ref([
  { id: 3, title: "서버 점검 안내 (11/25)", author: "관리자", createdAt: "2025-11-24" },
  { id: 2, title: "v1.1 업데이트 안내", author: "관리자", createdAt: "2025-11-20" },
  { id: 1, title: "PINUP 서비스 정식 오픈!", author: "관리자", createdAt: "2025-11-15" },
]);

function goToDashboard() {
  router.push('/admin/dashboard');
}

function goToCreateNotice() {
  router.push('/admin/notices/post');
}

function editNotice(id) {
  alert(`공지사항 ${id} 수정`);
  // TODO: 수정 페이지로 이동 또는 모달 열기
}

function deleteNotice(id) {
  if (confirm(`공지사항 ${id}을(를) 정말 삭제하시겠습니까?`)) {
    alert(`공지사항 ${id} 삭제`);
    // TODO: API 호출로 삭제 처리
  }
}

// 로그아웃
function logout() {
  window.location.href = "/logout";
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

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 20px;
}

.btn-new, .btn-dashboard {
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

.btn-new {
  background: linear-gradient(135deg, #3AC45D, #2FA84E);
}
.btn-new:hover {
  background: linear-gradient(135deg, #319C4A, #27823F);
}

.btn-dashboard {
  background: linear-gradient(135deg, #888, #666);
}
.btn-dashboard:hover {
  background: linear-gradient(135deg, #777, #555);
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

tr:hover { background: #f9fbff; }

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
}

.manage-btn.edit, .manage-btn.delete {
  background: linear-gradient(135deg, #1A8CFF, #1274D9);
}
.manage-btn.edit:hover, .manage-btn.delete:hover {
  background: linear-gradient(135deg, #0F6DD0, #0D5BB3);
}
</style>