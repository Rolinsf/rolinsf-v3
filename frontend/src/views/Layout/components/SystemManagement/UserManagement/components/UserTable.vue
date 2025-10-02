<!-- 用户表格组件部分 -->
<template>
  <el-table :data="userList" style="width: 100%" v-loading="loading">
    <el-table-column prop="id" label="用户ID" width="80" />
    <el-table-column prop="username" label="用户名" width="150">
      <template #default="scope">
        <div class="username-cell">
          <el-avatar size="small" class="user-avatar-small">{{ getAvatarText(scope.row.username) }}</el-avatar>
          <span>{{ scope.row.username }}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="email" label="邮箱" width="200" />
    <el-table-column prop="nickname" label="昵称" width="120">
      <template #default="scope">
        <span>{{ scope.row.nickname || '-' }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="gender" label="性别" width="80">
      <template #default="scope">
        <span>{{ scope.row.gender === 1 ? '男' : '女' }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="roleName" label="角色" width="100" />
    <el-table-column prop="status" label="状态" width="80">
      <template #default="scope">
        <el-switch 
          v-model="scope.row.status" 
          :active-value="1" 
          :inactive-value="0" 
          @change="(value) => handleStatusChange(scope.row.id, value)"
        />
      </template>
    </el-table-column>
    <el-table-column prop="createdAt" label="注册时间" width="180">
      <template #default="scope">
        <span>{{ formatDate(scope.row.createdAt) }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="lastLogin" label="上次登录时间" width="180">
      <template #default="scope">
        <span>{{ scope.row.lastLogin ? formatDate(scope.row.lastLogin) : '-' }}</span>
      </template>
    </el-table-column>
    <el-table-column label="操作" width="220" fixed="right">
      <template #default="scope">
        <span class="operation-buttons-container">
          <el-button size="small" @click="handleView(scope.row)" class="operation-button">查看</el-button>
          <el-button size="small" type="primary" @click="handleEdit(scope.row)" class="operation-button">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row.id)" class="operation-button">删除</el-button>
        </span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

// 定义属性
const props = defineProps({
  userList: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})

// 定义事件
const emit = defineEmits(['view-user', 'edit-user', 'delete-user', 'status-change'])

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

// 获取头像文字（用户名首字母）
const getAvatarText = (username) => {
  return username ? username.charAt(0).toUpperCase() : ''
}

// 处理查看
const handleView = (user) => {
  emit('view-user', user)
}

// 处理编辑
const handleEdit = (user) => {
  emit('edit-user', user)
}

// 处理删除
const handleDelete = (userId) => {
  emit('delete-user', userId)
}

// 处理状态变更
const handleStatusChange = (userId, status) => {
  emit('status-change', userId, status)
}
</script>

<style scoped>
.username-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-avatar-small {
  background-color: #409eff;
}

/* 操作按钮容器 */
.operation-buttons-container {
  display: flex;
  gap: 5px;
  flex-wrap: nowrap;
}

/* 操作按钮样式 */
.operation-button {
  flex-shrink: 0;
  padding: 0 8px;
  font-size: 12px;
}
</style>