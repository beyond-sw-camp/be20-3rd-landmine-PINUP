<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useBack } from '@/composables/useBack'
import api from '@/api/axios'
import { useUserDataStore } from '@/stores/userDataStore.js'

const router = useRouter()
const { back } = useBack({ name: 'feeds' })
const userStore = useUserDataStore()

const title = ref('')
const content = ref('')
const image = ref(null)
const isSubmitting = ref(false)

const userId = computed(() => userStore.user?.id ?? null)

const handleFileChange = (event) => {
  const target = event.target
  const fileList = target && target.files ? target.files : null
  image.value = fileList && fileList.length > 0 ? fileList[0] : null
}

const handleSubmit = async () => {
  const trimmedTitle = title.value.trim()
  const trimmedContent = content.value.trim()

  if (!userId.value) {
    ElMessage.warning('로그인이 필요합니다. 다시 로그인해 주세요.')
    router.push({ path: '/login', query: { redirect: '/feeds/write' } })
    return
  }

  if (!image.value) {
    ElMessage.warning('이미지를 한 장 업로드해 주세요.')
    return
  }

  if (trimmedTitle.length === 0) {
    ElMessage.warning('제목을 입력해 주세요.')
    return
  }
  if (trimmedTitle.length <= 5) {
    ElMessage.warning('제목은 5글자보다 길게 작성해 주세요.')
    return
  }

  if (trimmedContent.length === 0) {
    ElMessage.warning('내용을 입력해 주세요.')
    return
  }
  if (trimmedContent.length <= 10) {
    ElMessage.warning('내용은 10자보다 길게 작성해 주세요.')
    return
  }

  if (isSubmitting.value) return
  isSubmitting.value = true

  try {
    const formData = new FormData()

    formData.append('userId', String(userId.value))
    formData.append('title', trimmedTitle)
    formData.append('content', trimmedContent)
    formData.append('imageFile', image.value)

    const res = await api.post('/feeds/write', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    const newFeedId = res.data?.data

    if (newFeedId) {
      await router.push({ name: 'feed-detail', params: { feedId: newFeedId } })
    } else {
      ElMessage.error('피드는 작성완료')
    }
  } catch (e) {
    console.error(e)
    ElMessage.error('피드가 작성되지 않았습니다.')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="feed-page">
    <div class="feed-top-bar">
      <button type="button" class="feed-back-btn" @click="back">
        ←
      </button>

      <div class="feed-top-left">
        <span>새 피드 작성</span>
      </div>

      <el-button type="primary" :loading="isSubmitting" @click="handleSubmit">
        작성
      </el-button>
    </div>

    <div class="feed-form">
      <!-- 제목 -->
      <div class="feed-form-row">
        <label class="feed-form-label" for="feed-title">제목</label>
        <el-input
            id="feed-title"
            v-model="title"
            class="feed-input"
            placeholder="새 피드 제목"
        />
      </div>

      <!-- 내용 -->
      <div class="feed-form-row">
        <label class="feed-form-label" for="feed-content">내용</label>
        <el-input
            id="feed-content"
            v-model="content"
            type="textarea"
            :rows="10"
            class="feed-textarea"
            placeholder="새 피드 내용"
        />
      </div>

      <!-- 이미지 업로드 (1장) -->
      <div class="feed-form-row">
        <div class="feed-form-label">이미지 업로드</div>

        <label class="feed-upload-label">
          <input
              type="file"
              accept="image/*"
              class="feed-upload-input"
              @change="handleFileChange"
          />
          <span>+ 이미지를 업로드 해주세요</span>
        </label>

        <div v-if="image" class="feed-upload-selected">
          선택된 이미지: {{ image.name }}
        </div>
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
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  border: 1px dashed #ccc;
  border-radius: 8px;
  width: 100%;
  cursor: pointer;
}

.feed-upload-selected {
  margin-top: 8px;
  font-size: 13px;
  color: #666;
}
</style>
