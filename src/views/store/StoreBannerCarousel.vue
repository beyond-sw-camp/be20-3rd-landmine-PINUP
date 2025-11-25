<template>
  <div class="banner-wrapper">

    <!-- 왼쪽 버튼 -->
    <button class="nav-btn left" @click="prevBanner">
      <span>&lt;</span>
    </button>

    <!-- 배너 컨텐츠 -->
    <div class="banner-content">
      <h2>{{ banners[current].title }}</h2>
      <p>{{ banners[current].subtitle }}</p>

      <button class="action-btn" v-if="banners[current].buttonText">
        {{ banners[current].buttonText }}
      </button>
    </div>

    <!-- 오른쪽 버튼 -->
    <button class="nav-btn right" @click="nextBanner">
      <span>&gt;</span>
    </button>

  </div>
</template>

<script setup>
import { ref } from "vue";

// ⭐ 3개 배너 데이터
const banners = [
  {
    title: "🎁 주간 미션 보상 UP!",
    subtitle: "이번 주 미션 보상 포인트 2배 지급!",
    buttonText: "미션 도전",
  },
  {
    title: "🔥 신규 지역 업데이트",
    subtitle: "강원 · 전라 신규 지역이 추가되었습니다!",
    buttonText: "자세히 보기",
  },
  {
    title: "🌴 제주도 스페셜 이벤트",
    subtitle: "제주 방문 시 200 포인트 지급!",
    buttonText: "이벤트 보기",
  }
];

const current = ref(0);

function nextBanner() {
  current.value = (current.value + 1) % banners.length;
}

function prevBanner() {
  current.value = (current.value - 1 + banners.length) % banners.length;
}
</script>

<style scoped>
.banner-wrapper {
  background: linear-gradient(90deg, #2E89FF, #27D39F);
  color: white;
  padding: 32px;
  border-radius: 30px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 좌/우 버튼 */
.nav-btn {
  width: 40px;
  height: 40px;
  background: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  color: #333;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
}

.left { left: 16px; }
.right { right: 16px; }

/* 텍스트 */
.banner-content {
  text-align: center;
}

.banner-content h2 {
  margin: 0;
  margin-bottom: 6px;
  font-size: 26px;
  font-weight: 800;
}

.banner-content p {
  margin: 0;
  opacity: 0.9;
  font-size: 14px;
}

.action-btn {
  margin-top: 12px;
  padding: 8px 16px;
  background: #fff;
  color: #3B82F6;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  font-weight: 700;
}
</style>
