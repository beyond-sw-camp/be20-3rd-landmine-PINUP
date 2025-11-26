<template>
  <aside class="sidebar">
    <div class="logo">
      <img src="/images/favicon-32.png" alt="로고" class="logo-icon" />
      PIN-UP
    </div>

    <nav class="sidebar-nav">
      <RouterLink to="/home" class="nav-item" :class="{ active: isActive('/home') }">
        <span class="icon"></span> 홈
      </RouterLink>

      <RouterLink to="/mypage" class="nav-item" :class="{ active: isActive('/mypage') }">
        <span class="icon"></span> 마이페이지
      </RouterLink>

      <RouterLink to="/decorate" class="nav-item" :class="{ active: isActive('/decorate') }">
        <span class="icon"></span> 지도 꾸미기
      </RouterLink>

      <RouterLink to="/feeds" class="nav-item" :class="{ active: isActive('/feeds') }">
        <span class="icon"></span> 피드
      </RouterLink>

      <RouterLink to="/store" class="nav-item" :class="{ active: isActive('/store') }">
        <span class="icon"></span> 상점
      </RouterLink>

      <RouterLink to="/notices" class="nav-item" :class="{ active: isActive('/notices') }">
        <span class="icon"></span> 공지사항
      </RouterLink>

      <!-- 알림 버튼 -->
      <div class="nav-item" id="notif-btn" @click="toggleNotif">
        <span class="icon"></span>
        알림
        <span class="notif-badge" v-show="notifications.length > 0">
          {{ notifications.length }}
        </span>

        <div class="notif-box" :class="{ show: notifOpen }">
          <div class="notif-header">알림</div>
          <ul id="notif-list">
            <li v-for="(item, idx) in notifications" :key="idx" :class="getNotificationItemClass(item)">
              {{ item.notificationMessage }} <!-- item.message에서 item.notificationMessage로 수정 -->
            </li>
            <li v-if="notifications.length === 0">알림이 없습니다.</li>
          </ul>
        </div>
      </div>
    </nav>

    <div class="sidebar-bottom">
      국내 여행 땅따먹기 서비스 PIN-UP
    </div>
  </aside>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute } from 'vue-router';
import { useNotificationStore } from '@/stores/notificationStore';

const route = useRoute();
const notifStore = useNotificationStore();

// 현재 경로 기반으로 active 메뉴 표시
const isActive = (path) => route.path.startsWith(path);

// Pinia 스토어의 notifications 상태를 computed로 가져와 반응성을 유지합니다.
const notifications = computed(() => notifStore.notifications);

// 알림창을 열고 닫는 상태
const notifOpen = ref(false);

const toggleNotif = () => {
  notifOpen.value = !notifOpen.value;
};

// 알림 타입에 따라 CSS 클래스를 반환하는 함수
const getNotificationItemClass = (item) => {
  switch (item.notificationType) {
    case 'SUSPEND':
      return 'notif-suspended';
    case 'REPORT_HANDLED':
      return 'notif-report-handled';
    default:
      return 'notif-default';
  }
};
</script>

<style scoped>
.sidebar {
  width: 250px;
  background: linear-gradient(180deg, #1A8CFF 0%, #1274D9 100%);
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
  background: rgba(255, 255, 255, 0.16);
  opacity: 1;
}

.sidebar-bottom {
  margin-top: auto;
  width: 100%;
  font-size: 12px;
  opacity: 0.7;
}

/* 알림 뱃지 */
.notif-badge {
  margin-left: 6px;
  background: #ff4d4f;
  color: white;
  font-size: 11px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 999px;
}

/* 알림 박스 */
.notif-box {
  position: absolute;
  top: 40px;
  left: 0;
  width: 260px;
  background: #fff;
  color: #333;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
  padding: 12px;
  display: none;
  flex-direction: column;
  z-index: 999;
}

.notif-box.show {
  display: flex;
  animation: notifFade 0.2s ease;
}

@keyframes notifFade {
  from { opacity: 0; transform: translateY(-6px); }
  to { opacity: 1; transform: translateY(0); }
}

#notif-list {
  list-style: none;
  margin: 0;
  padding: 0;
  max-height: 180px;
  overflow-y: auto;
}

#notif-list li {
  background: #f5f7fa;
  margin-bottom: 6px;
  padding: 8px 10px;
  border-radius: 8px;
  font-size: 13px;
}

/* 알림 타입별 스타일 */
#notif-list li.notif-suspended {
  background-color: #FFDDDD; /* 연한 빨간색 */
}

#notif-list li.notif-report-handled {
  background-color: #FFFFDD; /* 연한 노란색 */
}

#notif-list li.notif-default {
  background-color: #DDFFDD; /* 연한 초록색 */
}

@media (max-width: 1080px) {
  .sidebar {
    flex-direction: row;
    width: 100%;
    border-radius: 0 0 32px 32px;
    align-items: center;
    justify-content: space-between;
  }

  .sidebar-nav {
    flex-direction: row;
    flex-wrap: wrap;
  }
}

/* 사이드바 반응형 */
@media (max-width: 1080px) {
  .sidebar {
    width: 100%;
    height: auto;
    padding: 14px 20px;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    border-radius: 0 0 20px 20px;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
  }

  .sidebar-nav {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 6px;
  }

  .nav-item {
    padding: 8px 12px;
    font-size: 13px;
    border-radius: 12px;
  }

  body {
    padding-top: 90px;
  }
}
</style>
