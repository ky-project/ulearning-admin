import Cookies from 'js-cookie'

const TokenKey = 'token'
const RefreshTokenKey = 'refresh_token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getRefreshToken() {
  return Cookies.get(RefreshTokenKey)
}

export function removeRefreshToken() {
  return Cookies.remove(RefreshTokenKey)
}

export function removeVuex() {
  return window.sessionStorage.removeItem('vuex')
}
