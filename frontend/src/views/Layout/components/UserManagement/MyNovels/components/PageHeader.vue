<template>
  <div class="page-header">
    <h2 class="title">我的小说</h2>
    <el-button type="primary" :icon="Plus" @click="$emit('create-novel')">新建小说</el-button>
  </div>
</template>

<script setup>
import { Plus } from '@element-plus/icons-vue';
defineEmits(['create-novel']);
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.title {
  font-size: 24px;
  color: #303133;
}
</style>
