<!-- 基本信息组件 -->
<template>
  <el-card class="user-info-card basic-info-card">
    <template #header>
      <div class="card-header">
        <span>基本信息</span>
        <el-button 
          type="primary" 
          size="small" 
          @click="$emit('switch-edit', 'basic')"
          :disabled="editMode"
        >
          编辑
        </el-button>
      </div>
    </template>

    <!-- 基本信息表单 -->
    <el-form 
      :model="localUserInfo" 
      ref="basicInfoFormRef" 
      :rules="basicInfoRules" 
      label-width="120px" 
      class="basic-info-form"
    >
      <div class="avatar-section">
        <el-avatar 
          size="120" 
          :src="localUserInfo.avatar || defaultAvatar" 
          class="user-avatar"
        >
          {{ getUserInitial(localUserInfo.username) }}
        </el-avatar>
        <el-upload
          v-if="editMode"
          class="avatar-uploader"
          action="#"
          :show-file-list="false"
          :before-upload="handleAvatarUpload"
          :on-success="handleAvatarSuccess"
          :on-error="handleAvatarError"
        >
          <el-button size="small" type="primary" class="upload-button">更换头像</el-button>
        </el-upload>
        <p v-if="avatarUploading" class="upload-status">上传中...</p>
      </div>

      <el-form-item label="用户名" prop="username">
        <el-input v-model="localUserInfo.username" :disabled="!editMode" placeholder="请输入用户名" />
      </el-form-item>

      <el-form-item label="昵称" prop="nickname">
        <el-input v-model="localUserInfo.nickname" :disabled="!editMode" placeholder="请输入昵称" />
      </el-form-item>

      <el-form-item label="邮箱" prop="email">
        <el-input v-model="localUserInfo.email" :disabled="!editMode" placeholder="请输入邮箱" type="email" />
      </el-form-item>

      <el-form-item label="性别" prop="gender">
        <el-radio-group v-model="localUserInfo.gender" :disabled="!editMode">
          <el-radio :label="1">男</el-radio>
          <el-radio :label="2">女</el-radio>
          <el-radio :label="0">保密</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="联系电话" prop="phone">
        <el-input v-model="localUserInfo.phone" :disabled="!editMode" placeholder="请输入联系电话" />
      </el-form-item>

      <el-form-item label="个人简介" prop="bio">
        <el-input
          v-model="localUserInfo.bio"
          :disabled="!editMode"
          type="textarea"
          placeholder="请输入个人简介"
          :rows="3"
        />
      </el-form-item>

      <el-form-item v-if="editMode" class="form-actions">
        <el-button type="primary" @click="saveInfo">保存</el-button>
        <el-button @click="cancelEdit">取消</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'

const props = defineProps({
  userInfo: {
    type: Object,
    required: true
  },
  editMode: {
    type: Boolean,
    default: false
  },
  avatarUploading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['switch-edit', 'cancel-edit', 'save-info', 'upload-avatar', 'upload-success', 'upload-error'])

// 表单引用
const basicInfoFormRef = ref(null)

// 默认头像
const defaultAvatar = '/avatar-placeholder.png'

// 本地用户信息（用于表单编辑）
const localUserInfo = reactive({ ...props.userInfo })

// 监听props.userInfo变化，更新本地数据
watch(() => props.userInfo, (newVal) => {
  Object.assign(localUserInfo, newVal)
}, { deep: true })

// 基本信息表单验证规则
const basicInfoRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符之间', trigger: 'blur' }
  ],
  nickname: [
    { max: 50, message: '昵称长度不能超过 50 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' }
  ],
  phone: [
    { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号码', trigger: 'blur' }
  ],
  bio: [
    { max: 200, message: '个人简介不能超过 200 个字符', trigger: 'blur' }
  ]
}

// 获取用户头像文字（用户名首字母）
const getUserInitial = (username) => {
  if (!username) return 'U'
  return username.charAt(0).toUpperCase()
}

// 处理头像上传
const handleAvatarUpload = (file) => {
  emit('upload-avatar', file)
  return false // 阻止默认上传行为
}

// 处理头像上传成功
const handleAvatarSuccess = (response, file) => {
  emit('upload-success', response, file)
}

// 处理头像上传失败
const handleAvatarError = (error) => {
  emit('upload-error', error)
}

// 保存信息
const saveInfo = async () => {
  if (!basicInfoFormRef.value) return
  
  try {
    await basicInfoFormRef.value.validate()
    emit('save-info', { ...localUserInfo })
  } catch (error) {
    // 表单验证失败，不做额外处理
    console.error('表单验证失败:', error)
  }
}

// 取消编辑
const cancelEdit = () => {
  // 恢复原始数据
  Object.assign(localUserInfo, props.userInfo)
  // 重置表单状态
  if (basicInfoFormRef.value) {
    basicInfoFormRef.value.resetFields()
  }
  emit('cancel-edit')
}
</script>

<style scoped>
.user-info-card {
  margin-bottom: 0;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
}

.user-info-card:hover {
  box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.15);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
  padding: 20px 0;
  border-bottom: 1px solid #ebeef5;
}

.user-avatar {
  margin-bottom: 16px;
  cursor: pointer;
  transition: transform 0.3s;
  border: 3px solid #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.user-avatar:hover {
  transform: scale(1.05);
}

.upload-button {
  margin-bottom: 8px;
}

.upload-status {
  font-size: 14px;
  color: #606266;
  margin: 0;
}

.basic-info-form {
  max-width: 100%;
  margin: 0 auto;
}

.form-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 20px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .avatar-section {
    padding: 15px 0;
  }
  
  .user-avatar {
    margin-bottom: 12px;
  }
}

@media (max-width: 480px) {
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .form-actions {
    flex-direction: column;
    gap: 8px;
  }
  
  .form-actions button {
    width: 100%;
  }
}
</style>