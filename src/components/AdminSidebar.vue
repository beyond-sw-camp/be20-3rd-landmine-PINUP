<template>
  <aside class="sidebar">
    <div class="logo">
      <img src="/images/favicon-32.png" alt="로고" class="logo-icon" />
      PIN-UP ADMIN
    </div>

    <nav class="sidebar-nav">
      <RouterLink to="/admin/dashboard" class="nav-item" :class="{ active: isActive('/admin/dashboard') }">
        <span class="icon"></span>홈
      </RouterLink>

      <RouterLink to="/admin/users" class="nav-item" :class="{ active: isActive('/admin/users') }">
        <span class="icon"></span>회원 관리
      </RouterLink>

      <RouterLink to="/admin/notices" class="nav-item" :class="{ active: isActive('/admin/notices') }">
        <span class="icon"></span>공지사항
      </RouterLink>

      <RouterLink to="/admin/reports" class="nav-item" :class="{ active: isActive('/admin/reports') }">
        <span class="icon"></span>신고 내역
      </RouterLink>

      <RouterLink to="/admin/store" class="nav-item" :class="{ active: isActive('/admin/store') }">
        <span class="icon"></span>상점 관리
      </RouterLink>
    </nav>

    <div class="sidebar-bottom">
      PIN-UP 관리자 페이지
    </div>
  </aside>
</template>

<script setup>
import { useRoute } from "vue-router";

const route = useRoute();
function isActive(path) {
  return route.path.startsWith(path);
}
</script>

<style scoped>
/* 사이드바 */
.sidebar {
  width: 250px;
  background: linear-gradient(180deg, #3AC45D 0%, #2FA84E 100%);
  color: #fff;
  padding: 28px 24px 32px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 28px;
  border-radius: 0 32px 32px 0;
}

.logo {
  font-weight: 800;
  font-size: 22px;
  letter-spacing: 0.06em;
}

.logo-icon {
  width: 28px;
  margin-right: 3px;
}

.sidebar-nav {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.nav-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 999px;
  font-size: 14px;
  opacity: 0.9;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  color: inherit;
}

.nav-item span.icon {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid #fff;
  display: inline-block;
}

.nav-item.active,
.nav-item:hover {
  background: rgba(255, 255, 255, 0.18);
  opacity: 1;
}

.sidebar-bottom {
  margin-top: auto;
  width: 100%;
  font-size: 12px;
  opacity: 0.7;
}

/* 반응형 */
@media (max-width: 1080px) {
  .sidebar {
    flex-direction: row;
    width: 100%;
    border-radius: 0 0 32px 32px;
    justify-content: space-between;
  }
  .sidebar-nav { flex-direction: row; flex-wrap: wrap; }
}
</style>
