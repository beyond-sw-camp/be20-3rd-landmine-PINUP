<template>
  <div class="home-view">
    <!-- ✅ AI 여행 추천 팝업 -->
    <div
        v-if="isPopupOpen"
        class="popup-overlay"
        @click.self="closePopup"
    >
      <div class="popup">
        <div class="popup-inner">
          <button class="popup-close" @click="closePopup">✕</button>

          <div class="popup-title">AI 여행 일정 추천 🚗⛱️🏙️🌈</div>
          <p class="popup-subtitle">
            {{ user ? user.name : '여행자' }}님의 관심사를 반영한 여행 일정을 추천합니다.
          </p>

          <div class="popup-card">
            <!-- 추천 전 -->
            <div
                v-if="!recommendResult && !isLoadingRecommend"
                class="popup-state"
            >
              <button class="recommend-btn" @click="requestRecommend">
                추천
              </button>
            </div>

            <!-- 로딩 중 -->
            <div
                v-else-if="isLoadingRecommend"
                class="popup-state"
            >
              <div class="itinerary-text">
                AI가 여행 일정을 만드는 중입니다... ✨
              </div>
            </div>

            <!-- 추천 결과 -->
            <div
                v-else
                class="popup-state"
            >
              <div class="itinerary-text">
                <div v-if="recommendResult.region">
                  [{{ recommendResult.region }}]
                </div>
                <strong>"{{ recommendResult.title }}"</strong>
                <br /><br />
                {{ recommendResult.description }}
              </div>
            </div>

            <div class="popup-footer-emoji">🌊🏙️🍹</div>
          </div>
        </div>
      </div>
    </div>
    <!-- ✅ 팝업 끝 -->

    <!-- 상단 환영 + 정복 통계 섹션 -->
    <section class="welcome-section">
      <!-- 👋 환영 카드 -->
      <div class="welcome-card compact" v-if="user">
        <div class="profile-info">
          <div class="profile-avatar">
            <img :src="user.picture" alt="프로필 이미지"/>
          </div>
          <div class="profile-text">
            <h2>안녕하세요, {{ user.name }}님 👋</h2>
            <p class="sub-text">오늘도 새로운 여행지를 정복해보세요! 🌏</p>
          </div>
        </div>

        <div class="action-buttons">
          <router-link to="/mypage" class="btn btn-primary">
            마이페이지
          </router-link>
          <button class="btn btn-danger" @click="logout">로그아웃</button>
        </div>
      </div>

      <!-- 🌏 정복 통계 카드 -->
      <div class="conquer-card">
        <div class="conquer-item">
          <img src="/images/earth.png" alt="지구" class="conquer-icon" />
          <div class="conquer-text">
            <h4>총 정복 지역 수</h4>
            <span class="highlight">{{ conquer.total }}</span>
          </div>
        </div>

        <div class="divider"></div>

        <div class="conquer-item">
          <img src="/images/map.png" alt="여행" class="conquer-icon" />
          <div class="conquer-text">
            <h4>이번 달 신규 정복 수</h4>
            <span class="highlight">{{ conquer.monthly }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 여행 대시보드 + 지도 -->
    <section class="dashboard-map">
      <!-- 🏆 월간 랭킹 섹션 -->
      <div class="ranking-card">
        <div class="ranking-header">
          <h3>🏆 월간 랭킹</h3>
          <button class="ranking-more-btn" @click="goToRanking">
            랭킹 전체 보기
          </button>
        </div>

        <table class="ranking-table">
          <thead>
          <tr>
            <th>순위</th>
            <th>닉네임</th>
            <th>정복 지역 수</th>
          </tr>
          </thead>
          <tbody>

          <!-- 데이터 없음 -->
          <tr v-if="ranking.length === 0">
            <td colspan="3">데이터를 불러오는 중...</td>
          </tr>

          <!-- 데이터 있을 때 -->
          <tr
              v-for="item in ranking"
              :key="item.rank"
              v-else
          >
            <td>{{ item.rank }}위</td>
            <td>{{ item.userName }}</td>
            <td>{{ item.completedCount }}개</td>
          </tr>
          </tbody>
        </table>

        <!-- 📢 공지사항 구역 -->
        <h3>📢 공지사항</h3>
        <table class="notice-table">
          <thead>
          <tr>
            <th>제목</th>
            <th>날짜</th>
          </tr>
          </thead>
          <tbody>
          <tr
              v-for="n in notices"
              :key="n.noticeId"
              @click="openNotice(n.noticeId)"
              style="cursor: pointer;"
          >
            <td>{{ n.noticeTitle }}</td>
            <td>{{ formatDate(n.createdAt) }}</td>
          </tr>
          </tbody>
        </table>
      </div>

      <div class="map-card">
        <h3>🗺️ 내 여행 지도</h3>
        <div id="map"></div>
      </div>
    </section>
  </div>
</template>

<script setup>
import MyPageView from "@/views/user/MyPageView.vue";
import L from "leaflet";
import axios from "axios";
import { onMounted, ref } from "vue";
import { useRouter } from 'vue-router'

const formatDate = (d) => {
  return new Date(d).toLocaleDateString();
};

// 가짜 사용자 데이터 — 로그인 후 백엔드에서 받아온다고 가정
// const user = ref({
//   name: "사용자",
//   picture: "/images/default-profile.png"
// });

const conquer = ref({
  total: 100,
  monthly: 55
});

// 사용자 정보 가져오기
const user = ref(null);

// ✅ 팝업 상태
const isPopupOpen = ref(false);
const isLoadingRecommend = ref(false);
const recommendResult = ref(null);

const router = useRouter();
const loadUser = async () => {
  try {
    const res = await axios.get("http://localhost:8080/api/user/me", {
      withCredentials: true
    });

    if (res.data.authenticated) {
      user.value = {
        name: res.data.name,
        email: res.data.email,
        picture: res.data.picture
      };
      // ✅ 홈 화면 들어오면 자동으로 팝업 열기
      isPopupOpen.value = true;
    } else {
      // 인증 안 됐으면 로그인 페이지로 이동
      window.location.href = "/login";
    }

  } catch (e) {
    console.error("유저 정보 불러오기 실패", e);
    window.location.href = "/login";
  }
};

onMounted(() => {
  loadUser();
});

// 랭킹 가져오기
const ranking = ref([])   // 랭킹 리스트 상태

const goToRanking = () => {
  router.push({ name: 'ranking' })   // 라우터에서 name:'ranking' 등록함
}

const loadRanking = async () => {
  try {
    const now = new Date();
    now.setMonth(now.getMonth() - 1);

    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    const { data } = await axios.get("http://localhost:8080/ranks/monthly", {
      params: { year, month },
      withCredentials: true
    });

    ranking.value = data.slice(0, 10);

  } catch (e) {
    console.error("API 실패 → 임시 데이터 사용");
    ranking.value = [
      { rank: 1, userName: "테스트1", completedCount: 10 },
      { rank: 2, userName: "테스트2", completedCount: 8 },
      { rank: 3, userName: "테스트3", completedCount: 8 }
    ];
  }
};

// 공지사항 가져오기
const notices = ref([]);

const loadNotices = async () => {
  try {
    const res = await fetch("http://localhost:8080/api/notices/latest?limit=2", {
      credentials: "include"
    });
    console.log("📌 공지 응답:", notices.value);


    if (!res.ok) throw new Error("공지사항 API 호출 실패");

    notices.value = await res.json();

  } catch (e) {
    console.error("❌ 공지사항 조회 실패", e);
  }
};

const logout = () => {
  window.location.href = "http://localhost:8080/logout";
};

const openNotice = (id) => {
  window.location.href = `/notices/${id}`;
};
// ✅ 팝업 제어
const closePopup = () => {
  isPopupOpen.value = false;
};

// ✅ 추천 API 호출
const requestRecommend = async () => {
  const userId = user.value?.id ?? 1;   // ← id 없으면 1 사용 (안전)
  isLoadingRecommend.value = true;
  recommendResult.value = null;

  try {
    const { data } = await axios.post(
        `http://localhost:8080/api/recommend/${userId}`, // ★ fallback 적용됨
        {},
        { withCredentials: true }
    );

    recommendResult.value = data;
  } catch (e) {
    console.error("추천 API 실패", e);
    alert("AI 추천을 불러오지 못했습니다. 다시 시도해주세요.");
  } finally {
    isLoadingRecommend.value = false;
  }
};


onMounted(() => {
  loadRanking();
  loadNotices();
});

</script>
<style scoped>

* {
  box-sizing: border-box;
}

.home-view {
  padding: 24px 32px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.welcome-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  width: 100%;
}

.welcome-card.compact {
  background: #FFFFFF;
  border-radius: 26px;
  box-shadow: 0 14px 40px rgba(0, 0, 0, 0.08);
  padding: 24px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.profile-info {
  display: flex;
  gap: 25px;
  align-items: center;
}

.profile-avatar {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(26, 140, 255, 0.25);
}

.profile-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-text h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
}

.sub-text {
  color: #555555;
  margin-top: 6px;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.btn {
  padding: 8px 18px;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  font-size: 14px;
}

.btn-primary {
  background: linear-gradient(145deg, #1A8CFF, #3AC45D);
  color: white;
}

.btn-danger {
  background: #E74C3C;
  color: white;
}

.conquer-card {
  background: linear-gradient(145deg, #1A8CFF, #3AC45D);
  border-radius: 26px;
  box-shadow: 0 14px 40px rgba(0, 0, 0, 0.08);
  padding: 20px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  text-align: center;
}

.conquer-item {
  display: flex;
  gap: 12px;
  align-items: center;
  color: #fff;
}

.conquer-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #f3f8ff;
}

.conquer-text h4 {
  margin: 0;
  font-size: 14px;
}

.highlight {
  font-size: 20px;
  font-weight: 700;
}

.dashboard-map {
  display: grid;
  grid-template-columns: 2fr 3fr;;
  gap: 24px;
  width: 100%;
}

/* 랭킹 카드 */
.ranking-card {
  background: #FFFFFF;
  border-radius: 26px;
  box-shadow: 0 14px 40px rgba(0, 0, 0, 0.08);
  padding: 20px;
}

.ranking-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.ranking-header h3 {
  margin: 0;
}

.ranking-table {
  width: 100%;
  text-align: center;
  margin: 10px 0 20px 0;
}

.ranking-more-btn {
  font-size: 10px;
  color: #1A8CFF;
  background: rgba(90, 53, 255, 0.06);
  padding: 5px 9px;
  border-radius: 999px;
  cursor: pointer;
  border: none;
  outline: none;
}
.ranking-more-btn:hover {
  outline: none;
  box-shadow: 0 0 4px rgba(26, 140, 255, 0.6);
}
/* 랭킹 & 공지사항 공통 */
.ranking-table th,
.notice-table th {
  background: #f7faff;
  border-bottom: 2px solid #1A8CFF;
  padding: 10px 14px;
}

.ranking-table td,
.notice-table td {
  padding: 10px 14px;
  border-bottom: 1px solid #eee;
}

.ranking-table tr:hover td,
.notice-table tr:hover td {
  background: #f7faff;
}


/* 공지사항 */
.notice-table {
  width: 100%;
  text-align: center;
  margin: 10px 0 20px 0;
}

/* 지도 섹션 */
.map-card {
  background: #FFFFFF;
  border-radius: 26px;
  box-shadow: 0 14px 40px rgba(0, 0, 0, 0.08);
  padding: 20px;
}

/* ✅ 팝업 스타일 */
.popup-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1000;
}

.popup {
  position: relative;
  width: min(90vw, 520px);
  background: linear-gradient(135deg, #0da7ff, #02d982, #ffb347);
  border-radius: 32px;
  padding: 16px;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.25);
}

.popup-inner {
  background: #ffffff;
  border-radius: 26px;
  padding: 22px 24px 26px;
  position: relative;
}

.popup-close {
  position: absolute;
  top: 14px;
  right: 18px;
  border: none;
  background: transparent;
  font-size: 18px;
  cursor: pointer;
  color: #555;
}

.popup-title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 6px;
}

.popup-subtitle {
  font-size: 12px;
  text-align: center;
  color: #666;
  margin-bottom: 16px;
}

.popup-card {
  background: #d6e9ff;
  border-radius: 26px;
  padding: 24px 22px;
  min-height: 230px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.popup-state {
  width: 100%;
  height: 100%;
}

.recommend-btn {
  padding: 10px 36px;
  border-radius: 999px;
  border: none;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  background: #f1f0ff;
  color: #777;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
  display: block;
  margin: 0 auto;   /* 좌우 자동 → 가로 중앙 정렬 */
}

.itinerary-text {
  font-size: 13px;
  line-height: 1.5;
  color: #333;
  white-space: pre-line;
}

.popup-footer-emoji {
  position: absolute;
  right: 18px;
  bottom: 12px;
  font-size: 18px;
}

@media (max-width: 480px) {
  .popup-inner {
    padding: 20px 18px 22px;
  }

  .popup-card {
    padding: 18px 14px 30px;
    min-height: 210px;
  }

  .popup-title {
    font-size: 18px;
  }
}
</style>
