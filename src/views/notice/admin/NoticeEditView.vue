<template>
  <div class="layout">
    <AdminSidebar />
    <main class="main">
      <div class="topbar">
        <div class="topbar-title">📢 공지사항 수정</div>
        <button class="logout-btn" @click="logout">로그아웃</button>
      </div>

      <section class="table-card">
        <form @submit.prevent="updateNotice" class="form-container">
          <div class="form-group">
            <input type="text" id="title" class="form-control" v-model="notice.noticeTitle" placeholder="공지사항 제목을 입력하세요" required>
          </div>
          <div class="form-group">
            <textarea id="content" class="form-control" rows="10" v-model="notice.noticeContent" placeholder="공지사항 내용을 입력하세요" required></textarea>
          </div>
          <div class="form-actions">
            <button type="submit" class="btn btn-save">수정</button>
            <button type="button" class="btn btn-cancel" @click="goToNoticeList">취소</button>
          </div>
        </form>
      </section>
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
const notice = ref({
  noticeId: null,
  noticeTitle: '',
  noticeContent: ''
});

const noticeId = route.params.id;

async function loadNotice() {
  try {
    const response = await noticeApi.getNoticeById(noticeId);
    notice.value = response.data;
  } catch (error) {
    console.error("공지사항 정보를 불러오는 중 오류가 발생했습니다.", error);
  }
}

async function updateNotice() {
  if (!notice.value.noticeTitle.trim() || !notice.value.noticeContent.trim()) {
    alert("제목과 내용을 모두 입력해주세요.");
    return;
  }

  try {
    await noticeApi.updateNotice(notice.value);
    alert("공지사항이 성공적으로 수정되었습니다.");
    router.push('/admin/notices');
  } catch (error) {
    console.error("공지사항 수정 중 오류가 발생했습니다.", error);
    alert("수정 중 오류가 발생했습니다.");
  }
}

function goToNoticeList() {
  router.push('/admin/notices');
}

function logout() {
  window.location.href = "/logout";
}

onMounted(loadNotice);
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
}

.form-container {
  margin-top: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #555;
}

.form-control {
  width: 100%;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s;
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

.btn-save {
  background: linear-gradient(135deg, #3AC45D, #2FA84E);
}
.btn-save:hover {
  background: linear-gradient(135deg, #319C4A, #27823F);
}

.btn-cancel {
  background: linear-gradient(135deg, #888, #666);
}
.btn-cancel:hover {
  background: linear-gradient(135deg, #777, #555);
}
</style>
