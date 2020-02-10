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
