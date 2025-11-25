<template>
  <!-- AppLayout 안에서 컨텐츠만 차지하는 구조 -->
  <div class="ranking-page">
    <div class="ranking-header">
      <div class="ranking-header-left">
        <button class="back-btn" @click="goBack">←</button>
        <span class="emoji">🏆</span>
        <span class="page-title">월간 랭킹 TOP 100</span>
      </div>

        <div class="month-box">
          <input
              type="month"
              v-model="selectedYearMonth"
          />
          <button @click="onClickApply">
            적용
          </button>
        </div>
      </div>

      <!-- 랭킹 테이블 + 내 랭킹 카드 -->
      <div class="content-row">
        <!-- 랭킹 테이블 -->
        <div class="table-card">
          <table>
            <thead>
            <tr>
              <th>순위</th>
              <th>닉네임</th>
              <th>정복지역 수</th>
              <th>마지막 정복일</th>
            </tr>
            </thead>
            <tbody>
            <!-- 로딩 -->
            <tr v-if="loadingRank">
              <td colspan="4">
                불러오는 중...
              </td>
            </tr>

            <!-- 에러 -->
            <tr v-else-if="rankError">
              <td colspan="4">
                {{ rankError }}
              </td>
            </tr>

            <!-- 데이터 없음 -->
            <tr v-else-if="!rankList.length">
              <td colspan="4">
                데이터가 없습니다.
              </td>
            </tr>

            <!-- 정상 데이터 -->
            <tr
                v-else
                v-for="item in rankList"
                :key="`${item.rank}-${item.userId ?? item.nickname}`"
            >
              <td>{{ formatRankLabel(item.rank) }}</td>
              <td>{{ item.nickname }}</td>
              <td>{{ item.captureCount ?? 0 }}개</td>
              <td>{{ formatDate(item.lastCaptureAt) }}</td>
            </tr>
            </tbody>
          </table>
        </div>

        <!-- 내 랭킹 카드 -->
        <div class="my-rank-card">
          <div class="my-rank-title">
            나의 랭킹 🏆
          </div>

          <div class="my-rank-main">
            <span v-if="loadingMyRank">로딩 중...</span>
            <span v-else-if="myRankError">{{ myRankError }}</span>
            <span v-else-if="myRank && myRank.message">
              {{ myRank.message }}
            </span>
            <span v-else-if="myRank && myRank.rank != null">
              현재 {{ myRank.rank }}위입니다.
            </span>
            <span v-else>
              순위 정보를 불러오지 못했습니다.
            </span>
          </div>

          <div
              v-if="myRank && myRank.captureCount != null"
              class="my-rank-sub"
          >
            정복지역 수: {{ myRank.captureCount }}개
          </div>
        </div>
      </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'   // ✅ axios import 추가

// 라우터; 뒤로가기 용도
const router = useRouter()

const user = ref(null)                     // 로그인 유저 정보; 홈뷰에 맞춰서
const selectedYearMonth = ref('')          // "YYYY-MM"
const rankList = ref([])                   // 월간 TOP100 리스트
const loadingRank = ref(false)
const rankError = ref('')

const myRank = ref(null)                   // 내 랭킹 정보(MyRankDto)
const loadingMyRank = ref(false)
const myRankError = ref('')


// ⚠️ 백엔드에서 userId를 안 내려줘서 당장은 하드코딩 (팀과 상의 후 교체)
const TEMP_USER_ID = 1   // TODO: 백엔드에서 userId 내려주면 교체

// ----------------------
// 공통 함수들
// ----------------------

// 뒤로가기 (홈화면으로)
function goBack() {
  router.push('/home')    // 라우터에서 /home 사용 중이므로 명시적으로 이동
}

