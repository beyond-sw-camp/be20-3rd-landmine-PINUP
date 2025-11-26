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
        <div
          class="scene"
          :style="{ backgroundImage: `url(${currentScene.background})` }"
        >
          <img :src="currentScene.character" :alt="currentScene.alt" class="hero" />
        </div>
        <div class="mission-actions">
          <button
            v-if="showStartButton"
            class="start-btn"
            :disabled="actionLoading"
            @click="startConquest"
          >
            점령 시작
          </button>
          <button
            v-else-if="showFinishButton"
            class="finish-btn"
            :disabled="actionLoading"
            @click="finishConquest"
          >
            점령 종료
          </button>
          <button
            v-else-if="showRetryButton"
            class="retry-btn"
            :disabled="actionLoading"
            @click="resetConquest"
          >
            다시 도전
          </button>
        </div>
      </section>

      <section class="status-card" v-if="statusMessage">
        <p :class="statusType">{{ statusMessage }}</p>
      </section>
    </section>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useGeolocation } from "@vueuse/core";
import ConquerApi from "@/api/ConquerApi.js";

const sessionId = ref(null);
const startCoords = ref(null);
const endCoords = ref(null);
const statusMessage = ref("");
const statusType = ref("info");
const actionLoading = ref(false);
const geoTimeoutMs = 5000;
const conquestState = ref("idle");
const isGeoSupported = typeof window !== "undefined" && "geolocation" in navigator;

const sceneAsset = (filename) => `${import.meta.env.BASE_URL ?? "/"}images/${filename}`;

const SCENE_VARIANTS = {
  idle: {
    background: sceneAsset("1.png"),
    character: sceneAsset("1_standing.png"),
    alt: "준비 중인 캐릭터"
  },
  running: {
    background: sceneAsset("2.png"),
    character: sceneAsset("2_gif.gif"),
    alt: "점령 중인 캐릭터"
  },
  failure: {
    background: sceneAsset("3.png"),
    character: sceneAsset("3_failed.png"),
    alt: "점령 실패 캐릭터"
  },
  success: {
    background: sceneAsset("4.png"),
    character: sceneAsset("4_success.png"),
    alt: "점령 성공 캐릭터"
  }
};

const { coords, error: geoError, resume } = useGeolocation({
  enableHighAccuracy: true,
  maximumAge: 1000,
  timeout: 10000
});

const formatCoords = (coords, emptyMessage) => {
  if (!coords) return emptyMessage;
  const lat = coords.latitude.toFixed(4);
  const lng = coords.longitude.toFixed(4);
  return `${lat}, ${lng}`;
};

const currentScene = computed(() => SCENE_VARIANTS[conquestState.value] ?? SCENE_VARIANTS.idle);

const missionPlan = computed(() => [
  { label: "점령 시작 위치", value: formatCoords(startCoords.value, "시작 지점을 선택해주세요") },
  {
    label: "진행 상태",
    value:
      conquestState.value === "running"
        ? sessionId.value
          ? `진행 중 (세션 #${sessionId.value})`
          : "진행 중"
        : conquestState.value === "success"
          ? "정복 성공"
          : conquestState.value === "failure"
            ? "정복 실패"
            : "준비 완료"
  },
  { label: "점령 종료 위치", value: formatCoords(endCoords.value, "종료 지점을 선택해주세요") }
]);

const showStartButton = computed(() => conquestState.value === "idle" && !sessionId.value);
const showFinishButton = computed(() => conquestState.value === "running" && !!sessionId.value);
const showRetryButton = computed(
  () => ["success", "failure"].includes(conquestState.value) && !sessionId.value
);

const openGuide = () => {
  alert("점령 미션 가이드는 추후 제공될 예정입니다.");
};

const hasValidCoords = () =>
  Number.isFinite(coords.value.latitude) && Number.isFinite(coords.value.longitude);

const mapGeoError = (error) => {
  if (!error) {
    return "위치 정보를 가져오지 못했습니다. 잠시 후 다시 시도해주세요.";
  }
  const messages = {
    1: "위치 접근이 차단되었습니다. 주소창 왼쪽 자물쇠 아이콘을 눌러 '위치' 권한을 허용한 뒤 다시 시도해주세요.",
    2: "위치 정보를 확인할 수 없습니다. 네트워크 상태를 확인하고 다시 시도해주세요.",
    3: "위치 정보를 가져오는데 시간이 너무 오래 걸립니다. 조금 이동한 뒤 다시 시도해주세요."
  };
  return messages[error.code] ?? error.message ?? "위치 정보를 가져오지 못했습니다.";
};

const requestBrowserPosition = () =>
  new Promise((resolve, reject) => {
    if (!isGeoSupported) {
      reject(new Error("이 기기에서는 위치 정보를 사용할 수 없습니다."));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) =>
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
          //console.log(latitude, longitude)
        }),
      (err) => reject(new Error(mapGeoError(err))),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });

