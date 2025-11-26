<template>
  <div class="modal-backdrop">
    <div class="modal">
      <h3>{{ editItem ? "아이템 수정" : "아이템 등록" }}</h3>

      <form @submit.prevent="saveItem">
        <label>아이템 이름</label>
        <input v-model="form.name" required />

        <label>설명</label>
        <textarea v-model="form.description" required />

        <label>가격</label>
        <input type="number" v-model="form.price" required />

        <label>카테고리</label>
        <select v-model="form.category">
          <option>MARKER</option>
          <option>SPECIALTY</option>
          <option>BUILDING</option>
          <option>TILE</option>
        </select>

        <label>판매 정책</label>
        <select v-model="form.limitType">
          <option>NORMAL</option>
          <option>LIMITED</option>
          <option>EVENT</option>
        </select>

        <label>이미지 URL</label>
        <input v-model="form.imageUrl" required />

        <div class="actions">
          <button type="submit" class="save-btn">저장</button>
          <button type="button" class="cancel-btn" @click="$emit('close')">
            닫기
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from "vue";
import { AdminStoreApi } from "@/api/AdminStoreApi.js";

const props = defineProps({
  editItem: Object
});

const emit = defineEmits(["close", "saved"]);

const form = reactive({
  adminId: 1, // TODO: 로그인 관리자 ID로 교체
  regionId: null,
  name: "",
  description: "",
  price: 0,
  category: "MARKER",
  limitType: "NORMAL",
  imageUrl: "",
  createdAt: null
});

// 수정 모드 초기값 세팅
watch(
    () => props.editItem,
    (v) => {
      if (v) Object.assign(form, v);
    },
    { immediate: true }
);

async function saveItem() {
  if (props.editItem) {
    await AdminStoreApi.updateItem(props.editItem.itemId, form);
  } else {
    await AdminStoreApi.createItem(form);
  }
  emit("saved");
  emit("close");
}
</script>

<style scoped>
/* 전체 모달 */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3000;
}

/* 팝업 박스 */
.modal {
  width: 420px;
  background: #fff;
  padding: 24px;
  border-radius: 16px;
}

label {
  font-weight: bold;
  margin-top: 12px;
  display: block;
}

input, textarea, select {
  width: 100%;
  padding: 8px;
  margin-top: 4px;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.actions {
  margin-top: 16px;
  text-align: right;
}

.save-btn {
  background: #3ac45d;
  border: none;
  color: white;
  padding: 8px 14px;
  border-radius: 8px;
  cursor: pointer;
  margin-right: 6px;
}

.cancel-btn {
  background: #bbb;
  border: none;
  color: white;
  padding: 8px 14px;
  border-radius: 8px;
  cursor: pointer;
}
</style>
