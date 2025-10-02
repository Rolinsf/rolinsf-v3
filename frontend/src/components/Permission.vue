<template>
  <div v-if="hasPermission">
    <slot></slot>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useUserStore } from '@/store/user'

// 定义组件的属性
const props = defineProps({
  // 单个权限
  permission: {
    type: String,
    default: ''
  },
  // 多个权限中的任意一个
  permissions: {
    type: Array,
    default: () => []
  },
  // 角色
  role: {
    type: String,
    default: ''
  },
  // 多个角色中的任意一个
  roles: {
    type: Array,
    default: () => []
  }
})

// 获取用户store
const userStore = useUserStore()

// 计算是否有权限
const hasPermission = computed(() => {
  // 检查角色
  if (props.role) {
    return userStore.userRole === props.role
  }
  
  if (props.roles && props.roles.length > 0) {
    return props.roles.includes(userStore.userRole)
  }
  
  // 检查权限
  if (props.permission) {
    return userStore.hasPermission(props.permission)
  }
  
  if (props.permissions && props.permissions.length > 0) {
    return userStore.hasAnyPermission(props.permissions)
  }
  
  // 默认显示
  return true
})
</script>

<style scoped>
/* 可以在这里添加组件的样式 */
</style>