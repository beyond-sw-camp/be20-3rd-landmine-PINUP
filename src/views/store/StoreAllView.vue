<template>
  <div class="store-all">
    <!-- ← 뒤로가기 -->
    <button class="back-btn" @click="router.back()">←</button>

    <!-- 상단 탭 영역 -->
    <div class="top-tabs-wrapper">
      <div class="top-tabs">
        <button class="tab-pill tab-main active">전체 아이템</button>

        <div class="tab-pill tab-dropdown">
          <select v-model="selectedCategory" class="category-select">
            <option value="general">일반 아이템</option>
            <option value="limited">기간 한정 아이템</option>
            <option value="event">이벤트 아이템</option>
          </select>
        </div>
      </div>
    </div>

    <!-- 아이템 목록 -->
    <div class="item-grid">
      <StoreItemCard
          v-for="item in items"
          :key="item.itemId || item.name"
          :item="item"
          @buy="openPopup"
      />
    </div>

    <!-- 페이지네이션 -->
    <div class="pagination">
      <button class="page-btn arrow" @click="prevPage" :disabled="page === 1">‹</button>

      <button
          v-for="n in totalPages"
          :key="n"
          class="page-btn"
          :class="{ active: n === page }"
          @click="loadPage(n)"
      >
        {{ n }}
      </button>

      <button class="page-btn arrow" @click="nextPage" :disabled="page === totalPages">›</button>
    </div>

    <!-- 구매 팝업 -->
    <ItemBuyPopup v-if="popupItem" :item="popupItem" @close="closePopup" />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { StoreApi } from "@/api/StoreApi";
import StoreItemCard from "@/components/store/StoreItemCard.vue";
import ItemBuyPopup from "@/components/store/ItemBuyPopup.vue";

const router = useRouter();

const page = ref(1);
const pageSize = 6;
const totalPages = ref(3);

const selectedCategory = ref("general");
const items = ref([]);

const ONE_DAY = 24 * 60 * 60 * 1000;
const ONE_WEEK = ONE_DAY * 7;

/* ⭐ itemType 생성 함수 */
function addItemType(item) {
  const now = Date.now();
  const created = new Date(item.createdAt).getTime();

  const isLimited = now - created <= ONE_WEEK;
  const isNew = now - created <= 3 * ONE_DAY;

  return {
    ...item,
    itemType:
        isLimited
            ? "LIMIT"
            : isNew
                ? "NEW"
                : item.isEvent
                    ? "EVENT"
                    : null
  };
}

/* ⭐ 더미 데이터 */
const dummyItems = [
  { itemId: 1, name: "제주 감귤 바구니", price: 1500, createdAt: new Date(), isEvent: false },
  { itemId: 2, name: "흑돼지 테고", price: 2000, createdAt: new Date(), isEvent: false },
  { itemId: 3, name: "한라산 미니오브제", price: 1800, createdAt: new Date(), isEvent: false },
  { itemId: 4, name: "제주 조랑말 피규어", price: 2400, createdAt: new Date(), isEvent: false },
  { itemId: 5, name: "제주 파도 배경", price: 1200, createdAt: new Date(), isEvent: false },
  { itemId: 6, name: "화산지형 엠블럼", price: 900, createdAt: new Date(), isEvent: false }
];


/* 구매 팝업 */
const popupItem = ref(null);
function openPopup(item) { popupItem.value = item; }
function closePopup() { popupItem.value = null; }

/* ⭐ 페이지 로딩 */
async function loadPage(p) {
  page.value = p;

  try {
    const data = await StoreApi.getPagedItems(p - 1, pageSize);

    if (data && Array.isArray(data.items) && data.items.length > 0) {
      items.value = data.items
          .map(addItemType)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      totalPages.value = data.totalPages || 3;
      return;
    }
  } catch (err) {
    console.error("StoreAllView API 오류:", err);
  }

  /* 백엔드 실패 시 더미 */
  items.value = dummyItems
      .map(addItemType)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  totalPages.value = 3;
}

function prevPage() {
  if (page.value > 1) loadPage(page.value - 1);
}

function nextPage() {
  if (page.value < totalPages.value) loadPage(page.value + 1);
}

/* 카테고리 변경 → 1페이지부터 */
watch(selectedCategory, () => {
  loadPage(1);
});

onMounted(() => {
  loadPage(1);
});
</script>

<style scoped>
/* ⭐ 기존 스타일 그대로 유지 */
.store-all {
  padding: 40px 80px 40px 60px;
  min-height: 100%;
  box-sizing: border-box;
}

.back-btn {
  background: none;
  border: none;
  font-size: 22px;
  cursor: pointer;
  margin-bottom: 10px;
}

.top-tabs-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 32px;
}

.top-tabs {
  display: flex;
  align-items: center;
  gap: 24px;
}

.tab-pill {
  min-width: 140px;
  padding: 10px 26px;
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  font-size: 14px;
  font-weight: 600;
  text-align: center;
}

.tab-main.active {
  background: #1A8CFF;
  color: #ffffff;
  border-color: #1A8CFF;
}

.tab-dropdown {
  position: relative;
  padding: 0;
}

.category-select {
  width: auto;
  min-width: 150px;
  max-width: 220px;
  border: none;
  outline: none;
  border-radius: 999px;
  padding: 10px 32px 10px 18px;
  font-size: 14px;
  font-weight: 600;
  appearance: none;
  background: #ffffff;
  cursor: pointer;
}

.tab-dropdown::after {
  content: "▾";
  position: absolute;
  right: 26px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 10px;
  color: #555;
}

.item-grid {
  margin-top: 12px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px 28px;
}

.pagination {
  margin-top: 32px;
  display: flex;
  justify-content: center;
  gap: 6px;
}

.page-btn {
  width: 30px;
  height: 30px;
  border-radius: 6px;
  border: none;
  background: #e5e7eb;
  font-size: 13px;
  cursor: pointer;
}

.page-btn.active {
  background: #7C3AED;
  color: #ffffff;
}

.page-btn.arrow {
  background: #f3f4f6;
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: default;
}
</style>
