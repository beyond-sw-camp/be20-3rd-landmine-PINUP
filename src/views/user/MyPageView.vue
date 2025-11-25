<template>
  <div class="layout">
    <main class="main">
    <!-- Topbar -->
    <div class="topbar">
        <div class="topbar-title">ℹ️ 마이페이지</div>
        <div class="search-box">
          <input type="text" placeholder="내 여행 기록 검색하기" />
          <div class="search-icon">🔍</div>
        </div>
      </div>

      <!-- 1행: 프로필 + 포인트 -->
      <section class="row">
        <!-- Profile Card -->
        <div class="card profile-card">
          <div class="profile-avatar">
            {{ user.name ? user.name.charAt(0).toUpperCase() : "P" }}
          </div>

          <div class="profile-info-main">
            <div class="profile-name">{{ user.name }} 님</div>
            <div class="profile-tag">여행자 · PIN-UP Explorer</div>

            <div class="profile-info-grid">
              <div>
                <div class="profile-label">이메일</div>
                <div>{{ user.email }}</div>
              </div>

              <div>
                <div class="profile-label">닉네임</div>
                <div>{{ user.nickname }}</div>
              </div>

              <div>
                <div class="profile-label">생년월일</div>
                <div>{{ user.birthDate }}</div>
              </div>

              <div>
                <div class="profile-label">성별</div>
                <div>{{ user.gender }}</div>
              </div>

              <div>
                <div class="profile-label">상태</div>
                <div>{{ user.status }}</div>
              </div>

              <div>
                <div class="profile-label">선호 카테고리</div>
                <div>{{ user.preferredCategory }}</div>
              </div>

              <div>
                <div class="profile-label">선호 계절</div>
                <div>{{ user.preferredSeason }}</div>
              </div>
            </div>
          </div>

          <!-- ✏ 정보 수정 버튼 -->
          <button class="edit-btn" @click="openModal">
            <span class="icon">✏️</span> 내 정보 수정
          </button>
        </div>

        <!-- Points Card -->
        <div class="card points-card">
          <div class="points-title">나의 PIN-UP 포인트</div>
          <div class="points-value">{{ totalPoints }} P</div>
          <div class="points-sub">방문 인증, 피드 작성 등으로 적립됩니다.</div>

          <div class="points-actions">
            <button class="points-pill" @click="goToPointHistory">
              포인트 사용 내역 상세보기
            </button>
          </div>
        </div>
      </section>

      <!-- 2행: 피드 + 통계 -->
      <section class="row-2">
        <div class="card feed-card">
          <div class="feed-header">
            <div class="feed-title">내 피드 모아보기</div>
            <div class="feed-filter">전체 보기</div>
          </div>

          <div class="feed-container">
            <div class="feed-photo-grid">
              <img
                  v-for="img in feeds"
                  :key="img.id"
                  :src="img.image"
                  class="feed-photo"
              />
            </div>
          </div>
        </div>

        <div class="card stats-card">
          <div class="stats-title">여행 기록 & 랭킹</div>

          <div class="stats-item">
            <div>
              <strong>이번 달 방문 지역</strong><br />
              부산, 전주, 속초 등 7개 지역
            </div>
            <span class="badge">+7 구역</span>
          </div>

          <div class="stats-item">
            <div>
              <strong>총 점령 구역</strong><br />
              시군구 23/226개
            </div>
            <span class="badge">상위 12%</span>
          </div>

          <div class="stats-item">
            <div>
              <strong>최근 미션</strong><br />
              강릉 바다 인증샷 완료
            </div>
            <span class="badge">+300P</span>
          </div>
        </div>
      </section>
    </main>

    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <h2>내 정보 수정</h2>

        <form @submit.prevent="saveEdit">
          <div class="form-group">
            <label>닉네임</label>
            <input v-model="edit.nickname" type="text" required />
          </div>

          <div class="form-group">
            <label>성별</label>
            <select v-model="edit.gender" required>
              <option value="M">남성</option>
              <option value="F">여성</option>
              <option value="U">기타/미지정</option>
            </select>
          </div>

          <div class="form-group">
            <label>선호 카테고리</label>
            <select v-model="edit.preferredCategory">
              <option value="자연">자연</option>
              <option value="체험">체험</option>
              <option value="역사">역사</option>
              <option value="문화">문화</option>
            </select>
          </div>

          <div class="form-group">
            <label>선호 계절</label>
            <select v-model="edit.preferredSeason">
              <option value="봄">봄</option>
              <option value="여름">여름</option>
              <option value="가을">가을</option>
              <option value="겨울">겨울</option>
            </select>
          </div>

          <div class="form-group">
            <label>생년월일</label>
            <input type="date" v-model="edit.birthDate" />
          </div>

          <div class="modal-buttons">
            <button type="submit" class="save-btn">저장</button>
            <button type="button" class="cancel-btn" @click="closeModal">취소</button>
          </div>
        </form>

      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, reactive, onMounted} from "vue";
