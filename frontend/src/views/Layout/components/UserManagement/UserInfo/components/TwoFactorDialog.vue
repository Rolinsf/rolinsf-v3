<!-- 两步验证 -->
<template>
  <el-dialog v-model="visible" :title="dialogTitle" width="500px" :close-on-click-modal="false">
    <div class="two-factor-content">
      <div v-if="!enabled">
        <p class="two-factor-intro">两步验证可以提高您账号的安全性。启用后，每次登录时需要输入密码和验证码。</p>
        
        <div class="qrcode-container" v-if="showQRCode">
          <div class="qrcode-placeholder">二维码图片</div>
          <p class="qrcode-text">请使用Google Authenticator或其他认证器应用扫描二维码</p>
          <el-input 
            v-model="verificationCode" 
            placeholder="请输入验证码" 
            class="verification-input"
            maxlength="6"
            show-word-limit
          />
        </div>
        
        <el-button 
          type="primary" 
          @click="handleSetup"
          :disabled="showQRCode && !verificationCode"
          class="action-button"
        >
          {{ showQRCode ? '确认设置' : '开始设置' }}
        </el-button>
      </div>
      
      <div v-else>
        <p class="two-factor-intro">两步验证已启用，您可以选择关闭它。</p>
        <el-input 
          v-model="disableCode" 
          placeholder="请输入验证码以关闭两步验证" 
          class="verification-input"
          maxlength="6"
          show-word-limit
        />
        <el-button 
          type="danger" 
          @click="handleDisable"
          :disabled="!disableCode"
          class="action-button"
        >
          关闭两步验证
        </el-button>
      </div>
    </div>
    
    <template #footer>
      <el-button @click="closeDialog">取消</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  enabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'setup', 'disable'])

// 对话框状态
const showQRCode = ref(false)
const verificationCode = ref('')
const disableCode = ref('')

// 计算属性：对话框可见状态
const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// 计算属性：对话框标题
const dialogTitle = computed(() => {
  return props.enabled ? '关闭两步验证' : '设置两步验证'
})

// 监听对话框打开状态
watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    // 对话框打开时重置状态
    resetState()
  }
})

// 重置状态
const resetState = () => {
  showQRCode.value = false
  verificationCode.value = ''
  disableCode.value = ''
}

// 处理设置两步验证
const handleSetup = async () => {
  if (!showQRCode.value) {
    // 第一步：显示二维码
    showQRCode.value = true
    return
  }
  
  // 第二步：验证并设置
  if (!verificationCode.value) {
    ElMessage.warning('请输入验证码')
    return
  }
  
  // 验证验证码格式
  if (!/^\d{6}$/.test(verificationCode.value)) {
    ElMessage.warning('请输入6位数字验证码')
    return
  }
  
  // 触发父组件处理设置
  emit('setup', verificationCode.value)
}

// 处理关闭两步验证
const handleDisable = async () => {
  if (!disableCode.value) {
    ElMessage.warning('请输入验证码')
    return
  }
  
  // 验证验证码格式
  if (!/^\d{6}$/.test(disableCode.value)) {
    ElMessage.warning('请输入6位数字验证码')
    return
  }
  
  // 触发父组件处理关闭
  emit('disable', disableCode.value)
}

// 关闭对话框
const closeDialog = () => {
  visible.value = false
  // 重置状态
  resetState()
}
</script>

<style scoped>
.two-factor-content {
  padding: 10px 0;
}

.two-factor-intro {
  margin-bottom: 20px;
  line-height: 1.6;
  color: #606266;
}

.qrcode-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px 0;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.qrcode-placeholder {
  width: 200px;
  height: 200px;
  background-color: #ffffff;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  color: #909399;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.qrcode-text {
  margin-bottom: 16px;
  text-align: center;
  color: #606266;
  font-size: 14px;
}

.verification-input {
  width: 100%;
  max-width: 300px;
  margin-bottom: 20px;
}

.action-button {
  width: 100%;
  max-width: 200px;
  margin: 0 auto;
  display: block;
}

/* 响应式设计 */
@media (max-width: 768px) {
  :deep(.el-dialog) {
    width: 90% !important;
    max-width: 400px;
  }
  
  .qrcode-placeholder {
    width: 180px;
    height: 180px;
  }
}

@media (max-width: 480px) {
  :deep(.el-dialog) {
    width: 95% !important;
  }
  
  .qrcode-placeholder {
    width: 160px;
    height: 160px;
  }
  
  .qrcode-text {
    font-size: 12px;
  }
  
  .verification-input {
    max-width: 100%;
  }
}
</style>