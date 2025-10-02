import axios from 'axios'

import { mockData, mockResponse, mockDelay, isMockEnabled } from './mock.js';

// 使用辅助函数判断是否启用模拟模式
const MOCK_MODE = isMockEnabled();

// 创建axios实例
const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // 从环境变量中获取API基础URL
  timeout: 10000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Mock请求处理器
 * 根据请求URL和方法返回对应的模拟数据
 */
const mockRequestHandler = async (config) => {
  // 记录请求日志，方便调试
  console.log('Mock API Call:', config.method.toUpperCase(), config.url, config.data);
  
  await mockDelay(); // 模拟网络延迟
  
  const url = config.url;
  const method = config.method.toLowerCase();
  // 检查 data 是否为字符串类型，如果是对象则直接使用
const data = typeof config.data === 'string' ? JSON.parse(config.data) : config.data || null;
  
  // 处理认证相关的mock请求
  if (url === '/auth/email-login' && method === 'post') {
    // 邮箱登录 - 支持admin账户和123456密码
    const { email, password } = data;
    let userInfo = null;
    let token = 'mock-jwt-token';
    
    // 检查是否是admin账户登录
    if (email === 'admin@example.com' || email === 'admin') {
      if (password === '123456') {
        // admin账户验证成功
        userInfo = {
          ...mockData.auth.users.admin,
          // 移除密码信息
          password: undefined
        };
        token = 'mock-jwt-token-admin';
      } else {
        // 密码错误
        return Promise.reject({
          response: {
            status: 401,
            data: mockResponse(null, 401, '密码错误')
          }
        });
      }
    } else if (mockData.auth.users.testuser.email === email || mockData.auth.users.testuser.username === email) {
      // 测试用户登录
      if (password === 'password123' || password === '123456') {
        userInfo = {
          ...mockData.auth.users.testuser,
          // 移除密码信息
          password: undefined
        };
      } else {
        // 密码错误
        return Promise.reject({
          response: {
            status: 401,
            data: mockResponse(null, 401, '密码错误')
          }
        });
      }
    } else {
      // 其他用户，默认使用testuser信息
      userInfo = {
        ...mockData.auth.users.testuser,
        email: email,
        // 移除密码信息
        password: undefined
      };
    }
    
    return Promise.resolve({
      data: mockResponse({
        token,
        userInfo
      })
    });
  } else if (url === '/auth/phone-login' && method === 'post') {
    // 手机号登录 - 假设任何手机号和验证码都能登录成功
    return Promise.resolve({
      data: mockResponse({
        token: 'mock-jwt-token',
        userInfo: {
          ...mockData.auth.users.testuser,
          // 移除密码信息
          password: undefined
        }
      })
    });
  } else if (url === '/auth/register' && method === 'post') {
    // 注册 - 假设注册总是成功
    return Promise.resolve({
      data: mockResponse(mockData.auth.register)
    });
  } else if (url.includes('/auth/email-code') && method === 'get') {
    // 获取邮箱验证码
    return Promise.resolve({
      data: mockResponse(mockData.auth.verifyCode)
    });
  } else if (url.includes('/auth/phone-code') && method === 'get') {
    // 获取手机验证码
    return Promise.resolve({
      data: mockResponse(mockData.auth.verifyCode)
    });
  } else if (url === '/auth/logout' && method === 'post') {
    // 退出登录
    return Promise.resolve({
      data: mockResponse({ success: true })
    });
  } else if (url === '/auth/user-info' && method === 'get') {
    // 获取用户信息 - 根据token判断用户角色
    const token = config.headers?.Authorization?.replace('Bearer ', '') || '';
    let userInfo;
    
    // 根据token判断是否为admin用户
    if (token === 'mock-jwt-token-admin') {
      userInfo = {
        ...mockData.auth.users.admin,
        // 移除密码信息
        password: undefined
      };
    } else {
      userInfo = {
        ...mockData.auth.users.testuser,
        // 移除密码信息
        password: undefined
      };
    }
    
    return Promise.resolve({
      data: mockResponse(userInfo)
    });
  }
  
  // 处理用户管理相关的mock请求
  else if (url === '/system/users' && method === 'get') {
    // 获取用户列表
    const { page = 1, pageSize = 10, keyword, role } = config.params || {};
    
    // 模拟用户列表数据
    const mockUsers = [
      { id: '1', username: 'admin', email: 'admin@example.com', roles: ['admin', 'user'], status: true },
      { id: '2', username: 'testuser', email: 'test@example.com', roles: ['user'], status: true },
      { id: '3', username: 'user1', email: 'user1@example.com', roles: ['user'], status: true },
      { id: '4', username: 'user2', email: 'user2@example.com', roles: ['user'], status: false },
      { id: '5', username: 'editor', email: 'editor@example.com', roles: ['editor', 'user'], status: true }
    ];
    
    // 过滤数据
    let filteredUsers = [...mockUsers];
    if (keyword) {
      filteredUsers = filteredUsers.filter(user => 
        user.username.toLowerCase().includes(keyword.toLowerCase()) ||
        user.email.toLowerCase().includes(keyword.toLowerCase())
      );
    }
    if (role) {
      filteredUsers = filteredUsers.filter(user => user.roles.includes(role));
    }
    
    // 分页
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedUsers = filteredUsers.slice(start, end);
    
    return Promise.resolve({
      data: mockResponse({
        list: paginatedUsers,
        total: filteredUsers.length,
        page: parseInt(page),
        pageSize: parseInt(pageSize)
      })
    });
  }
  else if (url.match(/^\/system\/users\/[^\/]+$/) && method === 'get') {
    // 获取用户详情
    const userId = url.split('/').pop();
    const mockUser = {
      id: userId,
      username: `user${userId}`,
      email: `user${userId}@example.com`,
      roles: ['user'],
      status: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    };
    
    return Promise.resolve({
      data: mockResponse(mockUser)
    });
  }
  else if (url === '/system/users' && method === 'post') {
    // 创建新用户
    return Promise.resolve({
      data: mockResponse({
        id: Date.now().toString(),
        ...data,
        createdAt: new Date().toISOString()
      })
    });
  }
  else if (url.match(/^\/system\/users\/[^\/]+$/) && method === 'put') {
    // 更新用户信息
    const userId = url.split('/').pop();
    return Promise.resolve({
      data: mockResponse({
        id: userId,
        ...data,
        updatedAt: new Date().toISOString()
      })
    });
  }
  else if (url.match(/^\/system\/users\/[^\/]+$/) && method === 'delete') {
    // 删除用户
    return Promise.resolve({
      data: mockResponse({ success: true })
    });
  }
  else if (url === '/system/users/batch-delete' && method === 'post') {
    // 批量删除用户
    return Promise.resolve({
      data: mockResponse({ success: true, deletedCount: data.ids.length })
    });
  }
  else if (url.includes('/status') && method === 'patch') {
    // 修改用户状态
    return Promise.resolve({
      data: mockResponse({ success: true, status: data.active })
    });
  }
  else if (url.includes('/reset-password') && method === 'post') {
    // 重置用户密码
    return Promise.resolve({
      data: mockResponse({ success: true })
    });
  }
  
  // 默认返回404
  return Promise.reject({
    response: {
      status: 404,
      data: mockResponse(null, 404, 'Mock API not found')
    }
  });
};

