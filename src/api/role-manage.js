import request from '@/utils/request'
import qs from 'qs'

// 添加角色
export function addRole(data) {
  return request({
    url: '/system-manage/role/save',
    method: 'POST',
    data: qs.stringify(data)
  })
}

// 删除角色
export function deleteRole(data) {
  const params = qs.stringify(data)
  return request({
    url: `/system-manage/role/delete?${params}`,
    method: 'GET'
  })
}

// 修改角色
export function updateRole(data) {
  return request({
    url: '/system-manage/role/update',
    method: 'POST',
    data: qs.stringify(data)
  })
}

// 分页查询角色信息
export function getRolePageList(data) {
  const params = qs.stringify(data)
  return request({
    url: `/system-manage/role/pageList?${params}`,
    method: 'GET'
  })
}

/* // 查询角色已分配权限
export function getAssignedPermission(data) {
  const params = qs.stringify(data)
  return request({
    url: `/system-manage/role/getAssignedPermission?${params}`,
    method: 'GET'
  })
} */

// 角色分配权限
export function saveAssignedPermission(data) {
  return request({
    url: '/system-manage/role/saveAssignedPermission',
    method: 'POST',
    data: qs.stringify(data)
  })
}

// 查询角色已分配权限
export function getAssignedPermission(data) {
  const params = qs.stringify(data)
  return request({
    url: `/system-manage/role/getAssignedPermission?${params}`,
    method: 'GET'
  })
}
