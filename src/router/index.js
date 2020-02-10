import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  /* {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  }, */

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index'),
        meta: { title: 'Dashboard', icon: 'dashboard' }
      }
    ]
  },
  {
    path: '/personal',
    component: Layout,
    redirect: '/personal/index',
    hidden: true,
    children: [
      {
        path: 'index',
        name: 'Personal',
        component: () => import('@/views/personal/index'),
        meta: { title: '个人信息' }
      }
    ]
  },
  {
    path: '/teacher-manage',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'TeacherManage',
        component: () => import('@/views/teacherManage/index'),
        meta: { title: '教师管理', icon: 'jiaoshi' }
      }
    ]
  },
  {
    path: '/student-manage',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'StudentManage',
        component: () => import('@/views/studentManage/index'),
        meta: { title: '学生管理', icon: 'yonghu' }
      }
    ]
  },
  {
    path: '/course-manage',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'CourseManage',
        component: () => import('@/views/courseManage/index'),
        meta: { title: '课程管理', icon: 'kechengbiao' }
      }
    ]
  },
  {
    path: '/teaching-task-manage',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'CourseManage',
        component: () => import('@/views/teachingTaskManage/index'),
        meta: { title: '教学任务管理', icon: 'renwu' }
      }
    ]
  },
  {
    path: '/rights-manage',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'RightsManage',
        component: () => import('@/views/rightsManage/index'),
        meta: { title: '权限管理', icon: 'quanxian' }
      }
    ]
  },
  {
    path: '/role-manage',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'RoleManage',
        component: () => import('@/views/roleManage/index'),
        meta: { title: '角色管理', icon: 'role' }
      }
    ]
  },
  {
    path: '/role-assignment',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'RoleAssignment',
        component: () => import('@/views/roleAssignment/index'),
        meta: { title: '角色分配', icon: 'fenpei' }
      }
    ]
  },
  {
    path: '/log-monitor',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'LogMonitor',
        component: () => import('@/views/logMonitor/index'),
        meta: { title: '日志监控', icon: 'rizhi' }
      }
    ]
  },
  {
    path: 'monitor-manage-link',
    component: Layout,
    children: [
      {
        path: 'http://ky.darren1112.com:8082/monitor-manage/',
        meta: { title: '监控管理', icon: 'jiankong' }
      }
    ]
  },
  {
    path: 'development-manage-link',
    component: Layout,
    children: [
      {
        path: 'http://ky.darren1112.com:8082/doc.html',
        meta: { title: '开发管理', icon: 'kaifa' }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
