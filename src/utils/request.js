import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import router from '@/router'
import { getToken, getRefreshToken } from '@/utils/auth'

const key = 'Bearer '

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // baseURL: '/api',
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 15 * 1000, // request timeout
  headers: { 'content-type': 'application/x-www-form-urlencoded' }
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      config.headers['Authorization-token'] = key + getToken()
      config.headers['Authorization-refresh-token'] = key + getRefreshToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data

    // if the custom code is not 200, it is judged as an error.
    // eslint-disable-next-line eqeqeq
    if (res.code != 200) {
      console.log(`success, but code is ${res.code}`)

      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (
        res.code === 50008 ||
                             res.code === 50012 ||
                             res.code === 50014
      ) {
        // to re-login
        MessageBox.confirm(
          'You have been logged out, you can cancel to stay on this page, or log in again',
          'Confirm logout',
          {
            confirmButtonText: 'Re-Login',
            cancelButtonText: 'Cancel',
            type: 'warning'
          }
        ).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(
        new Error(res.message || 'Error')
      )
    } else {
      return res
    }
  },
  error => {
    console.log(error) // for debug
    if (error.response && error.response.data) {
      const { code, message } = error.response.data
      // eslint-disable-next-line eqeqeq
      if (code == 400) {
        Message({
          message: message,
          type: 'error'
        })
      // eslint-disable-next-line eqeqeq
      } else if (code == 401) {
        Message({
          message: message,
          type: 'error'
        })
        // 1. 退出
        store.dispatch('user/logout')
          .then(response => {
            // 2. 返回登录界面
            router.push('/login')
          })
      }
    }
    return Promise.reject(error)
  }
)

export default service
