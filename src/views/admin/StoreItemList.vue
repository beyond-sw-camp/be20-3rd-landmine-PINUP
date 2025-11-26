<template>
  <div class="layout">
    <!-- 왼쪽 사이드바 (이미 다른 팀원이 만든 거) -->
    <AdminSidebar />

    <!-- 오른쪽 메인 영역 -->
    <main class="main">
      <!-- 상단 바 -->
      <div class="topbar">
        <h2>🛒 상점 아이템 목록</h2>
        <button class="register-btn" @click="openForm()">아이템 등록</button>
      </div>

      <!-- 테이블 카드 -->
      <section class="table-card">
        <table>
          <thead>
          <tr>
            <th>번호</th>
            <th>아이템명</th>
            <th>카테고리</th>
            <th>가격</th>
            <th>등록일</th>
            <th>판매 정책</th>
            <th>상태</th>
            <th>관리</th>
          </tr>
          </thead>

          <tbody>
          <tr v-for="(item, idx) in items" :key="item.itemId">
            <!-- 번호 -->
            <td>{{ idx + 1 + page * size }}</td>

            <!-- 이름 -->
            <td>{{ item.name }}</td>

            <!-- 카테고리 뱃지 -->
            <td>
              <span
                  class="category-badge"
                  :class="getCategoryMeta(item.category).className"
              >
                {{ getCategoryMeta(item.category).label }}
              </span>
            </td>

            <!-- 가격 -->
            <td>{{ item.price }} 포인트</td>

            <!-- 등록일 -->
            <td>{{ formatDate(item.createdAt) }}</td>

            <!-- 판매 정책 -->
            <td>
              <span
                  v-if="item.limitType === 'LIMITED'"
                  class="limit-badge limit"
              >
                LIMIT
              </span>
              <span
                  v-else-if="item.limitType === 'EVENT'"
                  class="limit-badge event"
              >
                EVENT
              </span>
              <span v-else>일반</span>
            </td>

            <!-- 상태 (판매중 / 중지 토글 버튼) -->
            <td>
              <button
                  class="status-toggle"
                  :class="item.isActive ? 'active' : 'disabled'"
                  @click="toggleStatus(item)"
              >
                {{ item.isActive ? '판매중' : '중지됨' }}
              </button>
            </td>

            <!-- 관리 (수정 / 삭제) -->
            <td>
              <button class="edit-btn" @click="openForm(item)">수정</button>
              <button class="delete-btn" @click="deleteItem(item.itemId)">삭제</button>
            </td>
          </tr>

          <!-- 아이템이 없을 때 -->
          <tr v-if="items.length === 0">
            <td colspan="8" class="empty-row">
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

          <button
              @click="changePage(page + 1)"
              :disabled="page === totalPages - 1"
          >
            →
          </button>
        </div>
      </section>

      <!-- 아이템 등록/수정 모달 -->
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

const items = ref([]);
const page = ref(0);
const size = ref(10);
const totalPages = ref(0);

const showForm = ref(false);
const selectedItem = ref(null);

// 카테고리 메타 정보 (라벨 + 클래스)
const CATEGORY_META = {
  MARKER: { label: "마커", className: "marker" },
  SPECIALTY: { label: "특산품", className: "specialty" },
  BUILDING: { label: "건물", className: "building" },
  TILE: { label: "타일", className: "tile" }
};

function getCategoryMeta(category) {
  return CATEGORY_META[category] || { label: category || "기타", className: "default" };
}

// 날짜 포맷팅
function formatDate(dateStr) {
  if (!dateStr) return "-";
  // createdAt 이 "2025-11-26T12:34:56" 형태라고 가정
  return dateStr.toString().slice(0, 10);
}

// 목록 다시 로드
async function reload() {
  const res = await AdminStoreApi.getItems(page.value, size.value);
  // 응답 형태가 { items, totalPages } 라고 가정
  items.value = res.items || [];
  totalPages.value = res.totalPages ?? 0;
}

// 페이지 변경
function changePage(p) {
  if (p < 0 || p >= totalPages.value) return;
  page.value = p;
  reload();
}

// 모달 열기 (item 이 있으면 수정, 없으면 등록)
function openForm(item = null) {
  selectedItem.value = item;
  showForm.value = true;
}

// 모달 닫기
function closeForm() {
  selectedItem.value = null;
  showForm.value = false;
}

// 상태 토글 (판매중 / 중지)
async function toggleStatus(item) {
  const newStatus = !item.isActive;

  await AdminStoreApi.updateItem(item.itemId, {
    isActive: newStatus
  });

  await reload();
}

// 삭제
async function deleteItem(id) {
  if (!confirm("정말 삭제하시겠습니까?")) return;
  await AdminStoreApi.deleteItem(id);
  await reload();
}

onMounted(reload);
</script>

<style scoped>
.layout {
  display: flex;
}

/* 오른쪽 메인 영역 */
.main {
  flex: 1;
  padding: 32px;
}

/* 상단바 */
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

/* 테이블 카드 */
.table-card {
  background: #ffffff;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  background: #f1f5ff;
  padding: 12px;
  text-align: center;
}

td {
  padding: 12px;
  border-bottom: 1px solid #eee;
  text-align: center;
}

.empty-row {
  padding: 40px 0;
  color: #888;
}

/* 상태 토글 버튼 */
.status-toggle {
  padding: 6px 12px;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
}

.status-toggle.active {
  background: #e6ffef;
  color: #1eaf4b;
}

.status-toggle.disabled {
  background: #ffe6e6;
  color: #e02424;
}

/* 카테고리 뱃지 */
.category-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 14px;
  font-size: 12px;
  font-weight: 700;
  color: #fff;
}

.category-badge.marker { background: #2563eb; }
.category-badge.specialty { background: #059669; }
.category-badge.building { background: #7c3aed; }
.category-badge.tile { background: #f59e0b; }
.category-badge.default { background: #6b7280; }

/* 판매 정책 뱃지 */
.limit-badge {
  display: inline-block;
  padding: 3px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  color: #fff;
}

.limit-badge.limit { background: #ef4444; }
.limit-badge.event { background: #1d4ed8; }

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
