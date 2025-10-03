<!-- 个人主页头部背景图组件 -->
<template>
  <div class="profile-bg">
    <div 
      class="bg-image" 
      :style="{ backgroundImage: `url(${profileBackground})` }"
    ></div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Plus, ChatDotSquare, MoreFilled } from '@element-plus/icons-vue'

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
  'report'
])

// 个人主页背景图
const profileBackground = props.backgroundImage || 'https://via.placeholder.com/1200x300?text=个人主页背景'

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



/* 响应式设计 */
@media (max-width: 768px) {
  .profile-bg {
    height: 120px;
  }
  
}
</style>