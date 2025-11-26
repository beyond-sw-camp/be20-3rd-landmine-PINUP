<template>
  <div class="layout">
    <AdminSidebar />

    <main class="main">
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
            <td>{{ item.price }} P</td>
            <td>{{ formatDate(item.createdAt) }}</td>

            <!-- 판매 정책 뱃지 ONLY -->
            <td>
                <span
                    v-if="item.limitType === 'LIMITED'"
                    class="policy-badge limited"
                >LIMIT</span>

              <span
                  v-else-if="item.limitType === 'EVENT'"
                  class="policy-badge event"
              >EVENT</span>

              <span v-else>
                  일반
                </span>
            </td>

            <!-- 판매중 / 중지됨 토글 -->
            <td>
              <button
                  class="status-toggle"
                  :class="item.isActive ? 'active' : 'disabled'"
                  @click="toggleStatus(item)"
              >
                {{ item.isActive ? "판매중" : "중지됨" }}
              </button>
            </td>

            <!-- 수정 / 삭제 -->
            <td>
              <button class="edit-btn" @click="openForm(item)">수정</button>
              <button class="delete-btn" @click="deleteItem(item.itemId)">삭제</button>
            </td>
          </tr>
          </tbody>
        </table>

        <!-- Pagination -->
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

      <!-- 등록 / 수정 모달 -->
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
import { AdminStoreApi } from "@/api/AdminStoreApi.js";
import StoreItemForm from "@/components/admin/StoreItemForm.vue";

const items = ref([]);
const page = ref(0);
const size = ref(10);
const totalPages = ref(0);

const showForm = ref(false);
const selectedItem = ref(null);

const formatDate = (d) =>
    d ? new Date(d).toISOString().slice(0, 10) : "-";

// 목록 가져오기
async function reload() {
  const res = await AdminStoreApi.getItems(page.value, size.value);
  items.value = res.items || [];
  totalPages.value = res.totalPages || 0;
}

// 페이지 이동
function changePage(p) {
  if (p < 0 || p >= totalPages.value) return;
  page.value = p;
  reload();
}

// 폼 열기
function openForm(item = null) {
  selectedItem.value = item;
  showForm.value = true;
}

// 폼 닫기
function closeForm() {
  showForm.value = false;
  selectedItem.value = null;
}

// 🔥 판매 상태 토글
async function toggleStatus(item) {
  const prev = item.isActive;
  const next = !prev;

  // optimistic UI
  item.isActive = next;

  try {
    await AdminStoreApi.updateItem(item.itemId, { isActive: next });
  } catch (e) {
    alert("상태 변경 실패");
    item.isActive = prev; // rollback
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

/* topbar */
.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
}

.register-btn {
  background: #3ac45d;
  color: white;
  padding: 10px 18px;
  border-radius: 20px;
  border: none;
  cursor: pointer;
  font-weight: 600;
}

/* table box */
.table-card {
  background: #ffffff;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
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

/* 판매 상태 토글 버튼 */
.status-toggle {
  padding: 6px 12px;
  border-radius: 16px;
  border: none;
  font-size: 13px;
  cursor: pointer;
  font-weight: 600;
}

.status-toggle.active {
  background: #e6ffef;
  color: #1fa04a;
}

.status-toggle.disabled {
  background: #ffe6e6;
  color: #d72727;
}

/* 판매 정책 뱃지 */
.policy-badge {
  padding: 6px 12px;
  border-radius: 14px;
  font-size: 12px;
  font-weight: 700;
  color: #fff;
}

.policy-badge.limited {
  background: #ef4444;
}

.policy-badge.event {
  background: #2563eb;
}

/* 관리 버튼 */
.edit-btn,
.delete-btn {
  padding: 6px 12px;
  border-radius: 8px;
  cursor: pointer;
  border: none;
  color: white;
  font-size: 12px;
}

.edit-btn {
  background: #3a8dff;
}

.delete-btn {
  background: #ff4f4f;
}

/* pagination */
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
}

.pagination .active {
  background: #5148c5;
  color: white;
}
</style>
