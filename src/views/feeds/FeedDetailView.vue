<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import api from '@/api/axios'
import { useBack } from '@/composables/useBack'
import { useUserDataStore } from '@/stores/userDataStore.js'

const route = useRoute()
const router = useRouter()
const { back } = useBack({ name: 'feeds' })
const userStore = useUserDataStore()

// ---------- 상태 ----------
const feed = ref(null)
const loading = ref(true)
const error = ref('')

const deleteDialogVisible = ref(false)
const reportDialogVisible = ref(false)
const hasLiked = ref(false)

// 라우트 파라미터
const feedId = computed(() => {
  const raw = route.params.feedId
  const num = Number(raw)
  return isNaN(num) ? null : num
})

// 현재 로그인 유저 id
const currentUserId = computed(() => userStore.userId)

// 작성자 여부 (authorId가 내려온다는 전제, 없으면 항상 false)
const isAuthor = computed(() => {
  if (!feed.value) return false
  if (!currentUserId.value) return false
  return feed.value.authorId && feed.value.authorId === currentUserId.value
})

// 작성 시간 포맷
const formattedCreatedAt = computed(() => {
  if (!feed.value || !feed.value.createdAt) return ''
  const d = new Date(feed.value.createdAt)
  if (isNaN(d.getTime())) return ''
  return d.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
})

// ---------- API 호출 ----------
const loadFeedDetail = async () => {
  if (!feedId.value) {
    error.value = '잘못된 피드입니다.'
    loading.value = false
    return
  }

  loading.value = true
  error.value = ''

  try {
    const res = await api.get('/feeds/view/' + feedId.value)
    const data = res.data && res.data.data
    if (!data) throw new Error('응답에 data가 없습니다.')

    feed.value = {
      id: data.id,
      title: data.title,
      content: data.content,
      imageUrl: data.imageUrl,
      thumbnailUrl: data.thumbnailUrl,
      authorName: data.authorName,
      authorProfileImage: data.authorProfileImage,
      authorId: data.authorId || null,
      likeCount: typeof data.likeCount === 'number' ? data.likeCount : 0,
      createdAt: data.createdAt,
    }
  } catch (e) {
    console.error('피드 상세 조회 실패:', e)
    error.value = '피드 정보를 불러오지 못했습니다.'
    ElMessage.error(error.value)
  } finally {
    loading.value = false
  }
}

// 좋아요
const handleLike = async () => {
  if (!feed.value || hasLiked.value) return

  const ok = await userStore.ensureLoggedIn()
  if (!ok) {
    router.push({
      path: '/login',
      query: { redirect: route.fullPath || ('/feeds/' + feedId.value) },
    })
    return
  }

  try {
    const res = await api.post('/feeds/' + feedId.value + '/likes', null, {
      params: { userId: currentUserId.value },
    })

    const result = res.data && res.data.data
    if (result && typeof result.likeCount === 'number') {
      feed.value.likeCount = result.likeCount
    } else {
      feed.value.likeCount = (feed.value.likeCount || 0) + 1
    }

    hasLiked.value = true
    ElMessage.success('좋아요를 눌렀습니다.')
  } catch (e) {
    console.error('좋아요 실패:', e)
    const status = e.response && e.response.status

    if (status === 409) {
      hasLiked.value = true
      ElMessage.warning('이미 좋아요를 누르셨습니다.')
    } else {
      ElMessage.error('좋아요 처리 중 오류가 발생했습니다.')
    }
  }
}

// 수정
const handleEdit = () => {
  if (!feed.value) return
  if (!isAuthor.value) {
    ElMessage.warning('본인 피드만 수정할 수 있습니다.')
    return
  }

  router.push({
    name: 'feed-edit',
    params: { feedId: feed.value.id },
  }).catch(() => {})
}

// 삭제
const handleDelete = () => {
  if (!feed.value) return
  if (!isAuthor.value) {
    ElMessage.warning('본인 피드만 삭제할 수 있습니다.')
    return
  }
  deleteDialogVisible.value = true
}

