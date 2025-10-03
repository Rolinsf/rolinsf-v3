<!-- 个人信息组件 -->
<template>
  <div class="profile-info">
    <!-- 主体内容容器 -->
    <div class="profile-content">
      <!-- 头像区域 -->
      <div class="avatar-wrapper">
        <el-avatar 
          size="120" 
          :src="userInfo.avatar || defaultAvatar" 
          class="profile-avatar"
        >
          {{ getUserInitial(userInfo.username) }}
        </el-avatar>
        
        <!-- 编辑头像按钮 -->
        <el-button 
          v-if="canEdit" 
          size="small" 
          class="edit-avatar-btn"
          @click="triggerAvatarChange"
        >
          <el-icon><Edit /></el-icon>
        </el-button>
      </div>
      
      <!-- 用户信息区域 -->
      <div class="user-details">
        <!-- 用户名和编辑按钮 -->
        <div class="username-row">
          <h1 class="username">{{ userInfo.username }}</h1>
          
          <!-- 编辑用户名按钮 -->
          <el-button 
            v-if="canEdit" 
            size="small" 
            class="edit-name-btn"
            @click="triggerNameEdit"
          >
            <el-icon><Edit /></el-icon>
          </el-button>
        </div>
        
        <!-- 关注/粉丝/获赞统计 -->
        <div class="stats-section">
          <div class="stat-item" @click="handleFollowingClick">
            <span class="stat-value">{{ stats.following }}</span>
            <span class="stat-label">关注</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item" @click="handleFollowersClick">
            <span class="stat-value">{{ stats.followers }}</span>
            <span class="stat-label">粉丝</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item" @click="handleLikesClick">
            <span class="stat-value">{{ stats.likes }}</span>
            <span class="stat-label">获赞与收藏</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-value">{{ stats.views }}</span>
            <span class="stat-label">视频播放</span>
          </div>
        </div>
        
        <!-- 个人签名 -->
        <div class="user-signature" @click="triggerBioEdit" v-if="canEdit">
          {{ userInfo.bio || '点击添加个人签名' }}
        </div>
        <div class="user-signature" v-else>
          {{ userInfo.bio || '该用户还没有填写个人签名' }}
        </div>
        
        <!-- 用户标签 -->
        <div class="user-tags">
          <el-tag 
            v-for="tag in userTags" 
            :key="tag" 
            class="user-tag"
          >
            {{ tag }}
          </el-tag>
          <el-button 
            v-if="canEdit && userTags.length < 8" 
            size="small" 
            type="dashed" 
            class="add-tag-btn"
            @click="triggerAddTag"
          >
            <el-icon><Plus /></el-icon>
            添加标签
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Check, Edit, Plus } from '@element-plus/icons-vue'

const props = defineProps({
  // 用户信息
  userInfo: {
    type: Object,
    required: true
  },
  // 用户统计数据
  stats: {
    type: Object,
    default: () => ({
      following: 0,
      followers: 0,
      likes: 0,
      views: 0
    })
  },
  // 用户标签
  userTags: {
    type: Array,
    default: () => []
  },
  // 是否可编辑
  canEdit: {
    type: Boolean,
    default: true
  },
  // 背景图URL
  backgroundImage: {
    type: String,
    default: ''
  }
})

const emit = defineEmits([
  'avatarChange',
  'nameEdit',
  'bioEdit',
  'addTag',
  'followingClick',
  'followersClick',
  'likesClick',
  'bgChange'
])

// 默认头像
const defaultAvatar = '/avatar-placeholder.png'

// 获取用户头像文字（用户名首字母）
const getUserInitial = (username) => {
  if (!username) return 'U'
  return username.charAt(0).toUpperCase()
}

// 触发头像更改
const triggerAvatarChange = () => {
  emit('avatarChange')
}

// 触发名称编辑
const triggerNameEdit = () => {
  emit('nameEdit')
}

// 触发背景图更改
const triggerBgChange = () => {
  emit('bgChange')
}

// 触发签名编辑
const triggerBioEdit = () => {
  emit('bioEdit')
}

