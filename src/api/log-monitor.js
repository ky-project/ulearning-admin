import request from '@/utils/request'
import qs from 'qs'

// 日志类型查询
export function getLogTypeList() {
  return request({
    url: '/monitor-manage/log/logTypeList',
    method: 'GET'
  })
}

// 日志查询
export function getLogPageList(data) {
  const params = qs.stringify(data)
  return request({
    url: `/monitor-manage/log/pageList?${params}`,
    method: 'GET'
  })
}

// 历史日志查询
export function getLogHistoryList() {
  return request({
    url: `/monitor-manage/logHistory/getVoList`,
    method: 'GET'
  })
}

// 查询前n条日志
export function getLogTop(data) {
  const params = qs.stringify(data)
  return request({
    url: `/monitor-manage/log/getTop?${params}`,
    method: 'GET'
  })
}

// 查询近n天的访问量
export function getDaysTraffic(data) {
  const params = qs.stringify(data)
  return request({
    url: `/monitor-manage/log/getDaysTraffic?${params}`,
    method: 'GET'
  })
}

// 查询近n天的访问量
export function getDaysOperation(data) {
  const params = qs.stringify(data)
  return request({
    url: `/monitor-manage/log/getDaysOperation?${params}`,
    method: 'GET'
  })
}