// "YYYY-MM-DD" 형태로 포맷팅
function formatDate(instantString) {
  if (!instantString) return '-'
  const d = new Date(instantString)
  if (isNaN(d.getTime())) return '-'
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

// 1위~3위 이모지 표시
function formatRankLabel(rank) {
  if (rank === 1) return '1위 🥇'
  if (rank === 2) return '2위 🥈'
  if (rank === 3) return '3위 🥉'
  return `${rank}위`
}

// ----------------------
// 로그인 유저 정보 가져오기 (HomeView에 맞추어)
// ----------------------
const loadUser = async () => {
  try {
    const res = await axios.get('http://localhost:8080/api/user/me', {
      withCredentials: true,
    })

    if (res.data.authenticated) {
      // ⚠️ id 필드 이름은 백엔드 응답에 맞게 변경 필요 (예: userId 등)
      user.value = {
        //id: res.data.id,
        name: res.data.name,
        email: res.data.email,
        picture: res.data.picture,
      }
    } else {
      window.location.href = '/login'
    }
  } catch (e) {
    console.error('유저 정보 불러오기 실패', e)
    window.location.href = '/login'
  }
}

// ----------------------
// 랭킹 api 호출 관련
// ----------------------
// TOP100 랭킹 조회
async function loadRanking(year, month) {
  loadingRank.value = true
  rankError.value = ''

  try {
    const res = await fetch(
        `http://localhost:8080/ranks/monthly?year=${year}&month=${month}`,
        { credentials: 'include' }   // 세션/쿠키 쓰면 추가
    )
    if (!res.ok) {
      throw new Error('랭킹 조회 실패')
    }
    const list = await res.json()
    rankList.value = Array.isArray(list) ? list : []
  } catch (e) {
    console.error(e)
    rankError.value = '랭킹 데이터를 불러오는 중 오류가 발생했습니다.'
    rankList.value = []
  } finally {
    loadingRank.value = false
  }
}

// 내 랭킹 조회
async function loadMyRanking(year, month) {
  loadingMyRank.value = true
  myRankError.value = ''
  myRank.value = null

  try {
    // ⚠️ 현재는 TEMP_USER_ID 사용 (백엔드에서 userId 내려주면 user.value.id로 교체)
    const res = await fetch(
        `http://localhost:8080/ranks/monthly/me?year=${year}&month=${month}&userId=${TEMP_USER_ID}`,
        { credentials: 'include' }
    )
    if (!res.ok) {
      throw new Error('내 랭킹 조회 실패')
    }
    const data = await res.json()
    myRank.value = data
  } catch (e) {
    console.error(e)
    myRankError.value = '내 랭킹을 불러오는 중 오류가 발생했습니다.'
  } finally {
    loadingMyRank.value = false
  }
}

// 한 달 기준으로 랭킹 + 내 랭킹 둘 다 호출
async function loadForMonth(year, month) {
  await Promise.all([
    loadRanking(year, month),
    loadMyRanking(year, month),
  ])
}

// 월 선택 적용 버튼
function onClickApply() {
  if (!selectedYearMonth.value) return
  const [y, m] = selectedYearMonth.value.split('-')
  loadForMonth(Number(y), Number(m))
}

// onMounted - (월 기본값 + 로그인 체크 + 랭킹 호출)
onMounted(async () => {
  // 1. 월 기본값 설정
  const today = new Date()
  const yyyy = today.getFullYear()
  const mm = String(today.getMonth() + 1).padStart(2, '0')
  selectedYearMonth.value = `${yyyy}-${mm}`

  // 2. 사용자 정보 로드
  await loadUser()

  // 3. 월간 랭킹 로드
  await loadForMonth(yyyy, Number(mm))
})
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.ranking-page {
  width: 100%;
  padding: 32px 40px;
}

.ranking-header {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 0 20px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ranking-header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}
.ranking-header .emoji {
  font-size: 22px;
}

.ranking-header .page-title {
  font-weight: 700;
  font-size: 20px;
}


/* 연월 선택 */
.month-box {
  display: inline-flex;
  align-items: center;
  background: #ffffff;
  border-radius: 999px;
  padding: 6px 18px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  gap: 8px;
}
.month-box input[type='month'] {
  border: none;
  outline: none;
  background: transparent;
  font-size: 14px;
  cursor: pointer;
}
.month-box button {
  border: none;
  background: #0d6efd;
  color: #fff;
  font-size: 13px;
  padding: 6px 14px;
  border-radius: 999px;
  cursor: pointer;
}

.content-row {
  display: grid;
  grid-template-columns: 3fr 1.5fr;
  gap: 24px;
  flex: 1;
}

/* 랭킹 테이블 카드 */
.table-card {
  background: #ffffff;
  border-radius: 26px;
  box-shadow: 0 14px 40px rgba(0, 0, 0, 0.08);
  padding: 24px 32px;
  display: flex;
  flex-direction: column;
  height: 100%;
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
  padding: 10px 8px;
  font-weight: 600;
}
tbody tr {
  border-bottom: 1px solid #f0f0f0;
}
tbody td {
  padding: 9px 8px;
  text-align: center;
}
tbody tr:nth-child(odd) {
  background: #ffffff;
}
tbody tr:nth-child(even) {
  background: #fbfbff;
}

/* 내 랭킹 카드 */
.my-rank-card {
  background: linear-gradient(135deg, #007bff, #12c2e9, #4facfe);
  border-radius: 26px;
  padding: 24px 32px;
  box-shadow: 0 14px 40px rgba(0, 0, 0, 0.08);
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
}
.my-rank-title {
  font-size: 16px;
  margin-bottom: 8px;
}
.my-rank-main {
  font-size: 26px;
  font-weight: 700;
}
.my-rank-sub {
  margin-top: 10px;
  font-size: 14px;
  opacity: 0.9;
}

/* 뒤로가기 버튼 */
.back-btn {
  margin-right: 12px;
  border: none;
  background: #E9E6FF;
  color: #4A45A3;
  border-radius: 10px;
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
}
.back-btn:hover:not(:disabled) {
  background: #D6D0FF;
}
</style>

