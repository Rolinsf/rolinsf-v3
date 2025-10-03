<template>
  <div class="user-info-container">
    <!-- B站风格个人主页头部 -->
    <UserHeader 
      :user-info="userBasicInfo"
      @view-profile="handleViewProfile"
      @edit-profile="handleEditProfile"
      @share-profile="handleShareProfile"
    />

    <!-- 左右两栏布局 -->
    <div class="user-info-layout">
      <!-- 左侧栏 - 基本信息 -->
      <div class="left-column">
        <BasicInfo 
          :user-info="userBasicInfo"
          :edit-mode="basicEditMode"
          :avatar-uploading="avatarUploading"
          :is-following="isFollowing"
          @switch-edit="handleSwitchEdit"
          @cancel-edit="handleCancelEdit"
          @save-info="handleSaveInfo"
          @upload-avatar="handleAvatarUpload"
          @upload-success="handleAvatarSuccess"
          @upload-error="handleAvatarError"
          @follow-user="handleFollowUser"
          @send-message="handleSendMessage"
          @change-background="handleChangeBackground"
        />
      </div>

      <!-- 右侧栏 - 密码与安全 -->
      <div class="right-column">
        <!-- 修改密码卡片 -->
        <PasswordManager 
          :loading="passwordLoading"
          @change-password="handleChangePassword"
        />

        <!-- 账号安全卡片 -->
        <SecuritySettings 
          :email-verified="userBasicInfo.emailVerified"
          :two-factor-enabled="twoFactorEnabled"
          @show-login-history="showLoginHistory"
          @send-verification-email="sendVerificationEmail"
          @toggle-two-factor="toggleTwoFactor"
        />
      </div>
    </div>

    <!-- 登录历史对话框 -->
    <LoginHistoryDialog 
      v-model="loginHistoryVisible" 
      :login-history="loginHistoryList"
    />

    <!-- 两步验证设置对话框 -->
    <TwoFactorDialog 
      v-model="twoFactorDialogVisible"
      :enabled="twoFactorEnabled"
      @setup="handleSetupTwoFactor"
      @disable="handleDisableTwoFactor"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store/user'
import UserHeader from './components/UserHeader.vue'
import BasicInfo from './components/BasicInfo.vue'
import PasswordManager from './components/PasswordManager.vue'
import SecuritySettings from './components/SecuritySettings.vue'
import LoginHistoryDialog from './components/LoginHistoryDialog.vue'
import TwoFactorDialog from './components/TwoFactorDialog.vue'
import userManagementApi from '@/api/userManagement'

// 用户Store
const userStore = useUserStore()

// 编辑模式状态
const basicEditMode = ref(false)
const originalBasicInfo = ref({})
// 显示编辑页面头部
const showEditHeader = ref(true)

// 是否关注状态
const isFollowing = ref(false)

// 上传状态
const avatarUploading = ref(false)
const passwordLoading = ref(false)
const backgroundUploading = ref(false)

// 对话框状态
const loginHistoryVisible = ref(false)
const twoFactorDialogVisible = ref(false)
const twoFactorEnabled = ref(false)

// 用户基本信息
const userBasicInfo = reactive({
  id: '',
  username: '',
  nickname: '',
  email: '',
  gender: 1,
  phone: '',
  bio: '',
  avatar: '',
  backgroundImage: '',
  emailVerified: false,
  // B站风格个人主页相关数据
  followerCount: 0,
  followingCount: 0,
  viewsCount: 0,
  likesReceived: 0,
  // 导航数据
  activeTab: 'dynamic',
  tabs: [
    { name: 'dynamic', label: '动态' },
    { name: 'works', label: '作品' },
    { name: 'collections', label: '收藏' },
    { name: 'history', label: '历史' }
  ]
})

// 登录历史记录
const loginHistoryList = ref([
  {
    time: '2024-01-15 14:30:25',
    ip: '192.168.1.1',
    location: '中国 北京',
    device: 'Windows 11',
    browser: 'Chrome 119'
  },
  {
    time: '2024-01-14 09:15:42',
    ip: '192.168.1.1',
    location: '中国 北京',
    device: 'MacOS',
    browser: 'Safari 17'
  },
  {
    time: '2024-01-10 21:05:18',
    ip: '192.168.1.1',
    location: '中国 北京',
    device: 'Android 13',
    browser: 'Chrome Mobile'
  }
])

