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
            <th>작성일</th>
            <th>관리</th>
          </tr>
          </thead>

          <tbody>
          <tr v-for="notice in notices" :key="notice.noticeId" @click="goToNoticeDetail(notice.noticeId)" style="cursor: pointer;">
            <td>{{ notice.noticeId }}</td>
            <td>{{ notice.noticeTitle }}</td>
            <td>{{ notice.createdAt }}</td>
            <td>
              <button class="manage-btn edit" @click.stop="editNotice(notice.noticeId)">수정</button>
              <button class="manage-btn delete" @click.stop="deleteNotice(notice.noticeId)">삭제</button>
            </td>
          </tr>
          </tbody>
        </table>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from 'vue-router';
import AdminSidebar from "@/components/AdminSidebar.vue";
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

function goToDashboard() {
  router.push('/admin/dashboard');
}

function goToCreateNotice() {
  router.push('/admin/notices/post');
}

function goToNoticeDetail(id) {
  router.push(`/admin/notices/${id}`);
}

function editNotice(id) {
  router.push(`/admin/notices/edit/${id}`);
}

async function deleteNotice(id) {
  if (confirm(`공지사항 ${id}을(를) 정말 삭제하시겠습니까?`)) {
    try {
      await noticeApi.deleteNotice(id);
      alert(`공지사항 ${id}이(가) 삭제되었습니다.`);
      await loadNotices(); // 목록 새로고침
    } catch (error) {
      console.error(`공지사항(id: ${id}) 삭제 중 오류가 발생했습니다.`, error);
      alert("삭제 중 오류가 발생했습니다.");
    }
  }
}

// 로그아웃
function logout() {
  window.location.href = "/logout";
}

onMounted(loadNotices);
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