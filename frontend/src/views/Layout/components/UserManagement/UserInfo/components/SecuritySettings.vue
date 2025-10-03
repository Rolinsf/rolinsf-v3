<!-- 安全登录 -->
<template>
  <el-card class="user-info-card security-card">
    <template #header>
      <div class="card-header">
        <span>账号安全</span>
      </div>
    </template>

    <div class="security-info">
      <div class="security-item">
        <div class="security-label">
          <span>登录记录</span>
          <el-tooltip content="查看最近的登录活动" placement="top">
            <el-icon class="info-icon"><HelpFilled /></el-icon>
          </el-tooltip>
        </div>
        <div class="security-actions">
          <el-button type="text" @click="showLoginHistory">查看历史记录</el-button>
        </div>
      </div>

      <div class="security-item">
        <div class="security-label">
          <span>邮箱验证</span>
        </div>
        <div class="security-actions">
          <span v-if="emailVerified" class="verified-status">已验证</span>
          <span v-else class="unverified-status">未验证</span>
          <el-button type="text" @click="sendVerificationEmail">重新发送验证</el-button>
        </div>
      </div>

      <div class="security-item">
        <div class="security-label">
          <span>两步验证</span>
          <el-tooltip content="提高账号安全性" placement="top">
            <el-icon class="info-icon"><HelpFilled /></el-icon>
          </el-tooltip>
        </div>
        <div class="security-actions">
          <el-switch v-model="localTwoFactorEnabled" @change="toggleTwoFactor" />
        </div>
      </div>
    </div>
  </el-card>
</template>

<script setup>
import { ref, watch } from 'vue'
import { HelpFilled } from '@element-plus/icons-vue'

const props = defineProps({
  emailVerified: {
    type: Boolean,
    default: false
  },
  twoFactorEnabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['show-login-history', 'send-verification-email', 'toggle-two-factor'])

// 本地两步验证状态
const localTwoFactorEnabled = ref(props.twoFactorEnabled)

// 监听父组件传入的两步验证状态变化
watch(() => props.twoFactorEnabled, (newVal) => {
  localTwoFactorEnabled.value = newVal
})

// 显示登录历史
const showLoginHistory = () => {
  emit('show-login-history')
}

// 发送验证邮箱
const sendVerificationEmail = () => {
  emit('send-verification-email')
}

// 切换两步验证
const toggleTwoFactor = () => {
  emit('toggle-two-factor')
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

.security-card {
  flex-shrink: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.security-info {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.security-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #ebeef5;
  transition: background-color 0.2s;
}

.security-item:hover {
  background-color: #f8f9fa;
}

.security-item:last-child {
  border-bottom: none;
}

.security-label {
  display: flex;
  align-items: center;
  gap: 8px;
}

.security-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.verified-status {
  color: #67c23a;
  font-size: 14px;
  font-weight: 500;
}

.unverified-status {
  color: #f56c6c;
  font-size: 14px;
  font-weight: 500;
}

.info-icon {
  color: #909399;
  font-size: 16px;
  cursor: help;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .security-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    padding: 12px 0;
  }
  
  .security-actions {
    width: 100%;
    justify-content: space-between;
  }
}

@media (max-width: 480px) {
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
</style>