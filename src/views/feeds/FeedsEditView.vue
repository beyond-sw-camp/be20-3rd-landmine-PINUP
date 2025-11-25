<script setup>
import { ref } from 'vue'
import { useBack } from '@/composables/useBack'

const { back } = useBack({ name: 'feeds' })

const title = ref('')
const content = ref('')

const handleSubmit = () => {
  console.log(title.value, content.value)
}
</script>

<template>
  <div class="feed-page">
    <div class="feed-top-bar">
      <button
          type="button"
          class="feed-back-btn"
          @click="back"
      >
        ←
      </button>

      <div class="feed-top-left">
        <span>새 피드 작성</span>
      </div>

      <el-button type="primary" @click="handleSubmit">
        작성
      </el-button>
    </div>

    <!-- 작성 폼 카드 -->
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

      <!-- 이미지 업로드 -->
      <div class="feed-form-row">
        <div class="feed-form-label">이미지 업로드</div>
        <div class="feed-upload-area">
          + 이미지를 업로드 해주세요
        </div>
      </div>
    </div>
  </div>
</template>

<style src="@/assets/styles/feeds.css" />

<style scoped>

</style>