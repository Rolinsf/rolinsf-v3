<!-- 个人主页内容区域组件 -->
<template>
  <div class="profile-content">
    <!-- 导航标签 -->
    <div class="profile-nav">
      <el-tabs v-model="activeTab" class="nav-tabs" @tab-click="handleTabClick">
        <el-tab-pane label="作品" name="works">
          <template #label>
            <span class="nav-item">
              <el-icon><VideoPlay /></el-icon>
              作品
              <span v-if="contentStats.works > 0" class="count-badge">{{ contentStats.works }}</span>
            </span>
          </template>
          <!-- 作品内容 -->
          <div class="tab-content">
            <div v-if="contentStats.works > 0" class="works-grid">
              <div v-for="(work, index) in worksList" :key="index" class="work-item" @click="handleWorkClick(work)">
                <div class="work-thumbnail">
                  <img 
                    :src="work.cover || `https://via.placeholder.com/280x160?text=作品${index + 1}`" 
                    :alt="work.title" 
                    class="work-image"
                  >
                  <div class="video-duration">{{ formatDuration(work.duration || 323) }}</div>
                </div>
                <div class="work-info">
                  <div class="work-title" :title="work.title || `示例作品 ${index + 1}`">
                    {{ work.title || `示例作品 ${index + 1}` }}
                  </div>
                  <div class="work-stats">
                    <span>{{ formatNumber(work.views || Math.floor(Math.random() * 10000)) }}播放</span>
                    <span>{{ formatNumber(work.danmaku || Math.floor(Math.random() * 1000)) }}弹幕</span>
                  </div>
                  <div class="publish-time">
                    {{ formatDate(work.publishDate || new Date(2023, 5, 10 + index)) }}
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="empty-state">
              <el-icon class="empty-icon"><Document /></el-icon>
              <p>暂无作品内容</p>
              <el-button v-if="canEdit" type="primary" @click="triggerCreateWork">
                <el-icon><Plus /></el-icon>
                上传作品
              </el-button>
            </div>
          </div>
        </el-tab-pane>
        
        <el-tab-pane label="评论" name="comments">
          <template #label>
            <span class="nav-item">
              <el-icon><ChatLineSquare /></el-icon>
              评论
              <span v-if="contentStats.comments > 0" class="count-badge">{{ contentStats.comments }}</span>
            </span>
          </template>
          <!-- 评论内容 -->
          <div class="tab-content">
            <div v-if="contentStats.comments > 0" class="comments-list">
              <div v-for="(comment, index) in commentsList" :key="index" class="comment-item">
                <el-avatar :src="comment.userAvatar" size="40">{{ getCommentUserInitial(comment.userName) }}</el-avatar>
                <div class="comment-content">
                  <div class="comment-header">
                    <span class="comment-user">{{ comment.userName }}</span>
                    <span class="comment-time">{{ formatRelativeTime(comment.commentTime) }}</span>
                  </div>
                  <div class="comment-text">{{ comment.content }}</div>
                  <div class="comment-actions">
                    <span class="comment-action" @click="handleCommentLike(comment)">
                      <el-icon><CaretTop /></el-icon>
                      {{ formatNumber(comment.likes || 0) }}
                    </span>
                    <span class="comment-action" @click="handleCommentReply(comment)">
                      <el-icon><ChatDotRound /></el-icon>
                      回复
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="empty-state">
              <el-icon class="empty-icon"><ChatDotSquare /></el-icon>
              <p>暂无评论内容</p>
            </div>
          </div>
        </el-tab-pane>
        
        <el-tab-pane label="推荐" name="recommendations">
          <template #label>
            <span class="nav-item">
              <el-icon><StarFilled /></el-icon>
              推荐
            </span>
          </template>
          <!-- 推荐内容 -->
          <div class="tab-content">
            <div v-if="contentStats.recommendations > 0" class="recommendations-grid">
              <div v-for="(rec, index) in recommendationsList" :key="index" class="rec-item" @click="handleRecommendationClick(rec)">
                <div class="rec-thumbnail">
                  <img 
                    :src="rec.cover || `https://via.placeholder.com/300x170?text=推荐${index + 1}`" 
                    :alt="rec.title" 
                  >
                </div>
                <div class="rec-info">
                  <div class="rec-title">{{ rec.title || `推荐内容 ${index + 1}` }}</div>
                  <div class="rec-stats">
                    <span>{{ formatNumber(rec.views || Math.floor(Math.random() * 20000)) }}次播放</span>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="empty-state">
              <el-icon class="empty-icon"><Star /></el-icon>
              <p>暂无推荐内容</p>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { 
  VideoPlay, 
  Document, 
  Plus, 
  ChatLineSquare, 
  CaretTop, 
  ChatDotRound, 
  StarFilled, 
  Star 
} from '@element-plus/icons-vue'

const props = defineProps({
  // 内容统计数据
  contentStats: {
    type: Object,
    default: () => ({
      works: 0,
      comments: 0,
      recommendations: 0
    })
  },
  // 作品列表
  worksList: {
    type: Array,
    default: () => []
  },
  // 评论列表
  commentsList: {
    type: Array,
    default: () => []
  },
  // 推荐列表
  recommendationsList: {
    type: Array,
    default: () => []
  },
  // 是否可编辑
  canEdit: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits([
  'tabChange',
  'workClick',
  'createWork',
  'commentLike',
  'commentReply',
  'recommendationClick'
])

// 选中的标签页
const activeTab = ref('works')

// 处理标签页点击
const handleTabClick = (tab) => {
  activeTab.value = tab.paneName
  emit('tabChange', tab.paneName)
}

// 格式化视频时长
const formatDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
}

// 格式化数字
const formatNumber = (num) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万'
  }
  return num.toString()
}

