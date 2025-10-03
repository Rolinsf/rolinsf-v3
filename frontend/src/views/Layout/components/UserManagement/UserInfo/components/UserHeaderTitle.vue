<template>
  <div class="header-title">
    <el-icon><UserFilled /></el-icon>
    <h2>个人设置</h2>
  </div>
</template>

<script setup>
import { UserFilled } from '@element-plus/icons-vue'
</script>

<style scoped>
.header-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}
</style>