// 处理编辑模式切换
const handleSwitchEdit = (mode) => {
  if (mode === 'basic') {
    // 保存原始数据，用于取消操作
    originalBasicInfo.value = { ...userBasicInfo }
    basicEditMode.value = true
  }
}

// 处理取消编辑
const handleCancelEdit = () => {
  // 恢复原始数据
  Object.assign(userBasicInfo, originalBasicInfo.value)
  basicEditMode.value = false
}

// 处理保存基本信息
const handleSaveInfo = async (formData) => {
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // 假设API调用成功
    // await userManagementApi.updateUser(userBasicInfo.id, formData)
    
    // 更新本地数据
    Object.assign(userBasicInfo, formData)
    
    // 更新用户Store中的信息
    userStore.userInfo = {
      ...userStore.userInfo,
      ...formData
    }
    
    ElMessage.success('基本信息更新成功')
    basicEditMode.value = false
  } catch (error) {
    console.error('保存基本信息失败:', error)
    ElMessage.error('保存基本信息失败，请重试')
    throw error // 抛出错误让子组件处理
  }
}

// 处理头像上传
const handleAvatarUpload = (file) => {
  avatarUploading.value = true
  // 这里只是模拟上传过程，实际项目中应该上传到服务器
  return false // 阻止默认上传行为
}

// 处理头像上传成功
const handleAvatarSuccess = (response, file) => {
  avatarUploading.value = false
  // 实际项目中，这里应该设置服务器返回的头像URL
  // userBasicInfo.avatar = response.url
  ElMessage.success('头像上传成功')
}

// 处理头像上传失败
const handleAvatarError = () => {
  avatarUploading.value = false
  ElMessage.error('头像上传失败，请重试')
}

// 处理修改密码
const handleChangePassword = async (passwordData) => {
  try {
    passwordLoading.value = true
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 假设API调用成功
    // await userManagementApi.resetUserPassword(userBasicInfo.id, passwordData.newPassword)
    
    ElMessage.success('密码修改成功')
  } catch (error) {
    console.error('修改密码失败:', error)
    ElMessage.error('修改密码失败，请重试')
    throw error // 抛出错误让子组件处理
  } finally {
    passwordLoading.value = false
  }
}

// 显示登录历史
const showLoginHistory = () => {
  loginHistoryVisible.value = true
}

// 发送验证邮箱
const sendVerificationEmail = async () => {
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    ElMessage.success('验证邮件已发送，请查收')
  } catch (error) {
    ElMessage.error('发送验证邮件失败，请重试')
  }
}

// 切换两步验证
const toggleTwoFactor = () => {
  twoFactorDialogVisible.value = true
}

// 处理设置两步验证
const handleSetupTwoFactor = async (verificationCode) => {
  // 模拟验证过程
  await new Promise(resolve => setTimeout(resolve, 500))
  twoFactorEnabled.value = true
  ElMessage.success('两步验证设置成功')
  twoFactorDialogVisible.value = false
}

// 处理关闭两步验证
const handleDisableTwoFactor = async (verificationCode) => {
  // 模拟验证过程
  await new Promise(resolve => setTimeout(resolve, 500))
  twoFactorEnabled.value = false
  ElMessage.success('两步验证已关闭')
  twoFactorDialogVisible.value = false
}

