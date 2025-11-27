<template>
  <div class="profile-container">
    <div class="profile-card">

      <!--   뒤로가기 버튼   -->
      <div class="back-button" @click="goBack">←</div>

      <!-- 프로필 이미지 -->
      <div class="avatar-circle">
        <span>{{ profile.nickname?.charAt(0)?.toUpperCase() }}</span>
      </div>

      <h2 class="nickname">{{ profile.nickname }}</h2>
      <p class="realname">{{ profile.name }}</p>
      <p class="email">{{ profile.email }}</p>

      <!-- 활동 통계 -->
      <div class="stats">
        <div class="stat">
          <span class="count">{{ profile.postCount ?? 0 }}</span>
          <span class="label">피드 수</span>
        </div>
        <div class="stat">
          <span class="count">{{ profile.totalTerritory ?? 0 }}</span>
          <span class="label">전체 정복 수</span>
        </div>
        <div class="stat">
          <span class="count">{{ profile.monthTerritory ?? 0 }}</span>
          <span class="label">이번달 정복 수</span>
        </div>
      </div>

      <!-- 차단 버튼 -->
      <button class="block-btn" @click="toggleBlock">
        {{ isBlocked ? "차단 해제" : "차단하기" }}
      </button>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import axiosInstance from "@/api/axios.js";
import router from "@/router/index.js";

const route = useRoute();
const userId = route.params.userId;
const profile = ref({});
const isBlocked = ref(false)

const fetchProfile = async () => {
  try {
    const res = await axiosInstance.get(`/users/${userId}`);
    profile.value = res.data;
    // 차단 여부
    isBlocked.value = !!res.data.isBlocked;
  } catch (e) {
    console.error("프로필 조회 오류:", e);
    alert("프로필 정보를 불러올 수 없습니다.");
  }
};

// 차단 기능
const toggleBlock = async () => {
  try {
    if (!isBlocked.value) {
      // 차단하기
      const confirmBlock = confirm("해당 사용자를 차단하시겠습니까?");
      if (!confirmBlock) return;

      await axiosInstance.post(`/users/${userId}/block`);
      alert("사용자를 차단했습니다.");
      isBlocked.value = true;

    } else {
      // 차단 해제
      const confirmUnblock = confirm("해당 사용자 차단을 해제하시겠습니까?");
      if (!confirmUnblock) return;

      await axiosInstance.post(`/users/${userId}/unblock`);
      alert("차단을 해제했습니다.");
      isBlocked.value = false;
    }

  } catch (e) {
    console.error("차단/해제 실패:", e);
    alert("처리 중 오류가 발생했습니다.");
  }
};

// 뒤로가기
const goBack = () => {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push("/home");
  }
};

onMounted(fetchProfile);
</script>

<style scoped>
/* 전체 레이아웃 */
.profile-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 0;
  font-family: "Pretendard", sans-serif;
}

.back-button {
  position: absolute;
  left: 25px;
  top: 25px;
  font-size: 28px;
  cursor: pointer;
  user-select: none;
  transition: 0.15s ease;
}

.back-button:hover {
  transform: translateX(-4px);
}

/* 카드 */
.profile-card {
  background: #fff;
  width: 350px;
  border-radius: 20px;
  padding: 40px 30px;
  text-align: center;
  box-shadow: 0 10px 40px rgba(0,0,0,0.08);
  position: relative;
}

/* 프로필 원형 */
.avatar-circle {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  margin: 0 auto 20px auto;
  background: linear-gradient(135deg, #1fc8db, #2cb5e8);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 55px;
  font-weight: bold;
  color: white;
}

/* 닉네임 */
.nickname {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 4px;
}

/* 사용자 이름 */
.realname {
  font-size: 15px;
  color: #666;
  margin-bottom: 4px;
}

/* 이메일 */
.email {
  font-size: 14px;
  color: #3b82f6;
  margin-bottom: 20px;
}

/* 통계 */
.stats {
  display: flex;
  justify-content: space-between;
  margin: 25px 0;
}

.stat {
  flex: 1;
}

.count {
  font-size: 20px;
  font-weight: 700;
  display: block;
}

.label {
  font-size: 13px;
  color: #777;
}

/* 차단하기 버튼 */
.block-btn {
  margin-top: 20px;
  background: #1a8cff;
  color: #fff;
  border: none;
  width: 100%;
  padding: 12px 0;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
}

.block-btn:hover {
  background: #0f6dd8;
}
</style>
