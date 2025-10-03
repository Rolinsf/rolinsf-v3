<!-- 个人信息组件 -->
<template>
  <div class="profile-info">
    <!-- 头像部分 -->
    <div class="avatar-section">
      <div class="avatar-container">
        <el-avatar 
          size="120" 
          :src="userInfo.avatar || defaultAvatar" 
          class="profile-avatar"
        >
          {{ getUserInitial(userInfo.username) }}
        </el-avatar>
        
        <!-- 验证徽章 -->
        <div v-if="userInfo.isVerified" class="verification-badge">
          <el-icon><Check /></el-icon>
        </div>
        
        <!-- 头像编辑按钮 -->
        <el-button 
          v-if="canEdit" 
          size="small" 
          class="edit-avatar-btn"
          @click="triggerAvatarChange"
        >
          <el-icon><Edit /></el-icon>
        </el-button>
      </div>
    </div>
    
    <!-- 用户基本信息 -->
    <div class="user-details">
      <div class="username-row">
        <h1 class="username">{{ userInfo.username }}</h1>
        <el-tag v-if="userInfo.vipLevel > 0" type="primary" class="vip-tag">
          VIP{{ userInfo.vipLevel }}
        </el-tag>
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
    
    <!-- 右侧关注与私信 -->
    <div class="right-actions" v-if="!canEdit">
      <el-button type="primary" class="action-btn follow-btn" @click="handleFollow">
        <el-icon><Plus /></el-icon>
        {{ isFollowing ? '已关注' : '关注' }}
      </el-button>
      <el-button class="action-btn message-btn" @click="handleMessage">
        <el-icon><ChatDotSquare /></el-icon>
        私信
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Check, Edit, Plus, ChatDotSquare } from '@element-plus/icons-vue'

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
  'avatarChange',
  'nameEdit',
  'bioEdit',
  'addTag',
  'follow',
  'message',
  'followingClick',
  'followersClick',
  'likesClick'
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

// 触发签名编辑
const triggerBioEdit = () => {
  emit('bioEdit')
}

// 触发添加标签
const triggerAddTag = () => {
  emit('addTag')
}

// 处理关注按钮点击
const handleFollow = () => {
  emit('follow')
}

// 处理私信按钮点击
const handleMessage = () => {
  emit('message')
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
  display: flex;
  gap: 20px;
  padding: 20px;
  background-color: #fff;
  border-bottom: 1px solid #eee;
  margin-bottom: 20px;
  position: relative;
  top: -40px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.avatar-section {
  position: relative;
  margin-top: -60px;
  flex-shrink: 0;
}

.avatar-container {
  position: relative;
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

.avatar-container:hover .edit-avatar-btn {
  opacity: 1;
}

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
  background-color: #eee;
}

.user-signature {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 15px;
  cursor: text;
  transition: color 0.3s ease;
}

.user-signature:hover {
  color: #333;
}

.user-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.user-tag {
  background-color: #f5f7fa;
  border-color: #e4e7ed;
  color: #606266;
  cursor: pointer;
  transition: all 0.3s ease;
}

.user-tag:hover {
  background-color: #e6f7ff;
  border-color: #91d5ff;
  color: #1890ff;
}

.add-tag-btn {
  padding: 0 10px;
  height: 28px;
  line-height: 26px;
}

.right-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex-shrink: 0;
  align-self: flex-start;
}

.action-btn {
  width: 120px;
  height: 36px;
  font-size: 14px;
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

/* 响应式设计 */
@media (max-width: 1024px) {
  .profile-info {
    flex-wrap: wrap;
  }
  
  .right-actions {
    width: 100%;
    flex-direction: row;
    justify-content: flex-end;
  }
}

@media (max-width: 768px) {
  .profile-info {
    flex-direction: column;
    text-align: center;
    top: -30px;
    padding: 15px;
  }
  
  .avatar-section {
    margin-top: -50px;
    margin-bottom: 15px;
  }
  
  .profile-avatar {
    width: 100px;
    height: 100px;
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
  
  .right-actions {
    justify-content: center;
  }
  
  .action-btn {
    width: 100px;
    font-size: 13px;
  }
  
  .user-tags {
    justify-content: center;
  }
}
</style>