import Sidebar from "@/components/Sidebar.vue";
import axios from "axios";
import { useRouter } from "vue-router";

const user = reactive({
  name: "",
  email: "",
  nickname: "",
  birthDate: "",
  gender: "",
  status: "",
  preferredCategory: "",
  preferredSeason: ""
});

// 포인트
const router = useRouter();
const totalPoints = ref(0);
// 포인트 사용 내역 페이지로 이동
function goToPointHistory() {
  router.push("/points");
}
// 내 피드
const feeds = ref([]);

onMounted(async () => {
  try {
    const res = await axios.get("http://localhost:8080/api/users/mypage", {
      withCredentials: true
    });

    const data = res.data.user;

    // 사용자 정보
    Object.assign(user, data);
    totalPoints.value = res.data.totalPoints;

    // 피드 (있으면 사용, 없으면 예시)
    const userFeeds = data.feeds;
    feeds.value = (userFeeds && userFeeds.length > 0)
        ? userFeeds
        : [
          { id: 1, image: "/images/sample1.jpg" },
          { id: 2, image: "/images/sample2.jpg" },
          { id: 3, image: "/images/sample3.jpg" }
        ];
  } catch (err) {
    console.error("마이페이지 API 오류:", err);

    // 예시 이미지 fallback
    feeds.value = [
      { id: 1, image: "/images/sample1.jpg" },
      { id: 2, image: "/images/sample2.jpg" },
      { id: 3, image: "/images/sample3.jpg" }
    ];
  }
});

// 모달 관련
const showModal = ref(false);

// 모달 내 수정용 데이터
const edit = reactive({ ...user });

// 모달 열기
function openModal() {
  Object.assign(edit, user);  // 기존 정보 복사
  showModal.value = true;
}

// 모달 닫기
function closeModal() {
  showModal.value = false;
}

// 저장
async function saveEdit() {
  try {
    // 백엔드로 수정 요청 보내기
    await axios.patch("http://localhost:8080/api/member/update", edit, {
      withCredentials: true
    });

    // 화면 반영
    Object.assign(user, edit);
    showModal.value = false;

    alert("수정이 완료되었습니다!");

  } catch (err) {
    console.error("수정 실패:", err);
    alert("수정 중 오류가 발생했습니다!");
  }
}

</script>

<style scoped>
* {
  box-sizing: border-box;
}

.layout {
  display: flex;
  min-height: 100vh;
}
.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 26px 32px;
  gap: 22px;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.topbar-title {
  font-size: 24px;
  font-weight: 700;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: #ffffff;
  border-radius: 999px;
  box-shadow: 0 4px 12px rgba(33, 33, 80, 0.06);
  min-width: 260px;
}

.search-box input {
  border: none;
  outline: none;
  flex: 1;
  font-size: 13px;
  color: #555555;
}

.search-icon {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: #1A8CFF;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #fff;
}

/* 카드 공통 */
.card {
  background: #FFFFFF;
  border-radius: 26px;
  box-shadow: 0 14px 40px rgba(0, 0, 0, 0.08);
  padding: 18px 22px;
}

/* 첫 줄: 프로필 / 포인트 요약 */
.row {
  display: grid;
  grid-template-columns: 2.5fr 1.2fr;
  gap: 18px;
}

.profile-card {
  display: flex;
  gap: 18px;
  align-items: center;
}