// 初始化用户信息
const initUserInfo = () => {
  if (userStore.userInfo) {
    // 从用户Store获取基本信息
    Object.assign(userBasicInfo, {
      id: userStore.userInfo.id || '',
      username: userStore.userInfo.username || '',
      nickname: userStore.userInfo.nickname || '',
      email: userStore.userInfo.email || '',
      gender: userStore.userInfo.gender || 1,
      phone: userStore.userInfo.phone || '',
      bio: userStore.userInfo.bio || '',
      avatar: userStore.userInfo.avatar || '',
      backgroundImage: userStore.userInfo.backgroundImage || '',
      emailVerified: userStore.userInfo.emailVerified || false
    })
  } else {
    // 如果没有用户信息，使用默认值
    // 实际项目中应该从API获取
    userBasicInfo.id = '1'
    userBasicInfo.username = 'admin'
    userBasicInfo.nickname = '管理员'
    userBasicInfo.email = 'admin@example.com'
    userBasicInfo.gender = 1
    userBasicInfo.bio = '这个人很懒，什么都没有留下'
    userBasicInfo.avatar = 'https://via.placeholder.com/200x280?text=%E5%B0%8F%E8%AF%B4%E5%B0%81%E9%9D%A2'
    userBasicInfo.backgroundImage = 'https://via.placeholder.com/1200x300?text=%E8%83%8C%E6%99%AF%E5%9B%BE'
    userBasicInfo.followerCount = 128
    userBasicInfo.followingCount = 64
    userBasicInfo.viewsCount = 1024
    userBasicInfo.likesReceived = 512
  }
}

// 处理查看个人主页
const handleViewProfile = () => {
  showEditHeader.value = false
  // 这里可以添加切换到查看模式的逻辑
  ElMessage.info('查看个人主页模式')
}

// 处理编辑个人资料
const handleEditProfile = () => {
  showEditHeader.value = true
  // 自动切换到基本信息编辑模式
  handleSwitchEdit('basic')
  ElMessage.info('切换到编辑模式')
}

// 处理分享个人主页
const handleShareProfile = () => {
  const profileUrl = `https://example.com/user/${userBasicInfo.username}`
  ElMessage.success(`分享链接: ${profileUrl}`)
  // 这里可以添加实际的分享逻辑，如复制到剪贴板
}

// 处理关注用户
const handleFollowUser = async () => {
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 切换关注状态
    isFollowing.value = !isFollowing.value
    
    // 更新关注数
    if (isFollowing.value) {
      userBasicInfo.followerCount++
      ElMessage.success('关注成功')
    } else {
      userBasicInfo.followerCount--
      ElMessage.success('已取消关注')
    }
  } catch (error) {
    console.error('关注操作失败:', error)
    ElMessage.error('操作失败，请重试')
  }
}

// 处理发送私信
const handleSendMessage = () => {
  // 实际项目中应该跳转到私信页面或打开私信对话框
  ElMessage.info('打开私信对话框')
}

// 处理更换背景图
const handleChangeBackground = (file) => {
  backgroundUploading.value = true
  
  // 模拟上传过程
  setTimeout(() => {
    // 实际项目中应该设置服务器返回的背景图URL
    // userBasicInfo.backgroundImage = response.url
    ElMessage.success('背景图更新成功')
    backgroundUploading.value = false
  }, 1000)
  
  return false // 阻止默认上传行为
}

// 组件挂载时初始化
onMounted(() => {
  initUserInfo()
})
</script>

<style scoped>
.user-info-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  color: #333;
}

/* 编辑模式下的头部样式 */
.edit-header {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e0e0e0;
}

.edit-header h2 {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #1a1a1a;
}

.edit-header .subtitle {
  font-size: 14px;
  color: #666;
  margin: 0;
}

/* 左右两栏布局 */
.user-info-layout {
  display: flex;
  gap: 24px;
  max-width: 1200px;
  margin: 0 auto;
  align-items: flex-start;
}

.left-column {
  flex: 1;
  min-width: 400px;
}

.right-column {
  flex: 1;
  min-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .user-info-layout {
    max-width: 100%;
  }
  
  .left-column,
  .right-column {
    min-width: 350px;
  }
}

@media (max-width: 768px) {
  .user-info-container {
    padding: 10px;
  }
  
  .user-info-header h2 {
    font-size: 24px;
  }
  
  /* 小屏幕下恢复单列布局 */
  .user-info-layout {
    flex-direction: column;
    gap: 16px;
  }
  
  .left-column,
  .right-column {
    min-width: auto;
    width: 100%;
  }
  
  .right-column {
    gap: 16px;
  }
}

@media (max-width: 480px) {
  .user-info-header h2 {
    font-size: 20px;
  }
  
  .subtitle {
    font-size: 12px;
  }
}
</style>