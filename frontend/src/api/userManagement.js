import request from './request';

/**
 * 用户管理相关API
 */
const userManagementApi = {
  /**
   * 获取用户列表
   * @param {Object} params - 查询参数
   * @param {number} params.page - 页码
   * @param {number} params.pageSize - 每页数量
   * @param {string} params.keyword - 搜索关键词 (可选)
   * @param {string} params.role - 用户角色 (可选)
   * @returns {Promise}
   */
  getUserList: (params) => {
    return request.get('/system/users', { params });
  },

  /**
   * 获取用户详情
   * @param {string} userId - 用户ID
   * @returns {Promise}
   */
  getUserDetail: (userId) => {
    return request.get(`/system/users/${userId}`);
  },

  /**
   * 创建新用户
   * @param {Object} data - 用户数据
   * @param {string} data.username - 用户名
   * @param {string} data.email - 邮箱
   * @param {string} data.password - 密码
   * @param {string[]} data.roles - 用户角色
   * @returns {Promise}
   */
  createUser: (data) => {
    return request.post('/system/users', data);
  },

  /**
   * 更新用户信息
   * @param {string} userId - 用户ID
   * @param {Object} data - 用户数据
   * @returns {Promise}
   */
  updateUser: (userId, data) => {
    return request.put(`/system/users/${userId}`, data);
  },

  /**
   * 删除用户
   * @param {string} userId - 用户ID
   * @returns {Promise}
   */
  deleteUser: (userId) => {
    return request.delete(`/system/users/${userId}`);
  },

  /**
   * 批量删除用户
   * @param {Array} userIds - 用户ID数组
   * @returns {Promise}
   */
  batchDeleteUsers: (userIds) => {
    return request.post('/system/users/batch-delete', { ids: userIds });
  },

  /**
   * 修改用户状态
   * @param {string} userId - 用户ID
   * @param {boolean} active - 是否激活
   * @returns {Promise}
   */
  updateUserStatus: (userId, active) => {
    return request.patch(`/system/users/${userId}/status`, { active });
  },

  /**
   * 重置用户密码
   * @param {string} userId - 用户ID
   * @param {string} newPassword - 新密码
   * @returns {Promise}
   */
  resetUserPassword: (userId, newPassword) => {
    return request.post(`/system/users/${userId}/reset-password`, { newPassword });
  }
};

export default userManagementApi;