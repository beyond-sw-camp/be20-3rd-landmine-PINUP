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
            <td>{{ item.price }} 포인트</td>
            <td>{{ formatDate(item.createdAt) }}</td>
            <td>{{ item.limited }}</td>
            <td>
              <span class="status" :class="item.isActive ? 'active' : 'disabled'">
                {{ item.isActive ? '판매중' : '중지됨' }}
              </span>
            </td>
            <td>
              <button class="edit-btn" @click="openForm(item)">수정</button>
              <button class="delete-btn" @click="deleteItem(item.itemId)">삭제</button>
            </td>
          </tr>
          </tbody>
        </table>

        <!-- Pagination -->
        <div class="pagination">
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
          @saved="reload()"
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

const formatDate = (d) => new Date(d).toISOString().slice(0, 10);

async function reload() {
  const res = await AdminStoreApi.getItems(page.value, size.value);
  items.value = res.items;
  totalPages.value = res.totalPages;
}

function changePage(p) {
  if (p < 0 || p >= totalPages.value) return;
  page.value = p;
  reload();
}

function openForm(item = null) {
  selectedItem.value = item;
  showForm.value = true;
}

function closeForm() {
  selectedItem.value = null;
  showForm.value = false;
}

async function deleteItem(id) {
  if (!confirm("삭제하시겠습니까?")) return;
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

.status.active {
  color: #3ac45d;
  font-weight: 700;
}

.status.disabled {
  color: #ff5e5e;
  font-weight: 700;
}

/* buttons */
.edit-btn, .delete-btn {
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
