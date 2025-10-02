<!-- 用户表单对话框 -->
<template>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    width="600px"
    @close="handleDialogClose"
  >
    <el-form :model="userForm" :rules="userRules" ref="userFormRef" label-width="100px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="userForm.username" placeholder="请输入用户名" :disabled="!isAdd" />
      </el-form-item>
      <el-form-item v-if="isAdd" label="密码" prop="password">
        <el-input v-model="userForm.password" type="password" placeholder="请输入密码" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="userForm.email" type="email" placeholder="请输入邮箱" />
      </el-form-item>
      <el-form-item label="昵称" prop="nickname">
        <el-input v-model="userForm.nickname" placeholder="请输入昵称" />
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-radio-group v-model="userForm.gender">
          <el-radio :label="1">男</el-radio>
          <el-radio :label="0">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="角色" prop="roleId">
        <el-select v-model="userForm.roleId" placeholder="请选择角色">
          <el-option 
            v-for="role in roleList" 
            :key="role.id" 
            :label="role.name" 
            :value="role.id" 
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'

// 定义属性
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  userData: {
    type: Object,
    default: null
  },
  isAdd: {
    type: Boolean,
    default: true
  },
  roleList: {
    type: Array,
    default: () => []
  }
})

// 定义事件
const emit = defineEmits(['update:visible', 'submit', 'close'])

// 对话框状态
const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})

// 对话框标题
const dialogTitle = computed(() => props.isAdd ? '添加用户' : '编辑用户')

// 表单引用
const userFormRef = ref(null)

// 用户表单
const userForm = reactive({
  id: '',
  username: '',
  password: '',
  email: '',
  nickname: '',
  gender: 1,
  roleId: '',
  status: 1 // 默认启用状态
})

// 表单验证规则
const userRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少 6 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  nickname: [
    { max: 50, message: '昵称长度不能超过 50 个字符', trigger: 'blur' }
  ],
  roleId: [
    { required: true, message: '请选择角色', trigger: 'change' }
  ]
}

// 重置表单
const resetForm = () => {
  if (userFormRef.value) {
    userFormRef.value.resetFields()
  }
  
  // 设置默认值
  Object.assign(userForm, {
    id: '',
    username: '',
    password: '',
    email: '',
    nickname: '',
    gender: 1,
    roleId: '',
    status: 1
  })
}

// 根据角色名查找角色ID
const findRoleIdByName = (roleName) => {
  if (!roleName) return ''
  const role = props.roleList.find(r => r.name === roleName)
  return role ? role.id : ''
}

// 监听用户数据变化
watch(() => props.userData, (newUserData) => {
  if (newUserData) {
    // 填充表单数据
    Object.assign(userForm, {
      id: newUserData.id || '',
      username: newUserData.username || '',
      email: newUserData.email || '',
      nickname: newUserData.nickname || '',
      gender: newUserData.gender || 1,
      roleId: findRoleIdByName(newUserData.roleName) || '',
      status: newUserData.status || 1
    })
  } else if (props.isAdd) {
    // 重置表单
    resetForm()
  }
}, { immediate: true })

// 提交表单
const handleSubmit = async () => {
  if (!userFormRef.value) return
  
  try {
    await userFormRef.value.validate()
    // 发送提交事件
    emit('submit', { ...userForm })
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

// 关闭对话框
const handleDialogClose = () => {
  if (userFormRef.value) {
    userFormRef.value.resetFields()
  }
  emit('close')
}
</script>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>