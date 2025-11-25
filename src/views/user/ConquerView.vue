<template>
  <div class="conquer-page">
    <section class="conquer-shell">
      <header class="conquer-header">
        <div class="title-wrap">
          <span class="title-icon">🗺️</span>
          <div>
            <h1>지역 점령하기</h1>
            <p>원하는 구간을 정하고 미션을 시작하세요.</p>
          </div>
        </div>
        <button class="guide-btn" @click="openGuide">?</button>
      </header>

      <section class="info-panel">
        <ul>
          <li v-for="item in missionPlan" :key="item.label">
            <span class="pin">📍</span>
            <div class="pin-details">
              <span class="pin-label">{{ item.label }} :</span>
              <span class="pin-value">{{ item.value }}</span>
            </div>
          </li>
        </ul>
      </section>

      <section class="scene-card">
        <div class="scene">
          <div class="cloud cloud-one"></div>
          <div class="cloud cloud-two"></div>
          <div class="tree tree-left"></div>
          <div class="tree tree-right"></div>
          <img src="/images/standing.png" alt="정복자" class="hero" />
        </div>
        <button class="start-btn" @click="startConquest">점령 시작</button>
      </section>
    </section>
  </div>
</template>

<script setup>
const missionPlan = [
  { label: "점령 시작 위치", value: "시작 지점을 선택해주세요" },
  { label: "점령 완료시 예상 획득 포인트", value: "약 2,000P" },
  { label: "점령 종료 위치", value: "종료 지점을 선택해주세요" }
];

const openGuide = () => {
  alert("점령 미션 가이드는 추후 제공될 예정입니다.");
};

const startConquest = () => {
  alert("점령을 시작하려면 지도에서 구간을 먼저 설정하세요.");
};
</script>

<style scoped>
.conquer-page {
  width: 100%;
  min-height: 100%;
  padding: 36px 40px;
  background: #eceff6;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.conquer-shell {
  width: 100%;
  max-width: 760px;
  background: #ffffff;
  border-radius: 32px;
  padding: 32px 36px;
  box-shadow: 0 20px 50px rgba(46, 91, 255, 0.08);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.conquer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.title-wrap {
  display: flex;
  gap: 14px;
  align-items: center;
}

.title-icon {
  font-size: 32px;
}

.conquer-header h1 {
  margin: 0;
  font-size: 26px;
  color: #111827;
}

.conquer-header p {
  margin: 4px 0 0;
  color: #5f6b82;
  font-size: 14px;
}

.guide-btn {
  width: 38px;
  height: 38px;
  border-radius: 14px;
  background: #e7f0ff;
  color: #2667ff;
  border: none;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s ease, background 0.2s;
}

.guide-btn:hover {
  background: #d7e7ff;
  transform: translateY(-1px);
}

.info-panel {
  background: #fff;
  border-radius: 24px;
  padding: 20px 26px;
  box-shadow: 0 12px 35px rgba(17, 25, 40, 0.08);
  border: 1px solid #eff4ff;
}

.info-panel ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.info-panel li {
  display: flex;
  gap: 12px;
  font-size: 15px;
  color: #1f2937;
}

.pin {
  font-size: 18px;
}

.pin-details {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  font-weight: 500;
}

.pin-label {
  color: #8b94a7;
}

.pin-value {
  color: #111;
}

.scene-card {
  position: relative;
  border: 3px solid #1a8cff;
  border-radius: 26px;
  overflow: hidden;
  min-height: 330px;
  background: linear-gradient(
      180deg,
      #9ad9ff 0%,
      #70c1ff 60%,
      #51b15e 60%,
      #3a9e4f 76%,
      #ca733a 76%,
      #a44d28 100%
  );
  box-shadow: inset 0 6px 18px rgba(255, 255, 255, 0.25);
}

.scene {
  width: 100%;
  height: 100%;
  position: relative;
}

.cloud {
  position: absolute;
  width: 120px;
  height: 45px;
  background: #fff;
  border-radius: 45px;
  opacity: 0.8;
}

.cloud::after,
.cloud::before {
  content: "";
  position: absolute;
  background: #fff;
  border-radius: 50%;
}

.cloud::before {
  width: 60px;
  height: 60px;
  top: -20px;
  left: 15px;
}

.cloud::after {
  width: 50px;
  height: 50px;
  top: -18px;
  right: 12px;
}

.cloud-one {
  top: 30px;
  left: 50px;
}

.cloud-two {
  top: 70px;
  right: 80px;
}

.tree {
  position: absolute;
  width: 24px;
  height: 70px;
  background: #7c4a2d;
  bottom: 110px;
}

.tree::after {
  content: "";
  position: absolute;
  width: 110px;
  height: 110px;
  background: #3da652;
  border-radius: 50%;
  top: -80px;
  left: -42px;
  box-shadow: inset 0 8px 16px rgba(0, 0, 0, 0.15);
}

.tree-left {
  left: 70px;
}

.tree-right {
  right: 80px;
  transform: scale(0.85);
}

.hero {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 190px;
  transform: translate(-50%, -50%);
  image-rendering: pixelated;
  filter: drop-shadow(0 6px 10px rgba(0, 0, 0, 0.2));
}

.start-btn {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 32px;
  border-radius: 999px;
  border: none;
  background: #1a8cff;
  color: #fff;
  font-weight: 700;
  font-size: 16px;
  box-shadow: 0 8px 16px rgba(26, 140, 255, 0.35);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.start-btn:hover {
  transform: translateX(-50%) translateY(-2px);
  box-shadow: 0 12px 20px rgba(26, 140, 255, 0.4);
}

@media (max-width: 840px) {
  .conquer-shell {
    padding: 28px 24px;
  }

  .conquer-header h1 {
    font-size: 22px;
  }

  .scene-card {
    min-height: 280px;
  }
}
</style>
