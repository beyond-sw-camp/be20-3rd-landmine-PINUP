<template>
  <div class="layout">
    <Sidebar v-if="showSidebar" />
    <main class="main">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import Sidebar from "@/components/Sidebar.vue";
import { computed, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import sseService from '@/api/sseService.js';

const route = useRoute();
const showSidebar = computed(() => route.meta?.hideSidebar !== true);

// 컴포넌트가 마운트되면 SSE 연결 시작
onMounted(() => {
  sseService.connect();
});

// 컴포넌트가 언마운트되면 SSE 연결 종료
onUnmounted(() => {
  sseService.close();
});
</script>

<style>
.layout {
  display: flex;
  height: 100vh;
  width: 100%;
}

.main {
  flex: 1;
  height: 100%;
  overflow-y: auto;
}
</style>
