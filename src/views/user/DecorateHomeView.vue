<template>
  <div class="decorate-page">
    <div class="map-header">
      <div>
        <h1>지도 꾸미기</h1>
        <p>시/도를 선택해 자신만의 뱃지를 붙여보세요.</p>
      </div>
    </div>

    <div ref="mapContainer" class="decorate-map"></div>

    <transition name="fade">
      <button
          v-if="hoveredProvince"
          class="decorate-btn"
          :style="{ top: buttonPosition.top, left: buttonPosition.left }"
          @click="goDetail"
      >
        {{ hoveredProvince.name }} 꾸미기
      </button>
    </transition>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { koreaGeoJson } from "@/data/provinces.js";

const mapContainer = ref(null);
const hoveredProvince = ref(null);
const buttonPosition = reactive({ top: "0px", left: "0px" });
const router = useRouter();

let map;
let geoLayer;

const baseStyle = {
  color: "#c7cad3",
  weight: 2,
  fillColor: "#ffffff",
  fillOpacity: 0.9
};

const highlightStyle = {
  color: "#1a8cff",
  weight: 3,
  fillColor: "#e7f1ff",
  fillOpacity: 0.95
};

const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

const setButtonPosition = (latlng) => {
  if (!map) return;
  const point = map.latLngToContainerPoint(latlng);
  const container = map.getSize();
  const x = clamp(point.x, 80, container.x - 80);
  const y = clamp(point.y, 40, container.y - 40);
  buttonPosition.left = `${x - 60}px`;
  buttonPosition.top = `${y - 20}px`;
};

const goDetail = () => {
  if (!hoveredProvince.value) return;
  router.push(`/decorate/${hoveredProvince.value.id}`);
};

onMounted(() => {
  if (map) return;

  map = L.map(mapContainer.value, {
    zoomControl: false,
    scrollWheelZoom: false,
    doubleClickZoom: false,
    dragging: true,
    attributionControl: false
  }).setView([36.5, 127.8], 7);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 10,
    minZoom: 6
  }).addTo(map);

  const bounds = L.latLngBounds([33.0, 124.5], [39.5, 130.5]);
  map.setMaxBounds(bounds);
  map.on("drag", () => map.panInsideBounds(bounds, { animate: false }));

  const resetHighlight = (e) => {
    geoLayer.resetStyle(e.target);
    hoveredProvince.value = null;
  };

  const onEachFeature = (feature, layer) => {
    layer.on({
      mouseover: (e) => {
        e.target.setStyle(highlightStyle);
        hoveredProvince.value = feature.properties;
        setButtonPosition(e.target.getBounds().getCenter());
        e.target.bringToFront();
      },
      mouseout: resetHighlight
    });
  };

  geoLayer = L.geoJSON(koreaGeoJson, {
    style: baseStyle,
    onEachFeature
  }).addTo(map);
});

onUnmounted(() => {
  if (map) {
    map.remove();
    map = null;
  }
});
</script>

<style scoped>
.decorate-page {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 24px 32px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: linear-gradient(180deg, #f2f5ff 0%, #f8fbff 100%);
}

.map-header h1 {
  margin: 0;
  font-size: 28px;
  color: #111a2c;
}

.map-header p {
  margin: 4px 0 0;
  color: #5c6c89;
  font-size: 14px;
}

.decorate-map {
  flex: 1;
  width: 100%;
  border-radius: 28px;
  overflow: hidden;
  box-shadow: 0 20px 45px rgba(16, 56, 129, 0.1);
  min-height: 540px;
}

.decorate-btn {
  position: absolute;
  z-index: 999;
  background: #1a8cff;
  color: #fff;
  border: none;
  padding: 10px 18px;
  border-radius: 16px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 8px 18px rgba(26, 140, 255, 0.3);
  transition: transform 0.2s ease;
}

.decorate-btn:hover {
  transform: translateY(-2px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
