<template>
  <div class="layout">
    <!-- 관리자 사이드바 -->
    <AdminSidebar />

    <!-- Main -->
    <main class="main">
      <div class="topbar">
        <div class="topbar-title">👥 회원 관리</div>
        <button class="logout-btn" @click="logout">로그아웃</button>
      </div>

      <section class="table-card">
        <!-- 필터 버튼 -->
        <div class="filter-buttons">
          <button class="btn btn-all" @click="filterStatus('ALL')">전체 회원 보기</button>
          <button class="btn btn-suspended" @click="filterStatus('SUSPENDED')">정지된 회원 보기</button>
        </div>

        <!-- 회원 테이블 -->
        <table>
          <thead>
          <tr>
            <th>ID</th>
            <th>이름</th>
            <th>닉네임</th>
            <th>이메일</th>
            <th>상태</th>
            <th>관리</th>
          </tr>
          </thead>

          <tbody>
          <tr v-for="u in filteredUsers" :key="u.userId">
            <td>{{ u.userId }}</td>
            <td>{{ u.name }}</td>
            <td>{{ u.nickname }}</td>
            <td>{{ u.email }}</td>
            <td>{{ u.status }}</td>

            <td>
              <!-- ACTIVE → 정지 / 삭제 -->
              <template v-if="u.status === 'ACTIVE'">
                <button class="manage-btn suspend" @click="handleSuspend(u.userId)">정지</button>
                <button class="manage-btn delete" @click="handleDelete(u.userId)">삭제</button>
              </template>

              <!-- SUSPENDED → 활성화 / 삭제 -->
              <template v-else-if="u.status === 'SUSPENDED'">
                <button class="manage-btn activate" @click="handleActivate(u.userId)">활성화</button>
                <button class="manage-btn delete" @click="handleDelete(u.userId)">삭제</button>
              </template>
            </td>
          </tr>
          </tbody>

        </table>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import AdminSidebar from "@/components/AdminSidebar.vue";

// Mock 데이터 (API 연결 전)
const users = ref([
  { userId: 1, name: "홍길동", nickname: "gildong", email: "gil@example.com", status: "ACTIVE" },
  { userId: 2, name: "김철수", nickname: "chul", email: "chul@example.com", status: "SUSPENDED" },
  { userId: 3, name: "이영희", nickname: "heehee", email: "hee@example.com", status: "ACTIVE" },
]);

const filter = ref("ALL");

// 필터된 유저 목록
const filteredUsers = computed(() => {
  if (filter.value === "ALL") return users.value;
  return users.value.filter((u) => u.status === "SUSPENDED");
});

// 필터 버튼 클릭
function filterStatus(type) {
  filter.value = type;
}

// API 함수 임포트 (충돌 방지 위해 이름 변경)
import {
  fetchUsers,
  suspendUser as apiSuspendUser,
  activateUser as apiActivateUser,
  deleteUser as apiDeleteUser
} from "@/api/UserAdminApi.js";

// 사용자 리스트 다시 불러오기
async function reloadUsers() {
  users.value = await fetchUsers();
}

// 첫 로드 시 데이터 로드
onMounted(async () => {
  users.value = await fetchUsers();
});

// UI에서 호출되는 액션 핸들러
async function handleSuspend(id) {
  await apiSuspendUser(id);
  alert("정지 완료!");
  reloadUsers();
}

async function handleActivate(id) {
  await apiActivateUser(id);
  alert("활성화 완료!");
  reloadUsers();
}

async function handleDelete(id) {
  if (!confirm("정말 삭제하시겠습니까?")) return;
  await apiDeleteUser(id);
  alert("삭제 완료!");
  reloadUsers();
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

/* 필터 버튼 */
.filter-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 12px;
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

.btn-all {
  background: linear-gradient(135deg, #3AC45D, #2FA84E);
}
.btn-all:hover {
  background: linear-gradient(135deg, #319C4A, #27823F);
}

.btn-suspended {
  background: linear-gradient(135deg, #FF5858, #F09819);
}
.btn-suspended:hover {
  background: linear-gradient(135deg, #E14C4C, #D87F17);
}

/* 테이블 카드 */
.table-card {
  background: #ffffff;
  border-radius: 26px;
  box-shadow: 0 14px 40px rgba(0,0,0,0.08);
  padding: 24px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 16px;
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
  background: linear-gradient(135deg, #1A8CFF, #1274D9);
  transition: 0.2s;
}

.manage-btn:hover {
  background: linear-gradient(135deg, #0F6DD0, #0D5BB3);
}
</style>
