<!-- 个人主页预览 -->
<template>
  <el-dialog
    v-model="dialogVisible"
    title="预览个人主页"
    width="80%"
    top="2vh"
    :before-close="handleClose"
  >
    <div class="profile-preview">
      <!-- 1. 头部背景图组件 -->
      <ProfileHeader
        :background-image="profileBackground"
        :is-following="isFollowing"
        :can-edit="true"
        @follow="handleFollow"
        @message="handleMessage"
        @share="handleShare"
        @report="handleReport"
        @background-change="handleBackgroundChange"
      />
      
      <!-- 2. 中间个人信息组件 -->
      <ProfileInfo
        :user-info="userInfo"
        :stats="userStats"
        :user-tags="userTags"
        :is-following="isFollowing"
        :can-edit="true"
        @avatar-change="handleAvatarChange"
        @name-edit="handleNameEdit"
        @bio-edit="handleBioEdit"
        @add-tag="handleAddTag"
        @follow="handleFollow"
        @message="handleMessage"
        @following-click="handleFollowingClick"
        @followers-click="handleFollowersClick"
        @likes-click="handleLikesClick"
      />
      
      <!-- 3. 下面内容区域组件 -->
      <ProfileContent
        ref="profileContentRef"
        :content-stats="contentStats"
        :works-list="worksList"
        :comments-list="commentsList"
        :recommendations-list="recommendationsList"
        :can-edit="true"
        @tab-change="handleTabChange"
        @work-click="handleWorkClick"
        @create-work="handleCreateWork"
        @comment-like="handleCommentLike"
        @comment-reply="handleCommentReply"
        @recommendation-click="handleRecommendationClick"
      />
    </div>
    
    <template #footer>
      <el-button @click="handleClose">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ProfileHeader from './ProfileHeader.vue'
import ProfileInfo from './ProfileInfo.vue'
import ProfileContent from './ProfileContent.vue'

