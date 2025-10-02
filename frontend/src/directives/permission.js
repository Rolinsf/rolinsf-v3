import { useUserStore } from '@/store/user'

// 创建权限指令
export default {
  install(app) {
    // v-permission 指令
    app.directive('permission', {
      mounted(el, binding) {
        const userStore = useUserStore()
        const { value } = binding
        
        if (!value) return
        
        // 判断权限
        let hasPermission = false
        
        if (typeof value === 'string') {
          // 单个权限
          hasPermission = userStore.hasPermission(value)
        } else if (Array.isArray(value)) {
          // 多个权限中的任意一个
          hasPermission = userStore.hasAnyPermission(value)
        }
        
        // 如果没有权限，隐藏元素
        if (!hasPermission) {
          el.style.display = 'none'
        }
      },
      
      updated(el, binding) {
        // 更新时重新检查权限
        const userStore = useUserStore()
        const { value } = binding
        
        if (!value) return
        
        // 判断权限
        let hasPermission = false
        
        if (typeof value === 'string') {
          hasPermission = userStore.hasPermission(value)
        } else if (Array.isArray(value)) {
          hasPermission = userStore.hasAnyPermission(value)
        }
        
        // 根据权限显示或隐藏元素
        if (!hasPermission) {
          el.style.display = 'none'
        } else {
          el.style.display = ''
        }
      }
    })
    
    // v-role 指令
    app.directive('role', {
      mounted(el, binding) {
        const userStore = useUserStore()
        const { value } = binding
        
        if (!value) return
        
        // 判断角色
        let hasRole = false
        
        if (typeof value === 'string') {
          // 单个角色
          hasRole = userStore.userRole === value
        } else if (Array.isArray(value)) {
          // 多个角色中的任意一个
          hasRole = value.includes(userStore.userRole)
        }
        
        // 如果没有角色，隐藏元素
        if (!hasRole) {
          el.style.display = 'none'
        }
      },
      
      updated(el, binding) {
        // 更新时重新检查角色
        const userStore = useUserStore()
        const { value } = binding
        
        if (!value) return
        
        // 判断角色
        let hasRole = false
        
        if (typeof value === 'string') {
          hasRole = userStore.userRole === value
        } else if (Array.isArray(value)) {
          hasRole = value.includes(userStore.userRole)
        }
        
        // 根据角色显示或隐藏元素
        if (!hasRole) {
          el.style.display = 'none'
        } else {
          el.style.display = ''
        }
      }
    })
  }
}