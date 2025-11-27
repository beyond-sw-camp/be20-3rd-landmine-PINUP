<template>
  <div class="province-page" :style="{ backgroundImage: `url(${activeProvince.heroImage})` }">
    <aside class="items-panel">
      <div class="items-header">
        <h2>내 아이템</h2>
        <p>{{ activeProvince.name }}에서 획득한 아이템</p>
        <p v-if="errorMessage" class="status-text error">{{ errorMessage }}</p>
        <p v-else-if="statusMessage" class="status-text" :class="statusType">{{ statusMessage }}</p>
      </div>

      <div
        class="items-scroll"
        v-if="!itemsLoading && items.length"
      >
        <article
          v-for="item in items"
          :key="item.itemId ?? item.id"
          class="item-card"
        >
          <img :src="item.image" :alt="item.name" />
          <div class="item-info">
            <p>{{ item.name }}</p>
            <button
              :disabled="itemsLoading || (!item.isEquipped && !selectedCoords)"
              :class="{ unequip: item.isEquipped }"
              @click="toggleEquip(item)"
            >
              {{ item.isEquipped ? "해제" : "장착" }}
            </button>
          </div>
        </article>
      </div>

      <div class="items-scroll empty-state" v-else-if="itemsLoading">
        <p>아이템을 불러오는 중입니다...</p>
      </div>
      <div class="items-scroll empty-state" v-else>
        <p>보유한 아이템이 없습니다.</p>
      </div>

      <button class="store-btn" @click="goStore">상점</button>
    </aside>

    <main class="province-stage" ref="stageRef" @click="selectCoordinate">
      <button class="back-btn" @click.stop="goBack">←</button>
      <div class="province-label">
        <img :src="heroImage" alt="캐릭터" />
        <span>{{ activeProvince.name }}</span>
      </div>

      <div class="coords-hint">
        <h3>배치 위치</h3>
        <p v-if="selectedCoords" class="coords-value">
          위도 {{ formattedCoords.latitude }} / 경도 {{ formattedCoords.longitude }}
        </p>
        <p v-else class="coords-muted">스테이지를 클릭해 위치를 선택하세요.</p>
        <p class="coords-sub">
          선택된 좌표를 기준으로 `/decorate/{itemId}` API가 호출됩니다.
        </p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import DecorateApi from "@/api/DecorateApi.js";
import { PROVINCES } from "@/data/provinces.js";

const props = defineProps({
  provinceId: {
    type: String,
    required: true
  }
});

const router = useRouter();
const resolvedProvince = computed(() => PROVINCES.find((p) => p.id === props.provinceId));
const activeProvince = computed(() => resolvedProvince.value ?? PROVINCES[0]);

const items = ref([]);
const itemsLoading = ref(false);
const errorMessage = ref("");
const statusMessage = ref("");
const statusType = ref("info");
const selectedCoords = ref(null);
const stageRef = ref(null);
const heroImage = `${import.meta.env.BASE_URL ?? "/"}images/1_standing.png`;

const pagination = ref({
  page: 0,
  size: 12,
  total: 0
});

const formattedCoords = computed(() => {
  if (!selectedCoords.value) return null;
  return {
    latitude: selectedCoords.value.y.toFixed(4),
    longitude: selectedCoords.value.x.toFixed(4)
  };
});

const fallbackItems = () => {
  const localItems = activeProvince.value?.items ?? [];
  return localItems.map((item, idx) => ({
    itemId: item.itemId ?? idx,
    name: item.name,
    image: item.image,
    isEquipped: false
  }));
};

const showStatus = (message, type = "info") => {
  statusMessage.value = message;
  statusType.value = type;
};

const loadItems = async () => {
  const currentProvince = resolvedProvince.value;
  if (!currentProvince?.sidoName) return;

  itemsLoading.value = true;
  errorMessage.value = "";
  try {
    const data = await DecorateApi.fetchRegionItems(currentProvince.sidoName, {
      page: pagination.value.page,
      size: pagination.value.size
    });
    const content = data?.content ?? [];
    items.value = content.map((item, idx) => ({
      itemId: item.itemId ?? item.id ?? idx,
      name: item.itemName ?? item.name ?? `아이템 ${idx + 1}`,
      image: item.imageUrl ?? item.image ?? "/images/seoul_backgound.png",
      isEquipped: item.isEquipped ?? false,
      coordinates: item.coordinates ?? null
    }));
    pagination.value.total = data?.totalElements ?? content.length;
  } catch (error) {
    console.error("Failed to fetch decorate items", error);
    errorMessage.value = error?.response?.data?.message ?? "아이템을 불러오지 못했습니다.";
    items.value = fallbackItems();
  } finally {
    itemsLoading.value = false;
  }
};

