<template>
  <div class="user-header">
    <!-- 左侧标题 -->
    <UserHeaderTitle />
    
    <!-- 右侧操作菜单 -->
    <UserHeaderActions 
      @view-profile="openProfilePreview"
      @share-profile="handleShareProfile"
    />
    
    <!-- 预览对话框 -->
    <ProfilePreviewDialog 
      ref="previewDialogRef"
      :user-info="userInfo"
      :visible="previewDialogVisible"
      @update:visible="previewDialogVisible = $event"
      @close="onPreviewDialogClose"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import UserHeaderTitle from './UserHeaderTitle.vue'
import UserHeaderActions from './UserHeaderActions.vue'
import ProfilePreviewDialog from './ProfilePreviewDialog.vue'

const props = defineProps({
  userInfo: {
    type: Object,
    required: true
  }
})

// 预览对话框相关
const previewDialogRef = ref(null)
const previewDialogVisible = ref(false)

// 打开个人主页预览
const openProfilePreview = () => {
  previewDialogVisible.value = true
  // 或者使用ref方式打开
  if (previewDialogRef.value) {
    previewDialogRef.value.open()
  }
}

// 预览对话框关闭回调
const onPreviewDialogClose = () => {
  previewDialogVisible.value = false
}

// 处理分享个人主页
const handleShareProfile = () => {
  const profileUrl = `https://example.com/user/${props.userInfo.username}`
  
  // 模拟复制到剪贴板
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(profileUrl).then(() => {
      ElMessage.success('链接已复制到剪贴板')
    }).catch(() => {
      showCopyDialog(profileUrl)
    })
  } else {
    showCopyDialog(profileUrl)
  }
}

// 显示复制对话框
const showCopyDialog = (url) => {
  ElMessageBox.prompt(
    '请复制以下链接:',
    '分享个人主页',
    {
      confirmButtonText: '复制',
      cancelButtonText: '取消',
      inputValue: url,
      inputReadOnly: true,
      callback: (action) => {
        if (action === 'confirm') {
          ElMessage.success('请手动复制链接')
        }
      }
    }
  )
}
</script>

<style scoped>
.user-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: #fff;
  border-bottom: 1px solid #eee;
  margin-bottom: 20px;
}

@media (max-width: 768px) {
  .user-header {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }
}
</style>