<template>
  <el-dialog
    v-model="dialogVisible"
    title="预览个人主页"
    width="80%"
    top="2vh"
    :before-close="handleClose"
  >
    <div class="profile-preview">
      <!-- 个人主页预览内容 -->
      <div class="preview-header">
        <div class="preview-avatar-container">
          <el-avatar 
            size="80" 
            :src="userInfo.avatar || defaultAvatar" 
            class="preview-avatar"
          >
            {{ getUserInitial(userInfo.username) }}
          </el-avatar>
        </div>
        
        <div class="preview-user-info">
          <h2 class="preview-username">{{ userInfo.username }}</h2>
          <div class="preview-stats">
            <div class="preview-stat-item">
              <span class="preview-stat-value">{{ stats.following }}</span>
              <span class="preview-stat-label">关注</span>
            </div>
            <div class="preview-stat-item">
              <span class="preview-stat-value">{{ stats.followers }}</span>
              <span class="preview-stat-label">粉丝</span>
            </div>
            <div class="preview-stat-item">
              <span class="preview-stat-value">{{ stats.likes }}</span>
              <span class="preview-stat-label">获赞</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 个人简介 -->
      <div class="preview-bio">
        <h3 class="preview-section-title">个人简介</h3>
        <p class="preview-bio-content">{{ userInfo.bio || '该用户还没有填写个人简介' }}</p>
      </div>
      
      <!-- 标签 -->
      <div class="preview-tags">
        <el-tag size="small" v-for="tag in userTags" :key="tag" class="preview-tag">
          {{ tag }}
        </el-tag>
      </div>
      
      <!-- 作品预览 -->
      <div class="preview-works">
        <h3 class="preview-section-title">最新作品</h3>
        <div class="works-grid">
          <div v-for="i in 6" :key="i" class="work-item">
            <div class="work-thumbnail">
              <img :src="`https://via.placeholder.com/200x280?text=作品${i}`" alt="作品预览">
            </div>
            <div class="work-title">示例作品 {{ i }}</div>
          </div>
        </div>
      </div>
    </div>
    
    <template #footer>
      <el-button @click="handleClose">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  userInfo: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:visible', 'close'])

// 对话框可见状态
const dialogVisible = ref(false)

// 监听visible变化
const watchVisible = (newVal) => {
  dialogVisible.value = newVal
}

// 暴露给父组件的方法
const open = () => {
  dialogVisible.value = true
}

const close = () => {
  dialogVisible.value = false
}

// 处理对话框关闭
const handleClose = () => {
  dialogVisible.value = false
  emit('close')
  emit('update:visible', false)
}

// 默认头像
const defaultAvatar = '/avatar-placeholder.png'

// 用户统计数据
const stats = {
  following: 156,
  followers: 128,
  likes: 2341,
  views: 15623
}

// 用户标签
const userTags = ['技术分享', '前端开发', 'Vue爱好者', '编程学习']

// 获取用户头像文字（用户名首字母）
const getUserInitial = (username) => {
  if (!username) return 'U'
  return username.charAt(0).toUpperCase()
}

// 向父组件暴露方法
defineExpose({
  open,
  close,
  watchVisible
})
</script>

<style scoped>
.profile-preview {
  max-height: 60vh;
  overflow-y: auto;
  padding-right: 10px;
}

.preview-header {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px 0;
  border-bottom: 1px solid #eee;
  margin-bottom: 20px;
}

.preview-avatar {
  border: 3px solid #f0f0f0;
}

.preview-user-info {
  flex: 1;
}

.preview-username {
  margin: 0 0 10px 0;
  font-size: 24px;
  font-weight: 600;
}

.preview-stats {
  display: flex;
  gap: 30px;
}

.preview-stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.preview-stat-value {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.preview-stat-label {
  font-size: 14px;
  color: #666;
}

.preview-bio {
  margin-bottom: 20px;
}

.preview-section-title {
  margin: 0 0 10px 0;
  font-size: 18px;
  font-weight: 500;
  color: #333;
}

.preview-bio-content {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: #666;
}

.preview-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.preview-tag {
  background-color: #f5f7fa;
  border-color: #e4e7ed;
  color: #606266;
}

.preview-works {
  margin-bottom: 20px;
}

.works-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
}

.work-item {
  text-align: center;
}

.work-thumbnail {
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.work-thumbnail img {
  width: 100%;
  height: auto;
  display: block;
}

.work-title {
  font-size: 14px;
  color: #666;
}
</style>