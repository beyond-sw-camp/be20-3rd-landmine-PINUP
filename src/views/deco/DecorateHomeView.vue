<template>
  <div class="decorate-page">
    <div class="map-header">
      <div>
        <h1>지도 꾸미기</h1>
        <p>시/도를 선택해 자신만의 뱃지를 붙여보세요.</p>
      </div>
    </div>

    <div class="map-container">
      <div ref="mapContainer" class="decorate-map"></div>
      <div class="province-buttons">
        <button
          v-if="hoveredProvince"
          class="decorate-btn"
          :style="getButtonStyle(hoveredProvince.position, mapVersion)"
          @mouseenter="cancelHoverClear"
          @mouseleave="scheduleHoverClear"
          @click.stop="goDetail(hoveredProvince.id)"
        >
          {{ hoveredProvince.name }} 꾸미기
        </button>
      </div>

      <div class="zoom-controls">
        <button @click="zoomIn">+</button>
        <button @click="zoomOut">-</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import { useRouter } from "vue-router";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { koreaGeoJson } from "@/data/provinces.js";

const mapContainer = ref(null);
const hoveredProvince = ref(null);
const mapVersion = ref(0);
const router = useRouter();

let map;
let geoLayer;
let activeLayer = null;
let hoverTimeout = null;

const baseStyle = {
  color: "#c7cad3",
  weight: 2,
  fillColor: "#ffffff",
  fillOpacity: 0.9
};

const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

const setButtonPosition = (latlng) => {
  if (!map) return { top: "0px", left: "0px" };
  const point = map.latLngToContainerPoint(latlng);
  const container = map.getSize();
  const x = clamp(point.x, 80, container.x - 80);
  const y = clamp(point.y, 40, container.y - 40);
  return { top: `${y - 20}px`, left: `${x - 60}px` };
};

const getButtonStyle = (latlng, version) => {
  void version; // ensures reactivity on map move/zoom
  return setButtonPosition(latlng);
};

const goDetail = (provinceId) => {
  if (!provinceId) return;
  hoveredProvince.value = null;
  if (activeLayer) {
    resetHighlight(activeLayer);
    activeLayer = null;
  }
  router.push(`/decorate/${provinceId}`);
};

const zoomIn = () => {
  if (map) {
    map.zoomIn();
  }
};

const zoomOut = () => {
  if (map) {
    map.zoomOut();
  }
};

const resolveGeoJson = () => {
  if (typeof window === "undefined") {
    return koreaGeoJson;
  }
  return window.statesData ?? koreaGeoJson;
};

const getFeatureName = (feature) =>
  feature?.properties?.SIDO_NM ?? feature?.properties?.name ?? "미지정 지역";

const getFeatureProvinceId = (feature) =>
  feature?.properties?.provinceId ?? feature?.id ?? null;

const highlightFeature = (layer) => {
  layer.setStyle({
    weight: 3,
    color: "#1a8cff",
    fillColor: "#e3f2ff",
    fillOpacity: 0.8
  });
};

const resetHighlight = (layer) => {
  if (!geoLayer) return;
  geoLayer.resetStyle(layer);
};

const cancelHoverClear = () => {
  if (hoverTimeout) {
    clearTimeout(hoverTimeout);
    hoverTimeout = null;
  }
};

const scheduleHoverClear = () => {
  cancelHoverClear();
  hoverTimeout = setTimeout(() => {
    hoveredProvince.value = null;
    if (activeLayer) {
      resetHighlight(activeLayer);
      activeLayer = null;
    }
  }, 150);
};

onMounted(() => {
  if (map) return;

  map = L.map(mapContainer.value, {
    zoomControl: false,
    scrollWheelZoom: true,
    doubleClickZoom: false,
    dragging: true,
    attributionControl: false
  }).setView([36.5, 127.8], 7);

  const bumpVersion = () => {
    mapVersion.value += 1;
  };
  map.on("move", bumpVersion);
  map.on("zoom", bumpVersion);

  const onEachFeature = (feature, layer) => {
    const provinceId = getFeatureProvinceId(feature);
    if (!provinceId) return;
    layer.on({
      mouseover: (event) => {
        cancelHoverClear();
        if (activeLayer && activeLayer !== event.target) {
          resetHighlight(activeLayer);
        }
        activeLayer = event.target;
        highlightFeature(activeLayer);
        hoveredProvince.value = {
          id: provinceId,
          name: getFeatureName(feature),
          position: event.latlng
        };
      },
      mousemove: (event) => {
        cancelHoverClear();
        if (hoveredProvince.value?.id === provinceId) {
          hoveredProvince.value = {
            ...hoveredProvince.value,
            position: event.latlng
          };
        }
      },
      mouseout: () => {
        scheduleHoverClear();
      },
      click: () => goDetail(provinceId)
    });
  };
  geoLayer = L.geoJSON(resolveGeoJson(), {
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

.map-container {
  position: relative;
  width: 100%;
  flex: 1;
}

.decorate-map {
  flex: 1;
  width: 100%;
  border-radius: 28px;
  overflow: hidden;
  box-shadow: 0 20px 45px rgba(16, 56, 129, 0.1);
  min-height: 540px;
}

.zoom-controls {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.zoom-controls button {
  background: rgba(255, 255, 255, 0.9);
  border: none;
  width: 42px;
  height: 42px;
  font-size: 24px;
  font-weight: 700;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(18, 33, 83, 0.15);
  cursor: pointer;
  transition: transform 0.2s ease;
}

.zoom-controls button:hover {
  transform: translateY(-2px);
}

.province-buttons {
  position: absolute;
  inset: 0;
  pointer-events: none;
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
  pointer-events: auto;
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
