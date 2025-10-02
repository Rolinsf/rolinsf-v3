<!-- 用户详情对话框组件 -->
<template>
  <el-dialog
    v-model="dialogVisible"
    title="用户详情"
    width="500px"
  >
    <el-descriptions :column="1" border>
      <el-descriptions-item label="用户ID">{{ userInfo.id }}</el-descriptions-item>
      <el-descriptions-item label="用户名">{{ userInfo.username }}</el-descriptions-item>
      <el-descriptions-item label="邮箱">{{ userInfo.email }}</el-descriptions-item>
      <el-descriptions-item label="昵称">{{ userInfo.nickname || '-' }}</el-descriptions-item>
      <el-descriptions-item label="性别">{{ userInfo.gender === 1 ? '男' : '女' }}</el-descriptions-item>
      <el-descriptions-item label="角色">{{ userInfo.roleName || '普通用户' }}</el-descriptions-item>
      <el-descriptions-item label="状态">{{ userInfo.status === 1 ? '启用' : '禁用' }}</el-descriptions-item>
      <el-descriptions-item label="注册时间">{{ formatDate(userInfo.createdAt) }}</el-descriptions-item>
      <el-descriptions-item label="上次登录">{{ formatDate(userInfo.lastLogin) || '暂无登录记录' }}</el-descriptions-item>
      <el-descriptions-item label="阅读时长">{{ userInfo.readingTime || 0 }}分钟</el-descriptions-item>
      <el-descriptions-item label="收藏小说">{{ userInfo.favoriteCount || 0 }}本</el-descriptions-item>
      <el-descriptions-item label="评论数量">{{ userInfo.commentCount || 0 }}条</el-descriptions-item>
    </el-descriptions>
  </el-dialog>
</template>

<script setup>
import { computed } from 'vue'

// 定义属性
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  userInfo: {
    type: Object,
    default: () => ({})
  }
})

// 定义事件
const emit = defineEmits(['update:visible'])

// 对话框状态
const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>