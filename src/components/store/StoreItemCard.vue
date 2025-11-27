<template>
  <div class="item-card">

    <!-- ⭐ LIMIT / EVENT 뱃지 -->
    <div
        v-if="item.itemType === 'LIMIT' || item.itemType === 'EVENT'"
        class="badge-row"
    >
      <span class="badge" :class="item.itemType.toLowerCase()">{{ item.itemType }}</span>

      <!-- LIMIT 만 남은 기간 표시 -->
      <span v-if="item.itemType === 'LIMIT'" class="limit-remaining">{{ remainingDaysText }}</span>
    </div>

    <!-- ⭐ 카테고리 뱃지 -->
    <div class="category-row">
      <span class="badge" :class="categoryMeta.className">{{ categoryMeta.label }}</span>
    </div>

    <!-- 이미지 -->
    <div class="item-image">
      <img
          v-if="item.imageUrl"
          :src="item.imageUrl"
          alt="item image"
      />
      <div v-else class="no-image">No Image</div>
    </div>

    <!-- 정보 -->
    <div class="item-info">
      <div class="item-name">{{ item.name }}</div>
      <div class="item-price">{{ item.price }} P</div>
    </div>

    <!-- 구매 버튼 -->
    <button
        class="buy-btn"
        :disabled="isExpired"
        @click="buy"
    >
      {{ isExpired ? '기간 종료' : '구매하기' }}
    </button>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed } from "vue";

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(["buy"]);
function buy() {
  if (!isExpired.value) emit("buy", props.item);
}

/* -------------------------------------------------
   ⭐ 기간 계산
   createdAt + 7일 = 만료일
-------------------------------------------------- */
const ONE_DAY = 24 * 60 * 60 * 1000;

const CATEGORY_META = {
  MARKER: { label: "마커", className: "marker" },
  SPECIALTY: { label: "특산품", className: "specialty" },
  BUILDING: { label: "건물", className: "building" },
  TILE: { label: "타일", className: "tile" }
};

const categoryMeta = computed(() => CATEGORY_META[props.item.category] || {
  label: props.item.category || "기타",
  className: "default"
});

const remainingDaysText = computed(() => {
  if (!props.item.createdAt) return "";

  const created = new Date(props.item.createdAt).getTime();
  const now = Date.now();

  const end = created + 7 * ONE_DAY;           // 만료 시각
  const diff = end - now;

  if (diff <= 0) return "종료됨";              // 만료됨

  const days = Math.floor(diff / ONE_DAY);

  if (days === 0) return "오늘 마감";           // 오늘이 마지막날

  return `${days}일 남음`;
});

const isExpired = computed(() => remainingDaysText.value === "종료됨");
</script>

<style scoped>
.item-card {
  background: #ffffff;
  border-radius: 18px;
  padding: 18px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: 0.15s;
}

.item-card:hover {
  transform: translateY(-4px);
}

/* ⭐ LIMIT / EVENT 표시 영역 */
.badge-row {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
}

.category-row {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  margin-bottom: 8px;
}

.limit-remaining {
  font-size: 12px;
  color: #ef4444;
  font-weight: 600;
}

.badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 14px;
  font-size: 11px;
  font-weight: 700;
  color: #fff;
}

.badge.limit { background: #ef4444; }
.badge.event { background: #1f66ff; }

.badge.marker { background: #2563eb; }
.badge.specialty { background: #059669; }
.badge.building { background: #7c3aed; }
.badge.tile { background: #f59e0b; }
.badge.default { background: #6b7280; }

/* 이미지 */
.item-image {
  width: 150px;
  height: 110px;
  background: #f2f4f7;
  border-radius: 12px;
  margin-bottom: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
}

.no-image {
  color: #777;
  font-size: 14px;
}

/* 정보 */
.item-info {
  text-align: center;
  margin-bottom: 10px;
}

.item-name {
  font-weight: 600;
  margin-bottom: 4px;
}

.item-price {
  font-size: 14px;
  color: #555;
}

/* 구매 버튼 */
.buy-btn {
  width: 120px;
  background: #3b82f6;
  border: none;
  color: white;
  padding: 8px 0;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
}

.buy-btn:disabled {
  background: #b4b4b4;
  cursor: default;
}
</style>
