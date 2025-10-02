import { useUserStore } from '@/store/user'
import { ALL_PERMISSIONS } from '@/utils/permissions'

/**
 * 权限管理辅助函数
 */
export const usePermission = () => {
  const userStore = useUserStore()
  
  /**
   * 检查是否拥有指定权限
   * @param {string} permission - 权限标识
   * @returns {boolean}
   */
  const hasPermission = (permission) => {
    return userStore.hasPermission(permission)
  }
  
  /**
   * 检查是否拥有多个权限中的任意一个
   * @param {string[]} permissions - 权限标识数组
   * @returns {boolean}
   */
  const hasAnyPermission = (permissions) => {
    return userStore.hasAnyPermission(permissions)
  }
  
  /**
   * 检查是否为指定角色
   * @param {string} role - 角色标识
   * @returns {boolean}
   */
  const isRole = (role) => {
    return userStore.userRole === role
  }
  
  /**
   * 检查是否为管理员
   * @returns {boolean}
   */
  const isAdmin = () => {
    return userStore.isAdmin
  }
  
  /**
   * 获取当前用户的所有权限
   * @returns {string[]}
   */
  const getPermissions = () => {
    return userStore.userPermissions
  }
  
  /**
   * 格式化权限标识为可读名称
   * @param {string} permission - 权限标识
   * @returns {string}
   */
  const formatPermissionName = (permission) => {
    const permissionMap = {
      'system:access': '系统管理访问',
      'system:user:manage': '用户管理',
      'system:log:view': '系统日志查看',
      'system:settings:manage': '系统设置管理',
      'system:role:manage': '角色权限管理',
      'novel:access': '小说管理访问',
      'novel:list:view': '小说列表查看',
      'novel:comment:manage': '评论管理',
      'novel:statistics:view': '数据统计查看'
    }
    return permissionMap[permission] || permission
  }
  
  return {
    hasPermission,
    hasAnyPermission,
    isRole,
    isAdmin,
    getPermissions,
    formatPermissionName,
    permissions: ALL_PERMISSIONS
  }
}