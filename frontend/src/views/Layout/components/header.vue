<template>
  <el-container>
    <el-header height="60px" class="header-el">
      <!-- 左侧Logo和标题 -->
      <div class="header-left">
        <h1 class="system-title" @click="handleTitleClick">
          <el-icon>
            <Menu />
          </el-icon>
          若林轻小说后台管理系统
        </h1>
      </div>

      <!-- 右侧面包屑和用户信息 -->
      <div class="header-right">
        <el-breadcrumb separator="/" class="breadcrumb">
          <el-breadcrumb-item v-for="item in breadcrumbItems" :key="item.path" :to="{ path: item.path }">
            {{ item.meta.title }}
          </el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 用户信息下拉菜单 -->
        <el-dropdown v-if="userInfo" class="user-dropdown">
          <div class="user-info" @click.stop>
            <el-avatar :size="32" class="user-avatar">
              {{ (userInfo.username || userInfo.email || '用户').charAt(0).toUpperCase() }}
            </el-avatar>
            <span class="user-name">
              {{ userInfo.username || userInfo.email || '用户' }}
            </span>
            <el-icon class="el-icon--right">
              <ArrowDown />
            </el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item index="/admin/user-info" @click="$router.push('/admin/user-info')">
                <el-icon>
                  <User />
                </el-icon>
                <span>个人中心</span>
              </el-dropdown-item>
              <el-dropdown-item divided @click="$emit('logout')">
                <span>退出登录</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-header>
  </el-container>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import {
  Menu,
  ArrowDown,
  User,
  Setting
} from '@element-plus/icons-vue'

const route = useRoute()
const breadcrumbItems = ref([])

// 生成面包屑的函数
const getBreadcrumbs = () => {
  // route.matched 是一个数组，包含当前路由的所有嵌套路径片段的路由记录
  const matched = route.matched.filter(item => item.meta && item.meta.title)

  // 如果第一个不是首页，可以手动添加一个
  const first = matched[0]
  if (first && first.path !== '/admin') {
    // 这里可以根据你的首页路由进行调整
    breadcrumbItems.value = [{ path: '/admin', meta: { title: '首页' } }].concat(matched)
  } else {
    breadcrumbItems.value = matched
  }
}

// 监听路由变化，并重新生成面包屑
watch(() => route.path, () => {
  getBreadcrumbs()
})

// 组件挂载时也生成一次面包屑
onMounted(() => {
  getBreadcrumbs()
})


// 定义组件接收的props
defineProps({
  userInfo: {
    type: Object,
    default: null
  }
})

// 定义组件发出的事件
const emit = defineEmits(['logout', 'toggleAside'])

// 点击标题触发侧边栏折叠/展开
const handleTitleClick = () => {
  console.log('Title clicked, emitting toggleAside event')
  emit('toggleAside')
}
</script>

<style scoped>
.header-el {
  padding: 0 20px;
  background-color: #fff;
  border-bottom: 1px solid #e9ecef;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 15px;
}

.logo {
  cursor: pointer;
  color: #1890ff;
}

.system-title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #1890ff;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  z-index: 100;
  padding: 5px 10px;
  border-radius: 4px;
}

.system-title:hover {
  color: #40a9ff;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.breadcrumb {
  font-size: 14px;
}

.user-dropdown {
  cursor: pointer;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 10px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.user-info:hover {
  background-color: #f5f7fa;
}

.user-avatar {
  background-color: #1890ff;
}

.user-name {
  font-size: 14px;
  color: #333;
}

.el-dropdown-menu {
  min-width: 160px;
}

.el-dropdown-item {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>