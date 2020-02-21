import request from '@/utils/request'
import qs from 'qs'
// getStudentPageList, updateStudent, addStudent, deleteStudent
// 添加学生
export function addStudent(data) {
  return request({
    url: '/system-manage/student/save',
    method: 'POST',
    data: qs.stringify(data)
  })
}

// 删除学生
export function deleteStudent(data) {
  const params = qs.stringify(data)
  return request({
    url: `/system-manage/student/delete?${params}`,
    method: 'GET'
  })
}

// 修改学生
export function updateStudent(data) {
  return request({
    url: '/system-manage/student/update',
    method: 'POST',
    data: qs.stringify(data)
  })
}

// 分页查询学生信息
export function getStudentPageList(data) {
  const params = qs.stringify(data)
  return request({
    url: `/system-manage/student/pageList?${params}`,
    method: 'GET'
  })
}
