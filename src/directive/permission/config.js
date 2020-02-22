/* 按钮权限 */
// 学生管理页面
export const STUDENT_ADD = ['student:save']
export const STUDENT_DELETE = ['student:delete']
export const STUDENT_UPDATE = ['student:update']
export const STUDENT_GET = ['student:pageList']
// 教师管理页面
export const TEACHER_ADD = ['teacher:save']
export const TEACHER_DELETE = ['teacher:delete']
export const TEACHER_UPDATE = ['teacher: update;']
export const TEACHER_GET = ['getTeacherPageList']
export const ALLOCATE_ROLE = [
  'teacher:getAssignedRole',
  'teacher:saveAssignedRole',
  'role:arrayList'
]
// 角色管理页面
export const ROLE_ADD = ['role:save']
export const ROLE_DELETE = ['role:delete']
export const ROLE_UPDATE = []
export const ROLE_GET = []
export const ALLOCATE_PERMISSION = []
// 权限管理
export const PERMISSION_ADD = []
export const PERMISSION_DELETE = []
export const PERMISSION_UPDATE = []
export const PERMISSION_GET = []
// 课程管理
export const COURCE_ADD = []
export const COURCE_DELETE = []
export const COURCE_UPDATE = []
export const COURCE_GET = []
// 教学任务管理
export const TEACH_TASK_ADD = []
export const TEACH_TASK_DELETE = []
export const TEACH_TASK_UPDATE = []
export const TEACH_TASK_GET = []
// 日志管理
export const LOG_GET = []
export const LOG_DOWNLOAD = []

export default {
  STUDENT_ADD,
  STUDENT_DELETE,
  STUDENT_UPDATE,
  STUDENT_GET
}

