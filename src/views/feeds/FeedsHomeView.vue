<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import api from "@/api/axios";
import { useUserDataStore } from "@/stores/userDataStore";

const router = useRouter();
const userStore = useUserDataStore();

const feeds = ref([]);
const isLoading = ref(false);
const isEnd = ref(false);

const cursor = ref(null);
const ROWS = 4; // 한 번에 가져올 개수(원하면 1로 다시 줄여도 됨)

// 피드 목록 로딩
const loadMore = async () => {
  if (isLoading.value || isEnd.value) return;

  isLoading.value = true;
  try {
    // 데모용 딜레이 (필요 없으면 지워도 됨)
    // await new Promise(resolve => setTimeout(resolve, 3000));

    const res = await api.get("/feeds/list", {
      params: {
        rows: ROWS,
        cursor: cursor.value ?? undefined,
      },
    });

    console.log("feeds list response >>>", res.data);

    // Swagger 기준: data 안에 items 배열
    const data = res.data?.data ?? {};
    const items = data.items ?? [];

    if (items.length === 0) {
      // 더 이상 가져올 게 없음
      if (!feeds.value.length) {
        // 처음부터 0개면 "작성된 피드가 없습니다" 유지
      }
      isEnd.value = true;
      return;
    }

    const mapped = items.map((item) => ({
      id: item.id,                                 // 피드 PK
      title: item.title,                           // 제목
      thumbnailUrl: item.thumbnailUrl || item.imageUrl, // 썸네일/이미지
      userProfile: null,                           // 프로필 이미지는 아직 없음
      userName: item.authorName,                   // 작성자 이름
      likeCount: item.likeCount ?? 0,              // 좋아요 수 기본값 0
    }));

    feeds.value.push(...mapped);

    // 만약 nextCursor 내려주면 사용, 없으면 그냥 끝으로 판단
    if (data.nextCursor !== undefined && data.nextCursor !== null) {
      cursor.value = data.nextCursor;
    } else {
      isEnd.value = true;
    }
  } catch (e) {
    console.error("피드 목록 조회 실패:", e);
  } finally {
    isLoading.value = false;
  }
};

const WRITE_PATH = "/feeds/write";

const goToWrite = async () => {
  const ok = await userStore.ensureLoggedIn();

  if (!ok) {
    router.push({
      path: "/login",
      query: { redirect: WRITE_PATH },
    });
    return;
  }

  // 로그인 확인 끝났으면 글쓰기 뷰로
  router.push(WRITE_PATH);
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

    <!-- 처음 로딩 스켈레톤 -->
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
            <el-skeleton-item
                variant="text"
                style="width: 80%; height: 14px; margin-bottom: 6px;"
            />
            <el-skeleton-item
                variant="text"
                style="width: 60%; height: 12px;"
            />
          </div>
        </template>
      </el-skeleton>
    </div>

    <!-- 실제 피드 리스트 -->
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

    <!-- 완전 비어 있을 때 -->
    <div
        v-if="!isLoading && feeds.length === 0"
        class="feed-empty"
    >
      작성된 피드가 없습니다
    </div>

    <!-- 추가 로딩 / 끝 표시 -->
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