const confirmDelete = async () => {
  if (!feed.value) return
  try {
    await api.delete('/feeds/delete/' + feed.value.id)
    ElMessage.success('피드가 삭제되었습니다.')
    deleteDialogVisible.value = false
    router.push({ name: 'feeds' })
  } catch (e) {
    console.error('삭제 실패:', e)
    ElMessage.error('피드를 삭제하지 못했습니다.')
  }
}

// 신고 (stub)
const handleReport = () => {
  if (!feed.value) return
  reportDialogVisible.value = true
}

const confirmReport = async () => {
  // TODO: 실제 신고 API 연동
  reportDialogVisible.value = false
  ElMessage.success('신고가 접수된 것으로 처리되었습니다. (TODO)')
}

onMounted(async () => {
  await userStore.ensureLoggedIn()
  await loadFeedDetail()
})
</script>

<template>
  <div class="feed-detail-page">
    <!-- 상단 바 -->
    <div class="feed-top-bar">
      <button type="button" class="feed-back-btn" @click="back">
        ←
      </button>

      <div class="feed-top-left">
        <span>피드 상세</span>
      </div>

      <!-- 오른쪽 상단: 수정/삭제 또는 신고 -->
      <div class="feed-top-right">
        <template v-if="isAuthor">
          <button type="button" class="edit-btn" @click="handleEdit">
            수정
          </button>
          <button type="button" class="delete-btn" @click="handleDelete">
            삭제
          </button>
        </template>
        <button
            v-else
            type="button"
            class="report-btn"
            @click="handleReport"
        >
          신고
        </button>
      </div>
    </div>

    <!-- 로딩 / 에러 / 내용 -->
    <div v-if="loading" class="feed-loading">
      피드 정보를 불러오는 중입니다...
    </div>

    <div v-else-if="error" class="feed-empty">
      {{ error }}
    </div>

    <div v-else-if="feed" class="detail-container">
      <!-- 이미지 영역 -->
      <div class="detail-image-wrapper">
        <img
            class="detail-main-image"
            :src="feed.imageUrl || feed.thumbnailUrl"
            :alt="feed.title"
        />
      </div>

      <!-- 텍스트/액션 영역 -->
      <div class="detail-content-wrapper">
        <h1 class="detail-title">
          {{ feed.title }}
        </h1>

        <!-- 작성자 + 좋아요 한 줄 -->
        <div class="detail-author-row">
          <div class="detail-author">
            <img
                v-if="feed.authorProfileImage"
                class="detail-author-img"
                :src="feed.authorProfileImage"
                alt="작성자 프로필"
            />
            <div class="detail-author-meta">
              <span class="detail-author-name">
                {{ feed.authorName }}
              </span>
              <span v-if="formattedCreatedAt" class="detail-created-at">
                {{ formattedCreatedAt }}
              </span>
            </div>
          </div>

          <button type="button" class="like-btn" @click="handleLike">
            ❤️ {{ feed.likeCount }}
          </button>
        </div>

        <div class="detail-text">
          {{ feed.content }}
        </div>
      </div>

      <!-- 삭제 모달 -->
      <el-dialog
          v-model="deleteDialogVisible"
          title="피드 삭제"
          width="360px"
      >
        <span>정말 이 피드를 삭제하시겠습니까?</span>
        <template #footer>
          <el-button @click="deleteDialogVisible = false">취소</el-button>
          <el-button type="danger" @click="confirmDelete">삭제</el-button>
        </template>
      </el-dialog>

      <!-- 신고 모달 (stub) -->
      <el-dialog
          v-model="reportDialogVisible"
          title="피드 신고"
          width="380px"
      >
        <p>스크립트 작성 필요</p>
        <template #footer>
          <el-button @click="reportDialogVisible = false">닫기</el-button>
          <el-button type="primary" @click="confirmReport">신고</el-button>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<style src="@/assets/styles/feeds.css" />

<style scoped>
</style>