const props = defineProps({
  userInfo: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:visible', 'close'])

// 组件引用
const profileContentRef = ref(null)

// 对话框可见状态
const dialogVisible = ref(false)

// 个人主页背景图
const profileBackground = 'https://via.placeholder.com/1200x300?text=个人主页背景'

// 是否关注状态
const isFollowing = ref(false)

// 用户统计数据
const userStats = {
  following: 156,
  followers: 128,
  likes: 2341,
  views: 15623
}

// 内容统计数据
const contentStats = {
  works: 32,
  comments: 12,
  recommendations: 8
}

// 用户标签
const userTags = ['技术分享', '前端开发', 'Vue爱好者', '编程学习']

// 作品列表
const worksList = generateSampleWorks(6)

// 评论列表
const commentsList = generateSampleComments(5)

// 推荐列表
const recommendationsList = generateSampleRecommendations(4)

// 监听visible变化
const watchVisible = (newVal) => {
  dialogVisible.value = newVal
}

// 暴露给父组件的方法
const open = () => {
  dialogVisible.value = true
  // 延迟设置活动标签，确保组件已挂载
  setTimeout(() => {
    if (profileContentRef.value) {
      profileContentRef.value.setActiveTab('works')
    }
  }, 100)
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

// 处理关注按钮点击
const handleFollow = () => {
  isFollowing.value = !isFollowing.value
  // 这里可以添加关注/取消关注的API调用
  console.log('关注/取消关注用户')
}

// 处理私信按钮点击
const handleMessage = () => {
  // 这里可以添加打开私信对话框的逻辑
  console.log('发送私信给用户')
}

// 处理分享按钮点击
const handleShare = () => {
  // 这里可以添加分享功能的逻辑
  console.log('分享个人主页')
}

// 处理举报按钮点击
const handleReport = () => {
  // 这里可以添加举报功能的逻辑
  console.log('举报用户')
}

// 处理背景图更改
const handleBackgroundChange = () => {
  // 这里可以添加背景图上传/选择的逻辑
  console.log('更改背景图')
  // 模拟更改背景图
  // profileBackground.value = '新的背景图URL'
}

// 处理头像更改
const handleAvatarChange = () => {
  // 这里可以添加头像上传/选择的逻辑
  console.log('更改头像')
}

// 处理名称编辑
const handleNameEdit = () => {
  // 这里可以添加编辑用户名的逻辑
  console.log('编辑用户名')
}

// 处理签名编辑
const handleBioEdit = () => {
  // 这里可以添加编辑个人签名的逻辑
  console.log('编辑个人签名')
}

// 处理添加标签
const handleAddTag = () => {
  // 这里可以添加添加标签的逻辑
  console.log('添加标签')
}

// 处理关注统计点击
const handleFollowingClick = () => {
  // 这里可以添加查看关注列表的逻辑
  console.log('查看关注列表')
}

// 处理粉丝统计点击
const handleFollowersClick = () => {
  // 这里可以添加查看粉丝列表的逻辑
  console.log('查看粉丝列表')
}

// 处理获赞统计点击
const handleLikesClick = () => {
  // 这里可以添加查看获赞内容的逻辑
  console.log('查看获赞内容')
}

// 处理标签页切换
const handleTabChange = (tabName) => {
  console.log('切换到标签页:', tabName)
}

// 处理作品点击
const handleWorkClick = (work) => {
  // 这里可以添加打开作品详情的逻辑
  console.log('查看作品:', work.title)
}

// 处理创建作品
const handleCreateWork = () => {
  // 这里可以添加创建新作品的逻辑
  console.log('创建新作品')
}

// 处理评论点赞
const handleCommentLike = (comment) => {
  // 这里可以添加评论点赞的逻辑
  console.log('点赞评论:', comment.id)
}

// 处理评论回复
const handleCommentReply = (comment) => {
  // 这里可以添加评论回复的逻辑
  console.log('回复评论:', comment.id)
}

// 处理推荐点击
const handleRecommendationClick = (recommendation) => {
  // 这里可以添加打开推荐内容的逻辑
  console.log('查看推荐:', recommendation.title)
}

// 生成示例作品数据
function generateSampleWorks(count) {
  const titles = [
    'Vue3入门到精通：组件化开发实战',
    '前端性能优化技巧分享',
    'Element Plus 组件库全面解析',
    '响应式布局设计原则与实践',
    'JavaScript高级特性详解',
    '前端工程化最佳实践'
  ]
  
  return Array.from({ length: count }, (_, index) => ({
    id: `work-${index + 1}`,
    title: titles[index % titles.length],
    cover: `https://via.placeholder.com/280x160?text=作品${index + 1}`,
    duration: 300 + index * 20,
    views: Math.floor(Math.random() * 10000),
    danmaku: Math.floor(Math.random() * 1000),
    publishDate: new Date(2023, 5, 10 + index)
  }))
}

// 生成示例评论数据
function generateSampleComments(count) {
  const comments = [
    '内容很有帮助，学到了很多东西！',
    '讲得很详细，期待更多优质内容',
    '非常感谢分享，解决了我的问题',
    '这个教程真的很棒，已经收藏了',
    '讲解清晰，适合初学者学习'
  ]
  
  const usernames = ['小明', '小红', '张三', '李四', '王五']
  
  return Array.from({ length: count }, (_, index) => ({
    id: `comment-${index + 1}`,
    userName: usernames[index % usernames.length],
    userAvatar: `https://via.placeholder.com/40x40?text=${index + 1}`,
    content: comments[index % comments.length],
    commentTime: new Date(Date.now() - index * 60000 * 60),
    likes: Math.floor(Math.random() * 100)
  }))
}

// 生成示例推荐数据
function generateSampleRecommendations(count) {
  const titles = [
    'Vue3最新特性深度解析',
    '如何构建高性能前端应用',
    '前端开发最佳实践指南',
    '现代化UI设计原则',
    'JavaScript异步编程详解',
    '前端框架对比与选择'
  ]
  
  return Array.from({ length: count }, (_, index) => ({
    id: `rec-${index + 1}`,
    title: titles[index % titles.length],
    cover: `https://via.placeholder.com/300x170?text=推荐${index + 1}`,
    views: Math.floor(Math.random() * 20000)
  }))
}

// 组件挂载时的逻辑
onMounted(() => {
  // 初始化组件
  console.log('个人主页预览组件已挂载')
})

// 向父组件暴露方法
defineExpose({
  open,
  close,
  watchVisible
})
</script>

<style scoped>
.profile-preview {
  max-height: 70vh;
  overflow-y: auto;
  padding-right: 10px;
}

/* 自定义滚动条样式 */
.profile-preview::-webkit-scrollbar {
  width: 8px;
}

.profile-preview::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.profile-preview::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.profile-preview::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .profile-preview {
    max-height: 75vh;
  }
}
</style>