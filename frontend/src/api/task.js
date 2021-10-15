import request from '@/utils/request'

/**
 * 获取试玩下载列表
 */
export function getTryPlayList(params) {
  return request({
    url: 'task-service/1.0.0/task/bk/gettryplaylist',
    method: 'get',
    params: params
  })
}
// 保存 下载试玩任务
export function saveTryPlay(data) {
  return request({
    url: 'task-service/1.0.0/task/bk/saveTryPlay',
    method: 'post',
    data
  })
}
// 上、下架任务
export function updateShelfStatusRequest(id, isShow) {
  return request({
    url: 'task-service/1.0.0/task/bk/changeStatus/ ' + id + '/' + isShow + '',
    method: 'post'
  })
}

/**
 * 获取 银行办卡列表
 */
export function getBankCardList(params) {
  return request({
    url: 'task-service/1.0.0/cardtask/bk/getbankcardlist',
    method: 'get',
    params: params
  })
}

/**
 * 获取 注册赚钱任务列表
 */
export function getResterList(params) {
  return request({
    url: 'task-service/1.0.0/register/bk/getregisterlist',
    method: 'get',
    params: params
  })
}
