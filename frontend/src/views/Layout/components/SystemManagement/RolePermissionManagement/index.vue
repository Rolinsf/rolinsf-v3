<template>
  <div class="role-permission-management">
    <h1>角色权限管理</h1>
    
    <!-- 角色选择 -->
    <el-row :gutter="20" class="mb-4">
      <el-col :span="6">
        <el-select v-model="selectedRole" placeholder="选择角色" @change="loadRolePermissions">
          <el-option v-for="role in roles" :key="role" :label="getRoleName(role)" :value="role" />
        </el-select>
      </el-col>
      <el-col :span="6">
        <el-button type="primary" @click="saveRolePermissions" :loading="saving">保存权限</el-button>
      </el-col>
    </el-row>
    
    <!-- 权限列表 -->
    <el-card v-if="selectedRole" class="mb-4">
      <template #header>
        <div class="card-header">
          <span>{{ getRoleName(selectedRole) }} 的权限</span>
        </div>
      </template>
      
      <!-- 系统管理权限 -->
      <div class="permission-group mb-4">
        <h3 class="permission-group-title">系统管理权限</h3>
        <el-checkbox-group v-model="systemPermissions" @change="updateRolePermissions">
          <div class="permission-list">
            <el-checkbox v-for="perm in systemPermissionList" :key="perm.value" :label="perm.value">
              {{ perm.label }}
            </el-checkbox>
          </div>
        </el-checkbox-group>
      </div>
      
      <!-- 小说管理权限 -->
      <div class="permission-group">
        <h3 class="permission-group-title">小说管理权限</h3>
        <el-checkbox-group v-model="novelPermissions" @change="updateRolePermissions">
          <div class="permission-list">
            <el-checkbox v-for="perm in novelPermissionList" :key="perm.value" :label="perm.value">
              {{ perm.label }}
            </el-checkbox>
          </div>
        </el-checkbox-group>
      </div>
    </el-card>
    
    <!-- 没有选择角色时的提示 -->
    <el-empty v-else description="请先选择一个角色" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { ROLE_PERMISSIONS, SYSTEM_PERMISSIONS, NOVEL_PERMISSIONS } from '@/utils/permissions'
import { usePermission } from '@/composables/usePermission'

// 获取权限辅助函数
const { formatPermissionName } = usePermission()

// 状态管理
const selectedRole = ref('')
const roles = ref(['admin', 'editor', 'user'])
const systemPermissions = ref([])
const novelPermissions = ref([])
const saving = ref(false)

// 权限列表
const systemPermissionList = [
  { value: SYSTEM_PERMISSIONS.ACCESS, label: formatPermissionName(SYSTEM_PERMISSIONS.ACCESS) },
  { value: SYSTEM_PERMISSIONS.USER_MANAGE, label: formatPermissionName(SYSTEM_PERMISSIONS.USER_MANAGE) },
  { value: SYSTEM_PERMISSIONS.LOG_VIEW, label: formatPermissionName(SYSTEM_PERMISSIONS.LOG_VIEW) },
  { value: SYSTEM_PERMISSIONS.SETTINGS_MANAGE, label: formatPermissionName(SYSTEM_PERMISSIONS.SETTINGS_MANAGE) }
]

const novelPermissionList = [
  { value: NOVEL_PERMISSIONS.ACCESS, label: formatPermissionName(NOVEL_PERMISSIONS.ACCESS) },
  { value: NOVEL_PERMISSIONS.LIST_VIEW, label: formatPermissionName(NOVEL_PERMISSIONS.LIST_VIEW) },
  { value: NOVEL_PERMISSIONS.COMMENT_MANAGE, label: formatPermissionName(NOVEL_PERMISSIONS.COMMENT_MANAGE) },
  { value: NOVEL_PERMISSIONS.STATISTICS_VIEW, label: formatPermissionName(NOVEL_PERMISSIONS.STATISTICS_VIEW) }
]

// 获取角色名称
const getRoleName = (role) => {
  const roleMap = {
    admin: '管理员',
    editor: '编辑',
    user: '普通用户'
  }
  return roleMap[role] || role
}

// 加载角色权限
const loadRolePermissions = () => {
  if (!selectedRole.value || !ROLE_PERMISSIONS[selectedRole.value]) {
    systemPermissions.value = []
    novelPermissions.value = []
    return
  }
  
  const permissions = ROLE_PERMISSIONS[selectedRole.value]
  
  // 分离系统权限和小说权限
  systemPermissions.value = permissions.filter(perm => 
    Object.values(SYSTEM_PERMISSIONS).includes(perm)
  )
  
  novelPermissions.value = permissions.filter(perm => 
    Object.values(NOVEL_PERMISSIONS).includes(perm)
  )
}

// 更新角色权限
const updateRolePermissions = () => {
  // 合并权限
  const allPermissions = [...systemPermissions.value, ...novelPermissions.value]
  
  // 更新ROLE_PERMISSIONS
  ROLE_PERMISSIONS[selectedRole.value] = allPermissions
}

// 保存角色权限
const saveRolePermissions = async () => {
  saving.value = true
  
  try {
    // 在实际应用中，这里应该调用API保存权限到服务器
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 保存成功
    ElMessage.success('权限保存成功')
    
    // 在实际应用中，可能需要刷新用户权限
    // 这里简单处理，打印日志
    console.log('权限已保存:', ROLE_PERMISSIONS)
  } catch (error) {
    console.error('保存权限失败:', error)
    ElMessage.error('权限保存失败')
  } finally {
    saving.value = false
  }
}

// 组件挂载时初始化
onMounted(() => {
  // 默认选择第一个角色
  if (roles.value.length > 0) {
    selectedRole.value = roles.value[0]
    loadRolePermissions()
  }
})
</script>

<style scoped>
.role-permission-management {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.permission-group {
  margin-bottom: 20px;
}

.permission-group-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 10px;
  color: #606266;
}

.permission-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.permission-list .el-checkbox {
  margin-right: 20px;
}
</style>