const waitForCoords = async () => {
  resume();
  if (hasValidCoords()) {
    return {
      latitude: coords.value.latitude,
      longitude: coords.value.longitude
    };
  }

  const start = performance.now();
  while (performance.now() - start < geoTimeoutMs) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    if (hasValidCoords()) {
      return {
        latitude: coords.value.latitude,
        longitude: coords.value.longitude
      };
    }
    if (geoError.value) break;
  }

  try {
    return await requestBrowserPosition();
  } catch (error) {
    const fallback = mapGeoError(geoError.value);
    const message = error instanceof Error && error.message ? error.message : fallback;
    throw new Error(message);
  }
};

const setStatus = (message, type = "info") => {
  statusMessage.value = message;
  statusType.value = type;
};

const setConquestState = (state) => {
  conquestState.value = state;
};

const resetConquest = () => {
  sessionId.value = null;
  startCoords.value = null;
  endCoords.value = null;
  setStatus("", "info");
  setConquestState("idle");
};

const startConquest = async () => {
  if (actionLoading.value) return;
  actionLoading.value = true;
  try {
    const coordsPayload = await waitForCoords();
    const data = await ConquerApi.start({
      latitude: coordsPayload.latitude,
      longitude: coordsPayload.longitude
    });
    sessionId.value = data?.sessionId ?? null;
    startCoords.value = coordsPayload;
    endCoords.value = null;
    setConquestState("running");
    setStatus("점령을 시작했습니다. 안전 운행하세요!", "success");
  } catch (error) {
    console.error("Failed to start conquest", error);
    setStatus(error?.response?.data?.message ?? error.message ?? "점령을 시작할 수 없습니다.", "error");
    if (!sessionId.value) {
      setConquestState("idle");
    }
  } finally {
    actionLoading.value = false;
  }
};

const finishConquest = async () => {
  if (actionLoading.value || !sessionId.value) return;
  actionLoading.value = true;
  try {
    const coordsPayload = await waitForCoords();
    const data = await ConquerApi.end({
      sessionId: sessionId.value,
      latitude: coordsPayload.latitude,
      longitude: coordsPayload.longitude
    });
    endCoords.value = coordsPayload;
    const status = data?.status ?? "FAILED";
    setStatus(data?.message ?? "점령 종료 결과를 확인했습니다.", status === "SUCCESS" ? "success" : "error");
    if (status === "SUCCESS") {
      sessionId.value = null;
      startCoords.value = null;
      setConquestState("success");
    }
    if (status !== "SUCCESS") {
      sessionId.value = null;
      startCoords.value = null;
      setConquestState("failure");
    }
  } catch (error) {
    console.error("Failed to end conquest", error);
    setStatus(error?.response?.data?.message ?? error.message ?? "점령 종료 중 오류가 발생했습니다.", "error");
    sessionId.value = null;
    startCoords.value = null;
    setConquestState("failure");
  } finally {
    actionLoading.value = false;
  }
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
  background: #f6f9ff;
  box-shadow: inset 0 6px 18px rgba(255, 255, 255, 0.25);
}

.scene {
  width: 100%;
  height: 100%;
  position: relative;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.hero {
  position: absolute;
  bottom: 24px;
  left: 50%;
  width: min(300px, 60%);
  transform: translateX(-50%);
  image-rendering: pixelated;
  filter: drop-shadow(0 6px 10px rgba(0, 0, 0, 0.2));
}

.mission-actions {
  display: flex;
  padding: 20px 24px 24px;
}

.start-btn,
.finish-btn,
.retry-btn {
  width: 100%;
  padding: 16px 20px;
  border: none;
  border-radius: 18px;
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.start-btn {
  background: linear-gradient(225deg, #ff6f61, #ff3e81);
  box-shadow: 0 10px 20px rgba(255, 110, 97, 0.3);
}

.finish-btn {
  background: #1a8cff;
  box-shadow: 0 10px 20px rgba(26, 140, 255, 0.3);
}

.retry-btn {
  background: linear-gradient(225deg, #6b7bff, #4e5de9);
  box-shadow: 0 10px 20px rgba(80, 102, 255, 0.3);
}

.start-btn:hover,
.finish-btn:hover,
.retry-btn:hover {
  transform: translateY(-2px);
}

.start-btn:disabled,
.finish-btn:disabled,
.retry-btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
  transform: none;
  box-shadow: none;
}

.status-card {
  margin-top: 12px;
  padding: 16px 20px;
  border-radius: 18px;
  background: #fff;
  border: 1px solid #dbe6ff;
  box-shadow: 0 8px 24px rgba(43, 72, 149, 0.08);
}

.status-card p {
  margin: 0;
  font-weight: 600;
}

.status-card .success {
  color: #1a8c4f;
}

.status-card .error {
  color: #c0374d;
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