const selectCoordinate = (event) => {
  if (!stageRef.value) return;
  const bounds = activeProvince.value?.bounds;
  if (!bounds) return;

  const rect = stageRef.value.getBoundingClientRect();
  const relativeX = (event.clientX - rect.left) / rect.width;
  const relativeY = (event.clientY - rect.top) / rect.height;

  const x = Number((bounds.west + (bounds.east - bounds.west) * relativeX).toFixed(5));
  const y = Number((bounds.south + (bounds.north - bounds.south) * (1 - relativeY)).toFixed(5));
  selectedCoords.value = { x, y };
  showStatus("배치할 위치가 선택되었어요.", "info");
};

const toggleEquip = async (item) => {
  if (!item.itemId) {
    showStatus("아이템 정보를 찾을 수 없습니다.", "error");
    return;
  }

  try {
    if (item.isEquipped) {
      await DecorateApi.removeItem(item.itemId);
      item.isEquipped = false;
      item.coordinates = null;
      showStatus("아이템을 해제했어요.", "success");
      return;
    }

    if (!selectedCoords.value) {
      showStatus("먼저 배치할 위치를 클릭해주세요.", "error");
      return;
    }

    await DecorateApi.equipItem(item.itemId, selectedCoords.value);
    item.isEquipped = true;
    item.coordinates = selectedCoords.value;
    showStatus("아이템을 장착했어요.", "success");
  } catch (error) {
    console.error("Failed to toggle decorate item", error);
    showStatus(error?.response?.data?.message ?? "아이템 장착/해제에 실패했습니다.", "error");
  }
};

const goBack = () => {
  router.push("/decorate");
};

const goStore = () => {
  router.push("/store");
};

watch(
  () => resolvedProvince.value,
  (provinceValue) => {
    if (!provinceValue) {
      router.replace("/decorate");
      return;
    }
    selectedCoords.value = null;
    showStatus("", "info");
    loadItems();
  },
  { immediate: true }
);
</script>

<style scoped>
.province-page {
  display: flex;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  position: relative;
  overflow: hidden;
}

.items-panel {
  width: 320px;
  background: linear-gradient(180deg, #1a8cff 0%, #2e3edb 100%);
  color: #fff;
  padding: 32px 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  border-radius: 0 32px 32px 0;
}

.items-header h2 {
  margin: 0;
  font-size: 24px;
}

.items-header p {
  margin: 6px 0 0;
  opacity: 0.86;
  font-size: 13px;
}

.status-text {
  margin-top: 8px;
  font-size: 13px;
  font-weight: 600;
}

.status-text.success {
  color: #9fffc7;
}

.status-text.error {
  color: #ffd6d6;
}

.items-scroll {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding-right: 8px;
}

.item-card {
  background: #fdfdfd;
  border-radius: 18px;
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 14px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.15);
  color: #111;
}

.item-card img {
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: 12px;
}

.item-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  gap: 12px;
}

.item-info p {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
}

.item-info button {
  min-width: 68px;
  border: none;
  border-radius: 999px;
  padding: 6px 16px;
  background: linear-gradient(145deg, #2e3edb, #1a8cff);
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;
}

.item-info button.unequip {
  background: rgba(255, 255, 255, 0.2);
  color: #1a8cff;
}

.item-info button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.store-btn {
  border: none;
  border-radius: 999px;
  padding: 12px;
  background: #f0f4ff;
  color: #1a2ccf;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 10px 20px rgba(10, 18, 70, 0.25);
}

.province-stage {
  flex: 1;
  position: relative;
  padding: 32px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.back-btn {
  position: absolute;
  top: 32px;
  left: 32px;
  border: none;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  width: 42px;
  height: 42px;
  font-size: 20px;
  cursor: pointer;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25);
}

.province-label {
  margin-top: 6px;
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(255, 255, 255, 0.9);
  padding: 8px 32px;
  border-radius: 20px;
  font-size: 20px;
  font-weight: 700;
  color: #2a3a64;
}

.province-label img {
  width: 32px;
  height: 32px;
}

.coords-hint {
  position: absolute;
  bottom: 32px;
  left: 32px;
  background: rgba(255, 255, 255, 0.88);
  border-radius: 16px;
  padding: 16px 20px;
  max-width: 320px;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.15);
}

.coords-hint h3 {
  margin: 0 0 6px;
  font-size: 16px;
  color: #1a2ccf;
}

.coords-value {
  margin: 0;
  font-weight: 700;
  color: #111;
}

.coords-muted {
  margin: 0;
  color: #6b779c;
}

.coords-sub {
  margin: 8px 0 0;
  font-size: 12px;
  color: #5a6486;
}

.empty-state {
  align-items: center;
  justify-content: center;
  text-align: center;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
}
</style>
