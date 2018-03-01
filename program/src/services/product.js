import Cookies from 'js-cookie';
import lyRequest from '../utils/lyRequest';
import { API_URL } from '../constant/config';


/**
 *  获取服务器产品列表
 *
*/
export async function queryProducts() {
  const acess_token = Cookies.get('access_token');
  return lyRequest(`${API_URL}/products`, {
    headers: {
      Authorization: acess_token,
    },
  });
}

/**
 * 获取产品详情
 *
 * @param {number} productId 产品id
*/
export async function queryProductDetail({ productId }) {
  const acess_token = Cookies.get('access_token');
  return lyRequest(`${API_URL}/products/${productId}`, {
    method: 'get',
    headers: {
      Authorization: acess_token,
    },
  });
}

