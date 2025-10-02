// 权限常量定义
// 系统管理权限
export const SYSTEM_PERMISSIONS = {
  ACCESS: 'system:access',
  USER_MANAGE: 'system:user:manage',
  LOG_VIEW: 'system:log:view',
  SETTINGS_MANAGE: 'system:settings:manage',
  ROLE_MANAGE: 'system:role:manage'
}

// 小说管理权限
export const NOVEL_PERMISSIONS = {
  ACCESS: 'novel:access',
  LIST_VIEW: 'novel:list:view',
  COMMENT_MANAGE: 'novel:comment:manage',
  STATISTICS_VIEW: 'novel:statistics:view'
}

// 角色权限映射
export const ROLE_PERMISSIONS = {
  // 管理员拥有所有权限
  admin: [
    SYSTEM_PERMISSIONS.ACCESS,
    SYSTEM_PERMISSIONS.USER_MANAGE,
    SYSTEM_PERMISSIONS.LOG_VIEW,
    SYSTEM_PERMISSIONS.SETTINGS_MANAGE,
    SYSTEM_PERMISSIONS.ROLE_MANAGE,
    NOVEL_PERMISSIONS.ACCESS,
    NOVEL_PERMISSIONS.LIST_VIEW,
    NOVEL_PERMISSIONS.COMMENT_MANAGE,
    NOVEL_PERMISSIONS.STATISTICS_VIEW
  ],
  // 编辑角色权限
  editor: [
    NOVEL_PERMISSIONS.ACCESS,
    NOVEL_PERMISSIONS.LIST_VIEW,
    NOVEL_PERMISSIONS.COMMENT_MANAGE
  ],
  // 普通用户权限
  user: [
    NOVEL_PERMISSIONS.ACCESS,
    NOVEL_PERMISSIONS.LIST_VIEW
  ]
}

// 导出所有权限
export const ALL_PERMISSIONS = {
  ...SYSTEM_PERMISSIONS,
  ...NOVEL_PERMISSIONS
}