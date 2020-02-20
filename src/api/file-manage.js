import request from '@/utils/request'

// 查询文件总量
export function getSumFileSize() {
  return request({
    url: '/monitor-manage/fileRecord/getSumFileSize',
    method: 'GET'
  })
}
