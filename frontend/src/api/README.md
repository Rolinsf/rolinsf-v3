# API服务层说明文档

## 架构概述

本项目采用了模块化的API服务架构，具有以下特点：

1. **统一的请求封装**：基于Axios创建了统一的请求实例
2. **环境变量控制**：通过环境变量一键切换模拟数据和真实接口
3. **模块化API设计**：按业务领域组织API接口
4. **统一的错误处理**：集中处理请求和响应错误
5. **可配置的模拟数据**：提供完整的模拟数据服务

## 环境变量配置

在`.env`文件中可以配置以下相关环境变量：

```
# API基础URL
VITE_API_BASE_URL=http://localhost:3000/api

# 模拟数据开关 - true启用模拟数据，false使用真实后端接口
VITE_USE_MOCK=true
```

### 一键切换说明

- 开发阶段：设置`VITE_USE_MOCK=true`，使用模拟数据
- 联调测试：设置`VITE_USE_MOCK=false`，连接真实后端接口

## 文件结构

```
src/api/
├── index.js          # API统一入口
├── request.js        # Axios实例配置和拦截器
├── mock.js           # 模拟数据和工具函数
├── auth.js           # 认证相关API
├── agreement.js      # 协议相关API
├── README.md         # 本文档
└── utils.js          # 工具函数
```

## 使用方法

### 1. 导入API模块

```javascript
// 导入特定模块
import { authApi } from '@/api';

// 或者导入整个API对象
import api from '@/api';
```

### 2. 调用API接口

```javascript
// 使用特定模块
async function login() {
  try {
    const result = await authApi.emailLogin({
      email: 'admin@example.com',
      password: '123456'
    });
    console.log('登录成功', result);
  } catch (error) {
    console.error('登录失败', error);
  }
}

// 使用整个API对象
async function getAgreement() {
  try {
    const result = await api.agreementApi.getUserAgreement();
    console.log('获取协议成功', result);
  } catch (error) {
    console.error('获取协议失败', error);
  }
}
```

## 添加新的API模块

### 1. 创建新的API模块文件

例如，创建`novel.js`文件，用于小说相关API：

```javascript
import request from './request';

/**
 * 小说相关API
 */
const novelApi = {
  /**
   * 获取小说列表
   * @param {Object} params - 查询参数
   * @param {number} params.page - 页码
   * @param {number} params.pageSize - 每页数量
   * @param {string} params.category - 分类 (可选)
   * @returns {Promise}
   */
  getNovelList: (params) => {
    return request.get('/novel/list', { params });
  },

  /**
   * 获取小说详情
   * @param {string} id - 小说ID
   * @returns {Promise}
   */
  getNovelDetail: (id) => {
    return request.get(`/novel/${id}`);
  }
  // 添加更多API方法...
};

export default novelApi;
```

### 2. 在index.js中导出新模块

```javascript
// API统一入口
import authApi from './auth';
import agreementApi from './agreement';
import novelApi from './novel'; // 导入新模块

// 导出所有API模块
export {
  authApi,
  agreementApi,
  novelApi // 导出新模块
};

// 也可以作为默认导出，方便整体导入
export default {
  authApi,
  agreementApi,
  novelApi // 默认导出新模块
};
```

### 3. 在mock.js中添加模拟数据

在`mockRequestHandler`函数中添加对应的处理逻辑：

```javascript
// 在request.js的mockRequestHandler中添加
if (url === '/novel/list' && method === 'get') {
  // 返回模拟的小说列表数据
  return Promise.resolve({
    data: mockResponse({
      list: [/* 模拟数据 */],
      total: 100,
      page: params.page,
      pageSize: params.pageSize
    })
  });
}
```

## 最佳实践

1. **遵循RESTful规范**：API设计应遵循RESTful规范
2. **统一错误处理**：在组件中统一处理API错误
3. **使用async/await**：推荐使用async/await语法处理异步请求
4. **参数验证**：在调用API前进行参数验证
5. **模拟数据与真实接口保持一致**：确保模拟数据的结构与真实接口一致

## 调试技巧

1. **查看请求日志**：模拟模式下会在控制台打印请求信息
2. **检查环境变量**：确认`.env`文件中的配置是否正确
3. **模拟网络延迟**：可以调整`mockDelay`函数中的延迟时间

## 注意事项

1. 真实环境中需要移除或禁用模拟数据
2. 敏感信息（如密钥、令牌）不应硬编码在代码中
3. 生产环境应使用HTTPS协议