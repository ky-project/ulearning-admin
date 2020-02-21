import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/layout'
import {
  TEACHER,
  STUDENT,
  ROLE,
  PERMISSION,
  COURSE,
  TEACHING_TASK,
  LOG,
  MONITOR,
  TASK_SCHEDULING,
  FILE,
  DOCUMENT
} from './config'
Vue.use(Router)

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
  {
    path: '/test',
    name: 'Test',
    component: () => import('@/views/test/index'),
    hidden: true
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
  }
  /* {
    path: '/system-manage',
    name: 'SystemManage',
    component: Layout,
    meta: { title: '系统管理', icon: 'xitongguanli' },
    redirect: 'noRedirect',
    children: [
      {
        path: 'student-manage',
        name: 'StudentManage',
        component: () => import('@/views/studentManage/index'),
        meta: { title: '学生管理', icon: 'yonghu' }
      },
      {
        path: 'teacher-manage',
        name: 'TeacherManage',
        component: () => import('@/views/teacherManage/index'),
        meta: { title: '教师管理', icon: 'jiaoshi' }
      },
      {
        path: 'role-manage',
        name: 'RoleManage',
        component: () => import('@/views/roleManage/index'),
        meta: { title: '角色管理', icon: 'role' }
      },
      {
        path: 'rights-manage',
        name: 'RightsManage',
        component: () => import('@/views/rightsManage/index'),
        meta: { title: '权限管理', icon: 'quanxian' }
      }
    ]
  },
  {
    path: '/function-module',
    name: 'FunctionModule',
    component: Layout,
    meta: { title: '功能模块', icon: 'gongneng' },
    redirect: 'noRedirect',
    children: [
      {
        path: 'course-manage',
        name: 'CourseManage',
        component: () => import('@/views/courseManage/index'),
        meta: { title: '课程管理', icon: 'kechengbiao' }
      },
      {
        path: 'teaching-task-manage',
        name: 'TeachingTaskManage',
        component: () => import('@/views/teachingTaskManage/index'),
        meta: { title: '教学任务管理', icon: 'renwu' }
      }
    ]
  },
  {
    path: '/monitor-manage',
    name: 'MonitorManage',
    component: Layout,
    meta: { title: '监控管理', icon: 'jiankong' },
    redirect: 'noRedirect',
    children: [
      {
        path: 'log-monitor',
        name: 'LogMonitor',
        component: () => import('@/views/logMonitor/index'),
        meta: { title: '日志管理', icon: 'rizhi' }
      },
      {
        path: 'http://ky.darren1112.com:8082/monitor-manage/',
        meta: { title: '监控系统', icon: 'jiankongmianban' }
      },
      {
        path: 'http://ky.darren1112.com:8082/xxl-job-admin/',
        meta: { title: '任务调度中心', icon: 'renwutiaodu' }
      },
      {
        path: 'http://????',
        meta: { title: '文件管理', icon: 'wenjianguanli' }
      }
    ]
  },
  {
    path: 'development-manage-link',
    component: Layout,
    children: [
      {
        path: 'http://ky.darren1112.com:8082/doc.html',
        meta: { title: '开发文档', icon: 'wendang' }
      }
    ]
  }, */
  /* {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  { path: '*', redirect: '/404', hidden: true } */
]

export const asyncRoutes = [
  {
    path: '/system-manage',
    name: 'SystemManage',
    component: Layout,
    meta: { title: '系统管理', icon: 'xitongguanli' },
    redirect: 'noRedirect',
    children: [
      {
        path: 'student-manage',
        name: 'StudentManage',
        component: () => import('@/views/studentManage/index'),
        meta: { title: '学生管理', icon: 'yonghu', permission: STUDENT }
      },
      {
        path: 'teacher-manage',
        name: 'TeacherManage',
        component: () => import('@/views/teacherManage/index'),
        meta: { title: '教师管理', icon: 'jiaoshi', permission: TEACHER }
      },
      {
        path: 'role-manage',
        name: 'RoleManage',
        component: () => import('@/views/roleManage/index'),
        meta: { title: '角色管理', icon: 'role', permission: ROLE }
      },
      {
        path: 'rights-manage',
        name: 'RightsManage',
        component: () => import('@/views/rightsManage/index'),
        meta: {
          title: '权限管理',
          icon: 'quanxian',
          permission: PERMISSION
        }
      }
    ]
  },
  {
    path: '/function-module',
    name: 'FunctionModule',
    component: Layout,
    meta: { title: '功能模块', icon: 'gongneng' },
    redirect: 'noRedirect',
    children: [
      {
        path: 'course-manage',
        name: 'CourseManage',
        component: () => import('@/views/courseManage/index'),
        meta: {
          title: '课程管理',
          icon: 'kechengbiao',
          permission: COURSE
        }
      },
      {
        path: 'teaching-task-manage',
        name: 'TeachingTaskManage',
        component: () => import('@/views/teachingTaskManage/index'),
        meta: {
          title: '教学任务管理',
          icon: 'renwu',
          permission: TEACHING_TASK
        }
      }
    ]
  },
  {
    path: '/monitor-manage',
    name: 'MonitorManage',
    component: Layout,
    meta: { title: '监控管理', icon: 'jiankong' },
    redirect: 'noRedirect',
    children: [
      {
        path: 'log-monitor',
        name: 'LogMonitor',
        component: () => import('@/views/logMonitor/index'),
        meta: { title: '日志管理', icon: 'rizhi', permission: LOG }
      },
      {
        path: 'http://ky.darren1112.com:8082/monitor-manage/',
        meta: {
          title: '监控系统',
          icon: 'jiankongmianban',
          permission: MONITOR
        }
      },
      {
        path: 'http://ky.darren1112.com:8082/xxl-job-admin/',
        meta: {
          title: '任务调度中心',
          icon: 'renwutiaodu',
          permission: TASK_SCHEDULING
        }
      },
      {
        path: 'http://????',
        meta: {
          title: '文件管理',
          icon: 'wenjianguanli',
          permission: FILE
        }
      }
    ]
  },
  {
    path: 'development-manage-link',
    component: Layout,
    children: [
      {
        path: 'http://ky.darren1112.com:8082/doc.html',
        meta: {
          title: '开发文档',
          icon: 'wendang',
          permission: DOCUMENT
        }
      }
    ]
  }
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
