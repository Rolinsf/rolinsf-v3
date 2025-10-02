// 前端路由模块

// 1.导入需要的路由成员
import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import { useUserStore } from '@/store/user'

// 导入需要通过路由切换的组件
import Login from '../views/Login/index.vue'
import Layout from '../views/Layout/index.vue'
import home from '../views/home/index.vue'

// 2.创建路由对象
const router = createRouter({
    // 使用浏览器的history API 进行路由切换
    history: createWebHistory(),
    // 路由规则
    routes: [
        // 登陆的路由规则
      { path: '/login', component: Login },
      
      //官网主页
      {path: '/', component: home},

        // 后台主页的路由规则
        {
          path: '/admin', 
          component: Layout,
          redirect: '/admin/dashboard',
          meta: { title: '首页' },
          children: [
            {
              path: 'dashboard', 
              component: () => import('../views/Layout/components/Dashboard/index.vue'),
              meta: { title: '仪表盘' }
            },
            // 系统管理
            {
              path: 'system',
              redirect: '/admin/system/user-management',
              meta: { title: '系统管理', permission: 'system:access' },
              children: [
                {
                  path: 'user-management',
                  component: () => import('../views/Layout/components/SystemManagement/UserManagement/index.vue'),
                  meta: { title: '用户管理', permission: 'system:user:manage' }
                },
                {
                  path: 'system-log',
                  component: () => import('../views/Layout/components/SystemManagement/SystemLog/index.vue'),
                  meta: { title: '系统日志', permission: 'system:log:view' }
                },
                {
                  path: 'system-settings',
                  component: () => import('../views/Layout/components/SystemManagement/SystemSettings/index.vue'),
                  meta: { title: '系统设置', permission: 'system:settings:manage' }
                },
                {
                  path: 'role-permission',
                  component: () => import('../views/Layout/components/SystemManagement/RolePermissionManagement/index.vue'),
                  meta: { title: '角色权限管理', permission: 'system:role:manage' }
                }
              ]
            },
            // 小说管理
            {
              path: 'novel',
              redirect: '/admin/novel/novel-list',
              meta: { title: '小说管理', permission: 'novel:access' },
              children: [
                {
                  path: 'novel-list',
                  component: () => import('../views/Layout/components/NovelManagement/NovelList/index.vue'),
                  meta: { title: '小说列表', permission: 'novel:list:view' }
                },
                {
                  path: 'comment-management',
                  component: () => import('../views/Layout/components/NovelManagement/CommentManagement/index.vue'),
                  meta: { title: '评论管理', permission: 'novel:comment:manage' }
                },
                {
                  path: 'data-statistics',
                  component: () => import('../views/Layout/components/NovelManagement/DataStatistics/index.vue'),
                  meta: { title: '数据统计', permission: 'novel:statistics:view' }
                },
              ]
            },
            // 个人中心
            {
              path: 'user',
              redirect: '/admin/user/user-info',
              meta: { title: '个人中心' },
              children: [
                {
                  path: 'user-info',
                  component: () => import('../views/Layout/components/UserManagement/UserInfo/index.vue'),
                  meta: { title: '用户信息' }
                },
                {
                  path: 'my-novels',
                  component: () => import('../views/Layout/components/UserManagement/MyNovels/index.vue'),
                  meta: { title: '我的小说' }
                },
                {
                  path: 'private-messages',
                  component: () => import('../views/Layout/components/UserManagement/PrivateMessages/index.vue'),
                  meta: { title: '私信' }
                },
                {
                  path: 'view-history',
                  component: () => import('../views/Layout/components/UserManagement/ViewHistory/index.vue'),
                  meta: {title: '浏览历史' }
                }
              ]
            }
          ]
        }
    ]
})

// 添加路由导航守卫
router.beforeEach((to, from, next) => {
  console.log('路由导航:', to.path)
  const userStore = useUserStore()
  
  // 不需要登录的页面白名单
  const whiteList = ['/login', '/']
  
  // 检查用户是否已登录
  const isLoggedIn = userStore.checkLoginStatus()
  console.log('登录状态:', isLoggedIn)
  
  // 如果用户已登录且访问的是登录页面，则重定向到后台管理系统
  if (isLoggedIn && to.path === '/login') {
    next('/admin')
  }
  // 如果用户未登录且访问的页面不在白名单中，则重定向到登录页
  else if (!isLoggedIn && !whiteList.includes(to.path)) {
    next('/login')
  } else {
    // 检查权限
    const requiredPermission = to.meta.permission
    console.log('需要权限:', requiredPermission)
    
    // 简化权限检查，开发环境下暂时跳过严格的权限控制
    if (requiredPermission && isLoggedIn && process.env.NODE_ENV === 'development') {
      // 开发环境下，打印权限检查日志但允许访问
      console.log('开发环境：权限检查', { requiredPermission, hasPermission: userStore.hasPermission(requiredPermission) })
      next()
    } else if (requiredPermission && isLoggedIn) {
      // 生产环境下的严格权限检查
      if (!userStore.hasPermission(requiredPermission)) {
        console.log('没有权限访问:', to.path)
        // 可以根据实际情况决定重定向到哪个页面
        next('/admin')
        return
      }
      next()
    } else {
      next()
    }
  }
})

// 3. 默认导出
export default router