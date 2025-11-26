<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useBack } from '@/composables/useBack'
import api from '@/api/axios'
import { useUserDataStore } from '@/stores/userDataStore.js'

const route = useRoute()
const router = useRouter()
const { back } = useBack({ name: 'feeds' })
const userStore = useUserDataStore()

// 상태
const title = ref('')
const content = ref('')
const image = ref(null)     // 새로 선택한 이미지 파일
const isSubmitting = ref(false)

const previewUrl = ref('')  // 기존 또는 새 이미지 미리보기
const isObjectUrl = ref(false)

// 로그인 유저 ID
const userId = computed(() => userStore.user?.id ?? null)

// feedId 추출
const feedId = computed(() => {
  const n = Number(route.params.feedId)
  return isNaN(n) ? null : n
})

// --- 기존 글 불러오기 ---
onMounted(async () => {
  if (!feedId.value) {
    ElMessage.error('잘못된 접근입니다.')
    router.replace({ name: 'feeds' })
    return
  }

  try {
    const res = await api.get(`/feeds/view/${feedId.value}`)
    const data = res.data?.data

    if (!data) {
      throw new Error('no data')
    }

    // 기존 데이터 세팅
    title.value = data.title ?? ''
    content.value = data.content ?? ''

    if (data.imageUrl) {
      previewUrl.value = data.imageUrl
      isObjectUrl.value = false
    }
  } catch (e) {
    console.error(e)
    ElMessage.error('기존 피드를 불러오지 못했습니다.')
    router.replace({ name: 'feeds' })
  }
})

// --- File blob URL cleanup ---
const cleanupObjectUrl = () => {
  if (previewUrl.value && isObjectUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
  }
  isObjectUrl.value = false
}

const handleFileChange = (event) => {
  const file = event.target.files?.[0] ?? null

  // 기존 Blob URL 정리
  cleanupObjectUrl()

  image.value = file

  if (file) {
    previewUrl.value = URL.createObjectURL(file)
    isObjectUrl.value = true
  } else {
    previewUrl.value = ''
  }
}

onBeforeUnmount(() => {
  cleanupObjectUrl()
})

// --- Submit 수정 요청 ---
const handleSubmit = async () => {
  const trimmedTitle = title.value.trim()
  const trimmedContent = content.value.trim()

  if (!userId.value) {
    ElMessage.warning('로그인이 필요합니다.')
    return router.push({
      path: '/login',
      query: { redirect: `/feeds/${feedId.value}/edit` },
    })
  }

  if (!feedId.value) {
    ElMessage.error('수정할 피드 ID가 없습니다.')
    return
  }

  if (trimmedTitle.length <= 5) {
    ElMessage.warning('제목은 5글자 이상 입력해주세요.')
    return
  }

  if (trimmedContent.length <= 10) {
    ElMessage.warning('내용은 10자 이상 입력해주세요.')
    return
  }

  if (isSubmitting.value) return
  isSubmitting.value = true

  try {
    const formData = new FormData()
    formData.append('title', trimmedTitle)
    formData.append('content', trimmedContent)

    if (image.value) {
      formData.append('imageFile', image.value)
    }

    await api.put(`/feeds/modify/${feedId.value}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    ElMessage.success('피드가 수정되었습니다.')
    router.push({ name: 'feed-detail', params: { feedId: feedId.value } })
  } catch (e) {
    console.error(e)
    ElMessage.error('피드 수정에 실패했습니다.')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="feed-page">
    <div class="feed-top-bar">
      <button type="button" class="feed-back-btn" @click="back">←</button>

      <div class="feed-top-left">
        <span>피드 수정</span>
      </div>

      <el-button type="primary" :loading="isSubmitting" @click="handleSubmit">
        수정 완료
      </el-button>
    </div>

    <div class="feed-form">
      <!-- 제목 입력 -->
      <div class="feed-form-row">
        <label class="feed-form-label" for="feed-title">제목</label>
        <el-input
            id="feed-title"
            v-model="title"
            class="feed-input"
            placeholder="수정할 제목 입력"
        />
      </div>

      <!-- 내용 입력 -->
      <div class="feed-form-row">
        <label class="feed-form-label" for="feed-content">내용</label>
        <el-input
            id="feed-content"
            v-model="content"
            type="textarea"
            :rows="10"
            class="feed-textarea"
            placeholder="수정할 내용 입력"
        />
      </div>

      <!-- 이미지 업로드 -->
      <div class="feed-form-row">
        <div class="feed-form-label">이미지 업로드</div>

        <label class="feed-upload-label">
          <input
              type="file"
              accept="image/*"
              class="feed-upload-input"
              @change="handleFileChange"
          />

          <div class="feed-upload-content">
            <div class="feed-upload-left">
              <span v-if="image">
                새 이미지 선택됨: <strong>{{ image.name }}</strong>
              </span>
              <span v-else class="feed-upload-placeholder">
                기존 이미지를 변경하려면 클릭하세요
              </span>
            </div>

            <div v-if="previewUrl" class="feed-upload-right">
              <img :src="previewUrl" alt="미리보기" />
            </div>
          </div>
        </label>
      </div>
    </div>
  </div>
</template>

<style src="@/assets/styles/feeds.css" />

<style scoped>
.feed-upload-input {
  display: none;
}

.feed-upload-label {
  display: block;
  padding: 16px;
  border: 1px dashed #ccc;
  border-radius: 8px;
  cursor: pointer;
}

.feed-upload-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.feed-upload-placeholder {
  color: #999;
}

.feed-upload-right img {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
}
</style>
