<template>
  <div class="login-page">
    <div class="login-box">
    <img src="/images/pinup_logo.png" alt="PIN-UP 로고" class="logo" />
    <h2>관리자 로그인</h2>

    <form @submit.prevent="login">
      <input
          type="text"
          v-model="username"
          placeholder="관리자 이름"
          required
      />
      <input
          type="password"
          v-model="password"
          placeholder="비밀번호"
          required
      />
      <button type="submit">로그인</button>
    </form>

    <router-link to="/" class="back-link">
      ← 사용자 로그인 페이지로 돌아가기
    </router-link>
  </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import router from "@/router/index.js";

const username = ref("");
const password = ref("");

// 관리자 로그인 API 호출
const login = async () => {
  try {
    const formData = new FormData();
    formData.append("username", username.value);
    formData.append("password", password.value);

    const res = await axios.post(
        "http://localhost:8080/admin/login",
        formData,
        {
          withCredentials: true,
        }
    );

    if (res.data.success) {
      router.push("/admin/dashboard");
    }

  } catch (e) {
    alert("로그인 실패!");
  }
};
</script>

<style scoped>
.login-page {
  font-family: 'Pretendard', sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  margin: 0;
  background: linear-gradient(135deg, #a8edea, #fed6e3);
}

.login-box {
  background: #fff;
  padding: 50px 40px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  width: 400px;
  text-align: center;
  animation: fadeIn 0.6s ease;
}

.logo {
  width: 150px;
  height: auto;
  margin-bottom: 10px;
}

h2 {
  margin: 10px 0 30px;
  font-size: 24px;
  color: #333;
}

input {
  width: 90%;
  padding: 12px 14px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 15px;
  transition: all 0.2s ease;
}

input:focus {
  outline: none;
  border-color: #5563DE;
  box-shadow: 0 0 5px rgba(85, 99, 222, 0.3);
}

button {
  background-color: #5563DE;
  color: white;
  padding: 12px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  width: 100%;
  font-weight: bold;
  font-size: 16px;
  margin-top: 10px;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #3346B0;
}

.back-link {
  display: inline-block;
  margin-top: 20px;
  font-size: 13px;
  color: #666;
  text-decoration: none;
}

.back-link:hover {
  color: #333;
  text-decoration: underline;
}

@keyframes fadeIn {
  from {opacity: 0; transform: translateY(15px);}
  to {opacity: 1; transform: translateY(0);}
}
</style>
