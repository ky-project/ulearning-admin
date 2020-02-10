import request from '@/utils/request'
import qs from 'qs'

// 添加课程
export function addCourse(data) {
  return request({
    url: '/system-manage/course/save',
    method: 'POST',
    data: qs.stringify(data)
  })
}

// 删除课程
export function deleteCourse(data) {
  const params = qs.stringify(data)
  return request({
    url: `/system-manage/course/delete?${params}`,
    method: 'GET'
  })
}

// 修改课程
export function updateCourse(data) {
  return request({
    url: '/system-manage/course/update',
    method: 'POST',
    data: qs.stringify(data)
  })
}

// 分页查询课程信息
export function getCoursePageList(data) {
  const params = qs.stringify(data)
  return request({
    url: `/system-manage/course/pageList?${params}`,
    method: 'GET'
  })
}

// 获取所有课程
export function getAllCourse() {
  return request({
    url: '/system-manage/course/getAll',
    method: 'GET'
  })
}