.profile-avatar {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  background: linear-gradient(145deg, #1A8CFF, #3AC45D);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 700;
  font-size: 26px;
  flex-shrink: 0;
}

.profile-info-main {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.profile-name {
  font-size: 20px;
  font-weight: 700;
}

.profile-tag {
  font-size: 12px;
  color: #1A8CFF;
  font-weight: 600;
}

.profile-info-grid {
  margin-top: 8px;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 4px 14px;
  font-size: 11px;
  color: #555555;
}

.profile-label {
  font-weight: 600;
  color: #9293b8;
}

.edit-btn {
  margin-left: auto;
  padding: 8px 14px;
  font-size: 11px;
  border-radius: 999px;
  border: none;
  background: rgba(90, 53, 255, 0.08);
  color: #1A8CFF;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
}

.edit-btn span.icon {
  font-size: 12px;
}

.points-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: linear-gradient(145deg, #1A8CFF, #3AC45D);
  color: #fff;
}

.points-title {
  font-size: 14px;
  font-weight: 600;
}

.points-value {
  font-size: 26px;
  font-weight: 800;
}

.points-sub {
  font-size: 11px;
  opacity: 0.9;
}

.points-actions {
  margin-top: 4px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.points-pill {
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 10px;
  background: rgba(255, 255, 255, 0.14);
  border: none;           /* 버튼 테두리 제거 */
  cursor: pointer;        /* 손가락 커서 */
  color: inherit;         /* 텍스트 색 유지 */
}

/* 두 번째 줄: 지도 + 통계/기록 */
.row-2 {
  display: grid;
  grid-template-columns: 2.3fr 1.2fr;
  gap: 18px;
}

.feed-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.feed-title {
  font-size: 16px;
  font-weight: 600;
}

.feed-filter {
  font-size: 10px;
  color: #1A8CFF;
  background: rgba(90, 53, 255, 0.06);
  padding: 5px 9px;
  border-radius: 999px;
}

.stats-card {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.stats-title {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 4px;
}

.stats-item {
  padding: 8px 10px;
  border-radius: 16px;
  background: #f5f5ff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
  color: #555555;
}

.stats-item strong {
  color: #121212;
  font-size: 12px;
}

.badge {
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 9px;
  background: rgba(90, 53, 255, 0.12);
  color: #1A8CFF;
}

/* ✏️ 내 정보 수정 폼 스타일 */
#editForm {
  background: #ffffff;
  border-radius: 26px;
  box-shadow: 0 8px 28px rgba(26, 140, 255, 0.08);
  padding: 24px 28px;
  margin-top: 20px;
  transition: all 0.3s ease;
  animation: fadeIn 0.3s ease-in-out;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 18px;
}

.form-group label {
  font-size: 13px;
  font-weight: 600;
  color: #1A8CFF;
  margin-bottom: 6px;
  letter-spacing: 0.02em;
}

.form-group input,
.form-group select {
  border: 1.5px solid rgba(26, 140, 255, 0.3);
  border-radius: 12px;
  padding: 10px 14px;
  font-size: 13px;
  transition: all 0.2s ease;
  background: #f9fcff;
  color: #333;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #1A8CFF;
  box-shadow: 0 0 0 4px rgba(26, 140, 255, 0.15);
  outline: none;
  background: #fff;
}

.save-btn,
.cancel-btn {
  border: none;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
  padding: 10px 20px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.save-btn {
  background: linear-gradient(135deg, #1A8CFF, #0099FF);
  color: #fff;
  box-shadow: 0 4px 10px rgba(26, 140, 255, 0.25);
}

.save-btn:hover {
  background: linear-gradient(135deg, #0079e6, #1A8CFF);
  transform: translateY(-1px);
}

.cancel-btn {
  margin-left: 10px;
  background: #E8F1FF;
  color: #1A8CFF;
  border: 1px solid rgba(26, 140, 255, 0.3);
}

.cancel-btn:hover {
  background: rgba(26, 140, 255, 0.08);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
}

a {
  text-decoration: none;
  color: inherit;
}

/* 모달 오버레이 */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

/* 모달 박스 */
.modal {
  background: #fff;
  padding: 28px 32px;
  width: 420px;
  border-radius: 22px;
  box-shadow: 0 20px 50px rgba(0,0,0,0.15);
  animation: fadeIn 0.25s ease-out;
}

.modal h2 {
  margin-top: 0;
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 18px;
  color: #121212;
}

.modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 14px;
}

/* 피드 */
.feed-photo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 12px;
}

.feed-photo {
  width: 100%;
  height: 140px;
  object-fit: cover;
  border-radius: 14px;
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.feed-photo:hover {
  opacity: 70%;
}

</style>
