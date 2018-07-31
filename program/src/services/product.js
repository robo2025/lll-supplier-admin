import lyRequest from '../utils/lyRequest';
import { API_URL } from '../constant/config';


/**
 *  获取服务器产品列表
 *
*/
export async function queryProducts({ offset = 0, limit = 10 }) {
  return lyRequest(`${API_URL}/products?offset=${offset}&limit=${limit}`);
}

/**
 * 获取产品详情
 *
 * @param {number} productId 产品id
*/
export async function queryProductDetail({ productId }) {
  return lyRequest(`${API_URL}/products/${productId}`);
}

