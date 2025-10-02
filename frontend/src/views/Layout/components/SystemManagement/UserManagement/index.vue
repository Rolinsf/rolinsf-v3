<template>
  <div class="user-management">
    <!-- 页面头部组件 -->
    <PageHeader @add-user="handleAddUser" />

    <!-- 搜索筛选组件 -->
    <SearchFilters 
      :search-form="searchForm"
      :role-list="roleList"
      @search="handleSearch"
      @reset="handleReset"
    />

    <!-- 用户列表表格组件 -->
    <UserTable 
      :user-list="userList"
      :loading="loading"
      :role-list="roleList"
      @view-user="handleViewUser"
      @edit-user="handleEditUser"
      @delete-user="handleDeleteUser"
      @status-change="handleStatusChange"
    />

    <!-- 分页组件 -->
    <Pagination 
      :pagination="pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <!-- 用户表单对话框组件 -->
    <UserFormDialog 
      v-model:visible="dialogVisible"
      :user-data="currentEditUser"
      :is-add="isAdd"
      :role-list="roleList"
      @submit="handleSubmit"
      @close="handleDialogClose"
    />

    <!-- 用户详情对话框组件 -->
    <UserDetailDialog 
      v-model:visible="viewDialogVisible"
      :user-info="viewUserInfo"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 导入组件
import PageHeader from './components/PageHeader.vue'
import SearchFilters from './components/SearchFilters.vue'
import UserTable from './components/UserTable.vue'
import Pagination from './components/Pagination.vue'
import UserFormDialog from './components/UserFormDialog.vue'
import UserDetailDialog from './components/UserDetailDialog.vue'

// 状态管理
const loading = ref(false)
const userList = ref([])
const roleList = ref([])
const dialogVisible = ref(false)
const viewDialogVisible = ref(false)
const currentEditUser = ref(null)

// 搜索表单
const searchForm = reactive({
  username: '',
  email: '',
  status: '',
  nickname: '',
  gender: '',
  roleId: '',
  dateRange: [],
  lastLoginRange: [],
  sortBy: ''
})

// 分页数据
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

// 用户详情
const viewUserInfo = reactive({})

// 计算属性
const isAdd = computed(() => !currentEditUser.value?.id)

// 模拟数据 - 实际项目中应替换为 API 调用
const mockUserList = [
  { id: 1, username: 'admin', email: 'admin@example.com', nickname: '管理员', gender: 1, roleName: '超级管理员', status: 1, createdAt: '2024-01-01T00:00:00Z', lastLogin: '2024-07-01T10:00:00Z', readingTime: 1200, favoriteCount: 50, commentCount: 120 },
  { id: 2, username: 'zhangsan', email: 'zhangsan@example.com', nickname: '张三', gender: 1, roleName: '普通用户', status: 1, createdAt: '2024-01-02T00:00:00Z', lastLogin: '2024-06-28T14:30:00Z', readingTime: 800, favoriteCount: 25, commentCount: 45 },
]

const mockRoleList = [
  { id: 1, name: '超级管理员' },
  { id: 2, name: '管理员' },
  { id: 3, name: '作者' }
]

// 获取用户列表
const getUserList = async () => {
  loading.value = true
  try {
    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 模拟搜索和分页逻辑
    let filteredList = [...mockUserList]
    
    // 应用搜索条件
    if (searchForm.username) {
      filteredList = filteredList.filter(user => 
        user.username.toLowerCase().includes(searchForm.username.toLowerCase())
      )
    }
    if (searchForm.email) {
      filteredList = filteredList.filter(user => 
        user.email.toLowerCase().includes(searchForm.email.toLowerCase())
      )
    }
    if (searchForm.status !== '') {
      filteredList = filteredList.filter(user => user.status === parseInt(searchForm.status))
    }
    
    // 高级搜索条件
    // 按昵称搜索
    if (searchForm.nickname) {
      filteredList = filteredList.filter(user => 
        user.nickname && user.nickname.toLowerCase().includes(searchForm.nickname.toLowerCase())
      )
    }
    
    // 按性别筛选
    if (searchForm.gender !== '') {
      filteredList = filteredList.filter(user => user.gender === Number(searchForm.gender))
    }
    
    // 按角色筛选
    if (searchForm.roleId !== '') {
      const roleName = roleList.value.find(r => r.id === Number(searchForm.roleId))?.name
      if (roleName) {
        filteredList = filteredList.filter(user => user.roleName === roleName)
      }
    }
    
    // 按注册时间范围筛选
    if (searchForm.dateRange && searchForm.dateRange.length === 2) {
      const [startDate, endDate] = searchForm.dateRange
      filteredList = filteredList.filter(user => {
        const userDate = new Date(user.createdAt).toISOString().split('T')[0]
        return userDate >= startDate && userDate <= endDate
      })
    }
    
    // 按上次登录时间范围筛选
    if (searchForm.lastLoginRange && searchForm.lastLoginRange.length === 2) {
      const [startDate, endDate] = searchForm.lastLoginRange
      filteredList = filteredList.filter(user => {
        if (!user.lastLogin) return false // 未登录用户不满足筛选条件
        const userDate = new Date(user.lastLogin).toISOString().split('T')[0]
        return userDate >= startDate && userDate <= endDate
      })
    }
    
    // 根据排序方式排序
    if (searchForm.sortBy) {
      filteredList.sort((a, b) => {
        // 处理未登录用户，将其放在末尾
        if (!a.lastLogin && !b.lastLogin) return 0
        if (!a.lastLogin) return 1 // a未登录，排在b后面
        if (!b.lastLogin) return -1 // b未登录，排在a后面
        
        // 已登录用户比较时间
        const dateA = new Date(a.lastLogin).getTime()
        const dateB = new Date(b.lastLogin).getTime()
        
        if (searchForm.sortBy === 'lastLoginAsc') {
          return dateA - dateB // 正序
        } else if (searchForm.sortBy === 'lastLoginDesc') {
          return dateB - dateA // 倒序
        }
        return 0
      })
    }
    
    // 计算总数
    pagination.total = filteredList.length
    
    // 应用分页
    const startIndex = (pagination.currentPage - 1) * pagination.pageSize
    const endIndex = startIndex + pagination.pageSize
    userList.value = filteredList.slice(startIndex, endIndex)
    
  } catch (error) {
    ElMessage.error('获取用户列表失败')
    console.error('获取用户列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 获取角色列表
const getRoleList = async () => {
  try {
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 300))
    roleList.value = mockRoleList
  } catch (error) {
    ElMessage.error('获取角色列表失败')
    console.error('获取角色列表失败:', error)
  }
}

// 搜索
const handleSearch = () => {
  pagination.currentPage = 1
  getUserList()
}

// 重置
const handleReset = () => {
  searchForm.username = ''
  searchForm.email = ''
  searchForm.status = ''
  searchForm.nickname = ''
  searchForm.gender = ''
  searchForm.roleId = ''
  searchForm.dateRange = []
  searchForm.lastLoginRange = []
  pagination.currentPage = 1
  getUserList()
}

// 分页大小变化
const handleSizeChange = (size) => {
  pagination.pageSize = size
  getUserList()
}

// 当前页码变化
const handleCurrentChange = (current) => {
  pagination.currentPage = current
  getUserList()
}

// 添加用户
const handleAddUser = () => {
  currentEditUser.value = null
  dialogVisible.value = true
}

// 编辑用户
const handleEditUser = (user) => {
  // 准备编辑数据，包括找到对应的roleId
  const roleId = roleList.value.find(role => role.name === user.roleName)?.id || ''
  currentEditUser.value = {
    ...user,
    roleId
  }
  dialogVisible.value = true
}

// 查看用户详情
const handleViewUser = async (user) => {
  try {
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 300))
    Object.assign(viewUserInfo, user)
    viewDialogVisible.value = true
  } catch (error) {
    ElMessage.error('获取用户详情失败')
    console.error('获取用户详情失败:', error)
  }
}

