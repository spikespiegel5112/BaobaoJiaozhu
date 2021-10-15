import request from '@/utils/request'

export function findList(query) {
  return request({
    url: '/advertising-service/1.0.0/advertising/advertistingList',
    method: 'get',
    params: query
  })
}

export function getAdvertising(id) {
  return request({
    url: '/advertising/detail',
    method: 'get',
    params: { id }
  })
}

export function createAdvertising(data) {
  return request({
    url: '/advertising/create',
    method: 'post',
    data
  })
}

export function updateAdvertising(data) {
  return request({
    url: '/advertising-service/1.0.0/advertising/update',
    method: 'post',
    data
  })
}

export function deleteAdvertising(id) {
  return request({
    url: '/advertising-service/1.0.0/advertising/' + id,
    method: 'delete'
  })
}
