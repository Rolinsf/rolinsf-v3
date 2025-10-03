<!-- 个人主页头部背景图组件 -->
<template>
  <div class="profile-bg">
    <div 
      class="bg-image" 
      :style="{ backgroundImage: `url(${profileBackground})` }"
    ></div>
    <!-- 个人操作按钮 -->
    <div class="top-actions">
      <el-button type="primary" size="small" class="follow-btn" @click="handleFollow">
        <el-icon><Plus /></el-icon>
        {{ isFollowing ? '已关注' : '关注' }}
      </el-button>
      <el-button size="small" class="message-btn" @click="handleMessage">
        <el-icon><ChatDotSquare /></el-icon>
        私信
      </el-button>
      <el-dropdown trigger="click" @command="handleDropdownCommand">
        <el-button size="small">
          <el-icon><MoreFilled /></el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="share">分享</el-dropdown-item>
            <el-dropdown-item command="report">举报</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    
    <!-- 背景图编辑按钮 -->
    <el-button 
      v-if="canEdit" 
      size="small" 
      class="edit-bg-btn"
      @click="triggerBgChange"
    >
      <el-icon><Edit /></el-icon>
      编辑背景
    </el-button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Plus, ChatDotSquare, MoreFilled, Edit } from '@element-plus/icons-vue'

const props = defineProps({
  // 背景图片URL
  backgroundImage: {
    type: String,
    default: ''
  },
  // 是否关注状态
  isFollowing: {
    type: Boolean,
    default: false
  },
  // 是否可编辑
  canEdit: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits([
  'follow',
  'message',
  'share',
  'report',
  'backgroundChange'
])

// 个人主页背景图
const profileBackground = props.backgroundImage || 'https://via.placeholder.com/1200x300?text=个人主页背景'

// 处理关注按钮点击
const handleFollow = () => {
  emit('follow')
}

// 处理私信按钮点击
const handleMessage = () => {
  emit('message')
}

// 处理下拉菜单命令
const handleDropdownCommand = (command) => {
  if (command === 'share') {
    emit('share')
  } else if (command === 'report') {
    emit('report')
  }
}

// 触发背景图更改
const triggerBgChange = () => {
  emit('backgroundChange')
}
</script>

<style scoped>
.profile-bg {
  position: relative;
  height: 180px;
  overflow: hidden;
  border-radius: 8px 8px 0 0;
}

.bg-image {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-color: #f0f2f5;
  transition: background-image 0.3s ease;
}

.top-actions {
  position: absolute;
  top: 15px;
  right: 20px;
  display: flex;
  gap: 10px;
  z-index: 10;
}

.follow-btn, .message-btn {
  transition: all 0.3s ease;
}

.follow-btn {
  background-color: #f759ab;
  border-color: #f759ab;
}

.follow-btn:hover {
  background-color: #ff7ac6;
  border-color: #ff7ac6;
}

.follow-btn.is-checked {
  background-color: #999;
  border-color: #999;
}

.edit-bg-btn {
  position: absolute;
  bottom: 15px;
  right: 20px;
  background-color: rgba(0, 0, 0, 0.5);
  border-color: rgba(0, 0, 0, 0.5);
  color: white;
  transition: all 0.3s ease;
}

.edit-bg-btn:hover {
  background-color: rgba(0, 0, 0, 0.7);
  border-color: rgba(0, 0, 0, 0.7);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .profile-bg {
    height: 120px;
  }
  
  .top-actions {
    top: 10px;
    right: 10px;
    gap: 8px;
  }
  
  .edit-bg-btn {
    bottom: 10px;
    right: 10px;
  }
  
  :deep(.el-button) {
    font-size: 12px;
    padding: 4px 8px;
  }
  
  :deep(.el-icon) {
    font-size: 14px;
  }
}
</style>