<!-- 登录历史对话框 -->
<template>
  <el-dialog v-model="visible" title="登录历史记录" width="800px" :close-on-click-modal="false">
    <div class="login-history-content">
      <el-table 
        :data="loginHistory" 
        stripe 
        :empty-text="'暂无登录历史记录'"
      >
        <el-table-column prop="time" label="登录时间" width="200" />
        <el-table-column prop="ip" label="登录IP" width="150" />
        <el-table-column prop="location" label="登录地点" width="150" />
        <el-table-column prop="device" label="设备信息" />
        <el-table-column prop="browser" label="浏览器" width="150" />
      </el-table>
      
      <div v-if="loginHistory.length > 0" class="login-tip">
        <el-alert
          title="安全提示"
          type="warning"
          :closable="false"
          :description="'发现可疑登录？请立即修改您的密码并开启两步验证。'"
        />
      </div>
    </div>
    
    <template #footer>
      <el-button @click="closeDialog">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  loginHistory: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue', 'close'])

// 计算属性：对话框可见状态
const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// 关闭对话框
const closeDialog = () => {
  visible.value = false
  emit('close')
}
</script>

<style scoped>
.login-history-content {
  max-height: 500px;
  overflow-y: auto;
}

.login-tip {
  margin-top: 16px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  :deep(.el-dialog) {
    width: 90% !important;
    max-width: 600px;
  }
  
  :deep(.el-table) {
    font-size: 12px;
  }
  
  :deep(.el-table__header th) {
    padding: 10px 5px;
  }
  
  :deep(.el-table__body td) {
    padding: 10px 5px;
  }
}

@media (max-width: 480px) {
  :deep(.el-dialog) {
    width: 95% !important;
  }
  
  :deep(.el-table__header th) {
    padding: 8px 4px;
    font-size: 11px;
  }
  
  :deep(.el-table__body td) {
    padding: 8px 4px;
    font-size: 11px;
  }
}
</style>