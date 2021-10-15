import request from '@/utils/request'

/**
 * 获取好折扣商品列表
 */
export function getDiscountGoodsList(params) {
  return request({
    url: '/better-discount-service/1.0.0/queryGoodsList/1',
    method: 'get',
    params
  })
}

/**
 * 获取某一类型商品列表
 */
export function getDiscountGoodsListByType(params) {
  return request({
    url: '/better-discount-service/1.0.0/queryGoodsListByType',
    method: 'post',
    params
  })
}

/**
 * 新增商品
 */
export function addGoods(params) {
  return request({
    url: '/better-discount-service/1.0.0/addGoods',
    method: 'post',
    params
  })
}

/**
 * 修改商品信息
 */
export function updatedGoods(params) {
  return request({
    url: '/better-discount-service/1.0.0/updateGoodsContent',
    method: 'post',
    params
  })
}

/**
 * 删除商品
 */
export function deleteDiscountGoodsList(params) {
  return request({
    url: '/better-discount-service/1.0.0/deleteGoods',
    method: 'post',
    params
  })
}
