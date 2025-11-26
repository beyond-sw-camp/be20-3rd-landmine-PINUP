<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import api from "@/api/axios";
import { useUserDataStore } from "@/stores/userDataStore";

const router = useRouter();
const route = useRoute();
const userStore = useUserDataStore();

/* -----------------------------------
   상태
----------------------------------- */
const feeds = ref([]);
const isLoading = ref(false);
const isEnd = ref(false);
const cursor = ref(null);

const ROWS = 4; // 한번에 가져올 개수

/* -----------------------------------
   authorId 필터 (마이페이지 → 전체 보기)
   /feeds?authorId=3 형태면 3을 받아옴
----------------------------------- */
const authorId = computed(() => route.query.authorId ?? null);

/* -----------------------------------
   피드 목록 로딩
----------------------------------- */
const loadMore = async () => {
  if (isLoading.value || isEnd.value) return;

  isLoading.value = true;
  try {
    const res = await api.get("/feeds/list", {
      params: {
        rows: ROWS,
        cursor: cursor.value ?? undefined,
        authorId: authorId.value ?? undefined, // ★ 추가된 필터
      },
    });

    console.log("feeds list response >>>", res.data);

    const data = res.data?.data ?? {};
    const items = data.items ?? [];

    if (items.length === 0) {
      if (!feeds.value.length) {
        // 처음부터 0개면 "작성된 피드가 없습니다" 유지
      }
      isEnd.value = true;
      return;
    }

    const mapped = items.map((item) => ({
      id: item.id,
      title: item.title,
      thumbnailUrl: item.thumbnailUrl || item.imageUrl,
      userProfile: null,
      userName: item.authorName,
      likeCount: item.likeCount ?? 0, // ★ BE 수정 후 정상 반영
    }));

    feeds.value.push(...mapped);

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

/* -----------------------------------
   글쓰기
----------------------------------- */
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

  router.push(WRITE_PATH);
};

/* -----------------------------------
   카드 → 디테일 이동
----------------------------------- */
const goToDetail = async (feedId) => {
  if (!feedId) return;

  const ok = await userStore.ensureLoggedIn();

  if (!ok) {
    router.push({
      path: "/login",
      query: { redirect: `/feeds/${feedId}` },
    });
    return;
  }

  router.push({
    name: "feed-detail",
    params: { feedId },
  });
};

/* -----------------------------------
   최초 로드
----------------------------------- */
onMounted(() => {
  loadMore();
});

/* -----------------------------------
   authorId 바뀔 때 자동 초기화 후 재로딩
   (마이페이지 → 전체보기 눌러서 진입할 때)
----------------------------------- */
watch(
    () => authorId.value,
    () => {
      feeds.value = [];
      cursor.value = null;
      isEnd.value = false;
      loadMore();
    }
);
</script>

<template>
  <div class="feed-page">
    <div class="feed-top-bar">
      <div class="feed-top-left">피드</div>

      <el-button type="primary" @click="goToWrite">
        피드 등록하기
      </el-button>
    </div>

    <!-- 처음 로딩 스켈레톤 -->
    <div v-if="isLoading && feeds.length === 0" class="feed-grid">
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
          @click="goToDetail(feed.id)"
      >
        <div class="feed-card__thumb">
          <img :src="feed.thumbnailUrl" :alt="feed.title" />
        </div>

        <div class="feed-card__body">
          <div class="feed-card__title">{{ feed.title }}</div>

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
    <div v-if="!isLoading && feeds.length === 0" class="feed-empty">
      작성된 피드가 없습니다
    </div>

    <!-- 추가 로딩 / 끝 -->
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
.feed-card {
  cursor: pointer;
}
</style>

