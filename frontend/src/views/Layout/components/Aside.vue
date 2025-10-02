<template>
  <el-aside :width="collapsed ? '0px' : '200px'" class="aside-container"
    :style="{ transform: collapsed ? '-translateX(100%)' : 'translateX(0)' }">
    <div class="menu-wrapper">
      <el-menu class="aside-menu" background-color="#fff" text-color="#333" active-text-color="#1890ff"
        default-active="1" router="true">
        <el-menu-item index="/admin">
          <el-icon>
            <HomeFilled />
          </el-icon>
          <span>首页</span>
        </el-menu-item>

        <el-sub-menu index="1">
          <template #title>
            <el-icon>
              <UserFilled />
            </el-icon>
            <span>个人中心</span>
          </template>
          <el-menu-item index="/admin/user/user-info">
            <el-icon>
              <User />
            </el-icon>
            <span>用户信息</span>
          </el-menu-item>
          <el-menu-item index="/admin/user/private-messages">
            <el-icon>
              <Message />
            </el-icon>
            <span>私信管理</span>
          </el-menu-item>
          <el-menu-item index="/admin/user/view-history">
            <el-icon>
              <ChatDotSquare />
            </el-icon>
            <span>观看记录</span>
          </el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="2">
          <template #title>
            <el-icon>
              <Document />
            </el-icon>
            <span>小说管理</span>
          </template>
          <el-menu-item index="/admin/novel/novel-list">
            <el-icon>
              <Notebook />
            </el-icon>
            <span>小说列表</span>
          </el-menu-item>
          <el-menu-item index="/admin/novel/comment-management">
            <el-icon>
              <Message />
            </el-icon>
            <span>评论管理</span>
          </el-menu-item>

          <el-menu-item index="/admin/novel/data-statistics">
            <el-icon>
              <PieChart />
            </el-icon>
            <span>数据统计</span>
          </el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="3">
          <template #title>
            <el-icon>
              <Setting />
            </el-icon>
            <span>系统管理</span>
          </template>
          <el-menu-item index="/admin/system/user-management">
            <el-icon>
              <Lock />
            </el-icon>
            <span>用户管理</span>
          </el-menu-item>
          <el-menu-item index="/admin/system/system-log">
            <el-icon>
              <Files />
            </el-icon>
            <span>系统日志</span>
          </el-menu-item>
          <el-menu-item index="/admin/system/system-settings">
            <el-icon>
              <Setting />
            </el-icon>
            <span>系统设置</span>

          </el-menu-item>
        </el-sub-menu>

      </el-menu>
    </div>
  </el-aside>
</template>

<script setup>
import { Files, Lock, Notebook, UserFilled } from '@element-plus/icons-vue';

// 接收折叠状态属性
defineProps({
  collapsed: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.aside-container {
  height: 100vh;
  background-color: #fff;
  border-right: 1px solid #e9ecef;
  box-shadow: 2px 0 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  position: relative;
  z-index: 10;
  overflow: hidden;
}

.menu-wrapper {
  height: calc(100% - 64px);
  overflow-y: auto;
}

.aside-header {
  padding: 20px;
  text-align: center;
  border-bottom: 1px solid #e9ecef;
}

.aside-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1890ff;
}

.aside-menu {
  flex: 1;
  border-right: none;
  padding-top: 20px;
}

.el-menu-item {
  height: 50px;
  line-height: 50px;
  font-size: 14px;
}

.el-sub-menu__title {
  height: 50px;
  line-height: 50px;
  font-size: 14px;
}
</style>