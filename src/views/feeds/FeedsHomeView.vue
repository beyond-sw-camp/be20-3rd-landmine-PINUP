<script setup>

</script>

<template>
  <div class="feed-page">

    <!-- 상단 버튼만 있는 심플 바 -->
    <div class="feed-top-bar">
      <div class="feed-top-left">
        피드
      </div>

      <el-button type="primary" @click="goToWrite">
        피드 등록하기
      </el-button>
    </div>

    <!-- 4열 그리드(슬라이스 느낌) -->
    <div
        class="feed-grid"
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="isLoading || isEnd"
        infinite-scroll-distance="200"
    >
      <div
          v-for="feed in feeds"
          :key="feed.id"
          class="feed-card"
      >
        <div class="feed-card__thumb">
          <img :src="feed.thumbnailUrl" :alt="feed.title" />
        </div>

        <div class="feed-card__body">
          <div class="feed-card__title">
            {{ feed.title }}
          </div>

          <div class="feed-card__footer">
            <div class="feed-card__user">
              <div class="feed-card__user-avatar">
                <img :src="feed.userProfile" alt="" />
              </div>
              <span>{{ feed.userName }}</span>
            </div>

            <div class="feed-card__likes">
              ❤️ {{ feed.likeCount }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 로딩 / 끝 -->
    <div v-if="isLoading" class="feed-loading">
      불러오는 중...
    </div>
    <p v-if="isEnd" class="feed-end">
      마지막 피드입니다.
    </p>

  </div>
</template>

<style src="@/assets/styles/feeds.css" />

<style scoped>

</style>