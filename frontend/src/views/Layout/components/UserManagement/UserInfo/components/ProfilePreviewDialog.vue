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
        :background-image="profileData.backgroundImage"
        :is-following="profileData.isFollowing"
        :can-edit="true"
        @follow="handleFollow"
        @message="handleMessage"
        @share="handleShare"
        @report="handleReport"
      />
      
      <!-- 2. 中间个人信息组件 -->
      <ProfileInfo
        :user-info="profileData.userInfo"
        :stats="profileData.stats"
        :user-tags="profileData.tags"
        :is-following="profileData.isFollowing"
        :can-edit="true"
        :background-image="profileData.backgroundImage"
        @avatar-change="handleAvatarChange"
        @name-edit="handleNameEdit"
        @bio-edit="handleBioEdit"
        @add-tag="handleAddTag"
        @follow="handleFollow"
        @message="handleMessage"
        @following-click="handleFollowingClick"
        @followers-click="handleFollowersClick"
        @likes-click="handleLikesClick"
        @bg-change="handleBackgroundChange"
      />
      
      <!-- 3. 下面内容区域组件 -->
      <ProfileContent
        ref="profileContentRef"
        :content-stats="profileData.contentStats"
        :works-list="profileData.works"
        :comments-list="profileData.comments"
        :recommendations-list="profileData.recommendations"
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
import { ref, watch } from 'vue'
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

// 预设背景图选项
const backgroundOptions = [
  'https://via.placeholder.com/1200x300?text=个人主页背景1',
  'https://via.placeholder.com/1200x300?text=个人主页背景2',
  'https://via.placeholder.com/1200x300?text=个人主页背景3',
  'https://via.placeholder.com/1200x300?text=个人主页背景4',
  'https://via.placeholder.com/1200x300?text=个人主页背景5'
]

// 当前选中的背景图索引
let currentBgIndex = 0

// 响应式个人资料数据对象，基于props.userInfo动态生成
const profileData = ref({
  // 用户基本信息
  userInfo: props.userInfo,
  // 背景图
  backgroundImage: props.userInfo.backgroundImage || backgroundOptions[0],
  // 是否关注状态
  isFollowing: false,
  // 统计数据
  stats: {
    following: props.userInfo.following || 0,
    followers: props.userInfo.followers || 0,
    likes: props.userInfo.likes || 0,
    views: props.userInfo.views || 0
  },
  // 内容统计
  contentStats: {
    works: props.userInfo.workCount || 0,
    comments: props.userInfo.commentCount || 0,
    recommendations: props.userInfo.recommendationCount || 0
  },
  // 用户标签
  tags: props.userInfo.tags || [],
  // 作品列表
  works: [],
  // 评论列表
  comments: [],
  // 推荐列表
  recommendations: []
})

// 监听userInfo变化，动态更新预览数据
watch(() => props.userInfo, (newUserInfo) => {
  profileData.value.userInfo = newUserInfo
  
  // 更新统计数据
  profileData.value.stats = {
    following: newUserInfo.following || 0,
    followers: newUserInfo.followers || 0,
    likes: newUserInfo.likes || 0,
    views: newUserInfo.views || 0
  }
  
  // 更新内容统计
  profileData.value.contentStats = {
    works: newUserInfo.workCount || 0,
    comments: newUserInfo.commentCount || 0,
    recommendations: newUserInfo.recommendationCount || 0
  }
  
  // 更新标签
  profileData.value.tags = newUserInfo.tags || []
  
  // 更新背景图（如果有）
  if (newUserInfo.backgroundImage) {
    profileData.value.backgroundImage = newUserInfo.backgroundImage
  }
  
  // 重新加载相关数据
  loadUserData()
}, { deep: true })

