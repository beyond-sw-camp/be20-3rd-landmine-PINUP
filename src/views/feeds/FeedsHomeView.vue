<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import api from "@/api/axios";

const router = useRouter();

const feeds = ref([]);
const isLoading = ref(false);
const isEnd = ref(false);


const cursor = ref(null);
const ROWS = 1;

const loadMore = async () => {
  if (isLoading.value || isEnd.value) return;

  isLoading.value = true;
  try {
    await new Promise(resolve => setTimeout(resolve, 3000));

    const res = await api.get("/feeds/list", {
      params: {
        rows: ROWS,
        cursor: cursor.value ?? undefined,
      },
    });

    const slice = res.data.data;
    const content = slice?.content ?? [];

    if (content.length === 0) {
      isEnd.value = true;
      return;
    }

    const mapped = content.map((item) => ({
      id: item.id,                      // 피드 PK
      title: item.title,                // 제목
      thumbnailUrl: item.thumbnailUrl,  // 썸네일 URL
      // 프로필 이미지는 DTO에 없으니 null 처리
      userProfile: null,
      userName: item.authorName,        // 작성자 이름
      // likeCount 없으면 0으로 처리
      likeCount: item.likeCount ?? 0,
    }));

    feeds.value.push(...mapped);

    cursor.value = slice.nextCursor ?? null;

    if (!slice.hasNext || !slice.nextCursor) {
      isEnd.value = true;
    }
  } catch (e) {
    console.error("피드 목록 조회 실패:", e);
  } finally {
    isLoading.value = false;
  }
};

const goToWrite = () => {
  router.push("/feeds/write");
};

// 첫 로드시 한 번 조회
onMounted(() => {
  loadMore();
});
</script>

<template>
  <div class="feed-page">

    <div class="feed-top-bar">
      <div class="feed-top-left">
        피드
      </div>

      <el-button type="primary" @click="goToWrite">
        피드 등록하기
      </el-button>
    </div>

    <div
        v-if="isLoading && feeds.length === 0"
        class="feed-grid"
    >
      <el-skeleton
          v-for="n in 4"
          :key="n"
          animated
          style="width: 100%;"
      >
        <template #template>

          <el-skeleton-item
              variant="image"
              style="width: 100%; aspect-ratio: 1 / 1; border-radius: 18px;"
          />
          <div style="margin-top: 10px;">
            <el-skeleton-item variant="text" style="width: 80%; height: 14px; margin-bottom: 6px;" />
            <el-skeleton-item variant="text" style="width: 60%; height: 12px;" />
          </div>
        </template>
      </el-skeleton>
    </div>

    <div
        v-else
        class="feed-grid"
        v-infinite-scroll="loadMore"
        :infinite-scroll-disabled="isLoading || isEnd"
        :infinite-scroll-distance="200"
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
                <img
                    v-if="feed.userProfile"
                    :src="feed.userProfile"
                    alt=""
                />
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

    <div
        v-if="!isLoading && feeds.length === 0"
        class="feed-empty"
    >
      작성된 피드가 없습니다
    </div>

    <div v-else>
      <div v-if="isLoading && feeds.length > 0" class="feed-loading">
        Loading...
      </div>

      <p v-else-if="isEnd && feeds.length > 0" class="feed-end">
        마지막 피드입니다.
      </p>
    </div>

  </div>
</template>

<style src="@/assets/styles/feeds.css" />

<style scoped>

</style>
