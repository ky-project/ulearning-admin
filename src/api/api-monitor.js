import request from '@/utils/request'
import qs from 'qs'

// 接口统计查询
export function getApiStatList(data) {
  const params = qs.stringify(data)
  return request({
    url: `/monitor-manage/druidStat/apiStat?${params}`,
    method: 'GET'
  })
}

// 查询系统模块映射
export function getSystemModules() {
  return request({
    url: '/monitor-manage/druidStat/getSystemModules',
    method: 'GET'
  })
}
