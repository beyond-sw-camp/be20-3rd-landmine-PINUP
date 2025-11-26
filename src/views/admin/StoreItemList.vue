<template>
  <div class="layout">
    <!-- 왼쪽 사이드바 -->
    <AdminSidebar />

    <!-- 오른쪽 메인 영역 -->
    <main class="main">
      <!-- 상단 -->
      <div class="topbar">
        <h2>🛒 상점 아이템 목록</h2>
        <button class="register-btn" @click="openForm()">아이템 등록</button>
      </div>

      <section class="table-card">
        <table>
          <thead>
          <tr>
            <th>번호</th>
            <th>아이템명</th>
            <th>가격</th>
            <th>등록일</th>
            <th>판매 정책</th>
            <th>상태</th>
            <th>관리</th>
          </tr>
          </thead>

          <tbody>
          <tr v-for="(item, idx) in items" :key="item.itemId">
            <td>{{ idx + 1 + page * size }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.price }} 포인트</td>
            <td>{{ formatDate(item.createdAt) }}</td>

            <!-- 판매 정책 뱃지 ONLY -->
            <td>
              <span v-if="item.limitType === 'LIMITED'" class="badge limit">LIMIT</span>
              <span v-else-if="item.limitType === 'EVENT'" class="badge event">EVENT</span>
              <span v-else>일반</span>
            </td>

            <!-- 판매중/중지 토글 -->
            <td>
              <button
                  class="status-toggle"
                  :class="item.isActive ? 'active' : 'disabled'"
                  @click="toggleStatus(item)"
              >
                {{ item.isActive ? '판매중' : '중지됨' }}
              </button>
            </td>

            <!-- 수정/삭제 -->
            <td>
              <button class="edit-btn" @click="openForm(item)">수정</button>
              <button class="delete-btn" @click="deleteItem(item.itemId)">삭제</button>
            </td>
          </tr>

          <!-- 목록 없음 -->
          <tr v-if="items.length === 0">
            <td colspan="7" class="empty-row">
              등록된 아이템이 없습니다.
            </td>
          </tr>
          </tbody>
        </table>

        <!-- 페이지네이션 -->
        <div class="pagination" v-if="totalPages > 0">
          <button @click="changePage(page - 1)" :disabled="page === 0">←</button>

          <button
              v-for="p in totalPages"
              :key="p"
              @click="changePage(p - 1)"
              :class="{ active: page === p - 1 }"
          >
            {{ p }}
          </button>

          <button @click="changePage(page + 1)" :disabled="page === totalPages - 1">→</button>
        </div>
      </section>

      <!-- 등록/수정 모달 -->
      <StoreItemForm
          v-if="showForm"
          :editItem="selectedItem"
          @close="closeForm"
          @saved="reload"
      />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import AdminSidebar from "@/components/AdminSidebar.vue";
import StoreItemForm from "@/components/admin/StoreItemForm.vue";
import { AdminStoreApi } from "@/api/AdminStoreApi.js";

// 상태
const items = ref([]);
const page = ref(0);
const size = ref(10);
const totalPages = ref(0);
const showForm = ref(false);
const selectedItem = ref(null);

// 날짜 포맷팅
function formatDate(d) {
  if (!d) return "-";
  return d.toString().slice(0, 10);
}

// 목록 로드
async function reload() {
  const res = await AdminStoreApi.getItems(page.value, size.value);
  items.value = res.items || [];
  totalPages.value = res.totalPages ?? 0;
}

// 페이지 이동
function changePage(p) {
  if (p < 0 || p >= totalPages.value) return;
  page.value = p;
  reload();
}

// 모달 열기
function openForm(item = null) {
  selectedItem.value = item;
  showForm.value = true;
}

// 모달 닫기
function closeForm() {
  selectedItem.value = null;
  showForm.value = false;
}

// 🔥 판매 상태 토글 로직
async function toggleStatus(item) {
  const prev = item.isActive;
  const next = !prev;

  // optimistic UI
  item.isActive = next;

  try {
    await AdminStoreApi.updateItem(item.itemId, { isActive: next });
  } catch (e) {
    console.error("토글 실패:", e);
    alert("상태 변경 실패");
    item.isActive = prev; // 롤백
  }
}

// 삭제
async function deleteItem(id) {
  if (!confirm("정말 삭제하시겠습니까?")) return;
  await AdminStoreApi.deleteItem(id);
  reload();
}

onMounted(reload);
</script>

<style scoped>
.layout {
  display: flex;
}

.main {
  flex: 1;
  padding: 32px;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.register-btn {
  background: #3ac45d;
  color: white;
  padding: 10px 18px;
  border-radius: 18px;
  font-weight: bold;
  border: none;
  cursor: pointer;
}

.table-card {
  background: white;
  padding: 28px;
  border-radius: 20px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  background: #f1f5ff;
  padding: 12px;
}

td {
  padding: 12px;
  border-bottom: 1px solid #eee;
  text-align: center;
}

.empty-row {
  padding: 32px 0;
  font-size: 14px;
  color: #777;
}

.status-toggle {
  padding: 6px 12px;
  border-radius: 20px;
  border: none;
  font-size: 12px;
  cursor: pointer;
  font-weight: bold;
}

.status-toggle.active {
  background: #e6ffef;
  color: #10a344;
}

.status-toggle.disabled {
  background: #ffe6e6;
  color: #e11d1d;
}

/* 판매 정책 뱃지 */
.badge {
  padding: 4px 8px;
  border-radius: 12px;
  color: white;
  font-size: 11px;
  font-weight: bold;
}

.badge.limit { background: #ef4444; }
.badge.event { background: #2563eb; }

/* 관리 버튼 */
.edit-btn,
.delete-btn {
  padding: 6px 12px;
  font-size: 12px;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.edit-btn { background: #3b82f6; margin-right: 4px; }
.delete-btn { background: #ef4444; }

/* 페이지네이션 */
.pagination {
  margin-top: 16px;
  text-align: center;
}

.pagination button {
  margin: 0 4px;
  padding: 6px 12px;
  border-radius: 8px;
  border: none;
  background: #e8e6ff;
  cursor: pointer;
  font-size: 12px;
}

.pagination .active {
  background: #5148c5;
  color: white;
}
</style>
