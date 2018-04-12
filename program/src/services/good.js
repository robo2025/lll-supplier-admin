import Cookies from 'js-cookie';
import lyRequest from '../utils/lyRequest';
import { API_URL } from '../constant/config';
import { queryString } from '../utils/tools';


/**
 *  获取服务器商品列表
 *
*/
export async function queryGoods({ params, offset = 0, limit = 10 }) {
  const acess_token = Cookies.get('access_token');
  return lyRequest(`${API_URL}/goods?offset=${offset}&limit=${limit}&${queryString.toQueryString(params)}`, {
    headers: {
      Authorization: acess_token,
    },
  });
}


/**
 * 添加商品信息
 *
 * @param {object} data 商品数据
*/
export async function addGood({ data }) {
  const acess_token = Cookies.get('access_token');
  return lyRequest(`${API_URL}/goods`, {
    method: 'post',
    headers: {
      Authorization: acess_token,
    },
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
export async function modifyGoodStatus({ goodId, goodStatus, publishType, desc }) {
  console.log('下架service', publishType, desc);
  const acess_token = Cookies.get('access_token');
  return lyRequest(`${API_URL}/goods/${goodId}/publish_status`, {
    method: 'put',
    headers: {
      Authorization: acess_token,
    },
    data: {
      is_publish: goodStatus,
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
export async function modifyGoodInfo({ goodId, data }) {
  const acess_token = Cookies.get('access_token');
  return lyRequest(`${API_URL}/goods/${goodId}`, {
    method: 'put',
    headers: {
      Authorization: acess_token,
    },
    data: {
      ...data,
    },
  });
}

/**
 * 修改商品价格
 *
 * @param {string} goodId 商品唯一ID
 * @param {object} data 商品价格区间
 *
*/
export async function modifyGoodPrice({ goodId, data }) {
  const acess_token = Cookies.get('access_token');
  return lyRequest(`${API_URL}/goods/${goodId}/price`, {
    method: 'put',
    headers: {
      Authorization: acess_token,
    },
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
export async function queryGoodDetail({ goodId }) {
  const acess_token = Cookies.get('access_token');
  return lyRequest(`${API_URL}/goods/${goodId}`, {
    method: 'get',
    headers: {
      Authorization: acess_token,
    },
  });
}


/**
 * 删除商品 *
 *
 * @param {array} ids 商品id数组
*/
export async function removeProducts({ ids }) {
  const acess_token = Cookies.get('access_token');
  return lyRequest(`${API_URL}/goods`, {
    method: 'delete',
    headers: {
      Authorization: acess_token,
    },
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
  const acess_token = Cookies.get('access_token');
  return lyRequest(`${API_URL}/operationlogs?module=${module}&object_id=${goodId}`, {
    method: 'get',
    headers: {
      Authorization: acess_token,
    },
  });
}

// 导出数据
export async function exportGood({ fields }) {
  const acess_token = Cookies.get('access_token');
  return lyRequest(`${API_URL}/goods_reports`, {
    method: 'post',
    headers: {
      Authorization: acess_token,
    },
    data: {
      fields,
    },
  });
}
