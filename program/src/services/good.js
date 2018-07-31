import lyRequest from '../utils/lyRequest';
import { API_URL } from '../constant/config';
import { queryString } from '../utils/tools';


/**
 *  获取服务器商品列表
 *
*/
export async function queryGoods({ params = {}, offset = 0, limit = 10 }) {
  return lyRequest(`${API_URL}/supplier/goods?offset=${offset}&limit=${limit}&${queryString.toQueryString(params)}`);
}

/**
 * 添加商品信息
 *
 * @param {object} data 商品数据
*/
export async function addGood({ data }) {
  return lyRequest(`${API_URL}/supplier/goods`, {
    method: 'post',
    data: {
      ...data,
    },
  });
}

/**
 * 商品上上下架
 * @param {string=} goodId 商品ID
 * @param {string=} GoodStatus 商品状态 [0,下架，1,上架]
 *
 */
export async function modifyGoodStatus({ gno, goodStatus, publishType, desc }) {
  return lyRequest(`${API_URL}/supplier/goods/${gno}/publish_status`, {
    method: 'put',
    data: {
      apply_publish_status: goodStatus,
      publish_type: publishType,
      desc,
    },
  });
}


/**
 * 修改商品信息
 *
 * @param {string} goodId 商品唯一ID
 * @param {object} data 商品数据
 *
*/
export async function modifyGoodInfo({ gno, data }) {
  return lyRequest(`${API_URL}/supplier/goods/${gno}`, {
    method: 'put',
    data: {
      ...data,
    },
  });
}

/**
 * 修改商品价格
 *
 * @param {string} gno 商品唯一ID
 * @param {object} data 商品价格区间
 *
*/
export async function modifyGoodPrice({ gno, data }) {
  return lyRequest(`${API_URL}/supplier/goods/${gno}/price`, {
    method: 'put',
    data: {
      ...data,
    },
  });
}

/**
 * 获取商品详情
 *
 * @param {number} productId 商品id
*/
export async function queryGoodDetail({ gno }) {
  return lyRequest(`${API_URL}/supplier/goods/${gno}`, {
    method: 'get',
  });
}


/**
 * 删除商品 *
 *
 * @param {array} ids 商品id数组
*/
export async function removeProducts({ ids }) {
  return lyRequest(`${API_URL}/goods`, {
    method: 'delete',
    data: {
      ids,
    },
  });
}

/**
 * 商品操作日志
 *
 * @param {array} ids 商品id数组
*/
export async function queryOperationLog({ module, goodId }) {
  return lyRequest(`${API_URL}/operationlogs?module=${module}&object_id=${goodId}`, {
    method: 'get',
  });
}

// 获取关联产品列表
export async function queryAssociatedProduct({ params = {}, offset = 0, limit = 10 }) {
  return lyRequest(`${API_URL}/supplier/product_models?offset=${offset}&limit=${limit}&${queryString.toQueryString(params)}`);
}

// 获取关联产品详情
export async function queryAssociatedProductDetail({ mno }) {
  return lyRequest(`${API_URL}/supplier/product_models/${mno}`, {
    method: 'get',
  });
}

// 导出数据
export async function exportGood({ fields }) {
  return lyRequest(`${API_URL}/goods/goods_reports`, {
    method: 'post',
    data: {
      fields,
    },
  });
}
// 获取分类数据
export async function queryCatalogLevel({ pid = 0 }) {
    return lyRequest(`${API_URL}/supplier/product_categories/level_selection?pid=${pid}`);  
  }
