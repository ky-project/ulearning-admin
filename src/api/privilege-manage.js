import request from '@/utils/request'
import qs from 'qs'

// 添加权限
export function addPrivilege(data) {
  return request({
    url: '/system-manage/permission/save',
    method: 'POST',
    data: qs.stringify(data)
  })
}

// 更新权限
export function updatePrivilege(data) {
  return request({
    url: '/system-manage/permission/update',
    method: 'POST',
    data: qs.stringify(data)
  })
}

// 删除权限
export function deletePrivilege(data) {
  const params = qs.stringify(data)
  return request({
    url: `/system-manage/permission/delete?${params}`,
    method: 'GET'
  })
}

// 分组查询所有权限
export function getPrivilegeGroupList() {
  return request({
    url: '/system-manage/permission/groupList',
    method: 'GET'
  })
}

// 查询所有权限组
export function getAllPrivilegeGroup() {
  return request({
    url: '/system-manage/permission/getAllGroup',
    method: 'GET'
  })
}

