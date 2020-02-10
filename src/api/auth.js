import request from '@/utils/request'
import qs from 'qs'

export function getVerifyCode() {
  return request({
    url: '/auth/vCode',
    method: 'GET'
  })
}

export function login(data) {
  return request({
    url: '/auth/login',
    method: 'POST',
    data: qs.stringify(data)
  })
}

export function logout() {
  return request({
    url: '/auth/logout',
    method: 'GET'
  })
}

export function getInfo() {
  return request({
    url: '/auth/info',
    method: 'GET'
  })
}

export function getPermission() {
  return request({
    url: '/auth/permissionInfo',
    method: 'GET'
  })
}

export function updateInfo(data) {
  return request({
    url: '/auth/update/info',
    method: 'POST',
    data: qs.stringify(data)
  })
}

export function updatePwd(data) {
  return request({
    url: '/auth/updatePassword',
    method: 'POST',
    data: qs.stringify(data)
  })
}

// data: {teaPhoto: file}
export function uploadAvatar(data) {
  return request({
    url: '/auth/uploadPhoto',
    method: 'POST',
    data,
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

export function getRole() {
  return request({
    url: '/auth/roleInfo',
    method: 'GET'
  })
}
