<template>
  <div class="province-page" :style="{ backgroundImage: `url(${province.heroImage})` }">
    <aside class="items-panel">
      <div class="items-header">
        <h2>내 아이템</h2>
        <p>{{ province.name }}에서 획득한 소장품</p>
      </div>

      <div class="items-scroll">
        <article
            v-for="item in province.items"
            :key="item.id"
            class="item-card"
        >
          <img :src="item.image" :alt="item.name" />
          <div class="item-info">
            <p>{{ item.name }}</p>
            <button>장착</button>
          </div>
        </article>
      </div>

      <button class="store-btn" @click="goStore">상점</button>
    </aside>

    <main class="province-stage">
      <button class="back-btn" @click="goBack">←</button>
      <div class="province-label">
        <img src="/images/standing.png" alt="캐릭터" />
        <span>{{ province.name }}</span>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { PROVINCES } from "@/data/provinces.js";

const props = defineProps({
  provinceId: {
    type: String,
    required: true
  }
});
const router = useRouter();

const province = computed(() => {
  const found = PROVINCES.find((p) => p.id === props.provinceId);
  return found ?? PROVINCES[0];
});

if (!PROVINCES.find((p) => p.id === props.provinceId)) {
  router.replace("/decorate");
}

const goBack = () => {
  router.push("/decorate");
};

const goStore = () => {
  router.push("/store");
};
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
  border: none;
  border-radius: 999px;
  padding: 6px 16px;
  background: linear-gradient(145deg, #2e3edb, #1a8cff);
  color: #fff;
  font-weight: 600;
  cursor: pointer;
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
</style>
