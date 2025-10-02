<!-- 头部 -->
<template>
  <div class="page-header">
    <h2>用户管理</h2>
    <el-button type="primary" @click="$emit('add-user')">添加用户</el-button>
  </div>
</template>

<script setup>
// 定义事件
const emit = defineEmits(['add-user'])
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #ebeef5;
}

.page-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
}
</style>