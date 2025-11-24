<template>
  <div class="point-page">
    <section class="panel">
      <!-- 상단 제목 + 뒤로가기 -->
      <header class="panel-header">
        <div class="panel-title">
          <button class="back-btn" @click="goBack">←</button>
          <span class="emoji">💰</span>
          <span>나의 포인트 사용 내역</span>
        </div>
      </header>

      <!-- 내용 행: 테이블 + 요약 카드 -->
      <div class="content-row">
        <!-- 포인트 사용 내역 테이블 -->
        <section class="table-card">
          <div class="table-wrapper">
            <table>
              <thead>
              <tr>
                <th>날짜</th>
                <th>사용처</th>
                <th>사용 금액</th>
              </tr>
              </thead>
              <tbody>
              <!-- 로딩 -->
              <tr v-if="loading">
                <td colspan="3">포인트 정보를 불러오는 중입니다...</td>
              </tr>

              <!-- 에러 -->
              <tr v-else-if="error">
                <td colspan="3">{{ error }}</td>
              </tr>

              <!-- 데이터 없음 -->
              <tr v-else-if="pointLogs.length === 0">
                <td colspan="3">포인트 사용 내역이 없습니다.</td>
              </tr>

              <!-- 정상 데이터 -->
              <tr
                  v-else
                  v-for="(log, idx) in pointLogs"
                  :key="idx"
              >
                <td>{{ log.date ?? '-' }}</td>
                <td>{{ log.description ?? '-' }}</td>
                <td>{{ formatAmount(log.amount ?? 0) }}</td>
              </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- 내 포인트 요약 카드 -->
        <aside class="point-summary-card">
          <div>
            <div class="point-summary-title">
              <span>나의 PIN-UP 포인트 🪙</span>
            </div>
            <div class="point-summary-main">
              <div class="point-amount">
                {{ formatNumber(totalPoint) }}
                <span class="unit">P</span>
              </div>
            </div>
          </div>
          <p class="point-summary-desc">
            방문 인증, 피드 작성, 미션 완료 등으로 적립된 포인트입니다.
          </p>
        </aside>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

// ⚠️ 백엔드에서 userId를 아직 안 내려줘서, 임시로 상수 사용
// 나중에 랭킹처럼 /api/user/me 에 userId 추가되면 여기만 교체하면 됨.
const USER_ID = 1

const router = useRouter()

// 상태값
const totalPoint = ref(0)
const pointLogs = ref([])
const loading = ref(false)
const error = ref('')

// 뒤로가기 (마이페이지로 간다고 가정)
const goBack = () => {
  router.push('/mypage') // 필요하면 '/home' 등으로 바꿔도 됨
}

// 숫자 포맷: 12000 -> "12,000"
const formatNumber = (num) => {
  if (num == null) return '0'
  return Number(num).toLocaleString('ko-KR')
}

// 포인트 금액 포맷: +5 / -10
const formatAmount = (amount) => {
  if (amount > 0) return `+${amount}`
  return String(amount)
}

// API 호출: 총 포인트
async function fetchTotalPoint(userId) {
  const res = await fetch(`/points/total?userId=${encodeURIComponent(userId)}`)
  if (!res.ok) {
    throw new Error(`총 포인트 조회 실패: ${res.status}`)
  }
  // 응답이 숫자 하나라고 가정
  return res.json()
}

// API 호출: 포인트 로그 리스트
async function fetchPointLogs(userId) {
  const res = await fetch(`/points/logs?userId=${encodeURIComponent(userId)}`)
  if (!res.ok) {
    throw new Error(`포인트 로그 조회 실패: ${res.status}`)
  }
  // [{ date, description, amount }, ...]
  return res.json()
}

// 전체 로딩
async function loadPoints() {
  loading.value = true
  error.value = ''
  pointLogs.value = []

  try {
    const [total, logs] = await Promise.all([
      fetchTotalPoint(USER_ID),
      fetchPointLogs(USER_ID),
    ])

    totalPoint.value = total ?? 0
    pointLogs.value = Array.isArray(logs) ? logs : []
  } catch (e) {
    console.error(e)
    error.value = '포인트 정보를 불러오는 중 오류가 발생했습니다.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadPoints()
})
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.point-page {
  width: 100%;
  padding: 32px 40px;
  background: #dcdcdc;
}

/* 패널 */
.panel {
  background: #f9fbff;
  border-radius: 32px;
  padding: 32px 36px;
  min-height: calc(100vh - 64px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
}

.panel-header {
  margin-bottom: 24px;
}

.panel-title {
  font-size: 20px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
}

.panel-title .emoji {
  font-size: 22px;
}

/* 뒤로가기 버튼 */
.back-btn {
  border: none;
  background: #ffffff;
  border-radius: 999px;
  width: 32px;
  height: 32px;
  cursor: pointer;
  box-shadow: 0 14px 40px rgba(0, 0, 0, 0.08);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  padding: 8px 18px;
}
.back-btn:hover {
  transform: translateY(-1px);
}

/* 레이아웃 */
.content-row {
  display: grid;
  grid-template-columns: 3fr 1.3fr;
  gap: 24px;
  flex: 1;
}

/* 포인트 로그 테이블 카드 */
.table-card {
  background: #fff;
  border-radius: 26px;
  padding: 24px 32px;
  box-shadow: 0 14px 40px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
}
.table-wrapper {
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid #eceff7;
  background: #fff;
}
table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}
thead {
  background: #f3f5ff;
}
thead th {
  padding: 10px 12px;
  font-weight: 600;
  text-align: center;
}
tbody tr {
  border-bottom: 1px solid #f3f3f3;
}
tbody td {
  padding: 10px 12px;
  text-align: center;
}
tbody tr:nth-child(even) {
  background: #fbfbff;
}

/* 내 포인트 카드 */
.point-summary-card {
  background: linear-gradient(135deg, #007bff, #12c2e9, #4facfe);
  border-radius: 26px;
  padding: 24px 32px;
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 220px;
  align-self: flex-start;
  box-shadow: 0 14px 40px rgba(0, 0, 0, 0.08);
}
.point-summary-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.point-summary-main {
  margin-top: 10px;
}
.point-amount {
  font-size: 32px;
  font-weight: 700;
  line-height: 1.1;
}
.point-amount .unit {
  font-size: 18px;
  font-weight: 500;
  margin-left: 4px;
}
.point-summary-desc {
  margin-top: 10px;
  font-size: 12px;
  opacity: 0.9;
}

/* 반응형 (원래 CSS 그대로 옮김) */
@media (max-width: 960px) {
  .point-page {
    padding: 20px;
  }
  .panel {
    padding: 20px;
    border-radius: 24px;
    min-height: auto;
  }
  .content-row {
    grid-template-columns: 1fr;
  }
  .point-summary-card {
    width: 100%;
  }
}
</style>
