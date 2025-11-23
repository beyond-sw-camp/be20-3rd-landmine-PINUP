<template>
  <main class="main">
    <div class="topbar">
      <div class="topbar-title">📢 공지사항 상세</div>
    </div>

    <section class="table-card">
      <hr class="notice-top-divider">
      <div class="notice-detail-header">
        <h2 class="notice-title">{{ notice.title }}</h2>
        <div class="notice-meta">
          <span>{{ notice.author }}</span> |
          <span>{{ notice.createdAt }}</span>
        </div>
      </div>
      <hr class="notice-bottom-divider">
      <div class="notice-content">
        <p>{{ notice.content }}</p>
      </div>

      <div class="form-actions">
        <button class="btn btn-cancel" @click="goToNoticeList">목록으로</button>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const notice = ref({
  id: null,
  title: "공지사항을 불러오는 중...",
  author: "관리자",
  createdAt: "YYYY-MM-DD",
  content: "내용을 불러오는 중입니다."
});

onMounted(() => {
  const noticeId = route.params.id;
  // TODO: noticeId를 사용하여 API에서 공지사항 상세 데이터를 불러오는 로직 구현
  console.log(`Loading notice with ID: ${noticeId}`);

  // Mock 데이터 (실제 API 호출로 대체)
  setTimeout(() => {
    notice.value = {
      id: noticeId,
      title: `공지사항 제목 ${noticeId}`,
      author: "관리자",
      createdAt: `2025-11-${noticeId * 5}`,
      content: `이것은 ${noticeId}번 공지사항의 상세 내용입니다. 개발 진행 중...
                <br><br>
                추가적인 내용입니다.
                <br><br>
                더 많은 내용이 여기에 표시될 수 있습니다.`
    };
  }, 500);
});

function goToNoticeList() {
  router.push('/notices');
}
</script>

<style scoped>
.main {
  flex: 1;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 26px;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.topbar-title {
  font-size: 24px;
  font-weight: 700;
}

.table-card {
  background: #ffffff;
  border-radius: 26px;
  box-shadow: 0 14px 40px rgba(0, 0, 0, 0.08);
  padding: 24px;
  min-height: 400px;
  display: flex;
  flex-direction: column;
}

.notice-detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.notice-title {
  font-size: 22px;
  font-weight: 700;
  color: #333;
}

.notice-meta {
  font-size: 13px;
  color: #777;
}

.notice-top-divider {
  border: none;
  border-top: 3px solid #000;
  margin: 5px 0;
}

.notice-bottom-divider {
  border: none;
  border-top: 1px solid #000;
  margin: 5px 0;
}

.notice-content {
  flex-grow: 1;
  font-size: 15px;
  line-height: 1.6;
  color: #444;
  word-break: break-all;
  white-space: pre-wrap;
}

.form-actions {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
}

.btn {
  padding: 10px 22px;
  border: none;
  border-radius: 999px;
  font-weight: 600;
  cursor: pointer;
  color: #fff;
  font-size: 14px;
  transition: all 0.25s ease;
  box-shadow: 0 4px 14px rgba(0,0,0,0.08);
}

.btn-cancel {
  background: linear-gradient(135deg, #888, #666);
}
.btn-cancel:hover {
  background: linear-gradient(135deg, #777, #555);
}

</style>