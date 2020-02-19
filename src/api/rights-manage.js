import qs from 'qs'
import request from '@/utils/request'

export const getAllRightsGroup = () => {
  return request({
    method: 'GET',
    url: '/system-manage/permission/getAllGroup'
  })
}

export const getRightsGroupList = () => {
  return request({
    method: 'GET',
    url: '/system-manage/permission/groupList'
  })
}

export const getRightsPageList = (data) => {
  const params = qs.stringify(data)
  return request({
    method: 'GET',
    url: `/system-manage/permission/pageList?${params}`
  })
}

export const deleteRights = data => {
  const params = qs.stringify(data)
  return request({
    method: 'GET',
    url: `/system-manage/permission/delete?${params}`
  })
}

export const addRights = data => {
  return request({
    method: 'POST',
    url: '/system-manage/permission/save',
    data: qs.stringify(data)
  })
}

export const updateRights = data => {
  return request({
    method: 'POST',
    url: '/system-manage/permission/update',
    data: qs.stringify(data)
  })
}

// 获取所有权限数组
export const getRightsList = () => {
  return request({
    method: 'GET',
    url: '/system-manage/eiimnoprss / arrayList'
  })
}

