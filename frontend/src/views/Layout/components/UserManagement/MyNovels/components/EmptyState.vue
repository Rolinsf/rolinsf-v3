<template>
  <div class="empty-state">
    <el-empty description="你还没有创作任何小说哦">
      <el-button type="primary" :icon="Plus" @click="$emit('create-novel')">开始创作第一部小说</el-button>
    </el-empty>
  </div>
</template>

<script setup>
import { Plus } from '@element-plus/icons-vue';
defineEmits(['create-novel']);
</script>

<style scoped>
.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
}
</style>