// 格式化日期
const formatDate = (date) => {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = (d.getMonth() + 1).toString().padStart(2, '0')
  const day = d.getDate().toString().padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 格式化相对时间
const formatRelativeTime = (date) => {
  const now = new Date()
  const d = new Date(date)
  const diffMs = now - d
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)
  
  if (diffSecs < 60) return '刚刚'
  if (diffMins < 60) return `${diffMins}分钟前`
  if (diffHours < 24) return `${diffHours}小时前`
  if (diffDays < 30) return `${diffDays}天前`
  
  return formatDate(date)
}

// 获取评论用户首字母
const getCommentUserInitial = (username) => {
  if (!username) return 'U'
  return username.charAt(0).toUpperCase()
}

// 处理作品点击
const handleWorkClick = (work) => {
  emit('workClick', work)
}

// 触发创建作品
const triggerCreateWork = () => {
  emit('createWork')
}

// 处理评论点赞
const handleCommentLike = (comment) => {
  emit('commentLike', comment)
}

// 处理评论回复
const handleCommentReply = (comment) => {
  emit('commentReply', comment)
}

// 处理推荐点击
const handleRecommendationClick = (recommendation) => {
  emit('recommendationClick', recommendation)
}

// 暴露方法给父组件
defineExpose({
  activeTab,
  setActiveTab: (tab) => {
    activeTab.value = tab
  }
})
</script>

<style scoped>
.profile-content {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.profile-nav {
  background-color: #fff;
}

.nav-tabs {
  background: transparent;
}

:deep(.el-tabs__header) {
  margin: 0;
  border-bottom: 1px solid #eee;
}

:deep(.el-tabs__nav) {
  background: transparent;
  height: 50px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 5px;
  height: 100%;
}

:deep(.el-tabs__item) {
  color: #666;
  font-size: 16px;
  padding: 0 25px;
  margin: 0;
  height: 50px;
  line-height: 50px;
  transition: all 0.3s ease;
}

:deep(.el-tabs__item:hover) {
  color: #00a1d6;
}

:deep(.el-tabs__item.is-active) {
  color: #00a1d6;
  font-weight: 600;
}

:deep(.el-tabs__active-bar) {
  background-color: #00a1d6;
  height: 3px;
  border-radius: 3px;
}

.count-badge {
  background-color: #ff6699;
  color: white;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 10px;
  margin-left: 5px;
}

/* 标签内容 */
.tab-content {
  padding: 20px;
  min-height: 400px;
}

/* 作品网格 */
.works-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.work-item {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  border-radius: 8px;
  overflow: hidden;
}

.work-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.work-thumbnail {
  position: relative;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 10px;
}

.work-image {
  width: 100%;
  height: 160px;
  object-fit: cover;
  display: block;
  transition: transform 0.3s ease;
}

.work-item:hover .work-image {
  transform: scale(1.05);
}

.video-duration {
  position: absolute;
  bottom: 5px;
  right: 5px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 3px;
}

.work-info {
  padding: 0 5px;
}

.work-title {
  font-size: 14px;
  font-weight: 500;
  color: #222;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 5px;
  word-break: break-word;
}

.work-stats {
  font-size: 12px;
  color: #999;
  display: flex;
  gap: 10px;
  margin-bottom: 3px;
}

.publish-time {
  font-size: 12px;
  color: #999;
}

/* 评论列表 */
.comments-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.comment-item {
  display: flex;
  gap: 12px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.comment-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.comment-content {
  flex: 1;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.comment-user {
  font-weight: 500;
  color: #333;
  font-size: 14px;
}

.comment-time {
  font-size: 12px;
  color: #999;
}

.comment-text {
  font-size: 14px;
  line-height: 1.6;
  color: #333;
  margin-bottom: 10px;
  word-break: break-word;
}

.comment-actions {
  display: flex;
  gap: 15px;
}

.comment-action {
  font-size: 12px;
  color: #999;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 2px;
  transition: color 0.3s ease;
}

.comment-action:hover {
  color: #00a1d6;
}

.comment-action.liked {
  color: #ff6699;
}

/* 推荐内容网格 */
.recommendations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.rec-item {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}

.rec-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.rec-thumbnail {
  height: 170px;
  overflow: hidden;
}

.rec-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.rec-item:hover .rec-thumbnail img {
  transform: scale(1.05);
}

.rec-info {
  padding: 12px;
}

.rec-title {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.rec-stats {
  font-size: 12px;
  color: #999;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #999;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 20px;
  color: #e0e0e0;
}

.empty-state p {
  font-size: 16px;
  margin-bottom: 20px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  :deep(.el-tabs__item) {
    padding: 0 15px;
    font-size: 14px;
  }
  
  .tab-content {
    padding: 15px;
  }
  
  .works-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  }
  
  .work-thumbnail img {
    height: 90px;
  }
  
  .work-title {
    font-size: 13px;
  }
  
  .recommendations-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  }
  
  .rec-thumbnail {
    height: 90px;
  }
  
  .empty-state {
    padding: 40px 15px;
  }
  
  .empty-icon {
    font-size: 48px;
  }
  
  .comment-item {
    gap: 10px;
  }
  
  .comment-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
}
</style>