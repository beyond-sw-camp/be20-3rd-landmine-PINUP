<template>
  <div class="store-home">

    <!-- ⭐ 상단 배너 -->
    <div class="banner-wrapper">
      <StoreBannerCarousel />
    </div>

    <!-- ⭐ 기간 한정 아이템 -->
    <section>
      <h3 class="section-title">✨ 기간 한정 아이템</h3>

      <div class="item-grid">
        <StoreItemCard
            v-for="item in limitedItems"
            :key="item.itemId"
            :item="item"
            @buy="openPopup"
        />
      </div>
    </section>

    <!-- ⭐ 최신 등록 아이템 -->
    <section class="latest-section">
      <div class="section-header">
        <h3 class="section-title">🆕 최신 등록 아이템</h3>
        <button class="show-more" @click="goToStoreAll">더보기 ></button>
      </div>

      <div class="item-grid">
        <StoreItemCard
            v-for="item in latestItems"
            :key="item.itemId"
            :item="item"
            @buy="openPopup"
        />
      </div>
    </section>

    <!-- ⭐ 구매 팝업 -->
    <ItemBuyPopup
        v-if="popupItem"
        :item="popupItem"
        @close="closePopup"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { StoreApi } from "@/api/StoreApi";
import StoreBannerCarousel from "@/views/store/StoreBannerCarousel.vue";
import StoreItemCard from "@/components/store/StoreItemCard.vue";
import ItemBuyPopup from "@/components/store/ItemBuyPopup.vue";

const router = useRouter();

const popupItem = ref(null);
function openPopup(item) {
  popupItem.value = item;
}
function closePopup() {
  popupItem.value = null;
}

const limitedItems = ref([]);
const latestItems = ref([]);

/* ⭐ NEW / LIMIT / EVENT 판단 */
const ONE_DAY = 24 * 60 * 60 * 1000;
const ONE_WEEK = ONE_DAY * 7;

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

onMounted(async () => {
  try {
    const data = await StoreApi.getHighlights(4, 4);

    /* ⭐ highlight 결과에 itemType 붙임 */
    limitedItems.value = data.limitedItems.map(addItemType);

    latestItems.value = data.latestItems
        .map(addItemType)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  } catch (err) {
    console.error("스토어 데이터 로딩 오류:", err);
  }

  /* ⭐ 더미에도 itemType 적용 */
  if (!limitedItems.value.length) {
    limitedItems.value = [
      { name: "아이템 이름", price: 1000, createdAt: new Date(), itemType: "LIMIT" },
      { name: "아이템 이름", price: 2000, createdAt: new Date(), itemType: "LIMIT" },
      { name: "아이템 이름", price: 3000, createdAt: new Date(), itemType: "LIMIT" },
      { name: "아이템 이름", price: 4000, createdAt: new Date(), itemType: "LIMIT" }
    ].map(addItemType);
  }

  if (!latestItems.value.length) {
    latestItems.value = [
      { name: "신규 아이템", price: 500, createdAt: new Date(), itemType: "NEW" },
      { name: "신규 아이템", price: 800, createdAt: new Date(), itemType: "NEW" },
      { name: "신규 아이템", price: 1200, createdAt: new Date(), itemType: "NEW" },
      { name: "신규 아이템", price: 1500, createdAt: new Date(), itemType: "NEW" }
    ]
        .map(addItemType)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
});

function goToStoreAll() {
  router.push("/store/all");
}
</script>

<style scoped>
/* ⭐ 네가 준 스타일 그대로 유지 */
.store-home {
  display: flex;
  flex-direction: column;
  gap: 36px;
  padding-right: 36px;
  padding-left: 36px;
}

.banner-wrapper {
  padding-right: 48px;
  padding-left: 48px;
  padding-top: 48px;
  margin-bottom: 20px;
}

.section-title {
  margin: 0 0 12px 4px;
  font-size: 18px;
  font-weight: 700;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.show-more {
  background: none;
  border: none;
  color: #3B82F6;
  cursor: pointer;
  font-size: 14px;
}

.item-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
}

.latest-section {
  margin-bottom: 48px;
}
</style>
