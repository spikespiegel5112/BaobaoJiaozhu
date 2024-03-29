import Vue from 'vue';
import Router from 'vue-router';
/* Layout */
import Layout from '../views/layout/Layout';

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router);

export const constantRouterMap = [
  {
    path: '/Login',
    name: 'Login',
    component: () => import('@/views/Login'),
    hidden: true
  },
  {
    path: '/Register',
    name: 'Register',
    component: () => import('@/views/Register'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: '/dashboard',
    name: 'dashboard',
    hidden: false,
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        meta: { title: '仪表盘', icon: 'iconfont icon-mail' }
      }
    ]
  },
  {
    path: '/Fans',
    component: Layout,
    name: 'Fans',
    hidden: false,
    meta: { title: '粉丝管理', icon: 'iconfont icon-mail' },
    children: [
      {
        path: 'FansManagement',
        component: () => import('@/views/Fans/FansManagement'),
        meta: { title: '粉丝管理', icon: 'iconfont icon-mail' }
      }
    ]
  },
  {
    path: '/FileDownloader',
    component: Layout,
    name: 'FileDownloader',
    hidden: false,
    meta: { title: '文件下载', icon: 'iconfont icon-mail' },
    children: [
      {
        path: 'FileDownloaderManagement',
        component: () =>
          import('@/views/FileDownloader/FileDownloaderManagement'),
        meta: { title: '文件下载', icon: 'iconfont icon-mail' }
      }
    ]
  },
  {
    path: '/User',
    component: Layout,
    name: 'User',
    hidden: false,
    meta: { title: '用户管理', icon: 'iconfont icon-mail' },
    children: [
      {
        path: 'UserManagement',
        component: () => import('@/views/User/UserManagement'),
        meta: { title: '用户管理', icon: 'iconfont icon-mail' }
      },
      {
        path: 'RoleManagement',
        component: () => import('@/views/User/RoleManagement'),
        meta: { title: '角色管理', icon: 'iconfont icon-mail' }
      }
    ]
  },
  {
    path: '/settings',
    component: Layout,
    name: 'settingsLayout',
    meta: { title: '设置', icon: 'iconfont icon-mail' },
    children: [
      {
        path: 'dictionary',
        name: 'dictionary',
        component: () => import('@/views/settings/Dictionary'),
        meta: { title: '字典表设置', icon: 'iconfont icon-mail' }
      }
    ]
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
];

export default new Router({
  // mode: 'history', //后端支持可开
  base: '',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
});
