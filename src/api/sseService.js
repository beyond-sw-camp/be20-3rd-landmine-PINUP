import { useNotificationStore } from '@/stores/notificationStore';

let eventSource;

const sseService = {
  connect() {
    // 이미 연결되어 있다면 중복 연결 방지
    if (eventSource && eventSource.readyState !== EventSource.CLOSED) {
      console.log('SSE connection already established.');
      return;
    }

    const notificationStore = useNotificationStore();

    const sseUrl = `http://localhost:8080/sse/connect`;
    console.log(`Connecting to SSE at: ${sseUrl}`);

    eventSource = new EventSource(sseUrl, { withCredentials: true });

    // SSE 연결 성공 시
    eventSource.onopen = () => {
      console.log('SSE connection established (onopen event).');
    };

    // 'new notification' 이름의 특정 이벤트 수신
    eventSource.addEventListener('new notification', (event) => { // 이벤트 이름 수정
      console.log('Received "new notification" event:', event);
      try {
        const notificationData = JSON.parse(event.data);
        console.log('Parsed data:', notificationData);
        notificationStore.addNotification(notificationData);
      } catch (e) {
        console.error('Failed to parse SSE event data:', e);
      }
    });

    // 에러 발생 시
    eventSource.onerror = (error) => {
      console.error('SSE connection error:', error);
      eventSource.close();
    };
  },

  close() {
    if (eventSource) {
      eventSource.close();
      console.log('SSE connection closed.');
    }
  }
};

export default sseService;