// 请求拦截器
request.interceptors.request.use(
  config => {
    // 非模拟模式，添加token等认证信息
    if (!MOCK_MODE) {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 在模拟模式下，使用axios的adapter来拦截所有请求
if (MOCK_MODE) {
  request.defaults.adapter = async function(config) {
    return mockRequestHandler(config);
  };
}

// 响应拦截器
request.interceptors.response.use(
  response => {
    // 统一处理响应数据
    const res = response.data;
    // 根据实际后端接口规范调整
    if (res.code !== 200) {
      // 可以在这里统一处理错误码
      console.error('API Error:', res.message);
      return Promise.reject(new Error(res.message || 'Error'));
    }
    return res.data;
  },
  error => {
    // 统一处理响应错误
    console.error('Request Error:', error);
    // 处理网络错误、超时等
    if (!error.response) {
      console.error('Network Error or Timeout');
    } else {
      // 根据HTTP状态码处理不同的错误
      switch (error.response.status) {
        case 401:
          // 未授权，可能需要跳转到登录页
          console.error('Unauthorized, please login again');
          break;
        case 403:
          console.error('Access denied');
          break;
        case 404:
          console.error('API not found');
          break;
        case 500:
          console.error('Server error');
          break;
        default:
          console.error('Unknown error');
      }
    }
    return Promise.reject(error);
  }
);

export default request;