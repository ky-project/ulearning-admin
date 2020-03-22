import request from '@/utils/request'
import qs from "qs";

// 查询文件总量
export function getSumFileSize() {
  return request({
    url: '/monitor-manage/fileRecord/getSumFileSize',
    method: 'GET'
  })
}

// 文件记录查询
export function pageListFile(data) {
  const params = qs.stringify(data)
  return request({
    url: `/monitor-manage/fileRecord/pageList?${params}`,
    method: 'GET'
  })
}

// 删除文件
export function deleteFile(data) {
  const params = qs.stringify(data)
  return request({
    url: `/monitor-manage/fileRecord/delete?${params}`,
    method: 'GET'
  })
}

// 根据id查询文件记录
export function getById(data) {
  const params = qs.stringify(data)
  return request({
    url: `/monitor-manage/fileRecord/getById?${params}`,
    method: 'GET'
  })
}