// 加载用户相关数据
const loadUserData = () => {
  // 这里应该从API获取实际数据
  // 目前使用模拟数据，但基于用户的实际数据生成
  const user = profileData.value.userInfo
  
  // 生成与用户相关的作品数据
  profileData.value.works = generateSampleWorks(
    profileData.value.contentStats.works || 6,
    user.username || '用户'
  )
  
  // 生成评论数据
  profileData.value.comments = generateSampleComments(
    profileData.value.contentStats.comments || 5
  )
  
  // 生成推荐数据
  profileData.value.recommendations = generateSampleRecommendations(
    profileData.value.contentStats.recommendations || 4
  )
}

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
  
  // 打开时加载数据
  loadUserData()
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
  profileData.value.isFollowing = !profileData.value.isFollowing
  
  // 动态更新粉丝数
  if (profileData.value.isFollowing) {
    profileData.value.stats.followers++
  } else {
    profileData.value.stats.followers = Math.max(0, profileData.value.stats.followers - 1)
  }
  
  // 这里可以添加关注/取消关注的API调用
  console.log('关注/取消关注用户:', profileData.value.userInfo.username)
}

// 处理私信按钮点击
const handleMessage = () => {
  // 这里可以添加打开私信对话框的逻辑
  console.log('发送私信给用户:', profileData.value.userInfo.username)
}

// 处理分享按钮点击
const handleShare = () => {
  // 这里可以添加分享功能的逻辑
  console.log('分享个人主页:', profileData.value.userInfo.username)
}

// 处理举报按钮点击
const handleReport = () => {
  // 这里可以添加举报功能的逻辑
  console.log('举报用户:', profileData.value.userInfo.username)
}

// 处理背景图更改
const handleBackgroundChange = () => {
  // 实现动态更换背景图的功能
  console.log('更改背景图')
  
  // 切换到下一个预设背景图
  currentBgIndex = (currentBgIndex + 1) % backgroundOptions.length
  profileData.value.backgroundImage = backgroundOptions[currentBgIndex]
  
  // 这里可以添加实际的背景图上传/选择逻辑
}

// 处理头像更改
const handleAvatarChange = () => {
  // 这里可以添加头像上传/选择的逻辑
  console.log('更改头像:', profileData.value.userInfo.username)
}

// 处理名称编辑
const handleNameEdit = () => {
  // 这里可以添加编辑用户名的逻辑
  console.log('编辑用户名:', profileData.value.userInfo.username)
}

// 处理签名编辑
const handleBioEdit = () => {
  // 这里可以添加编辑个人签名的逻辑
  console.log('编辑个人签名:', profileData.value.userInfo.username)
}

// 处理添加标签
const handleAddTag = () => {
  // 这里可以添加添加标签的逻辑
  console.log('添加标签')
}

// 处理关注统计点击
const handleFollowingClick = () => {
  console.log('查看关注列表:', profileData.value.userInfo.username)
}

// 处理粉丝统计点击
const handleFollowersClick = () => {
  console.log('查看粉丝列表:', profileData.value.userInfo.username)
}

// 处理获赞统计点击
const handleLikesClick = () => {
  console.log('查看获赞内容:', profileData.value.userInfo.username)
}

// 处理标签页切换
const handleTabChange = (tabName) => {
  console.log('切换到标签页:', tabName)
}

// 处理作品点击
const handleWorkClick = (work) => {
  console.log('查看作品:', work.title)
}

// 处理创建作品
const handleCreateWork = () => {
  console.log('创建新作品')
}

// 处理评论点赞
const handleCommentLike = (comment) => {
  console.log('点赞评论:', comment.id)
}

// 处理评论回复
const handleCommentReply = (comment) => {
  console.log('回复评论:', comment.id)
}

// 处理推荐点击
const handleRecommendationClick = (recommendation) => {
  console.log('查看推荐:', recommendation.title)
}

// 生成示例作品数据（基于用户名定制）
function generateSampleWorks(count, username) {
  const titles = [
    `${username}的Vue3入门教程`,
    `${username}分享前端性能优化技巧`,
    `${username}的Element Plus教程`,
    `${username}讲解响应式布局`,
    `${username}的JavaScript高级特性`,
    `${username}的前端工程化实践`
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