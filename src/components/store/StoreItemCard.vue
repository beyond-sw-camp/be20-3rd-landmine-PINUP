<template>
  <div class="item-card">

    <!-- ⭐ LIMIT / EVENT 뱃지 -->
    <div
        v-if="item.limitType === 'LIMITED' || item.limitType === 'EVENT'"
        class="badge-row"
    >
      <span class="badge" :class="limitClass">
        {{ limitLabel }}
      </span>

      <!-- LIMITED 일 때 남은 기간 -->
      <span v-if="item.limitType === 'LIMITED'" class="limit-remaining">
        {{ remainingDaysText }}
      </span>
    </div>

    <!-- ⭐ 카테고리 뱃지 -->
    <div class="category-row">
      <span class="badge" :class="categoryMeta.className">{{ categoryMeta.label }}</span>
    </div>

    <div class="item-image">
      <!-- ⭐ 정상 URL일 때만 이미지 표시 -->
      <img v-if="hasValidImage" :src="item.imageUrl" />

      <!-- ⭐ URL 없으면 이모지 -->
      <div v-else class="emoji-wrapper">
        <span class="emoji">{{ mappedEmoji }}</span>
      </div>
    </div>

    <div class="item-info">
      <div class="item-name">{{ item.name }}</div>
      <div class="item-price">{{ item.price }} P</div>
    </div>

    <button class="buy-btn" :disabled="isExpired" @click="buy">
      {{ isExpired ? '기간 종료' : '구매하기' }}
    </button>
  </div>
</template>

<script setup>
import { computed, defineProps, defineEmits } from "vue";

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

/* ------------------------------------
   ⭐ 판매 정책 뱃지
------------------------------------ */
const limitLabel = computed(() => {
  return props.item.limitType === "LIMITED" ? "LIMIT" :
      props.item.limitType === "EVENT"  ? "EVENT" : "";
});

const limitClass = computed(() =>
    props.item.limitType === "LIMITED" ? "limited" :
        props.item.limitType === "EVENT"  ? "event"   : ""
);

/* ------------------------------------
   ⭐ 카테고리 메타
------------------------------------ */
const CATEGORY_META = {
  MARKER:     { label: "마커",   className: "marker" },
  SPECIALTY:  { label: "특산품", className: "specialty" },
  BUILDING:   { label: "건물",   className: "building" },
  TILE:       { label: "타일",   className: "tile" }
};

const categoryMeta = computed(() =>
    CATEGORY_META[props.item.category] ||
    { label: props.item.category || "기타", className: "default" }
);

/* ------------------------------------
   ⭐ 이모지 매핑
------------------------------------ */
const EMOJI_MAP = {
  "서울 신라호텔": "🏨",
  "서울 롯데타워": "🗼",
  "전라도 거북선": "🚢",
  "제주 한라봉": "🍊",
  "강원도 감자": "🥔",
  "여수 포장마차": "🍢",
  "제주 조랑말": "🐴",
  // 기본
};

const mappedEmoji = computed(() => {
  return EMOJI_MAP[props.item.name] || "🛒";
});

/* ------------------------------------
   ⭐ URL 검증
------------------------------------ */
const hasValidImage = computed(() => {
  const url = props.item.imageUrl;
  if (!url) return false;
  return url.startsWith("http://") || url.startsWith("https://");
});

/* ------------------------------------
   ⭐ LIMITED 7일 남은 날짜
------------------------------------ */
const ONE_DAY = 24 * 60 * 60 * 1000;

const remainingDaysText = computed(() => {
  if (props.item.limitType !== "LIMITED") return "";
  if (!props.item.createdAt) return "";

  const created = new Date(props.item.createdAt).getTime();
  const diff = created + (7 * ONE_DAY) - Date.now();

  if (diff <= 0) return "종료됨";
  const days = Math.floor(diff / ONE_DAY);
  return days === 0 ? "오늘 마감" : `${days}일 남음`;
});

const isExpired = computed(() => remainingDaysText.value === "종료됨");
</script>

<style scoped>
/* → 디자인 절대 수정 안 함 (너가 준 원본 그대로) */
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

.item-card:hover { transform: translateY(-4px); }

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

.limited { background: #ef4444; }
.event   { background: #1f66ff; }

.marker     { background: #2563eb; }
.specialty  { background: #059669; }
.building   { background: #7c3aed; }
.tile       { background: #f59e0b; }
.default    { background: #6b7280; }

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

.emoji-wrapper { font-size: 48px; }
.emoji { font-size: 48px; }

.item-info { text-align: center; margin-bottom: 10px; }
.item-name { font-weight: 600; margin-bottom: 4px; }
.item-price { font-size: 14px; color: #555; }

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
