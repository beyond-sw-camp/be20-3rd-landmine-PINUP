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
          v-for="item in filteredItems"
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
import { ref, onMounted, watch, computed } from "vue";
import { useRouter } from "vue-router";
import { StoreApi } from "@/api/StoreApi";
import StoreItemCard from "@/components/store/StoreItemCard.vue";
import ItemBuyPopup from "@/components/store/ItemBuyPopup.vue";

const router = useRouter();

const page = ref(1);
const pageSize = 6;
const totalPages = ref(1);

const selectedCategory = ref("general");
const allItems = ref([]);

/* ⭐ LIMIT / EVENT / NORMAL 필터링 */
const filteredItems = computed(() => {
  return allItems.value
      .filter(item => {
        if (selectedCategory.value === "limited")
          return item.limitType === "LIMITED";

        if (selectedCategory.value === "event")
          return item.limitType === "EVENT";

        return true; // 일반 (전체)
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
});

/* 구매 팝업 */
const popupItem = ref(null);
function openPopup(item) { popupItem.value = item; }
function closePopup() { popupItem.value = null; }

/* 페이지 로딩 */
async function loadPage(p) {
  page.value = p;

  try {
    const data = await StoreApi.getPagedItems(page.value - 1, pageSize);

    if (data && Array.isArray(data.items)) {
      allItems.value = data.items;
      totalPages.value = data.totalPages || 1;
      return;
    }
  } catch (err) {
    console.error("StoreAllView API 오류:", err);
  }
}

function prevPage() {
  if (page.value > 1) loadPage(page.value - 1);
}

function nextPage() {
  if (page.value < totalPages.value) loadPage(page.value + 1);
}

watch(selectedCategory, () => {
  loadPage(1);
});

onMounted(() => {
  loadPage(1);
});
</script>

<style scoped>
/* → 디자인 절대 수정 X (원본 그대로) */
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
