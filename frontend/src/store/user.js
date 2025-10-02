import { defineStore } from 'pinia'
import { authApi } from '@/api'
import { ROLE_PERMISSIONS } from '@/utils/permissions'

export const useUserStore = defineStore('user', {
  // 持久化配置
  persist: {
    key: 'user_store',
    storage: localStorage,
    paths: ['token', 'userInfo']
  },
  
  // 状态定义
  state: () => ({
    token: '', // 用户登录凭证
    userInfo: null, // 用户信息
    isLoggedIn: false, // 是否已登录
    loading: false, // 加载状态
    error: null // 错误信息
  }),
  
  // 计算属性
  getters: {
    // 获取用户ID
    userId: (state) => state.userInfo?.id,
    
    // 获取用户角色
    userRole: (state) => state.userInfo?.role,
    
    // 获取用户权限列表
    userPermissions: (state) => state.userInfo?.permissions || [],
    
    // 判断是否为管理员
    isAdmin: (state) => state.userInfo?.role === 'admin',
    
    // 判断是否有权限
    hasPermission: (state) => (permission) => {
      // 管理员拥有所有权限
      if (state.userInfo?.role === 'admin') {
        return true
      }
      
      // 检查是否拥有特定权限
      if (state.userInfo?.permissions && Array.isArray(state.userInfo.permissions)) {
        return state.userInfo.permissions.includes(permission)
      }
      
      // 默认为没有权限
      return false
    },
    
    // 判断是否拥有多个权限中的任意一个
    hasAnyPermission: (state) => (permissions) => {
      // 管理员拥有所有权限
      if (state.userInfo?.role === 'admin') {
        return true
      }
      
      // 检查是否拥有任意一个指定权限
      if (state.userInfo?.permissions && Array.isArray(state.userInfo.permissions)) {
        return permissions.some(permission => state.userInfo.permissions.includes(permission))
      }
      
      // 默认为没有权限
      return false
    }
  },
  
  // 动作
  actions: {
    // 设置token
    setToken(token) {
      this.token = token
      this.isLoggedIn = !!token
    },
    
    // 设置用户信息
    setUserInfo(userInfo) {
      // 如果有用户信息且有角色，根据角色分配权限
      if (userInfo && userInfo.role && ROLE_PERMISSIONS[userInfo.role]) {
        // 将角色对应的权限添加到用户信息中
        userInfo.permissions = ROLE_PERMISSIONS[userInfo.role]
      }
      this.userInfo = userInfo
    },
    
    // 清除用户信息
    clearUserInfo() {
      this.token = ''
      this.userInfo = null
      this.isLoggedIn = false
      this.error = null
    },
    
    // 处理登录
    async handleLogin(loginType, credentials) {
      this.loading = true
      this.error = null
      
      try {
        let result
        
        // 根据登录类型调用不同的API
        if (loginType === 'email') {
          result = await authApi.emailLogin(credentials)
        } else if (loginType === 'phone') {
          result = await authApi.phoneLogin(credentials)
        }
        
        // 保存token和用户信息
        if (result?.token) {
          this.setToken(result.token)
          
          // 获取用户信息
          const userInfo = await authApi.getUserInfo()
          this.setUserInfo(userInfo)
        }
        
        return { success: true }
      } catch (err) {
        this.error = err.message || '登录失败'
        console.error('Login error:', err)
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },
    
    // 处理注册
    async handleRegister(registerInfo) {
      this.loading = true
      this.error = null
      
      try {
        const result = await authApi.register(registerInfo)
        
        // 注册成功后，可选择自动登录或跳转到登录页面
        if (result?.success) {
          return { success: true }
        }
        
        return { success: false, error: '注册失败' }
      } catch (err) {
        this.error = err.message || '注册失败'
        console.error('Register error:', err)
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },
    
    // 处理退出登录
    async handleLogout() {
      try {
        await authApi.logout()
      } catch (err) {
        console.error('Logout error:', err)
      } finally {
        this.clearUserInfo()
      }
    },
    
    // 刷新用户信息
    async refreshUserInfo() {
      try {
        const userInfo = await authApi.getUserInfo()
        this.setUserInfo(userInfo)
        return { success: true, userInfo }
      } catch (err) {
        console.error('Refresh user info error:', err)
        // 如果刷新用户信息失败，可能是token过期，需要重新登录
        if (err.response?.status === 401) {
          this.clearUserInfo()
        }
        return { success: false, error: err.message }
      }
    },
    
    // 检查登录状态
    checkLoginStatus() {
      // 如果有token但用户信息为null，尝试刷新用户信息
      if (this.token && !this.userInfo) {
        this.refreshUserInfo()
      }
      
      // 添加模拟数据，确保开发环境下可以访问所有功能
      if (!this.isLoggedIn && process.env.NODE_ENV === 'development') {
        console.log('开发环境：使用模拟数据')
        this.setToken('mock-token')
        this.setUserInfo({
          id: 1,
          username: 'admin',
          role: 'admin',
          permissions: ['system:access', 'system:user:manage', 'system:role:manage']
        })
      }
      
      return this.isLoggedIn
    }
  }
})