// 删除用户
const handleDeleteUser = (userId) => {
  ElMessageBox.confirm('确定要删除该用户吗？删除后不可恢复。', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      // 模拟API请求
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // 实际从模拟数据中删除用户
      const index = mockUserList.findIndex(user => user.id === userId)
      if (index !== -1) {
        mockUserList.splice(index, 1)
      }
      
      // 显示成功消息
      ElMessage.success('删除用户成功')
      getUserList() // 重新加载用户列表
    } catch (error) {
      ElMessage.error('删除用户失败')
      console.error('删除用户失败:', error)
    }
  }).catch(() => {
    // 取消删除
  })
}

// 切换用户状态
const handleStatusChange = async (userId, status) => {
  try {
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // 实际更新用户状态
    const user = mockUserList.find(user => user.id === userId)
    if (user) {
      user.status = status
    }
    
    // 显示成功消息
    ElMessage.success(`用户${status === 1 ? '启用' : '禁用'}成功`)
    getUserList() // 重新加载用户列表
  } catch (error) {
    // 如果失败，找到并恢复原状态
    const user = mockUserList.find(user => user.id === userId)
    if (user) {
      user.status = user.status === 1 ? 0 : 1
    }
    ElMessage.error(`用户${status === 1 ? '启用' : '禁用'}失败`)
    console.error(`用户状态切换失败:`, error)
  }
}

// 提交表单
const handleSubmit = async (formData) => {
  try {
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // 处理添加用户
    if (isAdd.value) {
      // 生成新用户ID
      const maxId = mockUserList.length > 0 ? Math.max(...mockUserList.map(user => user.id)) : 0
      const roleName = roleList.value.find(role => role.id === formData.roleId)?.name || '普通用户'
      
      // 添加新用户到模拟数据
      mockUserList.push({
        id: maxId + 1,
        username: formData.username,
        email: formData.email,
        nickname: formData.nickname || '',
        gender: formData.gender || 1,
        roleName: roleName,
        status: 1,
        createdAt: new Date().toISOString(),
        lastLogin: null,
        readingTime: 0,
        favoriteCount: 0,
        commentCount: 0
      })
    } 
    // 处理编辑用户
    else {
      const index = mockUserList.findIndex(user => user.id === formData.id)
      if (index !== -1) {
        const roleName = roleList.value.find(role => role.id === formData.roleId)?.name || '普通用户'
        
        // 更新现有用户数据
        mockUserList[index] = {
          ...mockUserList[index],
          username: formData.username,
          email: formData.email,
          nickname: formData.nickname || '',
          gender: formData.gender || 1,
          roleName: roleName
        }
      }
    }
    
    // 显示成功消息
    ElMessage.success(isAdd.value ? '添加用户成功' : '编辑用户成功')
    dialogVisible.value = false
    getUserList() // 重新加载用户列表
  } catch (error) {
    ElMessage.error(isAdd.value ? '添加用户失败' : '编辑用户失败')
    console.error(`${isAdd.value ? '添加' : '编辑'}用户失败:`, error)
  }
}

// 关闭对话框
const handleDialogClose = () => {
  currentEditUser.value = null
}

// 组件挂载时初始化数据
onMounted(() => {
  getUserList()
  getRoleList()
})
</script>

<style scoped>
.user-management {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .user-management {
    padding: 10px;
  }
}
</style>