// 触发添加标签
const triggerAddTag = () => {
  emit('addTag')
}

// 处理关注统计点击
const handleFollowingClick = () => {
  emit('followingClick')
}

// 处理粉丝统计点击
const handleFollowersClick = () => {
  emit('followersClick')
}

// 处理获赞统计点击
const handleLikesClick = () => {
  emit('likesClick')
}
</script>

<style scoped>
.profile-info {
  padding: 20px;
  background-color: #fff;
  border-bottom: 1px solid #eee;
  margin-bottom: 20px;
  position: relative;
  top: -40px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

/* 主体内容容器 */
.profile-content {
  display: flex;
  gap: 20px;
  align-items: center; /* 修改为居中对齐 */
}

/* 背景图编辑按钮 */
.edit-bg-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  background-color: rgba(0, 0, 0, 0.6);
  border-color: rgba(0, 0, 0, 0.6);
  color: white;
  z-index: 10;
  opacity: 0.8;
  transition: opacity 0.3s ease;
}

.edit-bg-btn:hover {
  background-color: rgba(0, 0, 0, 0.8);
  border-color: rgba(0, 0, 0, 0.8);
  opacity: 1;
}

/* 头像容器 */
.avatar-wrapper {
  position: relative;
  flex-shrink: 0;
}

.profile-avatar {
  border: 4px solid #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.verification-badge {
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: #1da1f2;
  color: white;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #fff;
}

.edit-avatar-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.6);
  border-color: rgba(0, 0, 0, 0.6);
  color: white;
  width: 28px;
  height: 28px;
  min-width: 28px;
  padding: 0;
  margin: 0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.avatar-wrapper:hover .edit-avatar-btn {
  opacity: 1;
}

/* 用户名容器 */
.user-details {
  flex: 1;
  min-width: 0;
}

.username-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  flex-wrap: wrap;
}

.username {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #222;
  flex-shrink: 0;
}

.vip-tag {
  background-color: #ff6699;
  border-color: #ff6699;
}

.edit-name-btn {
  color: #999;
  border: none;
  padding: 2px 8px;
  font-size: 12px;
}

.edit-name-btn:hover {
  color: #666;
  background-color: #f5f5f5;
}

.stats-section {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 10px;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: color 0.3s ease;
}

.stat-item:hover .stat-value {
  color: #00a1d6;
}

.stat-value {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  transition: color 0.3s ease;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.stat-divider {
  width: 1px;
  height: 20px;
  background-color: #e0e0e0;
}

.user-signature {
  font-size: 14px;
  color: #666;
  margin-bottom: 15px;
  line-height: 1.5;
  cursor: pointer;
  transition: color 0.3s ease;
}

.user-signature:hover {
  color: #333;
}

.user-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.user-tag {
  background-color: #f0f2f5;
  border-color: #e5e6eb;
  color: #595959;
}

.add-tag-btn {
  border-color: #d9d9d9;
  color: #999;
}

.add-tag-btn:hover {
  border-color: #409eff;
  color: #409eff;
  background-color: #ecf5ff;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .profile-content {
    flex-direction: column;
    text-align: center;
  }
  
  .avatar-wrapper {
    margin-bottom: 15px;
  }
  
  .username-row {
    justify-content: center;
    margin-bottom: 15px;
  }
  
  .username {
    font-size: 20px;
  }
  
  .stats-section {
    justify-content: center;
    gap: 15px;
  }
  
  .stat-value {
    font-size: 16px;
  }
  
  .user-tags {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .profile-info {
    padding: 15px;
    top: -30px;
  }
  
  .profile-avatar {
    width: 80px;
    height: 80px;
    font-size: 32px;
  }
  
  .verification-badge,
  .edit-avatar-btn {
    width: 24px;
    height: 24px;
  }
  
  .username {
    font-size: 18px;
  }
  
  .stats-section {
    gap: 10px;
  }
  
  .stat-value {
    font-size: 14px;
  }
  
  .stat-label {
    font-size: 12px;
  }
  
  .stat-divider {
    height: 15px;
  }
}
</style>