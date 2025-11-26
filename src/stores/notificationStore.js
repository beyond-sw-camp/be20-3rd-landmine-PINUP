import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useNotificationStore = defineStore('notification', () => {
  // 상태: 알림 목록
  const notifications = ref([]);

  // 액션: 새 알림 추가 (가장 최신 알림이 위로 오도록 unshift 사용)
  function addNotification(notification) {
    notifications.value.unshift(notification);
  }

  // 액션: 특정 알림 제거 (예: 사용자가 알림을 클릭했을 때)
  function removeNotification(index) {
    notifications.value.splice(index, 1);
  }

  // 액션: 모든 알림 제거
  function clearNotifications() {
    notifications.value = [];
  }

  return {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications
  };
});
