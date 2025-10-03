<template>
  <div class="header-actions">
    <el-dropdown @command="handleActionCommand" trigger="click">
      <el-button>
        更多操作
        <el-icon class="el-icon--right"><ArrowDown /></el-icon>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="viewProfile">预览个人主页</el-dropdown-item>
          <el-dropdown-item command="shareProfile">分享个人主页</el-dropdown-item>
          <el-dropdown-item command="report" divided>举报用户</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup>
import { ArrowDown } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['view-profile', 'share-profile'])

// 处理操作命令
const handleActionCommand = (command) => {
  switch (command) {
    case 'viewProfile':
      // 预览个人主页
      emit('view-profile')
      break
    case 'shareProfile':
      // 分享个人主页
      emit('share-profile')
      break
    case 'report':
      // 举报用户
      ElMessage.warning('举报功能暂未开放')
      break
    default:
      break
  }
}
</script>

<style scoped>
.header-actions {
  display: flex;
  align-items: center;
}
</style>