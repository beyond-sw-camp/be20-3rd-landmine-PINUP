<template>
  <div class="popup-overlay" @click.self="close">
    <div class="popup">

      <!-- 제목 -->
      <h3 class="popup-title">아이템 구매</h3>

      <!-- 이미지 -->
      <img
          :src="item.imageUrl || defaultImage"
          alt="item image"
          class="item-image"
      />

      <!-- 아이템 이름 -->
      <p class="item-name">{{ item.name }}</p>

      <!-- 가격 -->
      <p class="item-price">{{ item.price }} P</p>

      <!-- 버튼 영역 -->
      <div class="btn-group">
        <button class="btn cancel" @click="close">취소</button>
        <button class="btn confirm" @click="buyItem">구매하기</button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";
import { StoreApi } from "@/api/StoreApi";

const props = defineProps({
  item: { type: Object, required: true }
});

const emit = defineEmits(["close"]);

const defaultImage = "/images/no-image.png";

function close() {
  emit("close");
}

async function buyItem() {
  try {
    await StoreApi.buyItem(props.item.itemId);
    alert("구매 완료!");
    emit("close");
  } catch (err) {
    console.error(err);
    alert("구매 실패");
  }
}
</script>

<style scoped>
.popup-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 50;
}

.popup {
  background: #fff;
  padding: 28px;
  width: 360px;
  border-radius: 22px;
  text-align: center;
  box-shadow: 0 14px 40px rgba(0,0,0,0.15);
}

.popup-title {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 14px;
}

.item-image {
  width: 160px;
  height: 160px;
  margin: 0 auto 10px auto;
  border-radius: 14px;
  background: #eee;
  object-fit: cover;
}

.item-name {
  font-weight: 600;
  font-size: 16px;
  margin-top: 6px;
}

.item-price {
  font-size: 15px;
  margin: 4px 0 14px;
}

.btn-group {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.btn {
  padding: 8px 18px;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  font-size: 14px;
}

.cancel {
  background: #ccc;
  color: #222;
}

.confirm {
  background: #1A8CFF;
  color: #fff;
}
</style>
