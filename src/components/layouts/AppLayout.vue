<template>
  <div class="layout">
    <Sidebar />
    <main class="main">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import Sidebar from "@/components/Sidebar.vue";
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
