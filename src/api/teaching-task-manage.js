import request from '@/utils/request'
import qs from 'qs'

// 添加教学任务
export function addTask(data) {
  return request({
    url: '/system-manage/teachingTask/save',
    method: 'POST',
    data: qs.stringify(data)
  })
}

// 更新教学任务信息
export function updateTask(data) {
  return request({
    url: '/system-manage/teachingTask/update',
    method: 'POST',
    data: qs.stringify(data)
  })
}

// 删除教学任务
export function deleteTask(data) {
  const params = qs.stringify(data)
  return request({
    url: `/system-manage/teachingTask/delete?${params}`,
    method: 'GET'
  })
}

// 获取所有教学任务信息
export function getAllTask() {
  return request({
    url: '/system-manage/teachingTask/getAll',
    method: 'GET'
  })
}

// 分页查询教学任务信息
export function getTaskPageList(data) {
  const params = qs.stringify(data)
  return request({
    url: `/system-manage/teachingTask/pageList?${params}`,
    method: 'GET'
  })
}

// 获取学期集合
export function getTermList(data) {
  return request({
    url: 'system-manage/teachingTask/getTermList',
    method: 'GET'
  })
}
